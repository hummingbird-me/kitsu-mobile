import { GLView, ExpoWebGLRenderingContext, GLSnapshot } from 'expo-gl';
import { Platform } from 'react-native';

export type RenderOptions = {
  blurhash: string;
  height: number;
  width: number;
  punch?: number;
  downsample?: number;
};

type RenderCommand = {
  options: RenderOptions;
  resolve: (snapshot?: GLSnapshot | PromiseLike<GLSnapshot>) => void;
  reject: (error: unknown) => void;
};

var gl: ExpoWebGLRenderingContext | null;
var program: WebGLProgram | null;
const renderQueue: RenderCommand[] = [];
var isRendering = false;

const BLURHASH_VERTEX = `#version 300 es
in vec2 aPosition;
out vec2 vPosition;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vPosition = (aPosition + 1.0) / 2.0;
  vPosition[1] = 1.0 - vPosition[1];
}
`;
const BLURHASH_FRAGMENT = `#version 300 es
precision lowp float;

#define M_PI 3.1415926535897932384626433832795

uniform sampler2D uTexture;
out vec4 color;
uniform int numX;
uniform int numY;
in vec2 vPosition;

float linearTosRGB(float value) {
  float v = max(0.0, min(1.0, value));
  if (v <= 0.0031308) {
    return v * 12.92;
  } else {
    return 1.055 * pow(v, 1.0 / 2.4) - 0.055;
  }
}

void main() {
  color = vec4(0,0,0,1);

  for (int j = 0; j < numY; j++) {
    for (int i = 0; i < numX; i++) {
      float basis = cos(M_PI * vPosition[0] * float(i)) *
                    cos(M_PI * vPosition[1] * float(j));
      vec2 texCoord = vec2(float(i) / float(numX), float(j) / float(numY));
      color += texture(uTexture, texCoord) * vec4(basis, basis, basis, 1);
    }
  }
  color[0] = linearTosRGB(color[0]);
  color[1] = linearTosRGB(color[1]);
  color[2] = linearTosRGB(color[2]);
  color[3] = 1.0;
}
`;

const BASE83_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%*+,-.:;=?@[]^_{|}~'.split(
  ''
);

const decode83 = (str: string) => {
  let value = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    const digit = BASE83_CHARS.indexOf(c);
    value = value * 83 + digit;
  }
  return value;
};

const sRGBToLinear = (value: number) => {
  const v = value / 255;
  if (v <= 0.04045) {
    return v / 12.92;
  } else {
    return Math.pow((v + 0.055) / 1.055, 2.4);
  }
};

const signPow = (base: number, exp: number) =>
  Math.sign(base) * Math.pow(Math.abs(base), exp);

const decodeDC = (value: number) => {
  const intR = value >> 16;
  const intG = (value >> 8) & 255;
  const intB = value & 255;
  return [sRGBToLinear(intR), sRGBToLinear(intG), sRGBToLinear(intB)];
};

const decodeAC = (value: number, maximumValue: number) => {
  const quantR = Math.floor(value / (19 * 19));
  const quantG = Math.floor(value / 19) % 19;
  const quantB = value % 19;

  const rgb = [
    signPow((quantR - 9) / 9, 2.0) * maximumValue,
    signPow((quantG - 9) / 9, 2.0) * maximumValue,
    signPow((quantB - 9) / 9, 2.0) * maximumValue,
  ];

  return rgb;
};

const decodeBlurhash = (blurhash: string, punch: number = 1) => {
  const sizeFlag = decode83(blurhash[0]);
  const numY = Math.floor(sizeFlag / 9) + 1;
  const numX = (sizeFlag % 9) + 1;

  const quantisedMaximumValue = decode83(blurhash[1]);
  const maximumValue = (quantisedMaximumValue + 1) / 166;

  const colors = new Float32Array(numX * numY * 3);

  for (let i = 0; i < numX * numY; i++) {
    if (i === 0) {
      const value = decode83(blurhash.substring(2, 6));
      colors.set(decodeDC(value), i * 3);
    } else {
      const value = decode83(blurhash.substring(4 + i * 2, 6 + i * 2));
      const color = decodeAC(value, maximumValue * punch);
      colors.set(color, i * 3);
    }
  }

  return {
    colors,
    numX,
    numY,
  };
};

export class ShaderCompilationFailed extends Error {}
export class RendererNotBooted extends Error {}

export async function init(): Promise<void> {
  gl = await GLView.createContextAsync();

  // Set up vertex shader
  const vertex = gl.createShader(gl.VERTEX_SHADER);
  if (!vertex) throw new ShaderCompilationFailed('Vertex Shader null');
  gl.shaderSource(vertex, BLURHASH_VERTEX);
  gl.compileShader(vertex);
  if (!gl.getShaderParameter(vertex, gl.COMPILE_STATUS))
    throw new ShaderCompilationFailed(gl.getShaderInfoLog(vertex) || '');

  // Set up fragment shader
  const fragment = gl.createShader(gl.FRAGMENT_SHADER);
  if (!fragment) throw new ShaderCompilationFailed('Fragment Shader null');
  gl.shaderSource(fragment, BLURHASH_FRAGMENT);
  gl.compileShader(fragment);
  if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS))
    throw new ShaderCompilationFailed(gl.getShaderInfoLog(fragment) || '');

  // Link them into a program
  program = gl.createProgram();
  if (!program) throw new ShaderCompilationFailed('Program null');
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new ShaderCompilationFailed(gl.getProgramInfoLog(program) || '');
  gl.useProgram(program);

  // Set up a framebuffer
  const framebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

  // Configure canvas and clear it
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

export const getAverageColor = (blurhash: string): [number, number, number] => {
  const value = decode83(blurhash.substring(2, 6));
  const intR = value >> 16;
  const intG = (value >> 8) & 255;
  const intB = value & 255;
  return [intR, intG, intB];
};

// prettier-ignore
async function renderBlurhash({
  blurhash,
  height,
  width,
  punch = 1,
  downsample = 4
}: RenderOptions): Promise<GLSnapshot> {
  const renderHeight = height / downsample;
  const renderWidth = width / downsample;
  const { colors, numX, numY } = decodeBlurhash(blurhash, punch);

  if (!gl || !program) throw new RendererNotBooted();

  // Set up output texture & canvas
  const outputTexture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, outputTexture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, renderWidth, renderHeight, 0, gl.RGBA,
                gl.UNSIGNED_BYTE, null);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D,
                          outputTexture, 0);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Set up input texture
  const texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB32F, numX, numY, 0, gl.RGB, gl.FLOAT,
                colors);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  var textureLocation = gl.getUniformLocation(program, 'uTexture');
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(textureLocation, 1);

  const numXUniform = gl.getUniformLocation(program, 'numX');
  gl.uniform1i(numXUniform, numX);
  const numYUniform = gl.getUniformLocation(program, 'numY');
  gl.uniform1i(numYUniform, numY);

  const positionAttribute = gl.getAttribLocation(program, 'aPosition');
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.enableVertexAttribArray(positionAttribute);
  gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);

  const positions = new Float32Array([
    -1.0,  1.0,
     1.0,  1.0,
    -1.0, -1.0,

     1.0, -1.0,
     1.0,  1.0,
    -1.0, -1.0,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  gl.viewport(0, 0, renderWidth, renderHeight);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.endFrameEXP();

  return GLView.takeSnapshotAsync(gl, {
    flip: true,
    // @ts-ignore The types don't have WebP support
    format: Platform.OS === 'android' ? 'webp' : 'png'
  });
}

function tryRender() {
  if (!isRendering) {
    isRendering = true;
    if (renderQueue.length > 0) {
      const { options, resolve, reject } = renderQueue.shift()!;
      console.log(`STARTING ${options.blurhash}`);

      renderBlurhash(options)
        .then(resolve, reject)
        .finally(() => {
          console.log(`FINISHED ${options.blurhash}`);
          isRendering = false;
          tryRender();
        });
    } else {
      isRendering = false;
    }
  }
}

export function render(options: RenderOptions): Promise<GLSnapshot> {
  return new Promise((resolve, reject) => {
    renderQueue.push({
      resolve,
      reject,
      options,
    });
    tryRender();
  });
}

import { ExpoWebGLRenderingContext, GLSnapshot, GLView } from 'expo-gl';
import { Platform } from 'react-native';

import decodeBlurhash from './decoder';
import BLURHASH_FRAGMENT from './shaders/fragment.glsl';
import BLURHASH_VERTEX from './shaders/vertex.glsl';

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

export class ShaderCompilationFailed extends Error {}
export class RendererNotBooted extends Error {}

class BlurhashRenderer {
  gl?: ExpoWebGLRenderingContext;
  program?: WebGLProgram | null;
  renderQueue: RenderCommand[] = [];
  initialization: Promise<void>;
  isRendering = false;

  constructor() {
    this.initialization = this.init();
  }

  async init(): Promise<void> {
    const gl = (this.gl = await GLView.createContextAsync());

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
    const program = (this.program = gl.createProgram());
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

  // prettier-ignore
  async renderBlurhash({
    blurhash,
    height,
    width,
    punch = 1,
    downsample = 4
  }: RenderOptions): Promise<GLSnapshot> {
    const renderHeight = height / downsample;
    const renderWidth = width / downsample;
    const { colors, numX, numY } = decodeBlurhash(blurhash, punch);

    const { gl, program } = this;

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
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB32F, numX, numY, 0, gl.RGB, gl.FLOAT, colors);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const textureLocation = gl.getUniformLocation(program, 'uTexture');
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
      // @ts-ignore The types don't have WebP support
      format: Platform.OS === 'android' ? 'webp' : 'png'
    });
  }

  tryRender() {
    if (this.isRendering) return;

    this.isRendering = true;
    if (this.renderQueue.length > 0) {
      const { options, resolve, reject } = this.renderQueue.shift()!;

      // Connect the render promise to the item in the queue, and then try to render another frame
      this.renderBlurhash(options)
        .then(resolve, reject)
        .finally(() => {
          this.isRendering = false;
          this.tryRender();
        });
    } else {
      this.isRendering = false;
    }
  }

  render(options: RenderOptions): Promise<GLSnapshot> {
    return new Promise((resolve, reject) => {
      this.renderQueue.push({
        resolve,
        reject,
        options,
      });
      this.tryRender();
    });
  }
}

const renderer = new BlurhashRenderer();
export default renderer.render.bind(renderer);

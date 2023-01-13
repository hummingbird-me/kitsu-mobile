#version 300 es
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

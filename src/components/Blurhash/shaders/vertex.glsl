#version 300 es
in vec2 aPosition;
out vec2 vPosition;

void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
  vPosition = (aPosition + 1.0) / 2.0;
  vPosition[1] = 1.0 - vPosition[1];
}

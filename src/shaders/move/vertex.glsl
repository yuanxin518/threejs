// 顶点位置输入
attribute vec3 position;
attribute float aIndex;

// 变换矩阵
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float u_time;
uniform float u_pointLength;
void main() {
    float targetTime = mod(u_time, u_pointLength);
    if(aIndex > targetTime - 5.0 && aIndex < targetTime + 5.0) {
        gl_PointSize = 5.0;
    } else {
        gl_PointSize = 1.0;
    }
    vec3 newPosition = vec3(position.x, position.y, position.z);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
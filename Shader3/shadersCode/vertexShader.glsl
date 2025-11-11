//https://threejs.org/examples/webgl_shader2

// This variable will pass the texture coordinates (UVs)
// from the vertex shader to the fragment shader.
varying vec2 vUv;

void main() {
    // Pass the standard UV coordinates directly to the fragment shader.
    vUv = uv;
    
    // Transform the vertex position by the standard matrices.
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
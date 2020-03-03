/*
 * WebGL core teaching framwork 
 * (C)opyright Martin Puse, mpuse@beuth-hochschule.de 
 *
 * Vertex Shader: Phong lighting per vertex
 */

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 vertexPosition;
attribute vec3 vertexNormal;

varying vec3 color;

vec3 phong(vec3 p, vec3 v, vec3 n, vec3 lp, vec3 lc) {

	// phong model here ...
	return vec3(1, 0, 0);
}

void main() {

	// per vertex phong here ...
	
	color = vertexNormal; // normals color coded for debug
	
	gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);
} 

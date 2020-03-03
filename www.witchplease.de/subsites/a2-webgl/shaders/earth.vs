/*
 * WebGL core teaching framwork 
 * (C)opyright Martin Puse, mpuse@beuth-hochschule.de 
 *
 * Vertex Shader: Phong lighting per vertex
 */
 

struct Light {
	vec4 position;
	vec3 color;
	float type;
};

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform Light light;

attribute vec3 vertexPosition;
attribute vec3 vertexNormal;
attribute vec2 vertexTexcoords;

varying vec3 ecPosition;
varying vec3 ecNormal;
varying vec3 ecLightPosition;
	
varying vec2 texcoords; // output to fragment shader

void main() {
	texcoords = vertexTexcoords; // hand over to fragment shader
	
	// moved rest to fragment shader
	ecPosition = (modelViewMatrix * vec4(vertexPosition, 1.0)).xyz;
	ecNormal   = normalize(normalMatrix * vertexNormal);
	ecLightPosition = (modelViewMatrix * light.position).xyz;
	// or static light :)
	// ecLightPosition = light.position.xyz;
	gl_Position = projectionMatrix * vec4(ecPosition, 1.0);
} 

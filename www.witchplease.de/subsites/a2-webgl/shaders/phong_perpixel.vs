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

const int MAX_LIGHTS = 2;
uniform Light light[MAX_LIGHTS];

attribute vec3 vertexPosition;
attribute vec3 vertexNormal;

varying vec3 ecPosition;
varying vec3 ecNormal;
varying vec3 ecLightPosition[MAX_LIGHTS];

void main() {

	// moved rest to fragment shader
	ecPosition = (modelViewMatrix * vec4(vertexPosition, 1.0)).xyz;
	ecNormal   = normalize(normalMatrix * vertexNormal);
	for (int i=0; i<MAX_LIGHTS; ++i) {
		ecLightPosition[i] = (modelViewMatrix * light[i].position).xyz;
	}
	gl_Position = projectionMatrix * vec4(ecPosition, 1.0);
} 

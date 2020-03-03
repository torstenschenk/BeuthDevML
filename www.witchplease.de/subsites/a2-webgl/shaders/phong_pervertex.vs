/*
 * WebGL core teaching framwork 
 * (C)opyright Martin Puse, mpuse@beuth-hochschule.de 
 *
 * Vertex Shader: Phong lighting per vertex
 */
 
struct Material {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
};

const int SPOT_LIGHT = 1;
struct Light {
	vec4 position;
	vec3 color;
	float type;
};

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform Material material;

const int MAX_LIGHTS = 2;
uniform Light light[MAX_LIGHTS];
uniform vec3 ambientLight;

attribute vec3 vertexPosition;
attribute vec3 vertexNormal;
varying vec3 color;

/* calulcate ambient, diffuce and specular light */
vec3 phong(vec3 p, vec3 v, vec3 n, vec3 lp, vec3 lc) {
	// phong model here ... yes please :)
	// derived vectors
	vec3 toLight = normalize(lp - p);
	vec3 reflectLight = reflect(-toLight, n);
	
	// scalar products
	float ndots = max( dot(toLight, n), 0.0);
	float rdotv = max( dot(reflectLight, v), 0.0);
	
	// phong sim
	vec3 ambi = material.ambient * ambientLight;
	vec3 diff = material.diffuse * ndots * lc;
	vec3 spec = material.specular * pow(rdotv, material.shininess) * lc;
	
	return ambi + diff + spec;
}

void main() {

	// per vertex phong here ...
	vec3 ecPosition = (modelViewMatrix * vec4(vertexPosition, 1.0)).xyz;
	vec3 ecNormal   = normalize(normalMatrix * vertexNormal);
	
	
	vec3 viewDir = int(projectionMatrix[2][3])==0?vec3(0,0,1):normalize(-ecPosition);
	
	for (int i=0; i<MAX_LIGHTS; ++i) {
		if (int(light[i].type) == SPOT_LIGHT) {
			vec3 ecLightPosition = (modelViewMatrix * light[i].position).xyz;
			color += phong(ecPosition, viewDir, ecNormal, ecLightPosition, light[i].color);
		}
	}
	
	gl_Position = projectionMatrix * vec4(ecPosition, 1.0);
} 

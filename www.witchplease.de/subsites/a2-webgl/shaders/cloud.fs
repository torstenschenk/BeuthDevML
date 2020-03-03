/*
 * WebGL core teaching framwork 
 * (C)opyright Martin Puse, mpuse@beuth-hochschule.de 
 *
 * Fragment Shader: Phong lighting per Pixel
 */

//precision mediump float;   // doesnt work on some machines
precision highp float;

struct Material {
	vec3 ambient;
	vec3 diffuse;
	vec3 specular;
	float shininess;
};

struct Light {
	vec4 position;
	vec3 color;
	float type;
};

uniform mat4 projectionMatrix;

uniform Light light;

uniform Material material;
uniform vec3 ambientLight;

uniform sampler2D uSamplerCloud;

varying vec3 ecPosition;
varying vec3 ecNormal;
varying vec3 ecLightPosition;

varying vec2 texcoords;

/* calulcate ambient, diffuce and specular light */
vec3 phong(vec3 p, vec3 v, vec3 n, vec3 lp, vec3 lcCloud) {
	// phong model here ... yes please :)
	// derived vectors
	vec3 toLight = normalize(lp - p);
	vec3 reflectLight = reflect(-toLight, n);
	
	// scalar products
	float daydots = max( dot(toLight, n), 0.0);
	
	// phong sim
	vec3 ambi = material.ambient * ambientLight;
	vec3 diff = material.diffuse * daydots * lcCloud;
	
	return ambi + diff;
}

void main() {
	vec3 viewDir =int(projectionMatrix[2][3])==0?vec3(0,0,1):normalize(-ecPosition);
	vec3 texColorCloud = texture2D(uSamplerCloud, texcoords).rgb;

	gl_FragColor = vec4(phong(ecPosition, viewDir, ecNormal, ecLightPosition, texColorCloud),1);
	//gl_FragColor = vec4(texColorCloud,1);
}

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

const int SPOT_LIGHT = 1;
struct Light {
	vec4 position;
	vec3 color;
	float type;
};

uniform mat4 projectionMatrix;

const int MAX_LIGHTS = 2;
uniform Light light[MAX_LIGHTS];

uniform Material material;
uniform vec3 ambientLight;

varying vec3 ecPosition;
varying vec3 ecNormal;
varying vec3 ecLightPosition[MAX_LIGHTS];

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
	vec3 viewDir =int(projectionMatrix[2][3])==0?vec3(0,0,1):normalize(-ecPosition);
	vec3 color;
	for (int i=0; i<MAX_LIGHTS; ++i) {
		if (int(light[i].type) == SPOT_LIGHT) {
			color += phong(ecPosition, viewDir, ecNormal, ecLightPosition[i], light[i].color);
		}
	}
	gl_FragColor = vec4(color,1);	 
}

/*
 * WebGL core teaching framwork 
 * (C)opyright Martin Puse, mpuse@beuth-hochschule.de 
 *
 * Fragment Shader: Phong lighting per vertex
 */

//precision mediump float;   // doesnt work on some machines
precision highp float;


varying vec3 color;

void main() {

	gl_FragColor = vec4(color, 1.0);	 
}

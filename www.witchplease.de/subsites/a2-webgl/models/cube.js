/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 * changes by Martin Puse, mpuse@beuth-hochschule.de
 * Module: Cube
 *
 * The Cube is centered in the origin, all sides are axis-aligned, 
 * and each edge has length 1. 
 *
 *                   H              G
 *                   .--------------.
 *                  /              /|
 *                 / |            / |
 *                /              /  |
 *              D/   |         C/   |
 *    y         .--------------.    |
 *    |         |    |         |    |
 *    |         |    .- - - - -|----.
 *    |         |    E         |   /F
 *    0-----x   |  /           |  /
 *   /          |              | /
 *  /           |/             |/
 * z            .--------------.  
 *              A              B
 *
 *
 * We use a right-handed coordinate system with Z pointing towards the 
 * viewer. For example, vertex A (front bottom left) has the coordinates  
 * ( x = -0.5, y = -0.5, z = 0.5 ) . 
 *
 * The cube only consists of eight different vertex positions; however 
 * for various reasons (e.g. different normal directions) these vertices
 * are "cloned" for each face of the cube. There will be 3 instances
 * of each vertex, since each vertex belongs to three different faces.
 */

/* requireJS module definition */
define(['vbo'], 
function(vbo) {
       
    'use strict';
    
    // constructor, takes WebGL context object as argument
    function Cube(gl) {
        console.log('Creating a unit Cube.'); 
    
        // generate points and store in an array
        var coords = [ 
            // front
            -0.5, -0.5,  0.5,  // A: index 0
             0.5, -0.5,  0.5,  // B: index 1
             0.5,  0.5,  0.5,  // C: index 2
            -0.5,  0.5,  0.5,  // D: index 3
            // back
            -0.5, -0.5, -0.5,  // E: index 4
             0.5, -0.5, -0.5,  // F: index 5
             0.5,  0.5, -0.5,  // G: index 6
            -0.5,  0.5, -0.5,  // H: index 7
            // left
            -0.5, -0.5,  0.5,  // A': index 8
            -0.5,  0.5,  0.5,  // D': index 9
            -0.5,  0.5, -0.5,  // H': index 10
            -0.5, -0.5, -0.5,  // E': index 11
            // right
             0.5, -0.5,  0.5,  // B': index 12
             0.5, -0.5, -0.5,  // F': index 13
             0.5,  0.5, -0.5,  // G': index 14
             0.5,  0.5,  0.5,  // C': index 15
            // top
            -0.5,  0.5,  0.5,  // D'': index 16
             0.5,  0.5,  0.5,  // C'': index 17
             0.5,  0.5, -0.5,  // G'': index 18
            -0.5,  0.5, -0.5,  // H'': index 19
            // bottom
            -0.5, -0.5,  0.5,  // A'': index 20
            -0.5, -0.5, -0.5,  // E'': index 21
             0.5, -0.5, -0.5,  // F'': index 22
             0.5, -0.5,  0.5   // B'': index 23
        ];                                  
        // there are 3 floats per vertex, so...
        this.numVertices = coords.length / 3;
        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, {
            numComponents : 3,
            dataType      : gl.FLOAT,
            data          : coords 
        });
		
		// connection between corners to create triangles
		var indices = [ // 0 = A, 1 = B, ...
			0,1,2, // vorne
			0,2,3,
			1,2,5, // rechts
			2,5,6,
			2,3,6, // oben
			3,6,7,
			0,1,5, // unten
			0,4,5,
			0,3,4, // links
			3,4,7,
			4,5,6, // hinten
			4,6,7
		];
		this.indicesVBO = new vbo.Indices(gl, { "indices": indices });
		
			// generate vertex coilors and store in an array
		var colors = [
			0.0,0.0,0.0,1.0, // colors of vertice 1
			0.0,0.0,1.0,1.0, 
			0.0,1.0,0.0,1.0, // ...
			0.0,1.0,1.0,1.0,
			1.0,0.0,0.0,1.0,
			1.0,0.0,1.0,1.0,
			1.0,1.0,0.0,1.0,
			1.0,1.0,1.0,1.0
		];
		// create vertex buffer object (VBO) for the color
        this.colorBuffer = new vbo.Attribute(gl, {
            numComponents : 4,
            dataType      : gl.FLOAT,
            data          : colors
        });
    };

    // draw method: activate buffers and issue WebGL draw() method
    Cube.prototype.draw = function(gl, program) {
    
        // bind the attribute buffers
        this.coordsBuffer.bind(gl, program, 'vertexPosition');
        this.indicesVBO.bind(gl);
		this.colorBuffer.bind(gl, program, 'vertexColor');
		  
        // draw the vertices as points
        //gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices());
		
		// now draw as triangles
		gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
    };
        
    // this module only returns the constructor function    
    return Cube;
}); // define

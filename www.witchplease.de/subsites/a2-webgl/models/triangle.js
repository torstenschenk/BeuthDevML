/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 * changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: Triangle
 *
 * The Triangle lies in the X-Y plane and consists of three vertices:
 *
 *                     C 
 *    y                .
 *    |               / \
 *    |              /   \
 *    |             /     \    
 *    0-----x      /       \   
 *   /            /         \  
 *  /            /           \ 
 * z            .-------------.  
 *              A             B
 */

/* requireJS module definition */
define(['vbo'], 
function(vbo) {
       
    'use strict';
    
    // constructor, takes WebGL context object as argument
    function Triangle(gl) {
    
        // generate vertex coordinates and store in an array
        var coords = [
            -0.5, -0.5, 0.0,  // coordinates of A
             0.5, -0.5, 0.0,  // coordinates of B
             0.0,  0.5, 0.0   // coordinates of C
        ];

        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, {
            numComponents : 3,
            dataType      : gl.FLOAT,
            data          : coords 
        });
		
		// generate vertex coilors and store in an array
		var colors = [
			1.0,0.0,0.0,1.0, // colors of vertice 1
			0.0,1.0,0.0,1.0, // ...
			0.0,0.0,1.0,1.0
		
		];
		// create vertex buffer object (VBO) for the color
        this.colorBuffer = new vbo.Attribute(gl, {
            numComponents : 4,
            dataType      : gl.FLOAT,
            data          : colors
        });
    }

    // draw method: activate buffers and issue WebGL draw() method
    Triangle.prototype.draw = function(gl, program) {

        // bind the attribute buffers
        program.use();
        this.coordsBuffer.bind(gl, program, 'vertexPosition');
        this.colorBuffer.bind(gl, program, 'vertexColor');
        
		// TODO: connect the vertices to triangles
		//gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices()); 
		
        gl.drawArrays(gl.TRIANGLES, 0, this.coordsBuffer.numVertices()); 
    };
        
    // this module only returns the constructor function    
    return Triangle;
}); // define

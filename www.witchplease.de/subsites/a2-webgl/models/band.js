/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 * changes by Martin Puse, mpuse@beuth-hochschule.de
 * Module: Band
 *
 * The Band is made of two circles using the specified radius.
 * One circle is at y = height/2 and the other is at y = -height/2.
 */

/* requireJS module definition */
define(['vbo'], 
function(vbo) {
       
    'use strict';
    
    /* constructor for Band objects
     * gl:  WebGL context object
     * config: configuration object with the following attributes:
     *         radius: radius of the band in X-Z plane)
     *         height: height of the band in Y
     *         segments: number of linear segments for approximating the shape
     *         asWireframe: whether to draw the band as triangles or wireframe
     *                      (not implemented yet)
     */ 
    function Band(gl, config) {
    
        // read the configuration parameters
        config = config || {};
        var radius     = config.radius    || 1.0;
        var height     = config.height    || 0.1;
        var segments   = config.segments  || 20;
        this.drawStyle = config.drawStyle || 'points';
        
        console.log('Creating a Band with radius='+
            radius +', height='+ height +', segments='+ segments + ', draw style=' + this.drawStyle
        ); 
    
        // generate vertex coordinates and store in an array
        var coords = [];

        for (var i=0; i<=segments; i++) {
        
            // X and Z coordinates are on a circle around the origin
            var t = (i / segments) * 2 * Math.PI;
            var x = Math.sin(t) * radius;
            var z = Math.cos(t) * radius;
            // Y coordinates are simply -height/2 and +height/2 
            var y0 =  height * 0.5;
            var y1 = -height * 0.5;
            
            // add two points for each position on the circle
            // IMPORTANT: push each float value separately!
            coords.push(x, y0, z);
            coords.push(x, y1, z);  
        }

        // create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer = new vbo.Attribute(gl, {
            numComponents : 3,
            dataType      : gl.FLOAT,
            data          : coords 
        });
		
		// surface triangles
		var indices = [];
		for (var i=0; i<segments; i++) {
			var index = i*2;
			indices.push(i*2, i*2+1,i*2+2);  
			indices.push(i*2+1, i*2+2,i*2+3);  
		}
		// connection over the end of segments to start
		indices.push(segments*2, 0, 1);  
		indices.push(segments*2+1, 2, 3);  
		this.indicesVBO = new vbo.Indices(gl, { "indices": indices });
		
		// surface lines
		var lines = [];
		for (var i=0; i<segments; i++) {
			lines.push(i*2, i*2+1);  
			lines.push(i*2, i*2+2);  
			lines.push(i*2+1, i*2+3);  
		}
		// connection over the end of segments to start
		lines.push(segments*2, segments*2+1);  
		lines.push(segments*2, 0);  
		lines.push(segments*2+1, 1);  
		this.indicesLinesVBO = new vbo.Indices(gl, { "indices": lines });
    }

    // draw method: activate buffers and issue WebGL draw() method
    Band.prototype.draw = function(gl, program) {
    
        // bind the attribute buffers
        program.use();
        this.coordsBuffer.bind(gl, program, 'vertexPosition');
		
 
        // draw the vertices
        switch (this.drawStyle) {
            case 'points':	
                gl.drawArrays(gl.POINTS, 0, this.coordsBuffer.numVertices());
                break;
			case 'wire':
				this.indicesLinesVBO.bind(gl);
				gl.drawElements(gl.LINES, this.indicesLinesVBO.numIndices(), gl.UNSIGNED_SHORT, 0);
				//this.indicesLinesVBO.unbind(gl);
				break;
			case 'solid':
				this.indicesVBO.bind(gl);
				//gl.enable(gl.POLYGON_OFFSET_FILL);
				gl.polygonOffset(2,3);
				gl.drawElements(gl.TRIANGLES, this.indicesVBO.numIndices(), gl.UNSIGNED_SHORT, 0);
				gl.disable(gl.POLYGON_OFFSET_FILL);
				//this.indicesVBO.unbind(gl,program,'indices');
				break;
            // other draw styles here
            case 'wireframe':
				program.setUniform('uniColor', 'vec4', [0.0,0.0,0.0,1.0], true)
				this.indicesLinesVBO.bind(gl);
				gl.drawElements(gl.LINES, this.indicesLinesVBO.numIndices(), gl.UNSIGNED_SHORT, 0);
				this.indicesLinesVBO.unbind(gl,program,'indices');
				
				program.setUniform('uniColor', 'vec4', [0.5,1.0,0.5,1.0], true)
				this.indicesVBO.bind(gl);
				gl.enable(gl.POLYGON_OFFSET_FILL);
				gl.polygonOffset(2,3);
				gl.drawElements(gl.TRIANGLES, this.indicesVBO.numIndices(), gl.UNSIGNED_SHORT, 0);
				//gl.disable(gl.POLYGON_OFFSET_FILL);
				this.indicesVBO.unbind(gl,program,'indices');
				break;
            default:
                console.log('Band: draw style ' + this.drawStyle + ' not implemented.');
        }  
    };
        
    // this module only returns the Band constructor function    
    return Band;
}); // define

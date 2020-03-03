/*
 * WebGL core teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 * changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: ParametricSurface
 *
 * This function creates an object to draw any parametric surface.
 */

/* requireJS module definition */
define(['vbo'], 
function(vbo) {
       
    'use strict';
    
    /* constructor for Parametric Surface objects
     * gl:  WebGL context object
     * posFunc: function taking two arguments (u,v) and returning coordinates [x,y,z]
     * config: configuration object defining attributes uMin, uMax, vMin, vMax, 
     *         and drawStyle (i.e. 'points', 'wireframe', or 'surface')
     */ 
    function ParametricSurface(gl, posFunc, config) {
        
       // console.log('ParametricSurface() constructor is now implemented.');
		
		var uMin = config.uMin || -Math.PI;
		var uMax = config.uMax || Math.PI;
		var uSegments = config.uSegments || 50;
		var vMin = config.vMin || -Math.PI;
		var vMax = config.vMax || Math.PI;
		var vSegments = config.vSegments || 50;
        this.drawStyle = config.drawStyle || 'points';
		this.surfCol = config.surfCol || [0.0,1.0,0.0,1.0];
		
		var du = (uMax - uMin)/uSegments;
		var dv = (vMax - vMin)/vSegments;
		
		 // generate vertex coordinates and store in an array
        var coords = [];
        for (var i=0; i<=uSegments; i++) {
			for (var j=0; j<=vSegments; j++) {
				var valu = i*du + uMin;
				var valv = j*dv + vMin;
				var [x,y,z] = posFunc(valu,valv);
            
				// one point per (u,v) coord
				// IMPORTANT: push each float value separately!
				coords.push(x,y,z);
			}
		};	
		
		// create vertex buffer object (VBO) for the coordinates
        this.coordsBuffer2 = new vbo.Attribute(gl, {
            numComponents : 3,
            dataType      : gl.FLOAT,
            data          : coords 
        });
		
		//surface tiangles
		var indices = [];
		var lines = [];
		var numV = vSegments+1;
		for (var i=0; i<uSegments; i++) {
			for (var j=0; j<vSegments; j++) {
				indices.push( i*numV + j, i*numV + j+1, (i+1)*numV + j );
				indices.push( i*numV + j+1, (i+1)*numV + j, (i+1)*numV + j+1 );
				lines.push( i*numV + j, i*numV + j+1 );
				lines.push( i*numV + j, (i+1)*numV + j );
				lines.push(  (i+1)*numV + j, (i+1)*numV + j+1 );
			}
		};
		this.indicesVBO = new vbo.Indices(gl, { "indices": indices });
		this.indicesLinesVBO = new vbo.Indices(gl, { "indices": lines });
    }

    // draw method: activate buffers and issue WebGL draw() method
    ParametricSurface.prototype.draw = function(gl, program) {
    
        //console.log('ParametricSurface.draw() now implemented.');
    
        // bind the attribute buffers
        program.use();
        this.coordsBuffer2.bind(gl, program, 'vertexPosition');
 
        // draw the vertices
        switch (this.drawStyle) {
            case 'points':
                gl.drawArrays(gl.POINTS, 0, this.coordsBuffer2.numVertices());
				//console.log('draw arrays elliptic');
                break;
			case 'wireframe':
			/*
				this.indicesVBO.bind(gl);
				gl.polygonOffset(2,3);
				gl.drawElements(gl.TRIANGLES, this.indicesVBO.numIndices(), gl.UNSIGNED_SHORT, 0);
				gl.disable(gl.POLYGON_OFFSET_FILL);
				break;
				
				*/
				program.setUniform('uniColor', 'vec4', [0.0,0.0,0.0,1.0], true)
				this.indicesLinesVBO.bind(gl);
				gl.drawElements(gl.LINES, this.indicesLinesVBO.numIndices(), gl.UNSIGNED_SHORT, 0);
				this.indicesLinesVBO.unbind(gl,program,'indices');
				
				program.setUniform('uniColor', 'vec4', this.surfCol, true)
				this.indicesVBO.bind(gl);
				gl.enable(gl.POLYGON_OFFSET_FILL);
				gl.polygonOffset(2,3);
				gl.drawElements(gl.TRIANGLES, this.indicesVBO.numIndices(), gl.UNSIGNED_SHORT, 0);
				//gl.disable(gl.POLYGON_OFFSET_FILL);
				this.indicesVBO.unbind(gl,program,'indices');
				break;
            // other draw styles here
            
            default:
                console.log('Parametric: draw style ' + this.drawStyle + ' not implemented.');
        }  
    };
        
    // this module only returns the Band constructor function    
    return ParametricSurface;
}); // define

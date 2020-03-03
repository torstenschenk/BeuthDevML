/*
 * WebGL core teaching framwork 
 * changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: Cloud
 *
 * This function creates an object to draw a cloud.
 */

/* requireJS module definition */
define(['vbo'], 
function(vbo) {
       
    'use strict';
    
    // constructor, takes WebGL context object as argument
    function Cloud(gl, config) {
        console.log('Giving birth to cloud.'); 
    
        config = config || {};
        this._numLatitudes  = config.numLatitudes  || 8;
        this._numLongitudes = config.numLongitudes || 8;
        this._radius        = config.radius || 1;
        
        // generate the attributes
        var coords    = [];
        var normals   = [];
        var texcoords = [];
        for (var latitude = 0; latitude <= this._numLatitudes; latitude++) {
            var theta = latitude * Math.PI / this._numLatitudes;
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            for (var longitude = 0; longitude <= this._numLongitudes; longitude++) {
                var phi = longitude * 2 * Math.PI / this._numLongitudes;
                var cosPhi = Math.cos(phi);
                var sinPhi = Math.sin(phi);
                var x = cosPhi * sinTheta;
                var y = cosTheta;
                var z = sinPhi * sinTheta;
                normals.push(x);
                normals.push(y);
                normals.push(z);
                texcoords.push(1 - longitude / this._numLongitudes); // u
                texcoords.push(1 - latitude  / this._numLatitudes);  // v
                coords.push(this._radius * x);
                coords.push(this._radius * y);
                coords.push(this._radius * z);
            }
        }

        // generate the indices
        var indices = [];
        for (var latitude  = 0; latitude  < this._numLatitudes;  latitude++)
        for (var longitude = 0; longitude < this._numLongitudes; longitude++) {
            
            var first  = latitude * (this._numLongitudes + 1) + longitude;
            var second = first + this._numLongitudes + 1;
            indices.push(first);
            indices.push(second);
            indices.push(first + 1);

            indices.push(second);
            indices.push(second + 1);
            indices.push(first + 1);
        }

        // create the attribute vbos
        this.coordsBuffer = new vbo.Attribute(gl, {
            numComponents : 3,
            dataType      : gl.FLOAT,
            data          : coords 
        });
        this.normalsBuffer = new vbo.Attribute(gl, {
            numComponents : 3,
            dataType      : gl.FLOAT,
            data          : normals 
        });
        this.texcoordsBuffer = new vbo.Attribute(gl, {
            numComponents : 2,
            dataType      : gl.FLOAT,
            data          : texcoords 
        });
        // create the index vbo
        this.indicesBuffer = new vbo.Indices(gl, {
            indices : indices
        });
    };

    // draw method: activate buffers and issue WebGL draw() method
    Cloud.prototype.draw = function(gl, program) {
        // bind the attribute buffers
        this.coordsBuffer.bind(gl, program, 'vertexPosition');
        this.normalsBuffer.bind(gl, program, 'vertexNormal');
		this.texcoordsBuffer.bind(gl, program, 'vertexTexcoords');
		this.indicesBuffer.bind(gl);
		gl.enable(gl.BLEND);
		//gl.blendFunc(gl.SRC_COLOR, gl.DST_COLOR);
		gl.blendFunc(gl.SRC_COLOR, gl.ONE);
		//gl.depthMask(gl.FALSE);
        gl.drawElements(gl.TRIANGLES, this.indicesBuffer.numIndices(), gl.UNSIGNED_SHORT, 0);
        this.coordsBuffer.unbind(gl, program, 'vertexPosition');
        this.normalsBuffer.unbind(gl, program, 'vertexNormal');
		this.texcoordsBuffer.unbind(gl, program, 'vertexTexcoords');
        this.indicesBuffer.unbind(gl);
		gl.disable(gl.BLEND);
		//gl.depthMask(gl.TRUE);
    };
        
    // this module only returns the constructor function    
    return Cloud;
}); // define

/*
 * WebGL core teaching framework 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: texture
 *
 * This module loads images into a webgl format. 
 */

/* requireJS module definition */
define([], function() {
       
    'use strict';
    
	console.log("was in textures");
    // constructor, takes WebGL context object as argument
    function Texture(gl, config) {
        console.log('Creating texture' + config.name); 

        this.isLoaded = false;

        // load a to be replaced dummy texture to prevent gl failing to render the real texture
        this.glTexture = gl.createTexture();
        // gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
        // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        //       new Uint8Array([255, 0, 0, 255])); // red

        var self = this;
        this.glTexture.image = new Image();
        this.glTexture.image.onload = function() {
            self.setParams(gl, config);
            self.isLoaded = true;
            config.onLoaded();
        };
        this.glTexture.image.src = config.path;
    }
    var proto = Texture.prototype;

    proto.setParams = function(gl, config) {
        gl.bindTexture(gl.TEXTURE_2D, this.glTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.glTexture.image);
        if (config.useMipMap) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    // this module only returns the constructor function    
    return Texture;

}); // define

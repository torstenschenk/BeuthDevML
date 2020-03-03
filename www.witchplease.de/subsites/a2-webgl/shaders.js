/*
 * WebGL core teaching framework 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: shaders
 *
 * This module loads required shaders using the require.js text plugin, 
 * see https://github.com/requirejs/text 
 */

/* requireJS module definition - this loads the shaders asynchronously! */
define([
    'text!shaders/vertex_color.vs',    'text!shaders/vertex_color.fs',
    'text!shaders/unicolor.vs',        'text!shaders/unicolor.fs',
    'text!shaders/red.vs',             'text!shaders/red.fs',
	'text!shaders/green.vs',           'text!shaders/green.fs',
	'text!shaders/lila.vs',            'text!shaders/lila.fs',
	'text!shaders/phong_vertex_color.vs','text!shaders/phong_vertex_color.fs',
	'text!shaders/phong_pervertex.vs',  'text!shaders/phong_pervertex.fs',
	'text!shaders/phong_perpixel.vs',  'text!shaders/phong_perpixel.fs',
	'text!shaders/earth.vs',  			'text!shaders/earth.fs',
	'text!shaders/cloud.vs',  			'text!shaders/cloud.fs'
], function(
    vs_vertex_color,    	fs_vertex_color,
    vs_unicolor,        	fs_unicolor,
    vs_red,             	fs_red,
	vs_green,           	fs_green,
	vs_lila,            	fs_lila,
	vs_phong_vertex_color,  fs_phong_vertex_color,
	vs_phong_pervertex,  	fs_phong_pervertex,
	vs_phong_perpixel,  	fs_phong_perpixel,
	vs_earth,			  	fs_earth,
	vs_cloud,			  	fs_cloud
) {

    'use strict';
    
    // store all shaders in an associative array
    var shaders = {
        vertex_color    	: { vertex : vs_vertex_color,   	fragment : fs_vertex_color },
        unicolor        	: { vertex : vs_unicolor,       	fragment : fs_unicolor },
        red             	: { vertex : vs_red,            	fragment : fs_red },
		green           	: { vertex : vs_green,          	fragment : fs_green },
		lila            	: { vertex : vs_lila,           	fragment : fs_lila },
		phong_vertex_color 	: { vertex : vs_phong_vertex_color, fragment : fs_phong_vertex_color },
		phong_pervertex 	: { vertex : vs_phong_pervertex, 	fragment : fs_phong_pervertex },
		phong_perpixel  	: { vertex : vs_phong_perpixel, 	fragment : fs_phong_perpixel },
		earth			  	: { vertex : vs_earth, 				fragment : fs_earth },
		cloud			  	: { vertex : vs_cloud, 				fragment : fs_cloud }
    };
    
    var mod = {
        // return source code of a vertex shader
        getVertexShader: function(shadername) {
            if (!shaders[shadername])
                throw 'module shaders: unknown shader ' + shadername;
    
            if (!shaders[shadername].vertex)
                throw 'module shaders: no vertex shader for ' + shadername;
            
            return shaders[shadername].vertex;
        },

        // return source code of a fragment shader
        getFragmentShader: function(shadername) {
            if (!shaders[shadername])
                throw 'module shaders: unknown shader ' + shadername;

            if (!shaders[shadername].fragment)
                throw 'module shaders: no fragment shader for ' + shadername;

            return shaders[shadername].fragment;
        }
    };

    // module returns getter functions
    return mod;    
}); // define module

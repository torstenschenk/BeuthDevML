/*
 * Module main: CG2 Aufgabe 2 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 * changes by Martin Puse, mpuse@beuth-hochschule.de
 */

requirejs.config({
    paths : {
        jquery : [
            // try content delivery network location first
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the load via CDN fails, load locally
            '../lib/jquery-1.7.2.min'
        ],
        text      : '../lib/text',
        glmatrix  : '../lib/gl-matrix-1.3.7',
        webgldebug: '../lib/webgl-debug',
        Band      : './models/band',
        ParametricSurface: './models/parametric',
        Triangle  : './models/triangle',
		Cube      : './models/cube',
		Sphere    : './models/sphere',
		Earth     : './models/earth',
		Cloud     : './models/cloud'
    }
});

/*
 * The function defined below is the 'main' module,
 * it will be called once all prerequisites listed in the
 * define() statement are loaded.
 */

/* requireJS module definition */
define(['jquery', 'glmatrix', 'webgldebug', 'animation', 'scene', 'html_controller'], 
function($, glmatrix, WebGLDebug, Animation, Scene, HtmlController) {

    'use strict';

    /*
     * setuo the webgl context
     */
    var initWebGLContext = function(canvasName) {
    
        // get the canvas element to be used for drawing
        var canvas = $('#' + canvasName).get(0);
        if (!canvas) 
            throw new Error('HTML element with id \''+ canvasName + '\' not found'); 

        // get WebGL rendering context for canvas element
        var options = {
            alpha     : true,
            depth     : true,
            antialias : true
        };
        var gl = canvas.getContext('webgl', options) || 
                 canvas.getContext('experimental-webgl', options);
        if (!gl)
            throw new Error('could not create WebGL rendering context');
        
        // create a debugging wrapper of the context object
        var gl = WebGLDebug.makeDebugContext(gl, function(error, funcName, args) {
            throw new Error(WebGLDebug.glEnumToString(error) + ' was caused by call to: ' + funcName);
        });
        
        return gl;
    };

    /*
     * create an animation that rotates the scene around 
     * the Y axis over time. 
     */
    var makeAnimation = function(scene) {
    
        // create animation to rotate the scene
        var animation = new Animation(function(totalTime, deltaTime) {
            // rotation angle, depending on animation time
            var angleY = deltaTime / 3000 * animation.customSpeed; // in degrees
            // ask the scene to rotate around Y axis
            scene.rotate('worldY', angleY);
			//var angleX = deltaTime / 9000 * animation.customSpeed; // in degrees
            //ask the scene to rotate around Y axis
            //scene.rotate('worldX', angleX);
			
			// Light rotation angle 
			var angleLY = deltaTime / 1000 * animation.customSpeed; // in degrees
			scene.rotateLight('worldY',angleLY);
			// Light rotation angle 
			//var angleLX = deltaTime / 1000 * animation.customSpeed; // in degrees
			//scene.rotateLight('worldX',angleLX);
            // (re-) draw the scene
            scene.draw();
        });
        // set an additional attribute that can be controlled from the outside
        animation.customSpeed = 21;
        
        return animation;
    };

    /*
     * starts the app
     */
    $(document).ready(function() {
    
        // create WebGL context object for the named canvas object
        var gl = initWebGLContext('DRAWING_AREA');
                                        
        // create scene, create animation, and draw once
        var scene = new Scene(gl);
        var animation = makeAnimation(scene);

        // create HtmlController that takes care of all interaction
        // of HTML elements with the scene and the animation
        var controller = new HtmlController(scene, animation);

        // draw initially
		console.log("init");
        scene.draw();
    });
});


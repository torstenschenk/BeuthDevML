/*
 * Module main: 3WG Aufgabe 1
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * additional changes by Martin Puse, mpuse@beuth-hochschule.de
 */

/* 
 *  RequireJS alias/path configuration (http://requirejs.org/)
 */
requirejs.config({
    paths: {
        // jquery library
        'jquery': [
            // try content delivery network location first
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            // if the load via CDN fails, load locally
            '../lib/jquery-1.7.2.min'
        ],
        'util'            : './utils/util',
        'vec2'            : './math/vec2',
        'Scene'           : './scene/scene',
        'Line'            : './scene/line',
		'Circle'		  : './scene/circle',
		'Rectangle'       : './scene/rectangle',
		'Pcurve'		  : './scene/param_curve',
		'Bcurve'		  : './scene/bezier_curve',
        'PointDragger'    : './scene/point_dragger',
        'SceneController' : './controller/scene_controller',
        'HtmlController'  : './controller/html_controller'
    }
});

/*m
 * The function defined below is the "main" function,
 * it will be called once all prerequisites listed in the
 * define() statement are loaded.
 */
define(['jquery', 'util', 'Scene', 'SceneController', 'HtmlController'],
function($, util, Scene, SceneController, HtmlController) {

    'use strict';

    /*
     * main program, to be called once the document has loaded
     * and the DOM has been constructed
     */
    $(document).ready(function() {

        console.log('document ready - starting!');

        // get the canvas element to be used for drawing
        var canvas = $('#DRAWING_AREA').get(0);
        if (!canvas)
            util.fatal('canvas not found');

        // get 2D rendering context from canvas element
        var context = canvas.getContext('2d');
        if (!context)
            util.fatal('could not create 2D rendering context');

        // create scene with background color
        var scene = new Scene('#ffffFF');
        // create SceneController to process and map events
        var sceneController = new SceneController(context, scene);
        // callbacks for the various HTML elements (buttons, ...)
        var htmlController = new HtmlController(context, sceneController);
    });
});

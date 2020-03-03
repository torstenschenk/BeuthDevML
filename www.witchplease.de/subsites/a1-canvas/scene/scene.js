/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * additional changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: scene
 *
 * A Scene is a depth-sorted collection of things to be drawn, 
 * plus a background fill style.
 */

/* requireJS module definition */
define(['util'],
function(util) {
    
    'use strict';

    /*
     * Scene constructor
     * A Scene is a depth-sorted collection of things to be drawn,
     * plus a background fill style.
     */
    function Scene(bgFillStyle) {

        // remember background color
        this._bgFillStyle = bgFillStyle || '#dddddd';
        // list of objects that can be drawn
        this._drawableObjects = [];
    }
    
    var proto = Scene.prototype;

    /*
     * add multiple drawable objects (provided in an array) to the scene.
     * objects are added in 'drawing order', so objects added later are
     * considered 'on top' of older objects.
     *
     * Each object must at least define a method draw(context) for rendering
     * itself into a 2D rendering context.
     */
    proto.addObjects = function(objects) {
        for (var i=0, len=objects.length; i<len; ++i) {
            if (typeof objects[i].draw !== 'function')
                continue;
            
            this._drawableObjects.push(objects[i]);
        }
    };

    /*
     * remove drawable objects from the scene (provided in an array)
     */
    proto.removeObjects = function(objects) {
        for (var i=0, len=objects.length; i<len; ++i) {
            // find obj in array
            var idx = this._drawableObjects.indexOf(objects[i]);
            if (idx === -1) {
                window.console.log('warning: Scene.remove(): object not found.');
            }
            else {
                // remove obj from array
                this._drawableObjects.splice(idx, 1);
            }   
        }
    };

    /*
     * return array of all objects in the scene,
     * sorted back-to-front or front-to-back
     * Parameters:
     * - sortOrder [optional]: string indicating the order of the objects
     *    - 'back-to-front' [default]
     *    - 'front-to-back'
     */
    proto.getObjects = function(sortOrder) {
        var order = sortOrder || 'back-to-front';
        var clone = this._drawableObjects.slice(0);
        return order === 'back-to-front' ?
            clone : clone.reverse();
    };

    /*
     * drawing the scene means first clearing the canvas
     * and then drawing each object in back-to-front order
     */
    proto.draw = function(context) {
        if (!context)
            util.fatal('Scene.draw(): no context');

        // first we draw the canvas backgound
        if (this._bgFillStyle === 'clear') {
            // clear canvas to the color of the underlying document
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        }
        else {
            // clear canvas with specified background color
            context.fillStyle = this._bgFillStyle;
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        }

        // loop over all drawable objects and call their draw() methods
        var objects = this.getObjects('back-to-front');
        for (var i=0, len=objects.length; i<len; ++i) {
            objects[i].draw(context);
        }
    };


    // this module only exports the constructor for Scene objects
    return Scene;
});

/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * additional changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: scene_controller 
 *
 * This module defines a constructor function SceneController.
 *
 * A SceneController object takes events on the canvas object
 * and maps them to events for the scene objects. The controller
 * takes the drawing/depth order into account, defines 
 * high-level events like 'mouse drag', and handles the selection
 * and deselection of objects.
 *
 * The SceneController requires objects to be rendered to 
 * have the following attributes:
 *
 * - isDragger [Boolean attribute] 
 *     distinguish normal objects from draggers
 *
 * - isHit(pos) [returns Boolean, optional] 
 *     tell whether the object is 'hit' by the provided mouse position. 
 *
 * - createDraggers() [returns array of dragger objects]
 *     creates a set of draggers that can control the object
 *
 * - mouseDown(clickEvent) [optional event handler]
 *
 * - mouseDrag(dragEvent)  [optional event handler]
 *
 * - mouseUp(clickEvent)   [optional event handler]
 */

/* requireJS module definition */
define(['Scene', 'util'],
function(Scene, util) {

    'use strict';

    /*
     * A SceneController handles events on the canvas and triggers
     * the respective actions on objects in the scene.
     *
     * Parameters:
     * - context: the canvas' 2D rendering context
     * - scene  : an object with a draw() method used to trigger a redraw
     */
    function SceneController(context, scene) {

        this._context = context || util.fatal('SceneController got no context');
        this._scene   = scene   || util.fatal('SceneController got no scene'); 
        this._isDragging     = false;  // are we currently in dragging mode?
        this._dragObj        = null;   // which object is currently active?
        this._dragStartPos   = [0, 0]; // position when dragging was started
        this._dragLastPos    = [0, 0]; // last position used in dragging
        this._selected       = [];     // list of selected objects and their draggers
        this._selectCallback = null;   // function to be called with currently selected obj
        this._changeCallback = null;   // function to be called with currently selected obj

        // create event handlers with a closure
        // redirecting to scene controller
        var self = this;
        this._context.canvas.addEventListener('mousedown', function(event) {
            event.preventDefault();
            self.onMouseDown(event);
        }, false);
        this._context.canvas.addEventListener('mousemove', function(event) {
            event.preventDefault();
            self.onMouseMove(event);
        }, false);
        this._context.canvas.addEventListener('mouseup', function(event) {
            event.preventDefault();
            self.onMouseUp(event);
        }, false);
    }

    var proto = SceneController.prototype;

    /*
     *  Register a callback function for whenever the selection changes,
     *  The callback function will be called with one parameter,
     *  which is the currently selected object.
     */
    proto.onSelection = function(func) {
        if (typeof func !== 'function')
            util.fatal('onSelection callback is not a function');
        
        this._selectCallback = func;
    };

    /*
     *  Register a callback for whenever an object is manipulated,
     *  The callback function will be called with one parameter,
     *  which is the currently selected object.
     */
    proto.onChange = function(func) {
        if (typeof func !== 'function')
            util.fatal('onChange callback is not a function');

        this._changeCallback = func;
    };

    /*
     * redraws the whole scene
     */
    proto.redraw = function() {
        this._scene.draw(this._context);
    };
    
    /*
     * return currently selected object or null
     */
    proto.getSelected = function() {
        return this._selected[0] ?
            this._selected[0].obj : null;
    };

    /*
     * let the scene add an object
     */
    proto.add = function(obj) {
        this._scene.addObjects([obj]);
    };

    /*
     * let the scene remove an object
     */
    proto.remove = function(obj) {
		this.deselect();
        this._scene.removeObjects([obj]);
    };

    /*
     * select an object by creating its draggers
     * and adding them to the scene
     */
    proto.select = function(obj) {
        if (!obj)
            util.fatal('SceneController.select(): no object provided');

        // let the object create its draggers
        var draggers = obj.createDraggers();

        // store object and its draggers in an internal list
        this._selected.push({
            'obj'     : obj,
            'draggers': draggers
        });

        // add draggers as scene objects so they get rendered
        this._scene.addObjects(draggers);

        // if it exists, trigger onSelection callback
        this._selectCallback && this._selectCallback(obj);

        // redraw
        this.redraw();
    };

    /*
     * deselect an object by destroying its draggers and
     * removing them from the scene
     * obj is optional: if undefined/null, deselect all objects
     */
    proto.deselect = function(obj) {
        // go backwards through list of currently selected objects
        for (var i=this._selected.length-1; i>=0; --i) {

            // if no obj is specified, or if this object matches...
            if (!obj || obj === this._selected[i].obj) {

                // remove draggers from scene
                this._scene.removeObjects(this._selected[i].draggers);
                // remove object from list
                this._selected.splice(i, 1);
            }
        }

        // redraw
        this.redraw();
    };

    /*
     * Event handler: mouse button is pressed down.
     * --> determine which object is hit,
     *     remember it as the currently active object,
     *     and remember mouse position
     */
    proto.onMouseDown = function(event) {
        // get relative mouse position within canvas
        var pos = util.canvasPosition(event);

        //window.console.log('mouse down at [' + pos[0] + ',' + pos[1] + ']');

        // go through all scene elements in front-to-back order
        var objs = this._scene.getObjects('front-to-back');
        for (var i=0, len=objs.length; i<len; ++i) {

            // determine if object is right under the mouse cursor
            var obj = objs[i];
            if (typeof obj.isHit === 'function' && obj.isHit(pos)) {

                // if so, the first object wins
                this._dragObj = obj;
                this._dragStartPos = pos;
                this._dragLastPos  = pos;

                // if the object is not a dragger, then select it
                if (!obj.isDragger) {
                    // select the object, deselect others
                    this.deselect();
                    this.select(obj);
                }

                // call the object's handler function, if existing
                var clickEvent = { 'position': pos };
                this._isDragging = true;

                obj.onMouseDown && obj.onMouseDown(clickEvent);

                // redraw the scene
                this.redraw();
                return;
            }
        }

        // no foreground element was hit
        this.deselect();
        this._dragObj = null;

        // note: if you want the background of the scene to be clickable,
        // simply add a scene-filling rectangle.
    };

    /*
     * Event handler: called whenever mouse is moving
     * (with buttons up or down, regardless)
     */
    proto.onMouseMove = function(event) {
        // get relative mouse position within canvas
        var pos = util.canvasPosition(event);

        // only do something if the mouse was previously pressed down
        if (this._isDragging) {

            // difference of current and last position
            var deltax = pos[0] - this._dragLastPos[0];
            var deltay = pos[1] - this._dragLastPos[1];

            // window.console.log('mouse drag by [' + deltax + ',' + deltay + ']');

            // call the object's handler function, if existing
            var dragEvent = {
                position : pos,
                delta    : [deltax, deltay]
            };
            this._dragObj &&
            this._dragObj.mouseDrag &&
            this._dragObj.mouseDrag(dragEvent);

            // remember current position
            this._dragLastPos = pos;

            // some parameter of the object may have changed...
            this._changeCallback &&
            this._changeCallback(this.getSelected());

            // redraw the scene
            this.redraw();
            return;
        }
        else {
            // if mouse is hovering: do nothing
            // note: should add active mouse cursors here!
        }
    };

    /*
     * Event handler: called when mouse button is released
     */
    proto.onMouseUp = function(event) {
        // call one last mouse move in case the position has changed
        this.onMouseMove(event);

        // get relative mouse position within canvas
        var pos = util.canvasPosition(event);

        // call mouseUp event handler of object
        var clickEvent = { position: pos };
        this._dragObj &&
        this._dragObj.onMouseUp &&
        this._dragObj.onMouseUp(clickEvent);

        // reset dragging status
        this._isDragging = false;
    };


    // this module exposes only the constructor function
    return SceneController;
});

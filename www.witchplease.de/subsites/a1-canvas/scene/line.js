/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * additional changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: line
 *
 * A Line knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position 'hits' the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 */

/* requireJS module definition */
define(['vec2', 'PointDragger'],
function(vec2, PointDragger) {

    'use strict';

    /**
     *  A simple straight line that can be dragged
     *  around by its endpoints.
     *  Parameters:
     *  - point0 and point1: array objects representing [x,y] coordinates of start and end point
     *  - style: object defining width and color attributes for line drawing,
     *       begin of the form { width: 2, color: '#00FF00' }
     */
    function Line(point0, point1, style) {
        console.log('creating line from [' +
            point0[0] + ',' + point0[1] + '] to [' +
            point1[0] + ',' + point1[1] + '].'
        );

        // initial values in case either point is undefined
        this._point0 = point0 || [10, 10];
        this._point1 = point1 || [50, 10];
        // draw style for drawing the line
        this._style = style || { width: '2', color: '#0000AA' };
    }

    var proto = Line.prototype;


    /*
     * draw this line into the provided 2D rendering context
     */
    proto.draw = function(context) {
        // draw actual line
        context.beginPath();

        // set points to be drawn
        context.moveTo(this._point0[0], this._point0[1]);
        context.lineTo(this._point1[0], this._point1[1]);

        // set drawing style
        context.lineWidth   = this._style.width;
        context.strokeStyle = this._style.color;

        // actually start drawing
        context.stroke();
    };

    /*
     * test whether the mouse position is on this line segment
     */
    proto.isHit = function(mousePos) {

        // project point on line, get parameter of that projection point
        var t = vec2.projectPointOnLine(mousePos, this._point0, this._point1);
        console.log('t:', t);
        // outside the line segment?
        if (t < 0.0 || t > 1.0)
            return false;

        // coordinates of the projected point
        var p = vec2.add(this._point0, vec2.mult(vec2.sub(this._point1, this._point0), t));

        // distance of the point from the line
        var d = vec2.length(vec2.sub(p, mousePos));

        // allow 2 pixels extra 'sensitivity'
        return d <= (this._style.width / 2) + 2;
    };

    /*
     * return array of draggers to manipulate this line
     */
    proto.createDraggers = function() {
        // create custom line endpoint draggers
        var draggerStyle = {
            radius : 4,
            color  : this._style.color,
            width  : 0,
            fill   : true
        };
        var draggers = [];

        // create closure and callbacks for dragger
        var self = this;
        var getP0 = function() { return self._point0; };
        var getP1 = function() { return self._point1; };
        var setP0 = function(dragEvent) { self._point0 = dragEvent.position; };
        var setP1 = function(dragEvent) { self._point1 = dragEvent.position; };
        
        draggers.push(new PointDragger(getP0, setP0, draggerStyle));
        draggers.push(new PointDragger(getP1, setP1, draggerStyle));

        return draggers;
    };
	
    // this module only exports the constructor for Line objects
    return Line;
}); 

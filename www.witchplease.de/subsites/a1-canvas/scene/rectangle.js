/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * additional changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: rectangle
 *
 * A rectangle knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position 'hits' the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 */

/* requireJS module definition */
define(['vec2', 'PointDragger'],
function(vec2, PointDragger) {

    'use strict';

    /**
     *  A simple straight rectangle that can be dragged
     *  around by its endpoints.
     *  Parameters:
     *  - point0, point1: array objects representing [x,y] coordinates of start and end point
     *  - style: object defining width and color attributes for rectangle drawing,
     *       begin of the form { width: 2, color: '#00FF00' }
     */
    function Rectangle(point0, point1, style) {
       

        // initial values in case either point is undefined
        this._point0 = point0 || [10, 10];
        this._point1 = point1 || [50, 50];
        // draw style for drawing the rectangle
        this._style = style || { width: '2', color: '#0000AA' };
		
		var tmp;
		if (this._point0[0] > this._point1[0]) {
			tmp = this._point0[0];
			this._point0[0] = this._point1[0];
			this._point1[0] = tmp;
		}
		if (this._point0[1] > this._point1[1]) {
			tmp = this._point0[1];
			this._point0[1] = this._point1[1];
			this._point1[1] = tmp;
		}
		
		 console.log('creating axis aligned rectangle between [' +
            point0[0] + ',' + point0[1] + '] and [' +
			point1[0] + ',' + point1[1] + '].'
        );
    }

    var proto = Rectangle.prototype;

    /*
     * draw this rectangle into the provided 2D rendering context
     */
    proto.draw = function(context) {
        // draw actual rectangle
        context.beginPath();

		// set points to be drawn
		context.moveTo(this._point0[0], this._point0[1]);
		context.lineTo(this._point0[0], this._point1[1]);
		context.lineTo(this._point1[0], this._point1[1]);
		context.lineTo(this._point1[0], this._point0[1]);
		context.lineTo(this._point0[0], this._point0[1]);
	
        // set drawing style
        context.lineWidth = this._style.width;
        context.strokeStyle = this._style.color;

        // actually start drawing
        context.stroke();

    };

    /*
     * test whether the mouse position is on this rectangle segment
     */
    proto.isHit = function(mousePos) {
		var centerX = (this._point0[0]+this._point1[0]) / 2;
		var centerY = (this._point0[1]+this._point1[1]) / 2;
		var width   = Math.abs(this._point0[0] - this._point1[0]);
		var height  = Math.abs(this._point0[1] - this._point1[1]);
		
        // check distance of mouse to side lines
		var xOffset = Math.abs(centerX - mousePos[0]);
		var yOffset = Math.abs(centerY - mousePos[1]);
		
		// if both negative == inside
		// if one near 0 and the other negativ == boundary touched
		var xDistCenter = xOffset - width/2; // 
		var yDistCenter = yOffset - height/2; // negative == inside
		
		return ( (xDistCenter < 0 && Math.abs(yDistCenter)<2) || (yDistCenter < 0 && Math.abs(xDistCenter)<2))
    }
	 
    /*
     * return array of draggers to manipulate this rectangle
     */
    proto.createDraggers = function() {
		
        // create custom rectangle endpoint draggers
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

    // this module only exports the constructor for Rectangle objects
    return Rectangle;
}); 

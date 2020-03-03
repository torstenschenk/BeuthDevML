/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * additional changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: cirlce
 *
 * A Circle knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position 'hits' the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 * Implemented by Torsten Schenk Mat.Nr: 838995
 * Beuth Hochschule
 */

/* requireJS module definition */
define(['vec2', 'PointDragger'],
function(vec2, PointDragger) {

    'use strict';

    /**
     *  A simple straight circle that can be dragged on its center,
     *  select by clicking on its outer circle boundary.
     *  Parameters:
     *  - point0: array object representing [x,y] coordinate of start point
	 *  - radius: radius for circle
     *  - style: object defining width and color attributes for circle drawing,
     *       begin of the form { width: 2, color: '#00FF00' }
     */
    function Circle(center, radius, style) {
        console.log('creating circle on [' +
            center[0] + ',' + center[1] + '] radius: ' +
            radius + ', fill: ' + (style.fill===true)
        );

        // initial values in case either point is undefined
        this._center = center || [10, 10];
        this._radius = radius || 25;
        // draw style for drawing the circle
        this._style = style || { width: '2', color: '#0000AA', fill: 'false' };
		
		// create pos fro radius handleEvent
		this._radiusHandlePos = [center[0]+ parseInt(radius),center[1]];
		 //console.log('creating circle handle on [' +
         //  this._radiusHandlePos[0] + ',' + this._radiusHandlePos[1] + ']' );
    };

    var proto = Circle.prototype;

    /*
     * draw this circle into the provided 2D rendering context
     */
    proto.draw = function(context) {
        // draw actual circle
        context.beginPath();

        // draw arc
        context.arc(this._center[0], this._center[1], this._radius, 0.0, 2 * Math.PI, true);
		
		 context.strokeStyle = this._style.color;
        // set drawing style
		if ( this._style.fill === true ) {
			context.fillStyle = this._style.color;
			// start drawing with fill
			context.fill();
		} else {
			context.lineWidth   = this._style.width;
			// actually start drawing with stroke
			context.stroke();
		} 
    };

    /*
     * test whether the mouse position is on this circle
     */
	// calc center dist helper
	function calcDistToCenter(center, mousePos) {
		var xDiff = center[0] - mousePos[0];
		var yDiff = center[1] - mousePos[1];
		
		return Math.sqrt( xDiff*xDiff + yDiff*yDiff );
	}
		
    proto.isHit = function(mousePos) {
	
        // check distance of mouse to center point of circle
		var centerDist = calcDistToCenter(this._center, mousePos);
		
		// subtrace circle radius from calculated distance of mouse pointer
		var d = centerDist-this._radius;
		
		// print inner dist as - and outer dist as +
		console.log('circEdgeDist:', d);
		
		if (this._style.fill === true ) {
			// if mouse is inside, i.e. 'd' is negative
			return d < 0.0;
		} else {
			// if d is in range of +/- 2 px
			return Math.abs(d) <= 2.0;
		}
    };

    /*
     * return array of draggers to manipulate this circle
     */
    proto.createDraggers = function() {
        // create custom circle center dragger
		var col;
		if (this._style.fill === true ) {
			col = '#000000';
		} else {
			col = this._style.color;
		}
		
        var draggerStyle = {
            radius : 4,
            color  : col,
            width  : 0,
            fill   : true
        };
        var draggers = [];

        // create closure and callbacks for dragger
        var self = this;
		// center
        var getP0 = function() { return self._center; };
        var setP0 = function(dragEvent) { 
			self._center = dragEvent.position; 
			self._radiusHandlePos = [self._center[0] + parseInt(self._radius), self._center[1]];
		};
		// on radius
        var getP1 = function() { return self._radiusHandlePos; };
        var setP1 = function(dragEvent) { 
			self._radius = calcDistToCenter(self._center, dragEvent.position);
			self._radiusHandlePos = [self._center[0]+ parseInt(self._radius),self._center[1]]
			//dragEvent.position;
		};
		
        draggers.push(new PointDragger(getP0, setP0, draggerStyle));
		draggers.push(new PointDragger(getP1, setP1, draggerStyle));

        return draggers;
    };

    // this module only exports the constructor for Line objects
    return Circle;
}); 

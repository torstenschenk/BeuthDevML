/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
  * additional changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: bezier curve
 *
 * On a bezier curve it is not easy to determine when the mouse hits 
 * the curve, the function createDraggers() returns an empty array.
 * Parametric curves cannot moved again, though selected at its 4 polygon points.
 */

/* requireJS module definition */
define(['vec2', 'PointDragger'],
function(vec2, PointDragger) {

    'use strict';

    /**
     *  A bezier curve that can be edited or moved
     *  around by its polygon points.
     *  Parameters:
     *  - point0, point1, p3, p4: array objects representing [x,y] coordinates of start and end point
     *  - style: object defining width and color attributes for  bezier curve drawing,
     *  - optional are the ticks at the segment points and if the polyong is shown   
     */
    function Bcurve(points, segments, style) {
        // initial values in case either point is undefined
		this._points = points || [[20,20],[80,20],[80,150],[250,150]];
        // draw style for drawing the pcurve
		this._segments = segments || 20;
        this._style = style || { width: '2', color: '#0000AA', ticks: '20', poly: 'false', isBcurve: '1' };
		console.log('creating bezier curve');	
		
    }

    var proto = Bcurve.prototype;

    /*
     * draw this pcurve into the provided 2D rendering context
     */
    proto.draw = function(context) {
		
		var coordxList = [];
		var coordyList = [];
		
		context.moveTo(this._points[0][0], this._points[0][1]);
		context.beginPath();
		// connect always point with next point
		var step = 1/this._segments;
		for (var m = 0; m <= this._segments; m++) {
			var t = m*step;
			var t2 = t**2;
			var t3 = t**3
			var mt = 1-t;
			var mt2 = mt**2;
			var mt3 = mt**3;
			
			//console.log('step,m,t,diff: ' + step + ', ' + m + ', ' + t +', ' + mt );
			var px =         mt3 * this._points[0][0] + 
					  3*t  * mt2 * this._points[1][0] +
					  3*t2 * mt  * this._points[2][0] +
					    t3 *       this._points[3][0];
			var py =         mt3 * this._points[0][1] + 
					  3*t  * mt2 * this._points[1][1] +
					  3*t2 * mt  * this._points[2][1] +
					    t3 *       this._points[3][1];
						
			coordxList.push(px);
			coordyList.push(py);
			context.lineTo(px, py);
		}		
        // set drawing style
        context.lineWidth = this._style.width;
        context.strokeStyle = this._style.color;
        // actually start drawing
        context.stroke();
		
		// draw ticks
		if(this._style.ticks) {
			console.log('Enter ticks');
			var p0,p1, distX, distY;
			
			var calcNewTick = function(distX,distY){
				var ticklength = 15.0;
				var x,y;
				// normalise vector to length of 10px
				var len = vec2.length([distX,distY]);
				x = ticklength * distX / parseFloat(len);
				y = ticklength * distY / parseFloat(len);
				p0 = [-y,x];
				p1 = [y,-x];
				return [p0,p1];
			}
			
			var drawTick = function(index1,index2, indexP){
				// orthogonal line by diff from point (index2 - index1)
				// indexP == point to draw the ortho line from
				context.beginPath();
				context.moveTo(coordxList[indexP], coordyList[indexP]);
				distX = coordxList[index2] - coordxList[index1];
				distY = coordyList[index2] - coordyList[index1];
				npoint = calcNewTick(distX,distY);
				p0 = [npoint[0][0],npoint[0][1]];
				p1 = [npoint[1][0],npoint[1][1]];
				// add vector to points, in two directions
				context.lineTo((p0[0]+coordxList[indexP]),(p0[1]+coordyList[indexP]));
				context.lineTo((p1[0]+coordxList[indexP]),(p1[1]+coordyList[indexP]));
				// set drawing style
				context.lineWidth = 1;
				context.strokeStyle = "#000000";
				// actually start drawing
				context.stroke();
			}
			
			var npoint;
			
			for (var m = 0; m <= coordxList.length; m++){
				console.log('Enter ticks 4');
				if (m==0) {
					drawTick(0,1,0);
				} else if ( m < this._segments ) {
					drawTick(m-1,m+1,m);
				} else {
					drawTick(m-1,m,m);
				}
			}
		}
		
		// draw polygon lines
		if(this._style.poly) {
			// move draw pointer to start point
			context.moveTo(this._points[0][0], this._points[0][1]);
			context.beginPath();
			// connect always point with next point
			for (var i = 0; i < 4; i++) { 
				context.lineTo(this._points[i][0], this._points[i][1]);
			}
			
			// set drawing style
			context.lineWidth = 1;
			context.strokeStyle = "#000000";

			// actually start drawing
			context.stroke();
		}
    };

    /*
     * test whether the mouse position is on this pcurve segment
     */
    proto.isHit = function(mousePos) {
		// parametric curce will be only selectable near start and endpoint
		var hit = false;
		
		for (var i = 0; i < 4; i++) { 
			var distx = Math.abs(this._points[i][0]-mousePos[0]); 
			var disty = Math.abs(this._points[i][1]-mousePos[1]); 
			if ( distx < 3 && disty < 3) {
				hit = true;	
				console.log('Mouse pos dist to selected curve point:[' + distx + ', ' + disty + ']');
			}
		}
		return hit?1:0;
    }
	 
    /*
     * return array of draggers to manipulate this pcurve
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
		var point;
		
		var getP0 = function() { 
			return point = [self._points[0][0],self._points[0][1]]; };
		var getP1 = function() { 
			return point = [self._points[1][0],self._points[1][1]]; };
		var getP2 = function() { 
			return point = [self._points[2][0],self._points[2][1]]; };
		var getP3 = function() { 
			return point = [self._points[3][0],self._points[3][1]]; };	
		var setP0 = function(dragEvent) {
			self._points[0][0] = dragEvent.position[0];
			self._points[0][1] = dragEvent.position[1]; };
		var setP1 = function(dragEvent) {
			self._points[1][0] = dragEvent.position[0];
			self._points[1][1] = dragEvent.position[1]; };
		var setP2 = function(dragEvent) {
			self._points[2][0] = dragEvent.position[0];
			self._points[2][1] = dragEvent.position[1]; };
		var setP3 = function(dragEvent) {
			self._points[3][0] = dragEvent.position[0];
			self._points[3][1] = dragEvent.position[1]; };
		draggers.push(new PointDragger(getP0, setP0, draggerStyle));
		draggers.push(new PointDragger(getP1, setP1, draggerStyle));
		draggers.push(new PointDragger(getP2, setP2, draggerStyle));
		draggers.push(new PointDragger(getP3, setP3, draggerStyle));
		
        return draggers;
    };

    // this module only exports the constructor for Pcurve objects
    return Bcurve;
}); 

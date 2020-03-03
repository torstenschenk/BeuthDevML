/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
  * additional changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: parametric curve
 *
 * On a param curve it is not easy to determine when the mouse hits 
 * a curve, the function createDraggers() returns an empty array.
 * Parametric curves cannot moved again, though selected on its start and end point.
 */

/* requireJS module definition */
define(['vec2', 'PointDragger'],
function(vec2, PointDragger) {

    'use strict';

    /**
     *  A parametric curve that can be selected by its endpoints but not moved or edited.
     *  Parameters:
     *  - point0, point1: array objects representing [x,y] coordinates of start and end point
     *  - style: object defining width and color attributes for pcurve drawing,
     *       begin of the form { width: 2, color: '#00FF00' }
     */
    function Pcurve(xt, yt, segments, tlimits, style) {
       
        // initial values in case either point is undefined
		if (xt != undefined)
			this._xt = xt;

		if (yt != undefined)
			this._yt = yt;
        
        // draw style for drawing the pcurve
        this._style = style || { width: '2', color: '#0000AA' };
		
		this._segments = segments || 20;
		this._limits = tlimits || [0, 30];
		
		 console.log('creating param curve: [xt, yt, segmentnum, limits] [' +
            this._xt + ',' + this._yt + ' ,' + this._segments + ',' + 
			this._limits[0] + ',' + this._limits[1] + '].'
        );
		
		this._startP = [0.0,0.0];
		this._endP = [0.0,0.0];
		
    }

    var proto = Pcurve.prototype;

    /*
     * draw this pcurve into the provided 2D rendering context
     */
    proto.draw = function(context) {
        // draw actual pcurve
		var formular, t;
		var calc_t = function(formular, t) { 
			// evil eval function, beware of hackers
			// try catch block to catch wrong syntax
			try {
				var ret = eval(formular);
			}
			catch(err) {
				var ret = function(formular, t) {
					return 1;
				}
				console.log('Parametric Formular not valid, try again!');
			}
			return ret;
		}
		
		// needed for hit check later
		var startPx = calc_t(this._xt,this._limits[0]);
		var startPy = calc_t(this._yt,this._limits[0]);
		var endPx   = calc_t(this._xt,this._limits[1]);
		var endPy   = calc_t(this._yt,this._limits[1]);
		this._startP = [startPx,startPy];
		this._endP = [endPx,endPy];
		
		var dt = Math.abs((this._limits[1]-this._limits[0]))/this._segments;
		//console.log('Pcurve dt segments: [' + dt + ', ' + this._segments + ']');
        

		// move draw pointer to start point
		context.moveTo(calc_t(this._xt,this._limits[0]), calc_t(this._yt,this._limits[0]));
		context.beginPath();
		// connect always point with next point
		var currxt = 0.0;
		var curryt = 0.0;
		for (var i = 0; i <= this._segments; i++) { 
			t = parseFloat(this._limits[0]) + i*dt;
			currxt = calc_t(this._xt, t);
			curryt = calc_t(this._yt, t);
			//console.log('Pcurve point (t): [' + t +' ,'+ currxt + ', ' + curryt + ']');
			context.lineTo(currxt, curryt);
		}
		
        // set drawing style
        context.lineWidth = this._style.width;
        context.strokeStyle = this._style.color;

        // actually start drawing
        context.stroke();
	
    };

    /*
     * test whether the mouse position is on this pcurve segment
     */
    proto.isHit = function(mousePos) {
		// parametric curce will be only selectable near start and endpoint
		var diststartx = Math.abs(this._startP[0]-mousePos[0]); 
		var diststarty = Math.abs(this._startP[1]-mousePos[1]);
		var distendx = Math.abs(this._endP[0]-mousePos[0]); 
		var distendy = Math.abs(this._endP[1]-mousePos[1]);
		
		console.log('Mousepos for parametric curve select:[' + mousePos[0]+ ', ' + mousePos[1]+ 
		'] startP:[' + this._startP[0] + ', ' + this._startP[1]+ 
		'] endP:[' +this._endP[0] + ', ' + this._endP[1]+ ']');
		
		return (( diststartx < 4 && diststarty < 4) || ( distendx < 4 && distendy < 4));
    }
	 
    /*
     * return array of draggers to manipulate this pcurve
     */
    proto.createDraggers = function() {
        // do not generate any draggers!
		return [];
    };

    // this module only exports the constructor for Pcurve objects
    return Pcurve;
}); 

/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 * additional changes by Martin Puse, mpuse@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 */

/* requireJS module definition */
define(['jquery', 'util', 'Line','Circle','Rectangle','Pcurve','Bcurve'],
function($, util, Line, Circle, Rectangle, Pcurve, Bcurve) {
    
    'use strict';
    /*
     * define callback functions to react to changes in the HTML page
     * and provide them with a closure defining context
     */
    function HtmlController(context, sceneController) {
		console.log('run');

        // generate random coordinates within the canvas
        var _randomX = function() { return util.randomInt(context.canvas.width,  5); };
        var _randomY = function() { return util.randomInt(context.canvas.height, 5); };

		function checkWidth(width) {
			if (width < 1) {
				width = 1;
				document.getElementById("myWidth").value = width;
			} 
			return width;
		}
		
		function checkSegments(segments) {
			if (segments < 2) {
				segments = 2;
				document.getElementById("mysegment").value = segments;
			} 
			return segments;
		}
			
		function changeObj() {
			var obj = sceneController.getSelected();
			if ( obj instanceof Circle ){
				// console.log("is circle");
				document.getElementById("myRadius").value = obj._radius;
			}
			
			document.getElementById("myWidth").value = obj._style.width;
		}
	
		// CB to write obj parameters back to gui boxes
		function activateObj() {
			//console.log("test");
			var obj = sceneController.getSelected();
			if (obj != undefined) {
				
				document.getElementById("myColor").value = obj._style.color;
				
				// filled circles
				if (obj._style.fill != undefined) {
					$("#checkBoxFill").show();
					$("#myFillText").show();
					document.getElementById("checkBoxFill").checked = (obj._style.fill?true:false);
				} else {
					$("#checkBoxFill").hide();
					$("#myFillText").hide();
				}
				
				// all cricles habe radius
				if (obj._radius != undefined) {
					$("#myRadius").show();
					$("#myRadText").show();
					document.getElementById("myRadius").value = obj._radius;
				} else {
					$("#myRadius").hide();
					$("#myRadText").hide();
				}
				
				// parametric curve
				if (obj._xt != undefined) {
					$("#myx_t").show();
					$("#myxtText").show();
					document.getElementById("myx_t").value = obj._xt;
				} else {
					$("#myx_t").hide();
					$("#myxtText").hide();
				}
				if (obj._yt != undefined) {
					$("#myy_t").show();
					$("#myytText").show();
					document.getElementById("myy_t").value = obj._yt;
				} else {
					$("#myy_t").hide();
					$("#myytText").hide();
				}
				if (obj._limits != undefined) {
					$("#mytmin").show();
					$("#mytminText").show();
					$("#mytmax").show();
					$("#mytmaxText").show();
					document.getElementById("mytmin").value = obj._limits[0];
					document.getElementById("mytmax").value = obj._limits[1];
				} else {
					$("#mytmin").hide();
					$("#mytminText").hide();
					$("#mytmax").hide();
					$("#mytmaxText").hide();
				}
				
				// parametric and bezier curves
				if (obj._segments != undefined) {
					$("#mysegment").show();
					$("#mysegmText").show();
					document.getElementById("mysegment").value = obj._segments;
				} else {
					$("#mysegment").hide();
					$("#mysegmText").hide();
				}
				// bezier curve only
				if (obj._style.isBcurve != undefined) {
					$("#checkBoxTicks").show();
					$("#myTicksText").show();
					document.getElementById("checkBoxTicks").checked = (obj._style.ticks?true:false);
					$("#checkBoxPoly").show();
					$("#myPolyText").show();
					document.getElementById("checkBoxPoly").checked = (obj._style.poly?true:false);
				} else {
					$("#checkBoxTicks").hide();
					$("#myTicksText").hide();				
					$("#checkBoxPoly").hide();
					$("#myPolyText").hide();
				}
			}
		};
		
		sceneController.onChange(changeObj);
		sceneController.onSelection(activateObj);
        /*
         * event handler for 'new line' button.
         */
        $('#btnNewLine').click(function() {
            // create the actual line and add it to the scene
            var style = {
                width : document.getElementById("myWidth").value,
                color : document.getElementById("myColor").value
            };
				
			style.width = checkWidth(document.getElementById("myWidth").value);
			
            var line = new Line(
                [ _randomX(), _randomY() ],
                [ _randomX(), _randomY() ],
                style
            );
			
            // add and select newly created object
            sceneController.add(line);
            sceneController.deselect();
            sceneController.select(line); // this will also redraw
        });
		
		/*
         * event handler for 'new circle' button.
         */
        $('#btnNewCircle').click(function() {
			
			var style = {
                width : document.getElementById("myWidth").value,
                color : document.getElementById("myColor").value,
				fill : false
			};
			
			style.width = checkWidth(document.getElementById("myWidth").value);
			
			var radius = document.getElementById("myRadius").value;
			if (radius < 10) {
				radius = 10;
				document.getElementById("myRadius").value = radius;
			}
			
			
			if($('#checkBoxFill').attr('checked')) {
				style.fill = true;
			};
			
            // create the actual circle and add it to the scene
            var circle = new Circle(
                [ _randomX(), _randomY() ],
                radius,
                style
            );
            // add and select newly created object
            sceneController.add(circle);
            sceneController.deselect();
            sceneController.select(circle); // this will also redraw
        });
		
		 /*
         * event handler for 'new line' button.
         */
        $('#btnNewRect').click(function() {
			
            // create the actual line and add it to the scene
            var style = {
                width : document.getElementById("myWidth").value,
                color : document.getElementById("myColor").value,

            };
			
			style.width = checkWidth(document.getElementById("myWidth").value);
			
            var rectangle = new Rectangle(
                [ _randomX(), _randomY()],
                [ _randomX(), _randomY()],
                style
            );
			
            // add and select newly created object
            sceneController.add(rectangle);
            sceneController.deselect();
            sceneController.select(rectangle); // this will also redraw
        });
		
		 /*
         * event handler for 'new line' button.
         */
        $('#btnNewPcurve').click(function() {
			
            // create the actual line and add it to the scene
            var style = {
                width : document.getElementById("myWidth").value,
                color : document.getElementById("myColor").value,
            };
			
			style.width = checkWidth(document.getElementById("myWidth").value);
			
			var tmin = document.getElementById("mytmin").value;
			var tmax = document.getElementById("mytmax").value;
			
			if (Math.abs(tmin - tmax) < 5) {
				tmin = 0;
				tmax = 5;
				document.getElementById("mytmin").value = tmin;
				document.getElementById("mytmin").value = tmax;
			}
			var tlimits = [tmin,tmax];
			
			var segments = checkSegments(document.getElementById("mysegment").value);
            var pcurve = new Pcurve(
				document.getElementById("myx_t").value,
				document.getElementById("myy_t").value,
				segments, tlimits, style );
			
            // add and select newly created object
            sceneController.add(pcurve);
            sceneController.deselect();
            sceneController.select(pcurve); // this will also redraw
        });
		
		 /*
         * event handler for 'new bezier curve' button.
         */
        $('#btnNewBcurve').click(function() {
            // create the actual line and add it to the scene
            var style = {
                width : document.getElementById("myWidth").value,
                color : document.getElementById("myColor").value,
				ticks : false,
				poly  : false,
				isBcurve: 1
            };
			
			style.width = checkWidth(document.getElementById("myWidth").value);
			
			if($('#checkBoxTicks').attr('checked')) {
				style.ticks = true;
			};
			if($('#checkBoxPoly').attr('checked')) {
				style.poly = true;
			};
			
			var segments = checkSegments(document.getElementById("mysegment").value);
            var bcurve = new Bcurve(
                [[ _randomX(), _randomY() ],
                 [ _randomX(), _randomY() ],
				 [ _randomX(), _randomY() ],
				 [ _randomX(), _randomY() ]],
				segments,
                style
            );
			
            // add and select newly created object
            sceneController.add(bcurve);
            sceneController.deselect();
            sceneController.select(bcurve); // this will also redraw
        });
		
		// update circle
		 $('#checkBoxFill').change(function() {
			console.log("detected fill change!");
			var obj = sceneController.getSelected();
			if (obj != undefined) {
				if (obj instanceof Circle) {
					obj._style.fill = $('#checkBoxFill').attr('checked')?true:false;
					sceneController.redraw();
				}
			}   
	   });
	    $('#myRadius').change(function () {
           console.log("detected radius change!");
		   var obj = sceneController.getSelected();
			if (obj != undefined) {
				if (obj instanceof Circle) {
					obj._radius = checkSegments(document.getElementById("myRadius").value);
					sceneController.redraw();
				}
			}
       });
		
		// update PCurve obj
		$('#myx_t').change(function () {
           console.log("detected x string change!");
		   var obj = sceneController.getSelected();
			if (obj != undefined) {
				if (obj instanceof Pcurve) {
					obj._xt = document.getElementById("myx_t").value;
					sceneController.redraw();
				}
			}
       });	   
	   $('#myy_t').change(function () {
           console.log("detected y string change!");
		   var obj = sceneController.getSelected();
			if (obj != undefined) {
				if (obj instanceof Pcurve) {
					obj._yt = document.getElementById("myy_t").value;
					sceneController.redraw();
				}
			}
       });
	   
	   // update Bcurve
	   $('#checkBoxTicks').change(function() {
			console.log("detected tick box change!");
			var obj = sceneController.getSelected();
			if (obj != undefined) {
				if (obj instanceof Bcurve) {
					obj._style.ticks = $('#checkBoxTicks').attr('checked')?true:false;
					sceneController.redraw();
				}
			}
		   
	   });
	   $('#checkBoxPoly').change(function() {
			console.log("detected poly box change!");
			var obj = sceneController.getSelected();
			if (obj != undefined) {
				if (obj instanceof Bcurve) {
					obj._style.poly = $('#checkBoxPoly').attr('checked')?true:false;
					sceneController.redraw();
				}
			}
		   
	   });
	   $('#mysegment').change(function () {
           console.log("detected segment num change!");
		   var obj = sceneController.getSelected();
			if (obj != undefined) {
				if (obj instanceof Bcurve || obj instanceof Pcurve) {
					obj._segments = checkSegments(document.getElementById("mysegment").value);
					sceneController.redraw();
				}
			}
       });

	   $('#myWidth').change(function () {
           console.log("detected width num change!");
		   var obj = sceneController.getSelected();
			if (obj != undefined) {
				obj._style.width  = checkWidth(document.getElementById("myWidth").value);
				sceneController.redraw();
			}
       });
	  
	  $('#myColor').change(function () {
           console.log("detected color change!");
		   var obj = sceneController.getSelected();
			if (obj != undefined) {
				obj._style.color = checkSegments(document.getElementById("myColor").value);
				sceneController.redraw();
			}
       });
	   
	   
	   // delete
	   	 /*
         * event handler for 'new bezier curve' button.
         */
		
        $('#btnDel').click(function() {
			console.log("detected delete button!");
		    var obj = sceneController.getSelected();
			if (obj != undefined) {
				sceneController.remove(obj);
				sceneController.redraw();
			}
        });
		
    };

    // return the constructor function
    return HtmlController;
});

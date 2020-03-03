/*
 *
 * Module scene
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Martin Puse, mpuse@beuth-hochschule.de
 */

/* requireJS module definition */
define(['glmatrix', 'program', 'shaders', 'Band', 'ParametricSurface', 'Triangle','Cube','Sphere','Earth','texture','Cloud'], 
function(glmatrix, Program, shaders, Band, ParametricSurface, Triangle, Cube, Sphere, Earth, Texture, Cloud) {

    'use strict';
    
    // simple scene: create some scene objects in the constructor, and
    // draw them in the draw() method
    function Scene(gl) {

        // store the WebGL rendering context 
        this.gl = gl;  
            
        // create all required GPU programs from vertex and fragment shaders
        this.programs = {
            red : new Program(gl, 
                shaders.getVertexShader('red'), 
                shaders.getFragmentShader('red')
            ),
			green : new Program(gl, 
                shaders.getVertexShader('green'), 
                shaders.getFragmentShader('green')
            ),
			lila : new Program(gl, 
                shaders.getVertexShader('lila'), 
                shaders.getFragmentShader('lila')
            ),
            vertexColor : new Program(gl, 
                shaders.getVertexShader('vertex_color'), 
                shaders.getFragmentShader('vertex_color')
            ),
			uniColor : new Program(gl, 
                shaders.getVertexShader('unicolor'), 
                shaders.getFragmentShader('unicolor')
            ),
			vertexNormalCol : new Program(gl, 
                shaders.getVertexShader('phong_vertex_color'), 
                shaders.getFragmentShader('phong_vertex_color')
            ),
			vertexNormalPhong : new Program(gl, 
                shaders.getVertexShader('phong_pervertex'), 
                shaders.getFragmentShader('phong_pervertex')
            ),
			vertexNormalPixel : new Program(gl, 
                shaders.getVertexShader('phong_perpixel'), 
                shaders.getFragmentShader('phong_perpixel')
            ),
			earth : new Program(gl, 
                shaders.getVertexShader('earth'), 
                shaders.getFragmentShader('earth')
            ),
			cloud : new Program(gl, 
                shaders.getVertexShader('cloud'), 
                shaders.getFragmentShader('cloud')
            )
        };

        // create a camera mathematically
        this.camera = {
            eye : [0, 0.5, 10],  // position in scene
            pov : [0, 0, 0],     // focus point
            up  : [0, 1, 0]      // head orientation
        };

        // setup some matrices for mvp
        this.modelviewMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        this.rotationMatrix = mat4.create();
        mat4.identity(this.rotationMatrix);
        this.projectionMatrix = mat4.create();
		this.lightPos0 = [-10.0,0.0,-7.0,1.0];//[2.0,2.0,2.0,1.0];//[10.0, 12.5, 11.0, 1.0];
        
		// function to set material via application
		this.setMaterial = function(prog, mat) {
			prog.use();
			prog.setUniform("material.ambient",   "vec3",  mat.ambient);
			prog.setUniform("material.diffuse",   "vec3",  mat.diffuse);	
			prog.setUniform("material.specular",  "vec3",  mat.specular);	
			prog.setUniform("material.shininess", "float", mat.shininess);	
		};
		// function to set single light via application
		this.setLight1 = function(prog, matL) {
			prog.use();
			prog.setUniform("light.position","vec4",  matL.position);
			prog.setUniform("light.color",   "vec3",  matL.color);		
			prog.setUniform("light.type",   "float",  matL.type);
		};
		this.setLight2 = function(prog, matL0,matL1) {
			prog.use();
			prog.setUniform("light[0].position","vec4",  matL0.position);
			prog.setUniform("light[0].color",   "vec3",  matL0.color);		
			prog.setUniform("light[0].type",   "float",  matL0.type);
			prog.setUniform("light[1].position","vec4",  matL1.position);
			prog.setUniform("light[1].color",   "vec3",  matL1.color);		
			prog.setUniform("light[1].type",   "float",  matL1.type);
		};
		
        // the scene has an attribute 'drawOptions' that is used by 
        // the HtmlController. Each attribute in this.drawOptions 
        // automatically generates a corresponding checkbox in the UI.
        this.drawOptions = {
            'Perspective Projection': false, 
            'Show Band Points'      : false,
			'Show Band Wire'        : false,
			'Show Band Solid'       : false,
			'Show Band WireFrame'   : false,
            'Show Ellipsoid'        : false,
			'Show Horn'		        : false,
			'Show Helicoid'         : false,
			'Show Triangle'         : false,
			'Show Cube'             : false,
			'Show Sphere Colored'	: false,
			'Show Sphere Phong'		: false,
			'Show Sphere Pixel'		: false,
			'Show Earth'			: false,
			'Show Cloud'			: false
		};

        /*
         * create objects for the scene
         */

        // create a Band object to be drawn in this scene
        this.bandPoints = new Band(gl, { height : 0.4, drawStyle : 'points' });
		this.bandWire = new Band(gl, { height : 0.4, drawStyle : 'wire' });
		this.bandSolid = new Band(gl, { height : 0.4, drawStyle : 'solid' });
		this.bandWireframe = new Band(gl, { height : 0.4, drawStyle : 'wireframe' });

        // ELLIPSIOD: create a parametric surface function
        var ellipsoidFunc = function(u, v) {
            return [
                0.5 * Math.sin(u) * Math.cos(v),
                0.3 * Math.sin(u) * Math.sin(v),
                0.9 * Math.cos(u)
            ];
        };
         // ELLIPSIOD: create a parametric surface to be drawn in this scene
        this.ellipsoid = new ParametricSurface(gl, ellipsoidFunc, {
            uMin : -Math.PI, uMax : Math.PI, uSegments : 50,
            vMin : -Math.PI, vMax : Math.PI, vSegments : 50,
            drawStyle: 'wireframe',
			surfCol: [1.0,0.5,0.0,1.0]
        });
		
		// HORN: create a parametric surface function
		 var hornFunc = function(u, v) {
			 var a = 1.0;
			 var b = 1.6;
			 var c = 0.0;
            return [
				(a + u * Math.cos(v)) * Math.sin(b*Math.PI * u),
				((a + u * Math.cos(v)) * Math.cos(b*Math.PI * u)) + c * u,
                u * Math.sin(v)
            ];
        };
         // HORN: create a parametric surface to be drawn in this scene
        this.horn = new ParametricSurface(gl, hornFunc, {
            uMin : 0.01,      uMax : 0.7, uSegments : 50,
            vMin : -Math.PI, vMax : Math.PI, vSegments : 50,
            drawStyle: 'wireframe',
			surfCol: [1.0,0.0,1.0,1.0]
        });
		
		// HYPERBOLIC HELICOID: create a parametric surface function
		 var hypHeliFunc = function(u, v) {
			 var a = 2.5;
			 var f = 1 + (Math.cosh(u)*Math.cosh(v));
            return [
				Math.sinh(v) * Math.cos(a * u) / f,
				Math.sinh(v) * Math.sin(a * u) / f,
                Math.cosh(v) * Math.sinh(u)    / f,
            ];
        };
         // HYPERBOLIC HELICOID: create a parametric surface to be drawn in this scene
        this.hypHeli = new ParametricSurface(gl, hypHeliFunc, {
            puMin : -2.5, uMax : 2.5, uSegments : 70,
            vMin : -4.0, vMax : 4.0, vSegments : 30,
            drawStyle: 'wireframe',
			surfCol: [0.0,0.8,0.0,1.0]
        });
		
		// create a Triangle object to be drawn in this scene
        this.triangle = new Triangle(gl);
		// create a Cube object to be drawn in this scene
        this.cube = new Cube(gl);
		
		this.sphere = new Sphere(gl, {
			numLatitudes : 60,
			numLongitudes : 60,
			radius : 0.65
		});
		
		var self = this;
		var onLoaded = function() {
			self.draw();
		}
		
		this.textures = {
			earthDay: new Texture(gl, {
				name	: 'earthDay',
				path	: './textures/earth_day.jpg',
				onLoaded: onLoaded
			}),
			earthNight: new Texture(gl, {
				name	: 'earthNight',
				path	: './textures/earth_night.jpg',
				onLoaded: onLoaded
			}),
			earthWater: new Texture(gl, {
				name	: 'earthWater',
				path	: './textures/earth_water.jpg',
				onLoaded: onLoaded
			}),
			earthCloud: new Texture(gl, {
				name	: 'earthCloud',
				path	: './textures/earth_cloud.jpg',
				onLoaded: onLoaded
			})
		}
		
		this.sphereEarth = new Earth(gl, {
			numLatitudes : 30,
			numLongitudes : 30,
			radius : 0.9
		});
		
		this.sphereCloud = new Cloud(gl, {
			numLatitudes : 30,
			numLongitudes : 30,
			radius : 0.905
		});
		
    }
    var proto = Scene.prototype;

    // the scene's draw method draws whatever the scene wants to draw
    proto.draw = function() {
        // just a shortcut
        var gl = this.gl;

        // clear color and depth buffers
        gl.clearColor(0.3, 0.3, 0.3, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     
        // set up depth test to discard occluded fragments
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LESS);  
            
        // set up the projection matrix, depending on the canvas size
        var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
        this.projectionMatrix = this.drawOptions['Perspective Projection'] ?
            mat4.perspective(45, aspectRatio, 0.01, 100) : 
            mat4.ortho(-aspectRatio, aspectRatio, -1,1, 0.01, 100);

        // lets look through the camera
        this.viewMatrix = mat4.lookAt(
            this.camera.eye,
            this.camera.pov,
            this.camera.up
        );
        // add external rotation from animation flag
        mat4.multiply(this.viewMatrix, this.rotationMatrix);
        // modelview of the scene, to be changed by e.g. animation
        this.modelviewMatrix = mat4.create(this.viewMatrix);

        // set the uniform variables for all used programs
		var tmp = mat4.create();
        for (var prog in this.programs) {
            this.programs[prog].use();
            this.programs[prog].setUniform('projectionMatrix', 'mat4', this.projectionMatrix);
            
			if (prog != "vertexNormalPhong" && prog != "vertexNormalPixel") {
				//console.log("no transl for: " + prog );
				this.programs[prog].setUniform('modelViewMatrix',  'mat4', this.modelviewMatrix);
			} else if (prog == "vertexNormalPhong") {
				//console.log("set transl for: " + prog );
				tmp = mat4.create(this.modelviewMatrix);
				this.programs[prog].setUniform('modelViewMatrix',  'mat4',
					(mat4.translate(tmp,[-0.73,0,0])) ); // x,y,z
			} else {
				//console.log("set transl for: " + prog );
				// save mat4 first to copy it back
				tmp = mat4.create(this.modelviewMatrix);
				this.programs[prog].setUniform('modelViewMatrix',  'mat4',
					(mat4.translate(tmp,[0.73,0,0])) ); // x,y,z
			}
			
			//console.log("set uniforms for: " + prog );
			if (prog == "vertexNormalPhong" || prog == "vertexNormalPixel") {
				//console.log("Set Material of vertecNormalPhong program");
				var matM = {
					ambient  : [0.1, 0.1, 0.1],  // position in scene
					diffuse  : [0.5, 0.1, 0.5],  // focus point
					specular : [0.6, 0.5, 0.6],
					shininess : 45.0
				};
				this.setMaterial(this.programs[prog],matM);
				
				/* set normal transformation, special!!! */
				this.normalMatrix = mat3.create();
				mat4.toInverseMat3(this.modelviewMatrix, this.normalMatrix);
				mat3.transpose(this.normalMatrix);
				this.programs[prog].setUniform('normalMatrix', 'mat3', this.normalMatrix);
				/* ambient light is needed to material ambient isn't shown (mat.ambient*ambient) */
				this.programs[prog].setUniform('ambientLight',  'vec3', [1.0,1.0,1.0]);
				
				/* finally set light uniforms */
				var matL0 = {
					position : this.lightPos0, // xyz w=1.0
					color    : [0.2, 0.2, 1.0],
					type: 1.0
				};
				var matL1 = {
					position : [10.0, 5.5, 12.0, 1.0], // xyz w=1.0
					color    : [0.9, 0.2, 0.2],
					type: 1.0
				};
				this.setLight2(this.programs[prog],matL0, matL1);
			}
			
			if (prog == "earth" || prog == "cloud") {
				//console.log("set texture earth");
				this.programs[prog].setTexture('uSamplerDay',   0, this.textures.earthDay,0);
				this.programs[prog].setTexture('uSamplerNight', 1, this.textures.earthNight,0);
				this.programs[prog].setTexture('uSamplerWater', 2, this.textures.earthWater,0);
				this.programs[prog].setTexture('uSamplerCloud', 3, this.textures.earthCloud,0);
				
				var matM1 = {
					ambient  : [0.1, 0.1, 0.1],  // position in scene
					diffuse  : [1.0, 1.0, 1.0],  // focus point
					specular : [2.0, 2.0, 2.0],
					shininess : 10.0
				};
				this.setMaterial(this.programs[prog],matM1);
				
					/* set normal transformation, special!!! */
				this.normalMatrix = mat3.create();
				mat4.toInverseMat3(this.modelviewMatrix, this.normalMatrix);
				mat3.transpose(this.normalMatrix);
				this.programs[prog].setUniform('normalMatrix', 'mat3', this.normalMatrix);
				/* ambient light is needed to material ambient isn't shown (mat.ambient*ambient) */
				this.programs[prog].setUniform('ambientLight',  'vec3', [1.0,1.0,1.0]);
				
					var matL = {
					position : this.lightPos0,//[-10.0,0.0,-7.0,1.0], // xyz w=1.0
					color    : [1.0, 1.0, 1.0],
					type: 1.0
				};
			
				this.setLight1(this.programs[prog],matL);
			}
        }
		
		//setMaterial(this.programs[])

        /*
         * draw the scene objects
         */
        if (this.drawOptions['Show Band Points']) {
            this.bandPoints.draw(gl, this.programs.red);
        }
		if (this.drawOptions['Show Band Wire']) {
            this.bandWire.draw(gl, this.programs.lila);
        }
		if (this.drawOptions['Show Band Solid']) {
            this.bandSolid.draw(gl, this.programs.green);
        }
		if (this.drawOptions['Show Band WireFrame']) {
            this.bandWireframe.draw(gl, this.programs.uniColor);
        }
        if (this.drawOptions['Show Ellipsoid']) {
            this.ellipsoid.draw(gl, this.programs.uniColor);
        }
		if (this.drawOptions['Show Horn']) {
            this.horn.draw(gl, this.programs.uniColor);
        }
		if (this.drawOptions['Show Helicoid']) {
            this.hypHeli.draw(gl, this.programs.uniColor);
        }
		if (this.drawOptions['Show Triangle']) {
            this.triangle.draw(gl, this.programs.vertexColor);
        }
		if (this.drawOptions['Show Cube']) {
            this.cube.draw(gl, this.programs.vertexColor);
        }
		if (this.drawOptions['Show Sphere Colored']) {
            this.sphere.draw(gl, this.programs.vertexNormalCol);
        }
		if (this.drawOptions['Show Sphere Phong']) {
            this.sphere.draw(gl, this.programs.vertexNormalPhong);
        }
		if (this.drawOptions['Show Sphere Pixel']) {
            this.sphere.draw(gl, this.programs.vertexNormalPixel);
        }
		if (this.drawOptions['Show Earth']) {
            this.sphereEarth.draw(gl, this.programs.earth);
        }
		if (this.drawOptions['Show Cloud']) {
            this.sphereCloud.draw(gl, this.programs.cloud);
        }
    };

    // the scene's rotate method is called from HtmlController, when certain
    // keyboard keys are pressed. Try Y and Shift-Y, for example.
    proto.rotate = function(axis, angle) {
        // degrees to radians
        angle *= Math.PI / 180;
       
        // manipulate the corresponding matrix
        switch (axis) {
            case 'worldX': mat4.rotate(this.rotationMatrix, angle, [1,0,0]); break;
            case 'worldY': mat4.rotate(this.rotationMatrix, angle, [0,1,0]); break;
            default:
                console.log('axis ' + axis + ' not implemented.');
        }
    };
	
	 proto.rotateLight = function(axis, angle) {
        // degrees to radians
        angle *= -Math.PI / 180;
       
        // manipulate the corresponding matrix
		var rotMatrix = mat4.createFrom(1.0,0.0,0.0,0.0,
										0.0,1.0,0.0,0.0,
										0.0,0.0,1.0,0.0,
										0.0,0.0,0.0,1.0);
		//mat4.translate(rotMatrix,[this.lightPos0[0],this.lightPos0[1],this.lightPos0[2]]);
		
		//console.log("matrix1: ", rotMatrix);
        switch (axis) {
            case 'worldX': mat4.rotate(rotMatrix, angle, [1,0,0]); break;
            case 'worldY': mat4.rotate(rotMatrix, angle, [0,1,0]); break;
            default:
                console.log('axis ' + axis + ' not implemented.');
        }
		
		var dest = vec3.create();
		dest = [0.0,0.0,0.0];
		mat4.multiplyVec3(rotMatrix, [this.lightPos0[0],this.lightPos0[1],this.lightPos0[2]], dest);
		//console.log("pos in: ", this.lightPos0 + " pos out:" + dest);
		
		this.lightPos0[0] = dest[0];
		this.lightPos0[1] = dest[1];
		this.lightPos0[2] = dest[2];
		//console.log("ligh pos: ", this.lightPos0);
    };
	
    return Scene;
}); // define module

/*
 * WebGraphics Aufgabe 3
 * (C)opyright Martin Puse, mpuse@beuth-hochschule.de
 */

requirejs.config({
    paths: {
        // jquery library
        jquery : [
            // try content delivery network location first
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the load via CDN fails, load locally
            '../lib/jquery-1.7.2.min'
        ],
        // three.js framework
        'three' : '../lib/three.min'
    }
});


/*
 * The function defined below is the 'main' function,
 * it will be called once all prerequisites listed in the
 * define() statement are loaded.
 */

/* requireJS module definition */
define(['jquery', 'three'],
function($, THREE) {
    'use strict';

    /*
     * main program, to be called once the document has loaded
     * and the DOM has been constructed
     */
    $(document).ready(function() {
        console.log('document ready - starting!');
		console.log('t : toggle camera planet/solar system');
		console.log('i : zoom in, o : zoom out in solar system view');
		console.log('r : reset view in solar system view');
		console.log('a d : rotate view in solar system view');
		console.log('w s : time forward, backwards in solar system view');
		
        /* create cameraVert, cameraPlanet setup scene and setup the renderer */
        var camVert, camPlanet, scene, renderer, camDummy;
		var camActive = 1; // 1 == camVert, 0 == camPlanet
		
		/* planets (can have their own rotation around its own axis) */
		var cube, sun, earth, moon, mercury, venus, mars, jupiter, neptun, space;
		/* groups (rotation around sun) */
		var solarSysGroup 			= new THREE.Group();
		var mercuryOrbitGroup 		= new THREE.Group();
		var venusOrbitGroup 		= new THREE.Group();
		var earthOrbitGroup 		= new THREE.Group();
			var moonOrbitGroup 		= new THREE.Group();
		var marsOrbitGroup 			= new THREE.Group();
			var marsCamOrbitGroup 	= new THREE.Group();
		var jupiterOrbitGroup 		= new THREE.Group();
		var neptunOrbitGroup 		= new THREE.Group();
			
		 
		/* generate scene */
		init();

        // render with (hopefully) 60 fps
        var render = function () {
			/* we want a shadow map */
			renderer.shadowMap.enabled = true;
			// to antialias the shadow
			renderer.shadowMapSoft = true;
			renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            requestAnimationFrame(render);

            // update code between frames here        
			updatePlanetPos(0.1);
			
			var vector = new THREE.Vector3();
			
			if (camActive == 1){
				renderer.render(scene, camVert);
			} else {
				// lets render the scene from the view of the cameraVert
				vector.setFromMatrixPosition( camDummy.matrixWorld );
				//console.log('matrix world mars', vector);
				camPlanet.position.x = vector.x;
				camPlanet.position.y = vector.y;
				camPlanet.position.z = vector.z;
				vector.setFromMatrixPosition( mars.matrixWorld );
				//camPlanet.update
				camPlanet.lookAt(vector);
				renderer.render(scene, camPlanet);
			}		
        };

        // start the render animation
        render();
		
		   // react on keyboard controls
        $(this).keydown(function(evt) {
            evt.preventDefault();
            var keyCode = evt.which;
			// console.log('test',keyCode);
            // grab code of pressed key
            switch (keyCode) {
				//keyCode = evt.which();
				// rotate cube
				case 87: // w
					//cube.rotation.y				+= 1*Math.PI / 180; 
					if (camActive == 1)
						updatePlanetPos(1.0);
				break;
                case 83: // s
					if (camActive == 1)
						updatePlanetPos(-2.0*camActive);
				break; 
                case 65: // a
					if (camActive == 1)
						solarSysGroup.rotation.x -= 2*Math.PI / 180; 
				break; 
                case 68: // d
					if (camActive == 1)
						solarSysGroup.rotation.x += 2*Math.PI / 180; 
				break;
				case 73: // i for zoom in
					if (camActive == 1)
						camVert.position.y -= 1;
				break;
				case 79: // o for zoom out
					if (camActive == 1)
						camVert.position.y += 1;
				break;
				case 84: // t toggle cameraVert
					if (camActive == 0)
						camActive = 1;
					else
						camActive = 0;
				break;
				case 82: // r reset cameraVert to vertical view
					if (camActive == 1) {
						solarSysGroup.rotation.x = 0.0;
						camVert.position.y = 25.0;
					}
				break;
                
				// move cam
				/*
				case 87: cameraVert.position.y += 1; break; // w
                case 83: cameraVert.position.y -= 1; break; // s
                case 65: cameraVert.position.x -= 1; break; // a
                case 68: cameraVert.position.x += 1; break; // d
				*/
                case 67: break; // c
            }
			
			//console.log('activeCam', activeCam);
        });
		
		/* ************** helpers ************* */
		/* build some objects for the scene */
		function init() {
			/* texture loader */
			var loader = new THREE.TextureLoader();
			var texture;
			// scene object
			scene = new THREE.Scene();
			
			camVert = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
			camVert.position.y = 25;
			camVert.lookAt(scene.position);
			/* rotate around planet */
			camPlanet = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
			// set position after mars was translated
			
			// geometry and textures
			var geometry = new THREE.BoxGeometry( 3.0, 0.6, 0.6 );
			var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
			cube = new THREE.Mesh( geometry, material );
			cube.position.x = 5.0;
				
			// sun texture
			texture = loader.load("textures/sun2k.jpg");
			geometry = new THREE.SphereGeometry( 4.5, 64, 32);
			material = new THREE.MeshBasicMaterial({
				map: texture,
				overdraw:0.5
			});
			sun = new THREE.Mesh( geometry, material );
			
			// mercury texture
			texture = loader.load("textures/mercury2k.jpg");
			geometry = new THREE.SphereGeometry( 1.2, 32, 16);
			material = new THREE.MeshPhongMaterial({
				map: texture,
				overdraw:0.5
			});
			mercury = new THREE.Mesh( geometry, material );
			mercury.castShadow = true;
			mercury.receiveShadow = false;
			
			// venus texture
			texture = loader.load("textures/venus2k.jpg");
			geometry = new THREE.SphereGeometry( 1.4, 32, 16);
			material = new THREE.MeshPhongMaterial({
				map: texture,
				overdraw:0.5
			});
			venus = new THREE.Mesh( geometry, material );
			venus.castShadow = true;
			venus.receiveShadow = true;
			
			// earth texture
			texture = loader.load("textures/earth2k.jpg");
			geometry = new THREE.SphereGeometry( 1.9, 32, 16);
			material = new THREE.MeshPhongMaterial({
				map: texture,
				overdraw:0.5
			});
			earth = new THREE.Mesh( geometry, material );
			earth.castShadow = true;
			earth.receiveShadow = true;
			
			// moon texture
			texture = loader.load("textures/moon2k.jpg");
			geometry = new THREE.SphereGeometry( 0.9, 32, 16);
			material = new THREE.MeshPhongMaterial({
				map: texture,
				overdraw:0.5
			});
			moon = new THREE.Mesh( geometry, material );
			moon.castShadow = true;
			moon.receiveShadow = true;
			
			// mars texture
			texture = loader.load("textures/mars2k.jpg");
			geometry = new THREE.SphereGeometry( 1.4, 32, 16);
			material = new THREE.MeshPhongMaterial({
				map: texture,
				overdraw:0.5
			});
			mars = new THREE.Mesh( geometry, material );
			mars.castShadow = false;
			mars.receiveShadow = false;
			
			// jupiter texture
			texture = loader.load("textures/jupiter2k.jpg");
			geometry = new THREE.SphereGeometry( 4.0, 64, 32);
			material = new THREE.MeshPhongMaterial({
				map: texture,
				overdraw:0.5
			});
			jupiter = new THREE.Mesh( geometry, material );
			jupiter.castShadow = false;
			jupiter.receiveShadow = true;
			
			// neptun texture
			texture = loader.load("textures/neptune2k.jpg");
			geometry = new THREE.SphereGeometry( 1.4, 32, 16);
			material = new THREE.MeshPhongMaterial({
				map: texture,
				overdraw:0.5
			});
			neptun = new THREE.Mesh( geometry, material );
			neptun.castShadow = false; // too far away :)
			neptun.receiveShadow = true;
			
			// dummy for planet cam ?!?!?, somehow we have to get the new cam position
			geometry = new THREE.SphereGeometry( 0.1, 16, 16 );
			material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
			camDummy = new THREE.Mesh( geometry, material );
			camDummy.castShadow = false; // show satelite shadow on mars :)
			camDummy.receiveShadow = false;
			
			// outer space sphere for background
			texture = loader.load("textures/eso0932a.jpg");
			geometry = new THREE.SphereGeometry( 100, 64, 32);
			material = new THREE.MeshStandardMaterial({
				map: texture,
				overdraw:0.5,
				side: THREE.BackSide
			});
			space = new THREE.Mesh( geometry, material );
			
			/* // sun red grid
			geometry = new THREE.SphereGeometry( 4.52, 64, 12 );
			material = new THREE.MeshBasicMaterial( {color: 0xff0000,wireframe:true} );
			var spheregrid = new THREE.Mesh( geometry, material );
			solarSysGroup.add(spheregrid);
			*/
			/* // script info, funkst nicht ohne map
			material = THREE.MeshStandardMaterial({
				map: cloudTexture,
				color: '#ff0000',
				transparent: true,
				opacity: 0.5,
				blending: THREE.AdditiveBlending
			});
			*/
			
			/* scene graph 
				
			  -------------------- solarSysGroup ---------------------------------------------------------
			   |    |	 |		|					|				|				|					|
			   |   sun	cube	|					|				|				|					|
			   |				|					|				|				|					|
		earthOrbitGroup  mercuryOrbitGroup  venusOrbitGroup  marsOrbitGroup  jupiterOrbitGroup  neptunOrbitGroup
			   |    |			|					|			|	|				|					|
			   |  earth		  mercury			  venus			|   mars		 jupiter			  neptun
			   |												|
		 moonOrbitGroup										marsCamOrbitGroup
				  |													|
				 moon             								camPlanet
			*/
			
			var lightSun = new THREE.PointLight( 0xffffff, 1, 400 );
			lightSun.position.set( 0, 0, 0 );
			lightSun.castShadow = true;
			// remnoived by three js, best is to use ambient light!!!
			scene.add( new THREE.AmbientLight( 0xffffff, 0.1 ));
			//lightSun.shadowDarkness = 0.9;
			lightSun.shadow.camera.near = 5;       // default
			lightSun.shadow.camera.far = 75;      // default
			lightSun.shadow.mapSize.width = 1024; // default is 512
			lightSun.shadow.mapSize.height = 1024; // default is 512
			// debugger not working?
			//lightSun.shadowCameraVisible = true;
			
			/* transform solarSysGroup, setting identity matrix not needed! */
			var m = new THREE.Matrix4(); // create makes identity anyway :)
			//console.log('solar group matrix', m);
			//solarSysGroup.applyMatrix(m);
			/* transform earthOrbitGroup */
			//earthOrbitGroup.applyMatrix(m);
			mercury.translateX(-7.5);
			venus.translateX(-11.0);
					moon.translateX(5.0);
				moonOrbitGroup.translateX(-19.0);
			earth.translateX(-19.0);
					camDummy.translateZ(4.0);
					// for rotating cam around mars
				marsCamOrbitGroup.translateX(-28.5);
			mars.translateX(-28.5);
			jupiter.translateX(-60.0);
			neptun.translateX(-70.0);
			
			/* set pos of planet cam */
			camPlanet.position.x = -28.5;
			camPlanet.position.z = 2.7;
			camPlanet.lookAt(mars.position);
				
			/* *** construct scene graph *** */
			/* construct groups */
			// let the cube be part of the solar system :)
			//solarSysGroup.add(cube);
			solarSysGroup.add(space);
			solarSysGroup.add(sun);
			mercuryOrbitGroup.add(mercury);
			venusOrbitGroup.add(venus);
			earthOrbitGroup.add(earth);
				moonOrbitGroup.add(moon);  
			marsOrbitGroup.add(mars);
				marsCamOrbitGroup.add(camDummy);
			jupiterOrbitGroup.add(jupiter);
			neptunOrbitGroup.add(neptun);	
			
			/* finally add everything to scene object */
			solarSysGroup.add(mercuryOrbitGroup);
			solarSysGroup.add(venusOrbitGroup);
				earthOrbitGroup.add(moonOrbitGroup);
			solarSysGroup.add(earthOrbitGroup);
				marsOrbitGroup.add(marsCamOrbitGroup);
			solarSysGroup.add(marsOrbitGroup);
				
			solarSysGroup.add(jupiterOrbitGroup);
			solarSysGroup.add(neptunOrbitGroup);
			
			scene.add(solarSysGroup);
			scene.add(lightSun);			
			
			renderer = new THREE.WebGLRenderer();
			renderer.setClearColor("#303");
			renderer.setSize(window.innerWidth,window.innerHeight);
			document.body.appendChild(renderer.domElement);
		};
		
		function updatePlanetPos(div){
			//scene.rotation.y					+= div*8*Math.PI / 180; 
			sun.rotation.y 						+= div*0.2*Math.PI / 180; 
			mercuryOrbitGroup.rotation.y		+= div*2.5*Math.PI / 180;
			mercury.rotation.y 					+= div*6*Math.PI / 180; 					
			venusOrbitGroup.rotation.y 			+= div*1.7*Math.PI / 180; 
			venus.rotation.y 					+= div*14*Math.PI / 180; 
				moonOrbitGroup.rotation.y  		+= div*2*Math.PI / 180; 
			earthOrbitGroup.rotation.y 			+= div*1*Math.PI / 180; 
			earth.rotation.y 					+= div*12*Math.PI / 180;
				marsCamOrbitGroup.rotation.y	+= div*3*Math.PI / 180; 
				marsCamOrbitGroup.rotation.x	+= div*0.2*Math.PI / 180; 
				marsCamOrbitGroup.rotation.z	+= div*0.1*Math.PI / 180; 
			marsOrbitGroup.rotation.y 			+= div*0.8*Math.PI / 180;
			mars.rotation.y 					+= div*8*Math.PI / 180;					
			jupiterOrbitGroup.rotation.y		+= div*0.6*Math.PI / 180; 
			jupiter.rotation.y 					+= div*4*Math.PI / 180;
			neptunOrbitGroup.rotation.y 		+= div*0.3*Math.PI / 180;
			neptun.rotation.y 					+= div*1*Math.PI / 180; 	
		};
		
    }); // $(document).ready()
}); // define module

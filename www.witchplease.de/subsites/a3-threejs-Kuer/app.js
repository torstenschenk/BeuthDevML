/*
 * WebGraphics Aufgabe 3
 * (C)opyright Martin Puse, mpuse@beuth-hochschule.de
 */
<script src="https://cdn.rawgit.com/mrdoob/three.js/r69/examples/js/loaders/ColladaLoader.js"></script>
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
define(['jquery', 'three','collada'],
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
		var space, earth, moon, mars, heart;
		/* groups (rotation around sun) */
		var solarSysGroup 			= new THREE.Group();
		var earthOrbitGroup 		= new THREE.Group();
			var moonOrbitGroup 		= new THREE.Group();
		var marsOrbitGroup 			= new THREE.Group();
			var marsCamOrbitGroup 	= new THREE.Group();
		 
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
			// earth texture
			texture = loader.load("textures/earth2k.jpg");
			var geometry = new THREE.SphereGeometry( 1.9, 32, 16);
			var material = new THREE.MeshPhongMaterial({
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
			
			
			var loader = new THREE.ColladaLoader();
			
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
				
			  -------------------- solarSysGroup ---
			   |   				|					
			   |   				|					
			   |				|					
		earthOrbitGroup    marsOrbitGroup 
			   |    |			|			
			   |  earth		 	|   mars		
			   |				|
		 moonOrbitGroup	 marsCamOrbitGroup
				  |					|
				 moon       	camPlanet
			*/
			
			var lightSun = new THREE.PointLight( 0xffffff, 1, 400 );
			lightSun.position.set( 0, 0, 0 );
			lightSun.castShadow = true;
			// remnoived by three js, best is to use ambient light!!!
			scene.add( new THREE.AmbientLight( 0xffffff, 0.1 ));
			//lightSun.shadowDarkness = 0.9;
			lightSun.shadow.camera.near = 5;       // default
			lightSun.shadow.camera.far = 75;      // default
			lightSun.shadow.mapSize.width = 512; // default is 512
			lightSun.shadow.mapSize.height = 512; // default is 512
			// debugger not working?
			//lightSun.shadowCameraVisible = true;
			
			/* transform solarSysGroup, setting identity matrix not needed! */
			var m = new THREE.Matrix4(); // create makes identity anyway :)
			//console.log('solar group matrix', m);
			//solarSysGroup.applyMatrix(m);
			/* transform earthOrbitGroup */
			//earthOrbitGroup.applyMatrix(m);
					moon.translateX(5.0);
				moonOrbitGroup.translateX(-19.0);
			earth.translateX(-19.0);
					camDummy.translateZ(4.0);
					// for rotating cam around mars
				marsCamOrbitGroup.translateX(-28.5);
			mars.translateX(-28.5);
			
			/* set pos of planet cam */
			camPlanet.position.x = -28.5;
			camPlanet.position.z = 2.7;
			camPlanet.lookAt(mars.position);
				
			/* *** construct scene graph *** */
			/* construct groups */
			// let the cube be part of the solar system :)
			//solarSysGroup.add(cube);
			solarSysGroup.add(space);
			earthOrbitGroup.add(earth);
				moonOrbitGroup.add(moon);  
			marsOrbitGroup.add(mars);
				marsCamOrbitGroup.add(camDummy);
			
			/* finally add everything to scene object */
				earthOrbitGroup.add(moonOrbitGroup);
			solarSysGroup.add(earthOrbitGroup);
				marsOrbitGroup.add(marsCamOrbitGroup);
			solarSysGroup.add(marsOrbitGroup);
			
			scene.add(solarSysGroup);
			scene.add(lightSun);			
			
			renderer = new THREE.WebGLRenderer();
			renderer.setClearColor("#303");
			renderer.setSize(window.innerWidth,window.innerHeight);
			document.body.appendChild(renderer.domElement);
		};
		
		function updatePlanetPos(div){
			//scene.rotation.y					+= div*8*Math.PI / 180; 
				moonOrbitGroup.rotation.y  		+= div*2*Math.PI / 180; 
			earthOrbitGroup.rotation.y 			+= div*1*Math.PI / 180; 
			earth.rotation.y 					+= div*12*Math.PI / 180;
				marsCamOrbitGroup.rotation.y	+= div*3*Math.PI / 180; 
				marsCamOrbitGroup.rotation.x	+= div*0.2*Math.PI / 180; 
				marsCamOrbitGroup.rotation.z	+= div*0.1*Math.PI / 180; 
			marsOrbitGroup.rotation.y 			+= div*0.8*Math.PI / 180;
			mars.rotation.y 					+= div*8*Math.PI / 180;					
		};
		
    }); // $(document).ready()
}); // define module

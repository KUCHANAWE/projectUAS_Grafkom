import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Player, PlayerController, ThirdPersonCamera} from "./player.js";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow map
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Option for softer shadows
document.body.appendChild(renderer.domElement);

//setup scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(20, 80, 150.5); //buat mengatur posisi
camera.lookAt(20, 25.5, 200.5); //buat camera melihat ke mana 

//Orbit Control
var controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
controls.update();

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xFFFFFF,0.1);
scene.add(ambientLight);

// light
// Directional Light
var light = new THREE.DirectionalLight(0xFFFFFF,0.3);
light.position.set(37.5,-8.5,-273);
light.target.position.set(37.5,-28.5,-253);
light.castShadow = true;
scene.add(light);
scene.add(light.target);

var lightHelper = new THREE.DirectionalLightHelper(light);
scene.add(lightHelper);

// // Hemisphere Light
// light = new THREE.HemisphereLight(0xB1E1FF,0xB97A20,0.1);
// scene.add(light);

// Point light
// Perapian
light = new THREE.PointLight(0xFF0000,500);
light.position.set(220,15,-40);
light.castShadow = true;
scene.add(light);

lightHelper = new THREE.PointLightHelper(light);
scene.add(lightHelper);

light = new THREE.PointLight(0xFF0000,500);
light.position.set(110,-25,-135);
light.castShadow = true;
scene.add(light);

lightHelper = new THREE.PointLightHelper(light);
scene.add(lightHelper);

// Lampu Gantung
// kanan1
light = new THREE.PointLight(0xFFFFFF,500);
light.position.set(37.5,-8.5,-273);
light.castShadow = true;
scene.add(light);

lightHelper = new THREE.PointLightHelper(light);
scene.add(lightHelper);

// kanan2
light = new THREE.PointLight(0xFFFFFF,500);
light.position.set(-39.5,36,-75);
light.castShadow = true;
scene.add(light);

lightHelper = new THREE.PointLightHelper(light);
scene.add(lightHelper);

// kiri1
light = new THREE.PointLight(0xFFFFFF,500);
light.position.set(-162,42,212);
light.castShadow = true;
scene.add(light);

lightHelper = new THREE.PointLightHelper(light);
scene.add(lightHelper);

// kiri2
light = new THREE.PointLight(0xFFFFFF,500);
light.position.set(-5,36,137);
light.castShadow = true;
scene.add(light);

lightHelper = new THREE.PointLightHelper(light);
scene.add(lightHelper);

// kiri3
light = new THREE.PointLight(0xFFFFFF,500);
light.position.set(-80.3,36,130.5);
light.castShadow = true;
scene.add(light);

lightHelper = new THREE.PointLightHelper(light);
scene.add(lightHelper);

// kiri4
light = new THREE.PointLight(0xFFFFFF,500);
light.position.set(-46,45,287.5);
light.castShadow = true;
scene.add(light);

lightHelper = new THREE.PointLightHelper(light);
scene.add(lightHelper);

// Tavern 
const objects=[];
const loader = new GLTFLoader();
loader.load('baru/barAtap.gltf', function (gltf) {
  gltf.scene.traverse(function (node) {
    const model = gltf.scene;
    model.scale.set(0.5,0.5,0.5);
    if (node.isMesh) {
      node.castShadow = true; // Ensure the model casts shadows
      node.receiveShadow = true; // Ensure the model receives shadows
      // Check if the object name starts with "crystal" and adjust its material
      
    }
  });
  scene.add(gltf.scene);
}, undefined, function (error) {
  console.error(error);
});

const boxArrayBesar=[];

function createBox(x, y, z, width, height, depth) {
  const geometry = new THREE.BoxGeometry(width, height, depth); // x, z, y
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, z);
  scene.add(mesh);

  const box = new THREE.Box3();
  box.setFromObject(mesh);
  boxArrayBesar.push(box);
//   const helper = new THREE.Box3Helper( box, 0xffff00 );
//   scene.add( helper );

  return mesh;
}

// collasion tembok
{
	createBox(-130.638,54.780,-100.012,10.000,100.020,124.000);//1
	createBox(-104.310,47.622,6.733,120.000,100.000,87.000);//2
	createBox(-44.939,15.919,-239.528,90.020,100.000,90.000);//3
	createBox(42.812,-20.985,-281.981,80.000,200.000,10.000);//4
	createBox(150.440,-21.463,-255.458,150.000,300.000,40.000);//5
	createBox(217.630,39.691,-187.378,40.000,50.000,150.000);//6
	createBox(238.858,59.321,-77.620,10.000,100.000,120.000);//7
	createBox(59.135,16.858,-15.860,129.040,99.960,120.000);//8
	createBox(85.711,10.665,168.088,100.000,200.000,340.000);//9
	createBox(176.894,36.936,-34.224,120.000,100.000,20.000);//10
	createBox(-121.107,34.230,332.868,340.000,180.000,80.000);//11
	createBox(-171.631,50.521,167.651,10.020,100.000,250.000);//12
	createBox(-105.541,52.808,-175.631,45.000,100.000,35.000);//13
  }
  
  // Tembok Dalem
  {
	createBox(-124.736,38.686,130.3511,80.000,40.020,3.000);//14
	createBox(-86.008,26.485,70.702,9.000,35.020,40.000);//15
	createBox(-5.266,26.381,48.050,14.000,34.000,1.000);//16
	createBox(-39.738,26.381,48.050,14.000,34.000,1.000);//17
	createBox(-39.738,26.381,7.838,14.000,34.000,1.000);//18
	createBox(-5.266,26.381,7.838,14.000,34.000,1.000);//19
	createBox(-5.266,26.381,-33.294,14.000,34.000,1.000);//20
	createBox(-39.738,26.381,-33.294,14.000,34.000,1.000);//21
	createBox(-45.608,26.381,-76.686,2.000,34.000,80.000);//22
	createBox(-5.196,26.381,-135.297,2.000,34.000,45.000);//23
	createBox(-65.258,26.361,-74.572,45.000,34.000,2.000);//24
	createBox(-44.560,31.309,-157.257,79.000,50.000,2.000);
	createBox(-60.587,-14.325,-157.257,50.000,50.000,2.000);
	createBox(75.872,-8.236,-115.273,83.000,70.000,2.000);
	createBox(116.315,1.469,-168.073,2.000,70.000,130.000);
	createBox(-4.913,33.923,29.267,2.000,50.000,40.980);
	createBox(-4.717,23.838,212.381,79.000,30.000,2.000);
	createBox(-125.352,23.838,212.381,79.000,30.000,2.000);
	createBox(21.399,12.101,187.054,40.000,20.000,50.000);
	createBox(-64.403,13.033,152.601,40.000,20.000,45.000);
	createBox(-119.609,12.912,69.978,40.000,20.000,45.000);
	createBox(-153.907,20.472,114.109,24.980,20.000,35.000);
	createBox(-153.907,29.023,136.737,15.000,20.000,9.880);
	createBox(-147.161,23.600,134.554,14.000,20.000,7.000);
	//lemari
	createBox(-125.352,21.354,-48.528,10.000,35.020,25.000);
	//meja
	createBox(-88.535,16.891,-109.314,25.000,10.000,25.000);
	//kasur
	createBox(-112.601,13.866,-139.261,20.000,10.000,34.000);
	createBox(-159.631,23.600,173.782,9.000,20.000,70.000);
	createBox(-159.631,23.600,173.782,9.000,20.000,70.000);
	createBox(-131.971,16.910,173.459,38.000,19.940,30.000);
	createBox(-120.837,14.888,205.855,70.020,19.940,10.000);
	createBox(175.782,20.195,-167.642,46.000,24.000,26.020);
	createBox(54.535,21.994,-114.046,120.000,20.000,1.000);
	createBox(-66.088,16.910,233.339,50.000,20.000,1.000);
	createBox(-66.088,16.910,155.251,50.000,20.000,57.000);
	createBox(-4.858,24.370,90.402,3.000,30.000,80.000);
	createBox(19.049,24.137,129.068,50.000,30.000,1.000);
	createBox(54.535,21.994,-114.046,120.000,20.000,1.000);
	createBox(-66.088,16.910,233.339,50.000,20.000,1.000);
	createBox(-4.858,24.370,90.402,3.000,30.000,80.000);
	createBox(19.049,24.137,129.068,50.000,30.000,1.000);
	createBox(-87.658,19.285,230.444,5.000,19.000,40.000);
	createBox(-44.382,19.285,230.444,5.000,19.000,40.000);
  }

const loaderKhaimeraPutih = new GLTFLoader().setPath( 'baru/' );
	loaderKhaimeraPutih.load( 'KhaimeraPutih.gltf', async function ( gltf ) {
	const model = gltf.scene;
    model.scale.set(10,10,10);
    model.position.set(-55,17.5,260.5);

	// wait until the model can be added to the scene without blocking due to shader compilation
	await renderer.compileAsync( model, camera, scene ); 
	scene.add( model );
		
	} );

const loaderSevarogPutih = new GLTFLoader().setPath( 'baru/' );
	loaderSevarogPutih.load( 'SevarogPutih.gltf', async function ( gltf ) {
	const model = gltf.scene;
    model.scale.set(10,10,10);
    model.position.set(15,7.5,200.5);
	
	model.rotation.y = Math.PI;

	// wait until the model can be added to the scene without blocking due to shader compilation
	await renderer.compileAsync( model, camera, scene ); 
	scene.add( model );
		
	} );

const loaderNarbashPumkin = new GLTFLoader().setPath( 'baru/' );
	loaderNarbashPumkin.load( 'NarbashPumkin.gltf', async function ( gltf ) {
	const model = gltf.scene;
    model.scale.set(10,10,10);
    model.position.set(-130,17.5,305.5);

	model.rotation.y = Math.PI/2;

	// wait until the model can be added to the scene without blocking due to shader compilation
	await renderer.compileAsync( model, camera, scene ); 
	scene.add( model );
		
	} );

const loaderkapten = new GLTFLoader().setPath( 'baru/' );
	loaderkapten.load( 'kapten.gltf', async function ( gltf ) {
	const model = gltf.scene;
    model.scale.set(10,10,10);
    model.position.set(-170,7.5,120.5);

	model.rotation.y = Math.PI/2;

	// wait until the model can be added to the scene without blocking due to shader compilation
	await renderer.compileAsync( model, camera, scene ); 
	scene.add( model );
		
	} );

const loaderKhaimeraBiru = new GLTFLoader().setPath( 'baru/' );
	loaderKhaimeraBiru.load( 'KhaimeraBiru.gltf', async function ( gltf ) {
	const model = gltf.scene;
    model.scale.set(10,10,10);
    model.position.set(55,-34.5,-250.5);

	// wait until the model can be added to the scene without blocking due to shader compilation
	await renderer.compileAsync( model, camera, scene ); 
	scene.add( model );
		
	} );

const loaderKhaimeraOrange = new GLTFLoader().setPath( 'baru/' );
	loaderKhaimeraOrange.load( 'KhaimeraOrange.gltf', async function ( gltf ) {
	const model = gltf.scene;
    model.scale.set(10,10,10);
    model.position.set(-65,7.5,80.5);

	// wait until the model can be added to the scene without blocking due to shader compilation
	await renderer.compileAsync( model, camera, scene ); 
	scene.add( model );
		
	} );

const loaderNarbashBiru = new GLTFLoader().setPath( 'baru/' );
	loaderNarbashBiru.load( 'NarbashBiru.gltf', async function ( gltf ) {
	const model = gltf.scene;
    model.scale.set(10,10,10);
    model.position.set(-50.5,7.5,-125.5);

	// wait until the model can be added to the scene without blocking due to shader compilation
	await renderer.compileAsync( model, camera, scene ); 
	scene.add( model );
		
	} );

const loaderNarbashIjo = new GLTFLoader().setPath( 'baru/' );
	loaderNarbashIjo.load( 'NarbashIjo.gltf', async function ( gltf ) {
	const model = gltf.scene;
    model.scale.set(10,10,10);
    model.position.set(197,7,-75.5);

	model.rotation.y = (Math.PI/6)*8;

	// wait until the model can be added to the scene without blocking due to shader compilation
	await renderer.compileAsync( model, camera, scene ); 
	scene.add( model );
		
	} );

const loaderSevarogHitam= new GLTFLoader().setPath( 'baru/' );
	loaderSevarogHitam.load( 'SevarogHitam.gltf', async function ( gltf ) {
	const model = gltf.scene;
    model.scale.set(10,10,10);
    model.position.set(80.5,-34.5,-150.5);

	// wait until the model can be added to the scene without blocking due to shader compilation
	await renderer.compileAsync( model, camera, scene ); 
	scene.add( model );
		
	} );

const loaderSevarogEmas = new GLTFLoader().setPath( 'baru/' );
	loaderSevarogEmas.load( 'SevarogEmas.gltf', async function ( gltf ) {
	const model = gltf.scene;
    model.scale.set(10,10,10);
    model.position.set(155.5,7.5,-225.5);

	// wait until the model can be added to the scene without blocking due to shader compilation
	await renderer.compileAsync( model, camera, scene ); 
	scene.add( model );
		
	} );

const glassGeo = new THREE.BoxGeometry(15,28.5,2);

const glass = new THREE.MeshPhysicalMaterial({
  color: 0xFFFFFF,
  transparent: true,
  opacity: 0.5,
});

const glassMesh = new THREE.Mesh(glassGeo, glass);
glassMesh.position.set(-25, 23, 48);
scene.add(glassMesh);

const glassMesh2 = new THREE.Mesh(glassGeo, glass);
glassMesh2.position.set(-25, 23, 7);
scene.add(glassMesh2);

const glassMesh3 = new THREE.Mesh(glassGeo, glass);
glassMesh3.position.set(-25, 23, -35);
scene.add(glassMesh3);

// Player TPP
var player = new Player(
  new ThirdPersonCamera(
      camera, new THREE.Vector3(-5, 0, 0), new THREE.Vector3(0, 0, 0) // camera offset
  ),
  scene,
  60,
  new THREE.Vector3(20, 25.5, 150.5) // posisi player
);

// // Free Roam
// // Pointer Lock Controls setup
// const pointerControls = new PointerLockControls(camera, renderer.domElement);
// document.addEventListener('click', () => {
//   pointerControls.lock();
// });

// // Camera movement
// const keys = {
//   w: false,
//   a: false,
//   s: false,
//   d: false
// };

// const speed = 0.5; // Adjusted for smoother movement

// window.addEventListener('keydown', (event) => {
//   keys[event.key.toLowerCase()] = true;
// });

// window.addEventListener('keyup', (event) => {
//   keys[event.key.toLowerCase()] = false;
// });

// // Zoom in and out
// window.addEventListener('wheel', (event) => {
//   const zoomSpeed = 0.1;
//   camera.fov += event.deltaY * zoomSpeed;
//   camera.fov = THREE.MathUtils.clamp(camera.fov, 20, 100);
//   camera.updateProjectionMatrix();
// });

// function updateCameraPosition() {
//   if (keys.w) pointerControls.moveForward(speed);
//   if (keys.s) pointerControls.moveForward(-speed);
//   if (keys.a) pointerControls.moveRight(-speed);
//   if (keys.d) pointerControls.moveRight(speed);
// }

var time_prev = 0;
var clock = new THREE.Clock();
function animate(time) {
  var dt = time - time_prev;
  dt *= 0.1;

  player.update(clock.getDelta(),boxArrayBesar);
//   updateCameraPosition();

  // Check for collisions
  const playerBox = player.getBox();
  let collisionDetected = false;

  for (const box of boxArrayBesar) {
    if (playerBox.intersectsBox(box)) {
      collisionDetected = true;
      break;
    }
  }

  if (collisionDetected) {
    console.log('Collision detected!');
    player.speed = 0; // Adjust the player's speed if collision detected
  } 

  renderer.render(scene, camera);

  time_prev = time;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

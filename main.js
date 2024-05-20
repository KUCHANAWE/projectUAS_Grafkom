import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//setup scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.set(0,0,10);
camera.lookAt(0,0,0);


// Orbit Control
var controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
controls.update()

//geometry
// const points = [];
// points.push(new THREE.Vector3(-1, 0, 0));
// points.push(new THREE.Vector3(0, 1, 0));
// points.push(new THREE.Vector3(1, 0, 0));

// var geometry = new THREE.BufferGeometry().setFromPoints(points);
// var material = new THREE.LineBasicMaterial({color: 0xffffff});
// var line  = new THREE.Line(geometry, material);
// scene.add(line);

// var geometry = new THREE.BoxGeometry(1, 1, 1);
// var material = new THREE.MeshBasicMaterial({color: 0x00FF00});
// var cube = new THREE.Mesh(geometry,material);
// scene.add(cube);'

// var points_custom = [-1,-1,1,1,-1,1,-1,1,1,-1,1,1,1,-1,1,1,1,1,1,-1,1,1,-1,-1,1,1,1,1,1,1,1,-1,-1,1,1,-1,1,-1,-1,-1,-1,-1,1,1,-1,1,1,-1,-1,-1,-1,-1,1,-1,-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,-1,-1,-1,1,-1,1,1,1,1,-1,-1,1,-1,1,1,1,1,1,1,-1,1,-1,-1,1,1,1,-1,1,-1,-1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1,-1];
// var geometry = new THREE.BufferGeometry();
// geometry.setAttribute(
//     'position', new THREE.BufferAttribute(new Float32Array(points_custom), 3)
//     );
// var material = new THREE.MeshBasicMaterial({color: 0xFF0000});
// var custom_cube = new THREE.Mesh(geometry, material);
// scene.add(custom_cube);

// light
// Directional Light
var light = new THREE.DirectionalLight(0xFFFFFF,0.5);
light.position.set(0,10,0);
light.target.position.set(-5,0,0);
scene.add(light);
scene.add(light.target);


// Hemisphere Light
light = new THREE.HemisphereLight(0xB1E1FF,0xB97A20,0.5);
scene.add(light);

// Point light
light = new THREE.PointLight(0xFFFF00,50);
light.position.set(0,10,0);
scene.add(light);

// Spotlight
light = new THREE.SpotLight(0xFF0000,50);
light.position.set(10,10,10);
scene.add(light);

// geometry
const objects = [];

// // plane









const onProgress = function ( xhr ) {

    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( percentComplete.toFixed( 2 ) + '% downloaded' );

    }

};

// new MTLLoader()
// .setPath( 'source/' )
// .load( 'Alex_mesh.mtl', function ( materials ) {

//     materials.preload();

//     new OBJLoader()
//         .setMaterials( materials )
//         .setPath( 'source/' )
//         .load( 'Alex_mesh.obj', function ( object ) {

//             // object.position.y = - 0.95;
//             // object.scale.setScalar( 0.01 );
//             scene.add( object );

//         }, onProgress );

// } );

const loader = new GLTFLoader().setPath( 'baru/' );
						loader.load( 'Map_6_Top-Down.gltf', async function ( gltf ) {

							const model = gltf.scene;

							// wait until the model can be added to the scene without blocking due to shader compilation

							await renderer.compileAsync( model, camera, scene );

							scene.add( model );

							render();
			
						} );


var time_prev = 0;
function animate(time){
    var dt = time - time_prev;
    dt *= 0.1;

    objects.forEach((obj)=>{
        obj.rotation.z += dt * 0.01;
    })

    // cube.rotation.x += 0.01 * dt;
    // cube.rotation.y += 0.01 * dt;

    renderer.render(scene,camera);

    time_prev = time;
    requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
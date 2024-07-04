import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Player {
    constructor(camera, scene, speed, positionObject) {
        this.camera = camera;
        this.controller = new PlayerController(camera, positionObject);
        this.scene = scene;
        this.speed = speed;
        this.state = "idle";
        this.rotationVector = new THREE.Vector3(Math.PI, 0, 0);
        this.animations = {};
        this.lastRotation = 0;
        this.positionObject = positionObject;
        this.camera.setup(positionObject);

        this.mesh = null;
        this.box = new THREE.Box3();

        this.loadModel();
    }

    getBox() {
        return this.box;
    }

    setBox(box) {
        this.box = box;
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.setPath('baru/');
        loader.load('bugil.gltf', (gltf) => {
            gltf.scene.scale.setScalar(7);
            gltf.scene.traverse(c => {
                if (c.isMesh) {
                    c.castShadow = true;
                    c.receiveShadow = true;
                }
            });
            this.mesh = gltf.scene;
            this.scene.add(this.mesh);
            this.mesh.position.set(this.positionObject.x, this.positionObject.y - 17, this.positionObject.z);
            this.box.setFromObject(this.mesh);

            this.mixer = new THREE.AnimationMixer(this.mesh);

            const onLoad = (animName, anim) => {
                const clip = anim.animations[0];
                const action = this.mixer.clipAction(clip);

                this.animations[animName] = {
                    clip: clip,
                    action: action,
                };
            };

            const animLoader = new GLTFLoader();
            animLoader.setPath('baru/');
            animLoader.load('run.gltf', (gltf) => { onLoad('run', gltf) });
            animLoader.load('idle.gltf', (gltf) => { onLoad('idle', gltf) });
        });
    }

    update(dt, kotak) {
        if (this.mesh && this.animations) {
            this.lastRotation = this.mesh.rotation.y;
            const forwardVector = new THREE.Vector3();
            this.camera.camera.getWorldDirection(forwardVector);
            forwardVector.y = 0; // Hindari perubahan pada sumbu Y
            forwardVector.normalize();

            const direction = new THREE.Vector3(0, 0, 0);

            if (this.controller.keys['forward']) {
                direction.add(forwardVector.clone().multiplyScalar(dt * this.speed));
            }
            if (this.controller.keys['backward']) {
                direction.add(forwardVector.clone().multiplyScalar(-dt * this.speed));
            }
            if (this.controller.keys['left']) {
                const leftVector = new THREE.Vector3(forwardVector.z, 0, -forwardVector.x).normalize();
                direction.add(leftVector.clone().multiplyScalar(dt * this.speed));
            }
            if (this.controller.keys['right']) {
                const rightVector = new THREE.Vector3(-forwardVector.z, 0, forwardVector.x).normalize();
                direction.add(rightVector.clone().multiplyScalar(dt * this.speed));
            }

            // Update position and rotation
            this.mesh.position.add(direction);
            if (direction.length() > 0) {
                const angle = Math.atan2(direction.x, direction.z);
                this.mesh.rotation.y = angle;
            }

            if (direction.length() === 0) {
                if (this.animations['idle']) {
                    if (this.state !== "idle") {
                        this.mixer.stopAllAction();
                        this.state = "idle";
                        this.mixer.clipAction(this.animations['idle'].clip).play();
                    }
                }
            } else {
                if (this.animations['run']) {
                    if (this.state !== "run") {
                        this.mixer.stopAllAction();
                        this.state = "run";
                        this.mixer.clipAction(this.animations['run'].clip).play();
                    }
                }
            }

            if (this.controller.mouseDown) {
                const dtMouse = this.controller.deltaMousePos;
                dtMouse.x = dtMouse.x / Math.PI;
                dtMouse.y = dtMouse.y / Math.PI;

                this.rotationVector.y += dtMouse.x * dt * 0;
                this.rotationVector.z += dtMouse.y * dt * 0;
            }
            this.mesh.rotation.y += this.rotationVector.y;

            // Save the previous position in case of collision
            const previousPosition = this.mesh.position.clone();

            // Update camera
            this.camera.setup(this.mesh.position);

            this.box.setFromObject(this.mesh);

            // Check for collisions
            for (let i = 0; i < kotak.length; i++) {
                if (this.box.intersectsBox(kotak[i])) {
                    // Collision detected, revert to the previous position
                    this.mesh.position.copy(previousPosition);
                    this.box.setFromObject(this.mesh);
                }
            }
            
            if (this.mixer) {
                this.mixer.update(dt);
            }
        }
    }
}

export class PlayerController {
    constructor(camera, positionObject) {
        this.keys = {
            "forward": false,
            "backward": false,
            "left": false,
            "right": false
        };
        this.mousePos = new THREE.Vector2();
        this.mouseDown = false;
        this.deltaMousePos = new THREE.Vector2();
        this.camera = camera;
        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
        document.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
        document.addEventListener('mousedown', (e) => this.onMouseDown(e), false);
        document.addEventListener('mouseup', (e) => this.onMouseUp(e), false);
        document.addEventListener('keypress', (e) => this.onKeyPress(e), false); // For toggling TPP/FPP
    }

    onMouseDown(event) {
        this.mouseDown = true;
    }

    onMouseUp(event) {
        this.mouseDown = false;
    }

    onMouseMove(event) {
        if (!this.mouseDown) return;

        this.camera.onMouseMove(event);
    }

    onKeyPress(event) {
        if (event.key === 'f' || event.key === 'F') {
            this.camera.toggleFirstPerson();
        }
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case "W".charCodeAt(0):
            case "w".charCodeAt(0):
                this.keys['forward'] = true;
                break;
            case "S".charCodeAt(0):
            case "s".charCodeAt(0):
                this.keys['backward'] = true;
                break;
            case "A".charCodeAt(0):
            case "a".charCodeAt(0):
                this.keys['left'] = true;
                break;
            case "D".charCodeAt(0):
            case "d".charCodeAt(0):
                this.keys['right'] = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case "W".charCodeAt(0):
            case "w".charCodeAt(0):
                this.keys['forward'] = false;
                break;
            case "S".charCodeAt(0):
            case "s".charCodeAt(0):
                this.keys['backward'] = false;
                break;
            case "A".charCodeAt(0):
            case "a".charCodeAt(0):
                this.keys['left'] = false;
                break;
            case "D".charCodeAt(0):
            case "d".charCodeAt(0):
                this.keys['right'] = false;
                break;
        }
    }
}

export class ThirdPersonCamera {
    constructor(camera, positionOffSet, targetOffSet) {
        this.camera = camera;
        this.positionOffSet = positionOffSet;
        this.targetOffSet = targetOffSet;
        this.zoomLevel = 1; // Default zoom level
  
        this.camera.rotation.order = 'YXZ'; // Set rotation order if needed
        this.doOnce = false;
        this.radius = 10; // Radius from center to camera position
        this.positionObject = new THREE.Vector3(0, 0, 0); // Ensure it's a THREE.Vector3 object
        this.insialHigh = 30;
  
        this.theta = 0;
        this.phi = 0;

        this.pitch = 0; // Vertical rotation for FPP
        this.yaw = 0; // Horizontal rotation for FPP
        this.maxPitch = Math.PI / 2; // 90 degrees up and down for FPP
        this.maxYaw = Math.PI / 2; // 90 degrees left and right for FPP

        this.isFirstPerson = false; // Flag to toggle between TPP and FPP
  
        this.initZoomListener(); // Initialize zoom listener
    }
  
    updateCameraPosition() {
        if (this.isFirstPerson) {
            this.updateFirstPersonPosition();
        } else {
            this.updateThirdPersonPosition();
        }
    }

    updateThirdPersonPosition() {
        const x = this.positionObject.x + this.radius * Math.sin(this.theta);
        const y = this.positionObject.y + this.radius * Math.sin(this.phi) + this.insialHigh;
        const z = this.positionObject.z + this.radius * Math.cos(this.theta);
        this.camera.position.set(x, y, z);
        this.camera.lookAt(this.positionObject.x, this.positionObject.y + 20, this.positionObject.z); // Ensure the camera looks at the target
    }

    updateFirstPersonPosition() {
        const offset = new THREE.Vector3(0, 11, -4); // Adjust camera height
        const position = this.positionObject.clone().add(offset);
        this.camera.position.copy(position);

        const rotation = new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ');
        this.camera.quaternion.setFromEuler(rotation);
    }

    setup(positionObject) {
        if (!this.doOnce) {
            this.doOnce = true;
            this.camera.lookAt(positionObject);
        }
        this.positionObject.copy(positionObject);
        this.updateCameraPosition();
    }

    onMouseMove(event) {
        const sensitivity = 0.005;

        if (this.isFirstPerson) {
            this.yaw -= event.movementX * sensitivity;
            this.pitch -= event.movementY * sensitivity;

            // Clamp the pitch and yaw values
            this.pitch = Math.max(-this.maxPitch, Math.min(this.pitch, this.maxPitch));
            this.yaw = Math.max(-this.maxYaw, Math.min(this.yaw, this.maxYaw));
        } else {
            this.theta += event.movementX * sensitivity;
            this.phi += event.movementY * sensitivity;
  
            // Ensure phi stays within the range of [-π/2, π/2] to avoid flipping the camera
            this.phi = Math.max(-Math.PI / 2 + 0.01, Math.min(Math.PI / 2 - 0.01, this.phi));
        }

        this.updateCameraPosition();
    }
  
    zoom(deltaZoom) {
        this.zoomLevel += deltaZoom * 0.1;
        this.zoomLevel = Math.max(0.5, Math.min(this.zoomLevel, 2)); // Clamp zoom level between 0.5 and 2
  
        // Adjust the radius based on zoom level
        this.radius = 10 * this.zoomLevel;
        this.updateCameraPosition();
    }
  
    initZoomListener() {
        window.addEventListener('wheel', (event) => {
            const zoomSpeed = 0.1;
            this.camera.fov += event.deltaY * zoomSpeed;
            this.camera.fov = THREE.MathUtils.clamp(this.camera.fov, 30, 100);
            this.camera.updateProjectionMatrix();
            event.preventDefault(); // Prevent default scroll behavior
        });
    }

    toggleFirstPerson() {
        this.isFirstPerson = !this.isFirstPerson;
        this.updateCameraPosition();
    }
}
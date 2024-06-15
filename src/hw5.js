import {OrbitControls} from './OrbitControls.js'
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
scene.background = new THREE.Color( 'ForestGreen' );

function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}


// Helper function to create a cylinder
function createCylinder(radiusTop, radiusBottom, height, radialSegments, color, wireframe) {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    const material = new THREE.MeshBasicMaterial({ color: color, wireframe: wireframe });
    return new THREE.Mesh(geometry, material);
}


// Helper function to create a torus
function createTorus(radius, tube, radialSegments, tubularSegments, color, wireframe) {
    const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
    const material = new THREE.MeshBasicMaterial({ color: color, wireframe: wireframe });
    return new THREE.Mesh(geometry, material);
}


// Helper function to apply a translation matrix
function applyTranslation(mesh, x, y, z) {
    const translationMatrix = new THREE.Matrix4().makeTranslation(x, y, z);
    mesh.applyMatrix4(translationMatrix);
}


// Helper function to apply a rotation matrix
function applyRotation(mesh, axis, angle) {
    const rotationMatrix = new THREE.Matrix4().makeRotationAxis(axis, angle);
    mesh.applyMatrix4(rotationMatrix);
}

// Create the goal structure
const goalGroup = new THREE.Group();
const goalWidth = 7.32; // Realistic width of a football goal in meters
const goalHeight = 2.44; // Realistic height of a football goal in meters
const postRadius = 0.1;
const backSupportLength = 3.30;
const radialSegments = 32;

// Front goalposts
const goalPost1 = createCylinder(postRadius, postRadius, goalHeight, radialSegments, 0xffffff, true);
applyTranslation(goalPost1, -goalWidth / 2, goalHeight / 2, 0);
goalGroup.add(goalPost1);

const goalPost2 = createCylinder(postRadius, postRadius, goalHeight, radialSegments, 0xffffff, true);
applyTranslation(goalPost2, goalWidth / 2, goalHeight / 2, 0);
goalGroup.add(goalPost2);

// Crossbar
const crossbar = createCylinder(postRadius, postRadius, goalWidth, radialSegments, 0xffffff, true);
applyRotation(crossbar, new THREE.Vector3(0, 0, 1), degrees_to_radians(90));
applyTranslation(crossbar, 0, goalHeight, 0);
goalGroup.add(crossbar);

// Back supports
const backSupport1 = createCylinder(postRadius, postRadius, backSupportLength, radialSegments, 0xffffff, true);
applyRotation(backSupport1, new THREE.Vector3(1, 0, 0), degrees_to_radians(45));
applyTranslation(backSupport1, -goalWidth / 2, goalHeight / 2, -goalHeight / 2);
goalGroup.add(backSupport1);

const backSupport2 = createCylinder(postRadius, postRadius, backSupportLength, 32, 0xffffff, true);
applyRotation(backSupport2, new THREE.Vector3(1, 0, 0), degrees_to_radians(45));
applyTranslation(backSupport2, goalWidth / 2, goalHeight / 2, -goalHeight / 2);
goalGroup.add(backSupport2);

// Torus rings at the edges
const torus1 = createTorus(postRadius * 1.5, postRadius / 2, 16, 100, 0xffffff, true);
applyRotation(torus1, new THREE.Vector3(1, 0, 0), Math.PI / 2); // Rotate 90 degrees around X-axis
applyTranslation(torus1, -goalWidth / 2, postRadius / 2, 0);
goalGroup.add(torus1);

const torus2 = createTorus(postRadius * 1.5, postRadius / 2, 16, 100, 0xffffff, true);
applyRotation(torus2, new THREE.Vector3(1, 0, 0), Math.PI / 2);
applyTranslation(torus2, goalWidth / 2, postRadius / 2, 0);
goalGroup.add(torus2);

const torus3 = createTorus(postRadius * 1.5, postRadius / 2, 16, 100, 0xffffff, true);
applyRotation(torus3, new THREE.Vector3(1, 0, 0), Math.PI / 2);
applyTranslation(torus3, -goalWidth / 2, postRadius / 2, -backSupportLength * Math.cos(degrees_to_radians(45)));
goalGroup.add(torus3);

const torus4 = createTorus(postRadius * 1.5, postRadius / 2, 16, 100, 0xffffff, true);
applyRotation(torus4, new THREE.Vector3(1, 0, 0), Math.PI / 2);
applyTranslation(torus4, goalWidth / 2, postRadius / 2, -backSupportLength * Math.cos(degrees_to_radians(45)));
goalGroup.add(torus4);

// Nets material
const netMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: THREE.DoubleSide, wireframe: false });

// Back net
const backNetGeometry = new THREE.PlaneGeometry(goalWidth, goalHeight + 1);
const backNet = new THREE.Mesh(backNetGeometry, netMaterial);
applyRotation(backNet, new THREE.Vector3(1, 0, 0),degrees_to_radians(45));
applyTranslation(backNet, 0, goalHeight / 2, -goalHeight / 2);
goalGroup.add(backNet);

// Side Net 1 (Left)
const sideNet1Vertices = new Float32Array([
    -goalWidth / 2, 0, 0,                  // Bottom front
    -goalWidth / 2, goalHeight, 0,         // Top front
    -goalWidth / 2, 0, -goalWidth / 3 // Bottom back
]);

const sideNet1Geometry = new THREE.BufferGeometry();
sideNet1Geometry.setAttribute('position', new THREE.BufferAttribute(sideNet1Vertices, 3));
const sideNet1 = new THREE.Mesh(sideNet1Geometry, netMaterial);
goalGroup.add(sideNet1);

// Side Net 2 (Right)
const sideNet2Vertices = new Float32Array([
    goalWidth / 2, 0, 0,                  // Bottom front
    goalWidth / 2, goalHeight, 0,         // Top front
    goalWidth / 2, 0, -goalWidth / 3 // Bottom back
]);

const sideNet2Geometry = new THREE.BufferGeometry();
sideNet2Geometry.setAttribute('position', new THREE.BufferAttribute(sideNet2Vertices, 3));
const sideNet2 = new THREE.Mesh(sideNet2Geometry, netMaterial);
goalGroup.add(sideNet2);

// Ball
const ballGeometry = new THREE.SphereGeometry(goalHeight / 9, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
applyTranslation(ball, 0, ballGeometry.parameters.radius, goalWidth / 2);
scene.add(ball);

// Add the goal group to the scene
scene.add(goalGroup);

// Position the camera
camera.position.z = 15;


// This defines the initial distance of the camera
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0,0,5);
camera.applyMatrix4(cameraTranslate)

renderer.render( scene, camera );

const controls = new OrbitControls( camera, renderer.domElement );

let isOrbitEnabled = true;

const toggleOrbit = (e) => {
	if (e.key == "o"){
		isOrbitEnabled = !isOrbitEnabled;
	}
}

document.addEventListener('keydown',toggleOrbit)

//controls.update() must be called after any manual changes to the camera's transform
controls.update();

function animate() {

	requestAnimationFrame( animate );

	controls.enabled = isOrbitEnabled;
	controls.update();

	renderer.render( scene, camera );

}
animate()
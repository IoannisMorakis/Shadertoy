import * as THREE from 'three';
// Add this specific import for the renderer
import { WebGPURenderer } from 'three'; 
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { 
    positionLocal, 
    time, // Change timerLocal to time
    vec3, 
    sin, 
    MeshStandardNodeMaterial 
} from 'three/tsl';

// --- 1. RENDERER & SCENE SETUP ---
// Change this line to use the imported constructor directly
const renderer = new WebGPURenderer({ antialias: true }); 
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 15);
//camera.lookAt(0, 4, 0);

// ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 3, 0); // This is your rotation point
controls.enableDamping = true; // Makes movement smoother
controls.update();

// --- 2. PINE WIND LOGIC (TSL) ---
// This moves vertices based on their height (Y) and time
const t = time; 
const pos = positionLocal

// Simple Sway: sway amount increases as we go up the tree
const sway = sin(t.add(pos.y.mul(0.5))).mul(pos.y).mul(0.1);
const pineWindNode = vec3(pos.x.add(sway), pos.y, pos.z.add(sway));

// --- 3. LOADING THE PINE MODEL ---
const mtlLoader = new MTLLoader();
mtlLoader.load('OBJ22_Imam.mtl', (materials) => {
    materials.preload();
    
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('OBJ22_Imam.obj', (object) => {

        // SET THE POSITION
        object.position.set(0-18, 0, -10); 
        
         object.traverse((child) => {
            if (child.isMesh) {
                // We create a Node Material to support the TSL wind
                const nodeMat = new MeshStandardNodeMaterial({
                    map: child.material.map,
                    color: child.material.color,
                    transparent: true,
                    alphaTest: 0.5,
                    side: THREE.DoubleSide
                });

                // Attach the wind logic to the material
                nodeMat.positionNode = pineWindNode;
                child.material = nodeMat;
            }
        });
        
        scene.add(object);
    });
});

/*const testBox = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
testBox.position.set(0, 0, 0); 
scene.add(testBox);*/

// --- 4. LIGHTING ---
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, 7);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040, 1));

// --- 5. ANIMATION LOOP ---
renderer.setAnimationLoop(() => {
    controls.update(); // Required for damping
    renderer.render(scene, camera);
});

// Handle Window Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
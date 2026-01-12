import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';
import gsap from 'gsap';
// gui state object to hold properties
const guiState = {
    cubeY: 0,
    wireframe: false,
    materialColor: '#00ff00',
    spin: () => {
        gsap.to(cube.rotation, { y: cube.rotation.y + Math.PI * 2, duration: 1 });
    },
    reset: () => {
        // reset guiState properties
        guiState.cubeY = 0;
        guiState.wireframe = false;
        guiState.materialColor = '#00ff00';

        // reset 3D object
        cube.position.y = guiState.cubeY;
        cube.rotation.set(0, 0, 0);
        material.wireframe = guiState.wireframe;
        material.color.set(guiState.materialColor);

        // manually update all GUI controllers display
        gui.controllers.forEach(controller => {
            controller.updateDisplay();
        });
    }
};

// const gui = new GUI();

// bind guiState properties to GUI controls
// gui.add(guiState, 'cubeY', -5, 5, 0.1)
//     .name('Cube Y Position')
//     .onChange(value => {
//         cube.position.y = value;
//     });

// gui.add(guiState, 'wireframe')
//     .name('Wireframe Mode')
//     .onChange(value => {
//         material.wireframe = value;
//     });

// gui.addColor(guiState, 'materialColor')
//     .name('Cube Color')
//     .onChange(value => {
//         material.color.set(value);
//     });

// gui.add(guiState, 'spin').name('Spin Cube');
// gui.add(guiState, 'reset').name('Reset Cube');
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
    console.log('Loading started');
};
loadingManager.onLoad = () => {
    console.log('Loading complete');
};
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(`Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`);
};
loadingManager.onError = (url) => {
    console.log(`There was an error loading ${url}`);
};
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTexture = textureLoader.load('static/textures/door/color.jpg');
//  Three.js scene setup
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
    // color: guiState.materialColor,
    // wireframe: guiState.wireframe,
    map: cubeTexture
});
const cube = new THREE.Mesh(geometry, material);
cube.position.y = guiState.cubeY;
scene.add(cube);
const size = {
    width: window.innerWidth,
    height: window.innerHeight
};
window.addEventListener('resize', () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
    // Update renderer
    renderer.setSize(size.width, size.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Update camera
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
});
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement;
    // fullscreen
    if (!fullscreenElement) {
        if (canvasDom.requestFullscreen) {
            canvasDom.requestFullscreen();
        } else if (canvasDom.webkitRequestFullscreen) {
            canvasDom.webkitRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
});
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
const controls = new OrbitControls(camera, document.querySelector('.webgl'));
controls.enableDamping = true;
camera.position.z = 3;
camera.lookAt(cube.position);

const canvasDom = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvasDom });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};
tick();


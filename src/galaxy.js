import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import Router from './router.js'

const router = new Router();

let scene, camera, renderer, controls;
let animationId;
let isSceneInitialized = false;
let cube

function initThreeScene() {
    if (isSceneInitialized) return;
    const canvas = document.querySelector('canvas.galaxy_webgl');
    if (!canvas) return;
    scene = new THREE.Scene();

    /**
     * Test cube
     */
    cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshBasicMaterial()
    )
    scene.add(cube)

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    /**
     * Camera
     */
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.x = 3;
    camera.position.y = 3;
    camera.position.z = 3;
    scene.add(camera);

    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    /**
     * Renderer
     */
    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    isSceneInitialized = true;
}

const clock = new THREE.Clock();

function animate() {
    animationId = window.requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    controls.update();
    renderer.render(scene, camera);
}

function startAnimation() {
    if (!animationId) {
        animate();
    }
}

function stopAnimation() {
    if (animationId) {
        window.cancelAnimationFrame(animationId);
        animationId = null;
    }
}

function handleRouteChange() {
    const currentRoute = router.getCurrentRoute();

    if (currentRoute === 'galaxy') {
        setTimeout(() => {
            initThreeScene();
            startAnimation();
        }, 50);
    } else {
        stopAnimation();
    }
}

window.addEventListener('hashchange', handleRouteChange);
window.addEventListener('load', handleRouteChange);

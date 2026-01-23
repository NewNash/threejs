import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import Router from './router.js'

// Debug
// const gui = new GUI()

const router = new Router();
let isSceneInitialized = false;
let animationId = null;
let renderer = null;
let controls = null;
let scene = null
let camera = null;


function initParticlesScene() {
    if (isSceneInitialized) return;

    const canvas = document.querySelector("canvas.particles_webgl");
    if (!canvas) return;

    scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();

    /**
     * particles
     */
    const particleGeometry = new THREE.SphereGeometry(1, 32, 32);
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.02,
        sizeAttenuation: true
    })
    // points
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)
    
    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
    /**
     * Camera
     */
    // Base camera
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.z = 3
    scene.add(camera)
    // Controls
    controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    /**
     * Renderer
     */
    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

function animate() {
    animationId = requestAnimationFrame(animate);
    // Update controls
    controls.update();
    // Render
    renderer.render(scene, camera);
}

function startAnimation() {
    if (!animationId) {
        animate()
    }
}

function stopAnimation() {
    if (animationId) {
        window.cancelAnimationFrame(animationId);
        animationId = null;
    }
}
function handleRouteChange(route) {
    const currentRoute = router.getCurrentRoute();
    if (currentRoute === 'particles') {
        initParticlesScene();
        startAnimation();
    } else {
        stopAnimation();
    }
}

window.addEventListener('hashchange', handleRouteChange);
window.addEventListener('load', handleRouteChange);
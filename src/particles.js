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
let particles = null;
let particleGeometry = null;
const particleCount = 5000;



function initParticlesScene() {
    if (isSceneInitialized) return;

    const canvas = document.querySelector("canvas.particles_webgl");
    if (!canvas) return;

    scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('./particles/2.png');

    /**
     * particles
     */
    particleGeometry = new THREE.BufferGeometry();
    // 3: x y z
    const positions = new Float32Array(particleCount * 3);
    // 3: r g b
    const colors = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
        colors[i] = Math.random();
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const particleMaterial = new THREE.PointsMaterial({
        // color: 0xff88cc,
        size: 0.1,
        sizeAttenuation: true,
        alphaMap: particleTexture,
        transparent: true,
        // alphaTest: 0.001,
        // depthTest: false,
        // good solution
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    })
    // points
    particles = new THREE.Points(particleGeometry, particleMaterial)
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

const clock = new THREE.Clock();
function animate() {
    const elapsedTime = clock.getElapsedTime();
    animationId = requestAnimationFrame(animate);
    // Update particles
    // particles.rotation.x += 0.001;
    // particles.rotation.y = elapsedTime * 0.02;
    // Update controls

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const x = particleGeometry.attributes.position.array[i3 + 0];
        particleGeometry.attributes.position.array[i3 + 1] =  Math.cos(elapsedTime + x)
    }
    particleGeometry.attributes.position.needsUpdate = true;
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
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import Router from './router.js'

const router = new Router();

let scene, camera, renderer, controls;
let animationId;
let isSceneInitialized = false;
let gui, galaxy

function initThreeScene() {
    if (isSceneInitialized) return;
    const canvas = document.querySelector('canvas.galaxy_webgl');
    if (!canvas) return;
    scene = new THREE.Scene();
    gui = new GUI();


    const params = {
        count: 100000,
        size: 0.01,
        radius: 5,
        branches: 3,
        spin: 1,
        randomness: 0.2,
        randomnessPower: 3,
        insideColor: '#ff6030',
        outsideColor: '#1b3984',
    }

    let galaxyGeometry = null
    let galaxyMaterial = null
    // galaxy
    const generateGalaxy = () => {
        if (galaxy) {
            galaxyGeometry.dispose();
            galaxyMaterial.dispose();
            scene.remove(galaxy);
        }
        galaxyGeometry = new THREE.BufferGeometry();
        const positionArray = new Float32Array(params.count * 3);
        const colorArray = new Float32Array(params.count * 3);
        const insideColor = new THREE.Color(params.insideColor);
        const outsideColor = new THREE.Color(params.outsideColor);

        for (let i = 0; i < params.count; i++) {
            const radius = params.radius * Math.random();
            const spinAngle = radius * params.spin;
            const branchAngle = (i % params.branches) * (Math.PI * 2) / params.branches;
            const i3 = i * 3;

            const randomX = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
            const randomY = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);
            const randomZ = Math.pow(Math.random(), params.randomnessPower) * (Math.random() < 0.5 ? 1 : -1);

            positionArray[i3] = radius * Math.cos(branchAngle + spinAngle) + randomX 
            positionArray[i3 + 1] = 0 + randomY 
            positionArray[i3 + 2] = radius * Math.sin(branchAngle + spinAngle) + randomZ 

            const mixColor = insideColor.clone();
            const color = mixColor.lerp(outsideColor, radius / params.radius);
            colorArray[i3] = color.r;
            colorArray[i3 + 1] = color.g;
            colorArray[i3 + 2] = color.b;
        }
        galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
        galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
        galaxyMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: params.size,
            sizeAttenuation: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
        });
        galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
        scene.add(galaxy);
    }
    generateGalaxy();
    gui.add(params, 'count').min(100).max(100000).step(100).onFinishChange(generateGalaxy);
    gui.add(params, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
    gui.add(params, 'radius').min(1).max(10).step(0.1).onFinishChange(generateGalaxy);
    gui.add(params, 'branches').min(2).max(10).step(1).onFinishChange(generateGalaxy);
    gui.add(params, 'spin').min(-5).max(5).step(0.1).onFinishChange(generateGalaxy);
    gui.add(params, 'randomness').min(0).max(2).step(0.01).onFinishChange(generateGalaxy);
    gui.add(params, 'randomnessPower').min(1).max(10).step(0.1).onFinishChange(generateGalaxy);
    gui.addColor(params, 'insideColor').onFinishChange(generateGalaxy);
    gui.addColor(params, 'outsideColor').onFinishChange(generateGalaxy);



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
    // auto rotate
    galaxy.rotation.y = elapsedTime * 0.02;
    // Update controls
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

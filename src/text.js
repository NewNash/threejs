import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import Router from './router.js';

const router = new Router();

let scene, camera, renderer, controls;
let animationId;
let isSceneInitialized = false;

function initThreeScene() {
    if (isSceneInitialized) return;
    const canvas = document.querySelector('canvas.text_webgl');
    if (!canvas) return;
    scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    const matcapTexture = textureLoader.load('textures/matcaps/7.png');
    const fontLoader = new FontLoader();
    fontLoader.load(
        'fonts/helvetiker_regular.typeface.json',
        function (font) {
            const textGeometry = new TextGeometry('There is a lot of fun!', {
                font: font,
                size: 0.5,
                depth: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4,
            });
            textGeometry.center();

            const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
            const textMesh = new THREE.Mesh(textGeometry, material);
            scene.add(textMesh);

            const dotGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
            for (let i = 0; i < 100; i++) {
                const dotMesh = new THREE.Mesh(dotGeometry, material);
                dotMesh.position.x = (Math.random() - 0.5) * 10;
                dotMesh.position.y = (Math.random() - 0.5) * 10;
                dotMesh.position.z = (Math.random() - 0.5) * 10;

                dotMesh.rotation.x = Math.random() * Math.PI;
                dotMesh.rotation.y = Math.random() * Math.PI;
                dotMesh.rotation.z = Math.random() * Math.PI;

                const scale = Math.random() * 0.5 + 0.5;
                dotMesh.scale.set(scale, scale, scale);
                scene.add(dotMesh);
            }
        }
    );

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 2;
    scene.add(camera);

    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    isSceneInitialized = true;
}

function animate() {
    animationId = window.requestAnimationFrame(animate);
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

    if (currentRoute === 'text') {
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
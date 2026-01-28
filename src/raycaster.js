import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import Router from './router.js'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

const router = new Router();

let scene, camera, renderer, controls, raycaster, mouse, model;
let animationId;
let isSceneInitialized = false;
let object1, object2, object3;

function initThreeScene() {
    if (isSceneInitialized) return;
    const canvas = document.querySelector('canvas.raycaster_webgl');
    if (!canvas) return;
    scene = new THREE.Scene();
    /**
     * models
     */
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
        './models/Duck/glTF-Binary/Duck.glb',
        (gltf) => {
            // console.log(gltf);
            // scale the model
            model = gltf.scene
            gltf.scene.position.y = -1.2
            scene.add(gltf.scene);
        }
    )
    /**
     * lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight.position.set(1, 1, 0);
    scene.add(directionalLight);
    /**
     * Objects
     */
    object1 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: '#ff0000' })
    );
    object1.position.x = - 2;

    object2 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: '#ff0000' })
    );

    object3 = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 16, 16),
        new THREE.MeshBasicMaterial({ color: '#ff0000' })
    );
    object3.position.x = 2;

    scene.add(object1, object2, object3);

    raycaster = new THREE.Raycaster();
    // const rayOrigin = new THREE.Vector3(-3, 0, 0);
    // const rayDirection = new THREE.Vector3(10, 0, 0).normalize()
    // raycaster.set(rayOrigin, rayDirection);
    // const intersect = raycaster.intersectObject(object1);
    // console.log(intersect);

    // const intersects = raycaster.intersectObjects([object1, object2, object3]);
    // console.log(intersects);    
    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    };

    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    //mouse
    mouse = new THREE.Vector2();
    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / sizes.width) * 2 - 1;
        mouse.y = - (e.clientY / sizes.height) * 2 + 1;
    });
    window.addEventListener('click', () => {
        if (currentIntersect !== null) {
            console.log('click', currentIntersect.object);
            if (currentIntersect.object === object1) {
                console.log('click object1');
            } else if (currentIntersect.object === object2) {
                console.log('click object2');
            } else if (currentIntersect.object === object3) {
                console.log('click object3');
            }
        }
    })
    /**
     * Camera
     */
    // Base camera
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.z = 3;
    scene.add(camera);

    // Controls
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

/**
 * Animate
 */
const clock = new THREE.Clock();
let currentIntersect = null
function animate() {
    animationId = window.requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();
    object1.position.y = Math.sin(elapsedTime);
    object2.position.y = Math.cos(elapsedTime);
    object3.position.y = Math.sin(elapsedTime) * 2;
    // cast a ray
    raycaster.setFromCamera(mouse, camera);
    const objectsToTest = [object1, object2, object3];
    const intersects = raycaster.intersectObjects(objectsToTest);
    for (const object of objectsToTest) {
        object.material.color.set('#ff0000');
    }
    for (const intersect of intersects) {
        intersect.object.material.color.set('#00ff00');
    }
    if (intersects.length > 0) {
        if (currentIntersect === null) {
            console.log('mouse enter');
        }
        currentIntersect = intersects[0];
    } else {
        if (currentIntersect !== null) {
            console.log('mouse leave');
        }
        currentIntersect = null;
    }
    if (model) {
        const modelIntersects = raycaster.intersectObject(model);
        if (modelIntersects.length) {
            model.scale.set(1.2, 1.2, 1.2)
        } else {
            model.scale.set(1, 1, 1)
        }
        console.log(modelIntersects);
    }
    // for (const intersect of modelIntersects) {
    //     if (intersect.object.name === 'Duck') {
    //         intersect.object.material.color.set('#00ff00');
    //     }
    // }

    // Update controls
    controls.update();

    // Render
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

    if (currentRoute === 'raycaster') {
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
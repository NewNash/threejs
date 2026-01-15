import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

/**
 * Base
 */
// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// AxesHelper
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('textures/matcaps/7.png');

const fontLoader = new FontLoader();
fontLoader.load(
    // resource URL
    'fonts/helvetiker_regular.typeface.json',
    // called when the resource is loaded
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
        // textGeometry.computeBoundingBox();
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5
        // );
        // textGeometry.computeBoundingBox()
        // console.log(textGeometry.boundingBox)
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
/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
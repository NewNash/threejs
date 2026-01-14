import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import textureImg from './static/textures/door/color.jpg';
import ambientOcclusionTextureImg from './static/textures/door/ambientOcclusion.jpg';
import matcapTextureImg from './static/textures/matcaps/8.png';
import alphaTextureImg from './static/textures/door/alpha.jpg';
import gradientTextureImg from './static/textures/gradients/5.jpg';
import doorHeightImg from './static/textures/door/height.jpg';
import doorMetalnessImg from './static/textures/door/metalness.jpg';
import doorRoughnessImg from './static/textures/door/roughness.jpg';
import doorNormalImg from './static/textures/door/normal.jpg';
import environmentMapPXImg from './static/textures/environmentMap/px.png';  
import environmentMapNXImg from './static/textures/environmentMap/nx.png';
import environmentMapPYImg from './static/textures/environmentMap/py.png';
import environmentMapNYImg from './static/textures/environmentMap/ny.png';
import environmentMapPZImg from './static/textures/environmentMap/pz.png';
import environmentMapNZImg from './static/textures/environmentMap/nz.png';
import Gui from 'lil-gui';
const gui = new Gui();
const scene = new THREE.Scene();
const texturesLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const doorColorTexture = texturesLoader.load(textureImg);
const doorAmbientOcclusionTexture = texturesLoader.load(ambientOcclusionTextureImg);
const doorHeightTexture = texturesLoader.load(doorHeightImg);
const doorMetalnessTexture = texturesLoader.load(doorMetalnessImg);
const doorRoughnessTexture = texturesLoader.load(doorRoughnessImg);
const doorNormalTexture = texturesLoader.load(doorNormalImg);
const alphaTexture = texturesLoader.load(alphaTextureImg);
const gradientTexture = texturesLoader.load(gradientTextureImg);
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

const environmentMapTexture = cubeTextureLoader.load([
    environmentMapPXImg,
    environmentMapNXImg,
    environmentMapPYImg,
    environmentMapNYImg,
    environmentMapPZImg,
    environmentMapNZImg
])
// const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
// material.wireframe = true
// material.opacity = 0.5
// material.transparent = true
// material.alphaMap = alphaTexture
// material.side = THREE.DoubleSide


// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = doorColorTexture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100
// material.specular = new THREE.Color(0x1188ff);
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.45;
// material.roughness = 0.65;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.alphaMap = alphaTexture;
// material.transparent = true;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture;
gui.add(material, 'metalness').min(0).max(1).step(0.001);
gui.add(material, 'roughness').min(0).max(1).step(0.001);
gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.001);
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);
// material.metalness = 0.7;
// material.roughness = 0.2;
// material.map = doorColorTexture;
// material.alphaMap = alphaTexture;
// material.transparent = true;
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 64, 64),
    material
)
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));
sphere.position.x = -1.5;
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material
)

plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2));
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 64, 128),
    material
)
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2));
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 100);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

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
// camera.lookAt(plane.position);

const canvasDom = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvasDom });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    sphere.rotation.y = elapsedTime * 0.1;
    plane.rotation.y = elapsedTime * 0.1
    torus.rotation.y = elapsedTime * 0.1

    sphere.rotation.x = elapsedTime * 0.1;
    plane.rotation.x = elapsedTime * 0.1;
    torus.rotation.x = elapsedTime * 0.1;
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};
tick();


import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import Router from "./router.js";

const router = new Router();

let scene, camera, renderer, controls, gui, sphere, sphereShadow;
let animationId;
let isSceneInitialized = false;

function initThreeScene() {
  if (isSceneInitialized) return;
  const canvas = document.querySelector("canvas.shadows_webgl");
  if (!canvas) return;

  // Debug
  gui = new GUI();

  // Scene
  scene = new THREE.Scene();

  /**
   * Textures
   */
  const textureLoader = new THREE.TextureLoader();
  const bakedLoader = textureLoader.load("/textures/bakedShadow.jpg");
  const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg");

  /**
   * Lights
   */
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  gui.add(ambientLight, "intensity").min(0).max(3).step(0.001);
  scene.add(ambientLight);

  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
  directionalLight.position.set(2, 2, -1);
  gui.add(directionalLight, "intensity").min(0).max(3).step(0.001);
  gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001);
  gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001);
  gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001);
  scene.add(directionalLight);

  directionalLight.castShadow = false;
  directionalLight.shadow.mapSize.set(1024 * 2, 1024 * 2);
  directionalLight.shadow.camera.top = 2;
  directionalLight.shadow.camera.bottom = -2;
  directionalLight.shadow.camera.left = -2;
  directionalLight.shadow.camera.right = 2;
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 6;
  directionalLight.shadow.radius = 10;
  const directionalLightCameraHelper = new THREE.CameraHelper(
    directionalLight.shadow.camera,
  );
  directionalLightCameraHelper.visible = false;
  scene.add(directionalLightCameraHelper);

  // SpotLight
  const spotLight = new THREE.SpotLight(0xffffff, 3, 10, Math.PI * 0.3);
  spotLight.castShadow = false;
  spotLight.shadow.mapSize.set(1024, 1024);
  spotLight.shadow.camera.fov = 30;
  spotLight.position.set(0, 2, 2);
  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 6;
  scene.add(spotLight);
  scene.add(spotLight.target);

  const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
  spotLightHelper.visible = false;
  scene.add(spotLightHelper);

  // pointLight
  const pointLight = new THREE.PointLight(0xffffff, 5);
  pointLight.castShadow = false;
  pointLight.position.set(-1, 1, 0);
  pointLight.shadow.mapSize.set(1024, 1024);
  pointLight.shadow.camera.near = 0.1;
  pointLight.shadow.camera.far = 2;
  scene.add(pointLight);

  const pointLightHelper = new THREE.CameraHelper(pointLight.shadow.camera);
  pointLightHelper.visible = false;
  scene.add(pointLightHelper);

  /**
   * Materials
   */
  const material = new THREE.MeshStandardMaterial();
  material.roughness = 0.7;
  gui.add(material, "metalness").min(0).max(1).step(0.001);
  gui.add(material, "roughness").min(0).max(1).step(0.001);

  /**
   * Objects
   */
  sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);

  sphere.castShadow = true;
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({
      //   map: bakedLoader,
    }),
  );
  plane.rotation.x = -Math.PI * 0.5;
  plane.position.y = -0.5;
  plane.receiveShadow = true;
  scene.add(sphere, plane);

  sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
      color: 0x000000,
      alphaMap: simpleShadow,
      transparent: true,
    }),
  );
  sphereShadow.rotation.x = -Math.PI * 0.5;
  sphereShadow.position.y = plane.position.y + 0.01;
  scene.add(sphereShadow);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100,
  );
  camera.position.x = 1;
  camera.position.y = 1;
  camera.position.z = 2;
  scene.add(camera);

  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  isSceneInitialized = true;
}

const clock = new THREE.Clock();
function animate() {
  animationId = window.requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();
  sphere.position.x = Math.cos(elapsedTime) * 1.5;
  sphere.position.y = Math.abs(Math.sin(elapsedTime * 3));
  sphere.position.z = Math.sin(elapsedTime) * 1.5;

  sphereShadow.position.x = sphere.position.x;
  sphereShadow.position.z = sphere.position.z;
  sphereShadow.material.opacity = (1 - sphere.position.y) * 0.3;
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

  if (currentRoute === "shadows") {
    setTimeout(() => {
      initThreeScene();
      startAnimation();
    }, 50);
  } else {
    stopAnimation();
    // remove gui
    if (gui) gui.destroy();
  }
}

window.addEventListener("hashchange", handleRouteChange);
window.addEventListener("load", handleRouteChange);

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import Router from "./router.js";
import GUI from "lil-gui";

const router = new Router();
const gui = new GUI();
let scene, camera, renderer, controls;
let animationId = null;
let isSceneInitialized = false;
let timer;
let sizes;

function initThreeScene() {
  if (isSceneInitialized) return;
  const canvas = document.querySelector("canvas.house_webgl");
  if (!canvas) return;

  scene = new THREE.Scene();

  const textureLoader = new THREE.TextureLoader();

  const floorAlphaTexture = textureLoader.load("./floor/alpha.jpg");
  // static\floor\coast_sand_rocks_02_1k\coast_sand_rocks_02_diff_1k.jpg
  const floorColorTexture = textureLoader.load(
    "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg",
  );
  const floorARMTexture = textureLoader.load(
    "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg",
  );
  const floorNormalTexture = textureLoader.load(
    "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg",
  );
  const floorDisplacementTexture = textureLoader.load(
    "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg",
  );

  floorColorTexture.colorSpace = THREE.SRGBColorSpace;
  floorColorTexture.repeat.set(8, 8);
  floorColorTexture.wrapS = THREE.RepeatWrapping;
  floorColorTexture.wrapT = THREE.RepeatWrapping;

  floorARMTexture.repeat.set(8, 8);
  floorARMTexture.wrapS = THREE.RepeatWrapping;
  floorARMTexture.wrapT = THREE.RepeatWrapping;

  floorNormalTexture.repeat.set(8, 8);
  floorNormalTexture.wrapS = THREE.RepeatWrapping;
  floorNormalTexture.wrapT = THREE.RepeatWrapping;

  floorDisplacementTexture.repeat.set(8, 8);
  floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
  floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

  //wall
  const wallColorTexture = textureLoader.load(
    "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg",
  );
  const wallARMTexture = textureLoader.load(
    "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg",
  );
  const wallNormalTexture = textureLoader.load(
    "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg",
  );

  wallColorTexture.colorSpace = THREE.SRGBColorSpace;

  // roof
  const roofColorTexture = textureLoader.load(
    "./roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg",
  );
  const roofARMTexture = textureLoader.load(
    "./roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg",
  );
  const roofNormalTexture = textureLoader.load(
    "./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg",
  );

  roofColorTexture.colorSpace = THREE.SRGBColorSpace;
  roofColorTexture.repeat.set(3, 1);
  roofARMTexture.repeat.set(3, 1);
  roofNormalTexture.repeat.set(3, 1);

  roofColorTexture.wrapS = THREE.RepeatWrapping;
  roofARMTexture.wrapS = THREE.RepeatWrapping;
  roofNormalTexture.wrapS = THREE.RepeatWrapping;

  const bushColorTexture = textureLoader.load(
    "./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.jpg",
  );
  const bushARMTexture = textureLoader.load(
    "./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.jpg",
  );
  const bushNormalTexture = textureLoader.load(
    "./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.jpg",
  );
  bushColorTexture.colorSpace = THREE.SRGBColorSpace;
  bushColorTexture.repeat.set(2, 1);
  bushARMTexture.repeat.set(2, 1);
  bushNormalTexture.repeat.set(2, 1);

  bushColorTexture.wrapS = THREE.RepeatWrapping;
  bushARMTexture.wrapS = THREE.RepeatWrapping;
  bushNormalTexture.wrapS = THREE.RepeatWrapping;

  // Grave
  const graveColorTexture = textureLoader.load(
    "./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.jpg",
  );
  const graveARMTexture = textureLoader.load(
    "./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.jpg",
  );
  const graveNormalTexture = textureLoader.load(
    "./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.jpg",
  );

  graveColorTexture.colorSpace = THREE.SRGBColorSpace;

  graveColorTexture.repeat.set(0.3, 0.4);
  graveARMTexture.repeat.set(0.3, 0.4);
  graveNormalTexture.repeat.set(0.3, 0.4);

  // door
  const doorColorTexture = textureLoader.load("./door/color.jpg");
  const doorAlphaTexture = textureLoader.load("./door/alpha.jpg");
  const doorAmbientOcclusionTexture = textureLoader.load(
    "./door/ambientOcclusion.jpg",
  );
  const doorHeightTexture = textureLoader.load("./door/height.jpg");
  const doorNormalTexture = textureLoader.load("./door/normal.jpg");
  const doorMetalnessTexture = textureLoader.load("./door/metalness.jpg");
  const doorRoughnessTexture = textureLoader.load("./door/roughness.jpg");

  doorColorTexture.colorSpace = THREE.SRGBColorSpace;

  // floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
      alphaMap: floorAlphaTexture,
      transparent: true,
      map: floorColorTexture,
      aoMap: floorARMTexture,
      roughnessMap: floorARMTexture,
      metalnessMap: floorARMTexture,
      normalMap: floorNormalTexture,
      displacementMap: floorDisplacementTexture,
      displacementScale: 0.3,
      displacementBias: -0.2,
    }),
  );
  floor.rotation.x = -Math.PI * 0.5;
  scene.add(floor);

  gui
    .add(floor.material, "displacementScale")
    .min(0)
    .max(1)
    .step(0.01)
    .name("displacementScale");
  gui
    .add(floor.material, "displacementBias")
    .min(-1)
    .max(1)
    .step(0.01)
    .name("displacementBias");

  // house containers
  const house = new THREE.Group();
  scene.add(house);

  // walls
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
      map: wallColorTexture,
      aoMap: wallARMTexture,
      roughnessMap: wallARMTexture,
      metalnessMap: wallARMTexture,
      normalMap: wallNormalTexture,
    }),
  );
  walls.position.y = 1.25;
  house.add(walls);

  //roofs
  const roofs = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
      map: roofColorTexture,
      aoMap: roofARMTexture,
      roughnessMap: roofARMTexture,
      metalnessMap: roofARMTexture,
      normalMap: roofNormalTexture,
    }),
  );
  roofs.position.y = 2.5 + 0.75;
  roofs.rotation.y = -Math.PI * 0.25;
  house.add(roofs);

  // door
  const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
      map: doorColorTexture,
      transparent: true,
      alphaMap: doorAlphaTexture,
      aoMap: doorAmbientOcclusionTexture,
      displacementMap: doorHeightTexture,
      displacementScale: 0.15,
      displacementBias: -0.04,
      normalMap: doorNormalTexture,
      metalnessMap: doorMetalnessTexture,
      roughnessMap: doorRoughnessTexture,
    }),
  );
  door.position.y = 1;
  door.position.z = 2.001;
  house.add(door);

  // bush
  const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
  const bushMaterial = new THREE.MeshStandardMaterial({
    color: "#ccffcc",
    map: bushColorTexture,
    aoMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
  });
  const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush1.position.set(0.8, 0.2, 2.2);
  bush1.scale.set(0.5, 0.5, 0.5);
  bush1.rotation.x = -0.75;

  const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush2.position.set(1.4, 0.1, 2.1);
  bush2.scale.set(0.25, 0.25, 0.25);
  bush2.rotation.x = -0.75;

  const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush3.position.set(-0.8, 0.1, 2.2);
  bush3.scale.set(0.4, 0.4, 0.4);
  bush3.rotation.x = -0.75;

  const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
  bush4.position.set(-1, 0.05, 2.6);
  bush4.scale.set(0.15, 0.15, 0.15);
  bush4.rotation.x = -0.75;
  house.add(bush1, bush2, bush3, bush4);

  // graves
  const gravesGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
  const gravesMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture,
  });

  const graves = new THREE.Group();
  scene.add(graves);

  for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 3 + Math.random() * 4;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const grave = new THREE.Mesh(gravesGeometry, gravesMaterial);
    grave.position.set(x, 0.4 * Math.random(), z);
    grave.rotation.x = (Math.random() - 0.5) * 0.4;
    grave.rotation.y = (Math.random() - 0.5) * 0.4;
    grave.rotation.z = (Math.random() - 0.5) * 0.4;
    graves.add(grave);
  }

  const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("#ffffff", 1.5);
  directionalLight.position.set(3, 2, -8);
  scene.add(directionalLight);

  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100,
  );
  camera.position.x = 4;
  camera.position.y = 2;
  camera.position.z = 5;
  scene.add(camera);

  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  timer = new Timer();
  isSceneInitialized = true;
}

function animate() {
  animationId = window.requestAnimationFrame(animate);
  timer.update();
  const elapsedTime = timer.getElapsed();
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
  if (currentRoute === "house") {
    setTimeout(() => {
      initThreeScene();
      startAnimation();
    }, 50);
  } else {
    stopAnimation();
  }
}

window.addEventListener("hashchange", handleRouteChange);
window.addEventListener("load", handleRouteChange);


import * as THREE from 'three';

const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
// cube.position.x = 0.7;
// cube.position.y = -0.6;
// cube.position.z = 1;
cube.position.set(0.7, -0.6, 1);
cube.scale.set(2, 0.5, 0.5);
cube.rotation.reorder('YXZ');
cube.rotation.y = Math.PI / 2
cube.rotation.x = Math.PI / 4;
// cube.position.normalize();
scene.add(cube);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
const size = {
    width: 800,
    height: 600
};
const camera = new THREE.PerspectiveCamera(45, size.width / size.height);
camera.position.set(1, 1, 8);
camera.lookAt(cube.position);
console.log(cube.position.distanceTo(camera.position));
const canvasDom = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvasDom });
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);
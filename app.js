import * as THREE from 'three';

const scene = new THREE.Scene();

const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
cube1.position.x = -2;
cube1.rotation.y = 1;
group.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
// cube2.rotation.y = 0.5;
group.add(cube2);

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.x = 2;
cube3.rotation.y = -1
group.position.y = 1;
group.scale.set(1, 2, 1);
group.add(cube3);

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);
const size = {
    width: 800,
    height: 600
};
const camera = new THREE.PerspectiveCamera(45, size.width / size.height);
camera.position.set(1, 1, 8);
camera.lookAt(group.position);
const canvasDom = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvasDom });
renderer.setSize(size.width, size.height);
renderer.render(scene, camera);
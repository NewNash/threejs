import * as THREE from 'three';
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);
const size = {
    width: window.innerWidth,
    height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
const cursor = {
    x: 0,
    y: 0
};
window.addEventListener('mousemove', (event) => {
    cursor.x = -(event.clientX / size.width - 0.5);
    cursor.y = event.clientY / size.height - 0.5;
});
camera.position.z = 3;

const canvasDom = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvasDom });
renderer.setSize(size.width, size.height);

const clock = new THREE.Clock();
const tick = () => {
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
    camera.position.y = cursor.y * 5;
    camera.lookAt(cube.position);
    // const elapsedTime = clock.getElapsedTime();
    // cube.rotation.y = elapsedTime;
    // cube.position.y = Math.sin(elapsedTime);
    // cube.rotation.y = elapsedTime;
    // cube.position.x = Math.cos(elapsedTime);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};
tick();


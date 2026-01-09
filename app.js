import * as THREE from 'three';
const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);
const size = {
    width: 800,
    height: 600
};
const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 100);
// const aspectRatio = size.width / size.height;
// const camera = new THREE.OrthographicCamera(
//     -1 * aspectRatio,
//     1 * aspectRatio,
//     -1,
//     1,
//     0.1,
//     100
// );
camera.position.z = 2;
camera.position.x = 2;
camera.position.y = 2;
camera.lookAt(cube.position);
const canvasDom = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvasDom });
renderer.setSize(size.width, size.height);

const clock = new THREE.Clock();
const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    cube.rotation.y = elapsedTime;
    // cube.position.y = Math.sin(elapsedTime);
    // cube.rotation.y = elapsedTime;
    // cube.position.x = Math.cos(elapsedTime);
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
};
tick();
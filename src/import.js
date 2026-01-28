import * as THREE from 'three'
import { OrbitControls, } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import Router from './router.js'

const router = new Router()

let scene, camera, renderer, controls, mixer
let animationId = null
let isSceneInitialized = false


function initThreeScene() {
    if (isSceneInitialized) return
    const canvas = document.querySelector('canvas.import_webgl')
    if (!canvas) return

    scene = new THREE.Scene()

    /**
     * models
     */
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('./draco/')
    const gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)
    gltfLoader.load(
        // './models/Duck/glTF/Duck.gltf',
        // './models/Duck/glTF-Binary/Duck.glb',
        // './models/Duck/glTF-Draco/Duck.gltf',
        // './models/FlightHelmet/glTF/FlightHelmet.gltf',
        './models/Fox/glTF/Fox.gltf',
        function (gltf) {
            const children = [...gltf.scene.children]
            // while(gltf.scene.children.length > 0) {
            //     scene.add(gltf.scene.children[0])
            // }
            console.log(gltf)
            mixer = new THREE.AnimationMixer(gltf.scene)
            const action = mixer.clipAction(gltf.animations[2])
            action.play()
            gltf.scene.scale.set(0.03, 0.03, 0.03)
            scene.add(gltf.scene)
            // for (const child of children) {
            //     scene.add(child)
            // }
        }
    )


    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({
            color: '#444444',
            metalness: 0,
            roughness: 0.5
        })
    )
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI * 0.5
    scene.add(floor)

    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.set(1024, 1024)
    directionalLight.shadow.camera.far = 15
    directionalLight.shadow.camera.left = - 7
    directionalLight.shadow.camera.top = 7
    directionalLight.shadow.camera.right = 7
    directionalLight.shadow.camera.bottom = - 7
    directionalLight.position.set(5, 5, 5)
    scene.add(directionalLight)

    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(2, 2, 2)
    scene.add(camera)

    controls = new OrbitControls(camera, canvas)
    controls.target.set(0, 0.75, 0)
    controls.enableDamping = true

    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}
const clock = new THREE.Clock()
let previousTime = 0
function animate() {
    animationId = window.requestAnimationFrame(animate)
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    if (mixer) {
        mixer.update(deltaTime)
    }
    controls.update()
    renderer.render(scene, camera)
}

function startAnimation() {
    if (!animationId) {
        animate()
    }
}

function stopAnimation() {
    if (animationId) {
        window.cancelAnimationFrame(animationId)
        animationId = null
    }
}

function handleRouteChange() {
    const currentRoute = router.getCurrentRoute()
    if (currentRoute === 'import') {
        setTimeout(() => {
            console.log("ipo    ")
            initThreeScene()
            startAnimation()
        }, 50)
    } else {
        stopAnimation()
    }
}

window.addEventListener('hashchange', handleRouteChange)
window.addEventListener('load', handleRouteChange)

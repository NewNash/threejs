import * as THREE from 'three'
import Router from './router.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import CANNON from 'cannon'
const router = new Router()

let scene, camera, renderer, controls, world, sphereBody, sphere
let animationId = null
let isSceneInitialized = false

function initScene() {
    if (isSceneInitialized) return
    const canvas = document.querySelector('canvas.physics_webgl')
    if (!canvas) return
    scene = new THREE.Scene()
    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader()
    const cubeTextureLoader = new THREE.CubeTextureLoader()

    const environmentMapTexture = cubeTextureLoader.load([
        '/environmentMaps/0/px.png',
        '/environmentMaps/0/nx.png',
        '/environmentMaps/0/py.png',
        '/environmentMaps/0/ny.png',
        '/environmentMaps/0/pz.png',
        '/environmentMaps/0/nz.png'
    ])
    /**
     * Physics world
     */
    world = new CANNON.World()
    world.gravity.set(0, -9.82, 0)
    //material
    // const sphereMaterial = new CANNON.Material('sphereMaterial')
    // const floorMaterial = new CANNON.Material('floorMaterial')
    const defaultMaterial = new CANNON.Material('defaultMaterial')
    const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
        friction: 0.3, // 摩擦系数
        restitution: 0.9 // 弹性系数
    })
    world.addContactMaterial(defaultContactMaterial)    
    world.defaultContactMaterial = defaultContactMaterial

    // SPHERE 
    const sphereShape = new CANNON.Sphere(0.5)
    sphereBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: sphereShape,
        material: defaultMaterial
    })
    world.addBody(sphereBody)

    // floor
    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body({
        mass: 0,
        shape: floorShape,
        material: defaultMaterial
    })
    floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
    world.addBody(floorBody)
    /**
     * Test sphere
     */
    sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 32, 32),
        new THREE.MeshStandardMaterial({
            metalness: 0.3,
            roughness: 0.4,
            envMap: environmentMapTexture,
            envMapIntensity: 0.5
        })
    )
    sphere.castShadow = true
    sphere.position.y = 0.5
    scene.add(sphere)
    /**
     * Floor
     */
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshStandardMaterial({
            color: '#777777',
            metalness: 0.3,
            roughness: 0.4,
            envMap: environmentMapTexture,
            envMapIntensity: 0.5
        })
    )
    floor.receiveShadow = true
    floor.rotation.x = - Math.PI * 0.5
    scene.add(floor)

    /**
     * Lights
     */
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
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
    /**
     * Camera
     */
    // Base camera
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(- 3, 3, 3)
    scene.add(camera)

    // Controls
    controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    isSceneInitialized = true
}

const clock = new THREE.Clock()
let oldElapsedTime = 0
function animate() {
    animationId = window.requestAnimationFrame(animate)
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    //update physics world
    world.step(1 / 60, deltaTime, 3)
    sphere.position.copy(sphereBody.position)
    //update controls
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
    if (currentRoute === 'physics') {
        setTimeout(() => {
            initScene()
            startAnimation()
        }, 50)
    } else {
        stopAnimation()
    }
}

window.addEventListener('hashchange', handleRouteChange)
window.addEventListener('load', handleRouteChange)

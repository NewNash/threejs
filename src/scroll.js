import * as THREE from 'three'
import Router from './router.js'
import GUI from 'lil-gui'

const router = new Router()


let scene, camera, renderer, mesh1, mesh2, mesh3, material, sectionMeshes
let animationId = null
let isSceneInitialized = false
let scrollY = window.scrollY
const params = {
    materialColor: '#ffeded'
}
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const objectsDistance = 4
const cursor = {
    x: 0,
    y: 0
}

function initScene() {
    const gui = new GUI()
    gui.addColor(params, 'materialColor').onFinishChange(() => {
        if (!material) return
        material.color.set(params.materialColor)
    })
    if (isSceneInitialized) return
    const canvas = document.querySelector('canvas.scroll_webgl')
    if (!canvas) return
    scene = new THREE.Scene()
    /**
     * texture
     */
    const textureLoader = new THREE.TextureLoader()
    const gradientTexture = textureLoader.load('./gradients/3.jpg')
    gradientTexture.magFilter = THREE.NearestFilter

    /**
     * objects
     */
    material = new THREE.MeshToonMaterial({
        color: params.materialColor,
        gradientMap: gradientTexture
    })
    mesh1 = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.4, 16, 60),
        material
    )

    mesh2 = new THREE.Mesh(
        new THREE.ConeGeometry(1, 2, 32),
        material
    )

    mesh3 = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
        material
    )
    mesh1.position.y = -objectsDistance * 0
    mesh2.position.y = -objectsDistance * 1
    mesh3.position.y = -objectsDistance * 2

    mesh1.position.x = 2
    mesh2.position.x = -2
    mesh3.position.x = 2

    scene.add(mesh1, mesh2, mesh3)

    sectionMeshes = [mesh1, mesh2, mesh3]

    /**
     * lights
     */
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(1, 1, 0)
    scene.add(directionalLight)

    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY
    })
    window.addEventListener('mousemove', (e) => {
        cursor.x = e.clientX / sizes.width - 0.5
        cursor.y = e.clientY / sizes.height - 0.5
    })

    camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
    camera.position.z = 6
    scene.add(camera)

    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    isSceneInitialized = true
}

const clock = new THREE.Clock()

function animate() {
    animationId = window.requestAnimationFrame(animate)
    const elapsedTime = clock.getElapsedTime()
    camera.position.y = -scrollY / sizes.height * objectsDistance
    camera.position.x = cursor.x 
    camera.position.y = -cursor.y 

    for (const mesh of sectionMeshes) {
        mesh.rotation.x = elapsedTime * 0.1
        mesh.rotation.y = elapsedTime * 0.12
    }

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
    if (currentRoute === 'scroll') {
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

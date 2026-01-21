import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import Router from './router.js'

const router = new Router()

let scene, camera, renderer, controls
let animationId = null
let isSceneInitialized = false
let timer
let sizes

function initThreeScene() {
    if (isSceneInitialized) return
    const canvas = document.querySelector('canvas.house_webgl')
    if (!canvas) return

    scene = new THREE.Scene()

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshStandardMaterial({ roughness: 0.7 })
    )
    scene.add(sphere)

    const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
    directionalLight.position.set(3, 2, -8)
    scene.add(directionalLight)

    sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.x = 4
    camera.position.y = 2
    camera.position.z = 5
    scene.add(camera)

    controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true

    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    window.addEventListener('resize', () => {
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    timer = new Timer()
    isSceneInitialized = true
}

function animate() {
    animationId = window.requestAnimationFrame(animate)
    timer.update()
    const elapsedTime = timer.getElapsed()
    console.log(elapsedTime)
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
    if (currentRoute === 'house') {
        setTimeout(() => {
            initThreeScene()
            startAnimation()
        }, 50)
    } else {
        stopAnimation()
    }
}

window.addEventListener('hashchange', handleRouteChange)
window.addEventListener('load', handleRouteChange)

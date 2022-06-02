import * as THREE from 'three'

const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

const sun = textureLoader.load('/textures/sun.jpg')
const earth = textureLoader.load('/textures/earth.jpg')
const jupiter = textureLoader.load('/textures/jupiter.jpg')
const mars = textureLoader.load('/textures/mars.jpg')
const mercury = textureLoader.load('/textures/mercury.jpg')
const venus = textureLoader.load('/textures/venus.jpg')
const saturn = textureLoader.load('/textures/saturn.jpg')
const uranus = textureLoader.load('/textures/uranus.jpg')
const neptune = textureLoader.load('/textures/neptune.jpg')
const particle = textureLoader.load('/textures/particles.png');

const textures = {
	sun,
	earth,
	jupiter,
	mars,
	mercury,
	venus,
	saturn,
	uranus, 
	neptune,
	particle,
}

export default textures;
import * as THREE from 'three'

const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

//planet
const sun = textureLoader.load('/textures/sun.jpg')
const earth = textureLoader.load('/textures/earth.jpg')
const jupiter = textureLoader.load('/textures/jupiter.jpg')
const mars = textureLoader.load('/textures/mars.jpg')
const mercury = textureLoader.load('/textures/mercury.jpg')
const venus = textureLoader.load('/textures/venus.jpg')
const saturn = textureLoader.load('/textures/saturn.jpg')
const uranus = textureLoader.load('/textures/uranus.jpg')
const neptune = textureLoader.load('/textures/neptune.jpg')
const pluto = textureLoader.load('/textures/pluto.jpg')

//moon
const moon = textureLoader.load('/textures/moon.png')

//particle
const particle = textureLoader.load('/textures/particles.png');

//asteroid
const asteroid = textureLoader.load('/textures/asteroid.jpg')
const asteroidAlpha = textureLoader.load('/textures/asteroid_Alpha.jpg')
const asteroidHight	 = textureLoader.load('/textures/asteroid_height.png')
const asteroidNormal = textureLoader.load('/textures/asteroid_normal.png')
const asteroidRoughness = textureLoader.load('/textures/asteroid_roughness.jpg')

//ring
const saturnRing = textureLoader.load('/textures/rings.jpg');

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
	pluto,
	particle,
	asteroid,
	asteroidAlpha,
	asteroidHight,
	asteroidNormal,
	asteroidRoughness,
	saturnRing,
	moon,
}

export default textures;
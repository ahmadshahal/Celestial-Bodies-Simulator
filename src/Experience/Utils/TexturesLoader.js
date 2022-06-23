import * as THREE from 'three'
import textSun from '../../../static/textures/sun.jpg';
import textEarth from '../../../static/textures/earth.jpg';
import textJup from '../../../static/textures/jupiter.jpg';
import textMar from '../../../static/textures/mars.jpg';
import textMer from '../../../static/textures/mercury.jpg';
import textVen from '../../../static/textures/venus.jpg';
import textSat from '../../../static/textures/saturn.jpg';
import textUra from '../../../static/textures/uranus.jpg';
import textNep from '../../../static/textures/neptune.jpg';
import textPlu from '../../../static/textures/pluto.jpg';
import textMoon from '../../../static/textures/moon.png';
import textParticles from '../../../static/textures/particles.png';
import textRing from '../../../static/textures/rings.jpg';

const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager);

//planet
const sun = textureLoader.load(textSun);
const earth = textureLoader.load(textEarth);
const jupiter = textureLoader.load(textJup);
const mars = textureLoader.load(textMar)
const mercury = textureLoader.load(textMer);
const venus = textureLoader.load(textVen);
const saturn = textureLoader.load(textSat);
const uranus = textureLoader.load(textUra);
const neptune = textureLoader.load(textNep);
const pluto = textureLoader.load(textPlu);

//moon
const moon = textureLoader.load(textMoon);

//particle
const particle = textureLoader.load(textParticles);

//ring
const saturnRing = textureLoader.load(textRing);

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
	saturnRing,
	moon,
}

export default textures;
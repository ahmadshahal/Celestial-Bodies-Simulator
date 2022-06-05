import * as THREE from 'three';
import Experience from "../Experience";
import Planet , {earthConstants} from './Planet.js';
import Asteroid from './asteroid';
import textures  from '../Utils/TexturesLoader';

//sun radius = 696340 

let instance = null

export default class World {
    constructor() {
        if(instance)
        {
            return instance
        }
        instance = this
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.scene.background = new THREE.Color('#090909');
        
        // Scene Light
        this.sceneLight = new THREE.AmbientLight(0xb9b5ff, 0.12)

        // asteroid
        this.asteroid = new Asteroid('ast', 0.5 , 0.5 , 0 , 1 , 1 , 1 , 1 , 1 , null , textures.asteroid , textures.asteroidAlpha , textures.asteroidHight , textures.asteroidNormal , textures.asteroidRoughness);

        this.sun = new Planet('sun' , 0, 0, 0,/* (109 * earthRadius)*/ 0.2, 333152.42, 0, 0, 0, 0.1, null ,textures.sun,true , false , null)

        this.mercury = new Planet('mercury' , 0.387, 0, 0, 0.383 , 0.0553, 0, 0, 1.59 , 0.01, null, textures.mercury,false , false , null)
        this.venus = new Planet('venus' , 0.723, 0, 0, 0.949 , 0.815, 0, 0, 1.18 , 0.01,null, textures.venus,false , false , null)
        this.earth = new Planet('earth' , -1, 0, 0, 1, 1 , 0,  0, -1 , 0.01, null, textures.earth,false ,false , null)
        this.mars = new Planet('mars' ,1.52, 0, 0, 0.532 , 0.107, 0, 0, 0.808 , 0.01, null, textures.mars,false , false , null)
        this.jupiter = new Planet('jupiter' , 5.2, 0, 0, 11.21 , 317.8 , 0, 0, 0.439 , 0.01 ,null, textures.jupiter,false , false , null)
        this.saturn = new Planet('saturn' , 9.57 , 0, 0, 9.45 , 95.2 , 0, 0, 0.325 , 0.01, null, textures.saturn,false , true , textures.saturnRing);
        this.uranus = new Planet('uranus' , 19.17 , 0, 0, 4.01 , 14.5 , 0, 0, 0.228 , 0.01, null, textures.uranus,false , false , null)
        this.neptune = new Planet('neptune' , 30.18 , 0, 0, 3.88 , 17.1 , 0, 0 , 0.182 , 0.01, null, textures.neptune,false , false ,null)

        this.planets = [
            this.sun,
            this.mercury,
            this.venus,
            this.earth,
            this.mars,
            this.jupiter,
            this.saturn,
            this.uranus,
            this.neptune
        ]

        this.scene.add(
            this.sceneLight,
            this.sun.mesh,
            this.earth.mesh,
            this.mars.mesh,
            this.venus.mesh,
            this.jupiter.mesh,
            this.mercury.mesh,
            this.saturn.mesh,
            this.uranus.mesh,
            this.neptune.mesh
        )

        this.scene.add(
            this.sun.orbit.line,
            this.earth.orbit.line,
            this.mars.orbit.line,
            this.venus.orbit.line,
            this.jupiter.orbit.line,
            this.mercury.orbit.line,
            this.saturn.orbit.line,
            this.uranus.orbit.line,
            this.neptune.orbit.line
        )
        
        this.planets.forEach(planet => {
            this.experience.controlPanel.editPlanet(planet);
            this.experience.controlPanel.deletePlanet(planet);
        });
    }
    
    update() {
        this.planets.forEach((planet) => {
            this.gravitationalForceUpdate(planet)
            this.collisionUpdate(planet)
            this.positionUpdate(planet)
            planet.rotate()
        })
    }

    gravitationalForceUpdate(planet) {
        const force = new THREE.Vector3(0, 0, 0)
        this.planets.forEach((tempPlanet) => {
            if (tempPlanet != planet) {
                force.add(tempPlanet.gravitationalForce(planet))
            }
        })
        planet.momentum = planet.momentum.clone().add(force.multiplyScalar(earthConstants.TIME_STEP));
    }

    collisionUpdate(planet) {
        const COR = 1
        this.planets.forEach((tempPlanet) => {
            if (planet != tempPlanet) {
                if (planet.areCollided(tempPlanet)) {
                    const n = planet.position.clone().sub(tempPlanet.position.clone())
                    const un = n.clone().divideScalar(n.length())
                    let ut = new THREE.Vector3(-un.y, un.x, un.z)

                    // !: Start of Danger Zone
                    const temp = un.clone().cross(ut);
                    ut = temp.clone();
                    // !: End of Danger Zone

                    const tempPlanetVN = un.clone().dot(tempPlanet.getVelocity().clone())
                    const tempPlanetVT = ut.clone().dot(tempPlanet.getVelocity().clone())
                    const planetVN = un.clone().dot(planet.getVelocity().clone())
                    const planetVT = ut.clone().dot(planet.getVelocity().clone())

                    const newTempPlanetVN = (tempPlanetVN * tempPlanet.mass + planetVN * planet.mass + planet.mass * (planetVN - tempPlanetVN) * COR) / (planet.mass + tempPlanet.mass)
                    const newPlanetVN = (planetVN * planet.mass + tempPlanetVN * tempPlanet.mass + tempPlanet.mass * (tempPlanetVN - planetVN) * COR) / (planet.mass + tempPlanet.mass)

                    const finalTempPlanetVN = un.clone().multiplyScalar(newTempPlanetVN)
                    const finalTempPlanetVT = ut.clone().multiplyScalar(tempPlanetVT)
                    const finalPlanetVN = un.clone().multiplyScalar(newPlanetVN)
                    const finalPlanetVT = ut.clone().multiplyScalar(planetVT)

                    const newTempPlanetVelocity = finalTempPlanetVN.add(finalTempPlanetVT.clone())
                    const newPlanetVelocity = finalPlanetVN.add(finalPlanetVT.clone())

                    tempPlanet.momentum = newTempPlanetVelocity.multiplyScalar(tempPlanet.mass)
                    planet.momentum = newPlanetVelocity.multiplyScalar(planet.mass)
                }
                // const speed = planet.momentum.clone().divideScalar(planet.mass)
                // planet.position = planet.position.clone().add(speed.clone().multiplyScalar(this.TIME_STEP))
                // planet.mesh.position.x = planet.position.x * this.SCALE
                // planet.mesh.position.y = planet.position.y * this.SCALE
                // planet.mesh.position.z = planet.position.z * this.SCALE

                // const tempPlanetSpeed = tempPlanet.momentum.clone().divideScalar(tempPlanet.mass)
                // tempPlanet.position = tempPlanet.position.clone().add(tempPlanetSpeed.clone().multiplyScalar(this.TIME_STEP))
                // tempPlanet.mesh.position.x = tempPlanet.position.x * this.SCALE
                // tempPlanet.mesh.position.y = tempPlanet.position.y * this.SCALE
                // tempPlanet.mesh.position.z = tempPlanet.position.z * this.SCALE
            }
        })
    }

    positionUpdate(planet) {
        const speed = planet.momentum.clone().divideScalar(planet.mass)
        planet.position = planet.position.clone().add(speed.clone().multiplyScalar(earthConstants.TIME_STEP))
        planet.mesh.position.x = planet.position.x * earthConstants.SCALE;
        planet.mesh.position.y = planet.position.y * earthConstants.SCALE;
        planet.mesh.position.z = planet.position.z * earthConstants.SCALE;
        if(planet.star)
            planet.starLight.position.set(planet.mesh.position.x , planet.mesh.position.y , planet.mesh.position.z);
        if(planet.ring)
            planet.planetRings.position.set(planet.mesh.position.x , planet.mesh.position.y , planet.mesh.position.z);
        this.drawPlanetOrbit(planet);
    }

    drawPlanetOrbit(planet){
        let index = planet.orbit.pointCount;
        if(index < 1000){
            planet.orbit.line.geometry.attributes.position.array[index * 3] = planet.position.x * earthConstants.SCALE;
            planet.orbit.line.geometry.attributes.position.array[(index * 3) + 1] = planet.position.y * earthConstants.SCALE;
            planet.orbit.line.geometry.attributes.position.array[(index * 3) + 2] = planet.position.z * earthConstants.SCALE;
            planet.orbit.pointCount++;
            planet.orbit.line.geometry.setDrawRange(planet.orbit.startIndex , planet.orbit.pointCount);
        } 
        else if(index >= 1000 && index < 10000){
            planet.orbit.line.geometry.attributes.position.array[index * 3] = planet.position.x * earthConstants.SCALE;
            planet.orbit.line.geometry.attributes.position.array[(index * 3) + 1] = planet.position.y * earthConstants.SCALE;
            planet.orbit.line.geometry.attributes.position.array[(index * 3) + 2] = planet.position.z * earthConstants.SCALE;
            planet.orbit.pointCount++;
            planet.orbit.startIndex++;
            planet.orbit.line.geometry.setDrawRange(planet.orbit.startIndex , 1000);
        }
        else{
            let j = 0;
            for(let i = 27000; i < 30000 ; i++){
                planet.orbit.line.geometry.attributes.position.array[j] =  planet.orbit.line.geometry.attributes.position.array[i];
                j++;
            }
            planet.orbit.pointCount = 1000;
            planet.orbit.startIndex = 0;
            planet.orbit.line.geometry.setDrawRange(0 , 1000);
        }
        planet.orbit.line.geometry.attributes.position.needsUpdate = true;
    }
}
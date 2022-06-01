import * as THREE from 'three';
import Experience from "../Experience";
import Planet from './Planet.js';
import textures from '../Utils/TexturesLoader';
//sun radius = 696340 

let instance = null

export default class World {
    constructor() {
        if(instance)
        {
            return instance
        }
        instance = this
        //const varibales
        this.AU =  149.6e6 * 1000
        this.SCALE = 5 / this.AU
        this.TIME_STEP = 24*60*60
        // this.earthMass = 5.97 * 10 ** 24
        this.radiusScale = 1/(6378 * 2)
        this.earthRadius = 6378 * this.radiusScale
        this.earthVelocity = -1 * 29.8 * 1000
        
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.scene.background = new THREE.Color(0x1c253c)

        // Scene Light
        this.sceneLight = new THREE.AmbientLight(0xb9b5ff, 0.12)

        this.sun = new Planet('sun' , 0, 0, 0,/* (109 * earthRadius)*/ 0.2, 333152.42, 0, 0, 0, 0.1, null ,textures.sun,1)


        this.mercury = new Planet('mercury' , 0.387, 0, 0, 0.383 * this.earthRadius, 0.0553, 0, 0, 1.59 * this.earthVelocity, 0.01, null, textures.mercury,0)
        this.venus = new Planet('venus' , 0.723, 0, 0, 0.949 * this.earthRadius, 0.815, 0, 0, 1.18 * this.earthVelocity, 0.01,null, textures.venus,0)
        this.earth = new Planet('earth' , -1, 0, 0, this.earthRadius, 1 , 0,  0, -1 * this.earthVelocity, 0.01, null, textures.earth,0)
        this.mars = new Planet('mars' ,1.52, 0, 0, 0.532 * this.earthRadius, 0.107, 0, 0, 0.808 * this.earthVelocity, 0.01, null, textures.mars,0)
        this.jupiter = new Planet('jupiter' , 5.2, 0, 0, 11.21 * this.earthRadius, 317.8 , 0, 0, 0.439 * this.earthVelocity, 0.01 ,null, textures.jupiter,0)
        this.saturn = new Planet('saturn' , 9.57 , 0, 0, 9.45 * this.earthRadius, 95.2 , 0, 0, 0.325 * this.earthVelocity, 0.01, null, textures.saturn,0)
        this.uranus = new Planet('uranus' , 19.17 , 0, 0, 4.01 * this.earthRadius, 14.5 , 0, 0, 0.228 * this.earthVelocity, 0.01, null, textures.uranus,0)
        this.neptune = new Planet('neptune' , 30.18 , 0, 0, 3.88 * this.earthRadius, 17.1 , 0, 0 , 0.182 * this.earthVelocity, 0.01, null, textures.neptune,0)

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
        planet.momentum = planet.momentum.clone().add(force.multiplyScalar(this.TIME_STEP))
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

                // if (planet.orbit.index <= 10000) {
                //     let index = planet.orbit.index;
                //     planet.orbit.line.geometry.attributes.position.array[index * 3] = planet.position.x * this.SCALE;
                //     planet.orbit.line.geometry.attributes.position.array[(index * 3) + 1] = planet.position.y * this.SCALE;
                //     planet.orbit.line.geometry.attributes.position.array[(index * 3) + 2] = planet.position.z * this.SCALE;
                //     planet.orbit.index++;
                //     if (planet.orbit.line.geometry.drawRange.count < planet.orbit.index)
                //         planet.orbit.line.geometry.setDrawRange(0, planet.orbit.index);
                //     planet.orbit.line.geometry.attributes.position.needsUpdate = true;
                // }

                // if (tempPlanet.orbit.index <= 10000) {
                //     let index = tempPlanet.orbit.index;
                //     tempPlanet.orbit.line.geometry.attributes.position.array[index * 3] = tempPlanet.position.x * this.SCALE;
                //     tempPlanet.orbit.line.geometry.attributes.position.array[(index * 3) + 1] = tempPlanet.position.y * this.SCALE;
                //     tempPlanet.orbit.line.geometry.attributes.position.array[(index * 3) + 2] = tempPlanet.position.z * this.SCALE;
                //     tempPlanet.orbit.index++;
                //     if (tempPlanet.orbit.line.geometry.drawRange.count < tempPlanet.orbit.index)
                //         tempPlanet.orbit.line.geometry.setDrawRange(0, tempPlanet.orbit.index);
                //     tempPlanet.orbit.line.geometry.attributes.position.needsUpdate = true;
                // }
            }
        })
    }
    positionUpdate(planet) {
        const speed = planet.momentum.clone().divideScalar(planet.mass)
        planet.position = planet.position.clone().add(speed.clone().multiplyScalar(this.TIME_STEP))
        planet.mesh.position.x = planet.position.x * this.SCALE
        planet.mesh.position.y = planet.position.y * this.SCALE
        planet.mesh.position.z = planet.position.z * this.SCALE

        if (planet.orbit.index <= 10000) {
            let index = planet.orbit.index;
            planet.orbit.line.geometry.attributes.position.array[index * 3] = planet.position.x * this.SCALE;
            planet.orbit.line.geometry.attributes.position.array[(index * 3) + 1] = planet.position.y * this.SCALE;
            planet.orbit.line.geometry.attributes.position.array[(index * 3) + 2] = planet.position.z * this.SCALE;
            planet.orbit.index++;
            if (planet.orbit.line.geometry.drawRange.count < planet.orbit.index)
                planet.orbit.line.geometry.setDrawRange(0, planet.orbit.index);
            planet.orbit.line.geometry.attributes.position.needsUpdate = true;
        }
    }
}
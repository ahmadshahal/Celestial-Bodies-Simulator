import * as THREE from 'three';
import Experience from "../Experience";
import Planet from './Planet.js';
import textures from '../Utils/TexturesLoader';

const earthMass = 5.97 * 10 ** 24
const radiusScale = 1/(696340*2) //sun radius
const earthRadius = 6378 * radiusScale
const earthVelocity = -1 * 29.8 * 1000

let instance = null

export default class World {
    constructor() {
        if(instance)
        {
            return instance
        }
        instance = this

        this.AU =  149.6e6 * 1000
        this.SCALE = 4 / this.AU
        this.TIME_STEP = 24*3600
        
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.scene.background = new THREE.Color(0x1c253c)

        this.sun = new Planet('sun' , 0, 0, 0, (109 * earthRadius), 1.98892 * 10 ** 30 , 0, 0, 0, 0.1, null ,textures.sun)


        this.mercury = new Planet('mercury' , 0.387 * this.AU, 0, 0, 0.383 * earthRadius, 0.0553 * earthMass, 0, 0, 1.59 * earthVelocity, 0.01, null, textures.mercury)
        this.venus = new Planet('venus' , 0.723* this.AU , 0, 0, 0.949 * earthRadius, 0.815 * earthMass, 0, 0, 1.18 * earthVelocity, 0.01,null, textures.venus)
        this.earth = new Planet('earth' , -1 * this.AU, 0, 0, earthRadius, earthMass , 0,  0, -1 * earthVelocity, 0.01, null, textures.earth)
        this.mars = new Planet('mars' ,1.52 * this.AU, 0, 0, 0.532 * earthRadius, 0.107 * earthMass, 0, 0, 0.808 * earthVelocity, 0.01, null, textures.mars)
        this.jupiter = new Planet('jupiter' , 5.2 * this.AU, 0, 0, 11.21 * earthRadius, 317.8 * earthMass, 0, 0, 0.439 * earthVelocity, 0.01 ,null, textures.jupiter)
        this.saturn = new Planet('saturn' , 9.57 * this.AU, 0, 0, 9.45 * earthRadius, 95.2 * earthMass, 0, 0, 0.325 * earthVelocity, 0.01, null, textures.saturn)
        this.uranus = new Planet('uranus' , 19.17 * this.AU, 0, 0, 4.01 * earthRadius, 14.5 * earthMass, 0, 0, 0.228 * earthVelocity, 0.01, null, textures.uranus)
        this.neptune = new Planet('neptune' , 30.18 * this.AU, 0, 0, 3.88 * earthRadius, 17.1*earthMass, 0, 0 , 0.182 * earthVelocity, 0.01, null, textures.neptune)

        this.planets = [
            this.sun,
            this.earth,
            this.venus,
            this.mars,
            this.jupiter,
            this.mercury,
            this.saturn,
            this.uranus,
            this.neptune
        ]

        this.scene.add(
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
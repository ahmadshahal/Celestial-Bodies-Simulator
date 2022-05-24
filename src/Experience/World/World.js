import * as THREE from 'three'
import Experience from "../Experience"
import PathPoint from './PathPoint'
import Planet from './Planet.js'

export default class World {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.scene.background = new THREE.Color(0xB4B4B4)

        this.sun = new Planet(0, 0, 0, 0.5, 0xFFFFFF, 100000, 0, 0, 0)

        this.mars = new Planet(2, 0, 0, 0.1, 0xFFFFFF, 1, 0, 0, 50)
        this.venus = new Planet(0, 2, 0, 0.1, 0xFFFFFF, 1, 50, 0, 0)
        this.earth = new Planet(0, 0, 2, 0.1, 0xFFFFFF, 1, 0, 50, 0)

        this.jupiter = new Planet(3, 0, 0, 0.1, 0xFFFFFF, 1, 0, 0, 50)
        this.uranus = new Planet(0, 3, 0, 0.1, 0xFFFFFF, 1, 50, 0, 0)
        this.neptune = new Planet(0, 0, 3, 0.1, 0xFFFFFF, 1, 0, 50, 0)


        this.planets = [
            this.sun,
            this.earth,
            this.venus,
            this.mars,
            this.jupiter,
            this.uranus,
            this.neptune
        ]

        this.scene.add(
            this.sun.mesh,
            this.earth.mesh,
            this.mars.mesh,
            this.venus.mesh,
            this.jupiter.mesh,
            this.uranus.mesh,
            this.neptune.mesh
        )

        this.scene.add(
            this.sun.orbit.line,
            this.earth.orbit.line,
            this.mars.orbit.line,
            this.venus.orbit.line,
            this.jupiter.orbit.line,
            this.uranus.orbit.line,
            this.neptune.orbit.line
        )

        this.TIME_STEP = 0.0001
    }
    update() {
        this.planets.forEach((planet) => {
            this.gravitationalForceUpdate(planet)
            this.collisionUpdate(planet)
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
                const speed = planet.momentum.clone().divideScalar(planet.mass)
                planet.position = planet.position.clone().add(speed.clone().multiplyScalar(this.TIME_STEP))
                planet.mesh.position.x = planet.position.x
                planet.mesh.position.y = planet.position.y
                planet.mesh.position.z = planet.position.z

                const tempPlanetSpeed = tempPlanet.momentum.clone().divideScalar(tempPlanet.mass)
                tempPlanet.position = tempPlanet.position.clone().add(tempPlanetSpeed.clone().multiplyScalar(this.TIME_STEP))
                tempPlanet.mesh.position.x = tempPlanet.position.x
                tempPlanet.mesh.position.y = tempPlanet.position.y
                tempPlanet.mesh.position.z = tempPlanet.position.z

                if (planet.orbit.index <= 10000) {
                    let index = planet.orbit.index;
                    planet.orbit.line.geometry.attributes.position.array[index * 3] = planet.position.x;
                    planet.orbit.line.geometry.attributes.position.array[(index * 3) + 1] = planet.position.y;
                    planet.orbit.line.geometry.attributes.position.array[(index * 3) + 2] = planet.position.z;
                    planet.orbit.index++;
                    if (planet.orbit.line.geometry.drawRange.count < planet.orbit.index)
                        planet.orbit.line.geometry.setDrawRange(0, planet.orbit.index);
                    planet.orbit.line.geometry.attributes.position.needsUpdate = true;
                }

                if (tempPlanet.orbit.index <= 10000) {
                    let index = tempPlanet.orbit.index;
                    tempPlanet.orbit.line.geometry.attributes.position.array[index * 3] = tempPlanet.position.x;
                    tempPlanet.orbit.line.geometry.attributes.position.array[(index * 3) + 1] = tempPlanet.position.y;
                    tempPlanet.orbit.line.geometry.attributes.position.array[(index * 3) + 2] = tempPlanet.position.z;
                    tempPlanet.orbit.index++;
                    if (tempPlanet.orbit.line.geometry.drawRange.count < tempPlanet.orbit.index)
                        tempPlanet.orbit.line.geometry.setDrawRange(0, tempPlanet.orbit.index);
                    tempPlanet.orbit.line.geometry.attributes.position.needsUpdate = true;
                }
            }
        })
    }
}
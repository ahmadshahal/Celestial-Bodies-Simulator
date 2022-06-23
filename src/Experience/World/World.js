import * as THREE from 'three';
import Experience from "../Experience";
import Planet , {earthConstants} from './Planet.js';
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
        this.scene.background = new THREE.Color('#00001a');
        
        // Scene Light
        this.sceneLight = new THREE.AmbientLight(0xb9b5ff, 0.12)

        
        // sun
        this.sun = new Planet('Sun' , 0 , 0 , 0 , 109 , 333152.42 , 0 , 0 , 0 , 1/27 , '#ff9800' , textures.sun , 0 , false , null);

        // planet
        this.mercury = new Planet('Mercury' , 0.387 , 0 , 0 , 0.383 , 0.0553 , 0 , 0 , 1.59 , 1/58.8 , '#7973dc' , textures.mercury , 1 , false , null);
        this.venus = new Planet('Venus' , 0.723 , 0 , 0 , 0.949 , 0.815 , 0 , 0 , 1.18 , 1/-244 , '#d67a19' , textures.venus , 1 , false , null);
        this.earth = new Planet('Earth' , 1 , 0 , 0 , 1 , 1 , 0 , 0 , 1 , 1 , '#5592c6' , textures.earth , 1 , false , null);
        this.mars = new Planet('Mars' , 1.52 , 0 , 0 , 0.532  , 0.107 , 0 , 0 , 0.808 , 1/1.03 , '#3adede' , textures.mars , 1 , false , null);
        this.jupiter = new Planet('Jupiter' , 5.20 , 0 , 0 , 11.21 , 317.8 , 0 , 0 , 0.439 , 1/0.415 , '#e96a76' , textures.jupiter , 2 , false , null);
        this.saturn = new Planet('Saturn' , 9.57 , 0 , 0 , 9.45 , 95.2 , 0 , 0 , 0.325 , 1/0.445 , '#eba357' , textures.saturn , 2 , true , textures.saturnRing);
        this.uranus = new Planet('Uranus' , 19.17 , 0 , 0 , 4.01 , 14.5 , 0 , 0 , 0.228 , 1/-0.720 , '#89ebff' , textures.uranus , 2 , false , null);
        this.neptune = new Planet('Neptune' , 30.18 , 0 , 0 , 3.88 , 17.1 , 0 , 0 , 0.182 , 1/0.673 , '#b7d0ff' , textures.neptune , 2 , false , null);
        this.pluto = new Planet('Pluto' , 39.48 , 0 , 0 , 0.187 , 0.0022 , 0 , 0 , 0.157 , 1/6.41 , '#ff9469' , textures.pluto , 1 , false , null);
        
        this.planets = [
            this.sun,
            this.mercury,
            this.venus,
            this.earth,
            this.mars,
            this.jupiter,
            this.saturn,
            this.uranus,
            this.neptune,
            this.pluto
        ]
        
        this.deleteList = [];

        this.scene.add(
            this.sceneLight,
            this.sun.mesh,
            this.mercury.mesh,
            this.venus.mesh,
            this.earth.mesh,
            this.mars.mesh,
            this.jupiter.mesh,
            this.saturn.mesh,
            this.uranus.mesh,
            this.neptune.mesh,
            this.pluto.mesh,
        )

        this.scene.add(
            this.sun.orbit.line,
            this.mercury.orbit.line,
            this.venus.orbit.line,
            this.earth.orbit.line,
            this.mars.orbit.line,
            this.jupiter.orbit.line,
            this.saturn.orbit.line,
            this.uranus.orbit.line,
            this.neptune.orbit.line,
            this.pluto.orbit.line,
        )
        
        this.planets.forEach(planet => {
            this.experience.controlPanel.editPlanet(planet);
            this.experience.informationPanel.panel(planet);
        });
    }
    
    update() {
        this.planets.forEach((planet) => {
            this.gravitationalForceUpdate(planet)
            this.collisionUpdate(planet)
            this.positionUpdate(planet)
            planet.rotate()
        })
        this.deleteList.forEach((planet) => {
            this.experience.controlPanel.deletePlanet(planet);
        })
        this.deleteList = []
    }

    gravitationalForceUpdate(planet) {
        const force = new THREE.Vector3(0, 0, 0)
        this.planets.forEach((tempPlanet) => {
            if (tempPlanet != planet) {
                force.add(tempPlanet.gravitationalForce(planet))
            }
        })
        planet.momentum = planet.momentum.clone().add(force.multiplyScalar(earthConstants.TIME_STEP));
        planet.forceVector.setDirection(force);
    }

    collisionUpdate(planet) {
        this.planets.forEach((tempPlanet) => {
            if (planet != tempPlanet) {
                if (planet.areCollided(tempPlanet)) {

                    
                    const n = planet.position.clone().sub(tempPlanet.position.clone())
                    const un = n.clone().divideScalar(n.length())
                    let ut = new THREE.Vector3(-un.y, un.x, un.z)

                    const temp = un.clone().cross(ut);
                    ut = temp.clone();

                    const tempPlanetVN = un.clone().dot(tempPlanet.getVelocity().clone())
                    const tempPlanetVT = ut.clone().dot(tempPlanet.getVelocity().clone())
                    const planetVN = un.clone().dot(planet.getVelocity().clone())
                    const planetVT = ut.clone().dot(planet.getVelocity().clone())

                    const newTempPlanetVN = (tempPlanetVN * tempPlanet.mass + planetVN * planet.mass + planet.mass * (planetVN - tempPlanetVN) * earthConstants.COR) / (planet.mass + tempPlanet.mass)
                    const newPlanetVN = (planetVN * planet.mass + tempPlanetVN * tempPlanet.mass + tempPlanet.mass * (tempPlanetVN - planetVN) * earthConstants.COR) / (planet.mass + tempPlanet.mass)

                    const finalTempPlanetVN = un.clone().multiplyScalar(newTempPlanetVN)
                    const finalTempPlanetVT = ut.clone().multiplyScalar(tempPlanetVT)
                    const finalPlanetVN = un.clone().multiplyScalar(newPlanetVN)
                    const finalPlanetVT = ut.clone().multiplyScalar(planetVT)

                    const newTempPlanetVelocity = finalTempPlanetVN.add(finalTempPlanetVT.clone())
                    const newPlanetVelocity = finalPlanetVN.add(finalPlanetVT.clone())
                    
                    tempPlanet.momentum = newTempPlanetVelocity.multiplyScalar(tempPlanet.mass)
                    planet.momentum = newPlanetVelocity.multiplyScalar(planet.mass)
                    
                    if(planet.type === 0 && tempPlanet.type !== 0){
                        this.deleteList.push(tempPlanet);
                    }

                }
            }
        })
    }

    positionUpdate(planet) {
        const speed = planet.momentum.clone().divideScalar(planet.mass)
        planet.position = planet.position.clone().add(speed.clone().multiplyScalar(earthConstants.TIME_STEP))
        planet.mesh.position.x = planet.position.x * earthConstants.SCALE;
        planet.mesh.position.y = planet.position.y * earthConstants.SCALE;
        planet.mesh.position.z = planet.position.z * earthConstants.SCALE;

        planet.speedVector.position.set(planet.mesh.position.x , planet.mesh.position.y , planet.mesh.position.z);
        planet.speedVector.setDirection(planet.getVelocity());
        planet.forceVector.position.set(planet.mesh.position.x , planet.mesh.position.y , planet.mesh.position.z);

        planet.velocityLength = planet.getVelocity().length();

        if(planet.nameMesh !== undefined  &&  planet.nameMesh  != null){
            planet.nameMesh.position.x = planet.mesh.position.x;
            planet.nameMesh.position.z = planet.mesh.position.z;
            planet.nameMesh.lookAt(this.experience.camera.instance.position);
        }
        if(planet.type === 0)
            planet.starLight.position.set(planet.mesh.position.x , planet.mesh.position.y , planet.mesh.position.z);
        if(planet.ring)
            planet.planetRings.position.set(planet.mesh.position.x , planet.mesh.position.y , planet.mesh.position.z);
        this.drawPlanetOrbit(planet);
    }

    drawPlanetOrbit(planet){
        let index = planet.orbit.pointCount;
        if(index === 10000){
            for(let i = 3; i < 30000; i++){
                planet.orbit.line.geometry.attributes.position.array[i-3] = planet.orbit.line.geometry.attributes.position.array[i];
            }
            index--;
            planet.orbit.pointCount--;
        }
        planet.orbit.line.geometry.attributes.position.array[index * 3] = planet.position.x * earthConstants.SCALE;
        planet.orbit.line.geometry.attributes.position.array[(index * 3) + 1] = planet.position.y * earthConstants.SCALE;
        planet.orbit.line.geometry.attributes.position.array[(index * 3) + 2] = planet.position.z * earthConstants.SCALE;
        planet.orbit.pointCount++;
        planet.orbit.line.geometry.setDrawRange(0 , planet.orbit.pointCount);
        planet.orbit.line.geometry.attributes.position.needsUpdate = true;
    }
}
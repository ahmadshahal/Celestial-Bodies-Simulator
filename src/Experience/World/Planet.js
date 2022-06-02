import * as THREE from 'three'
import PathPoint from './PathPoint'
import Experience from "../Experience";
import World from './World'

export default class Planet {
    constructor(name, x, y, z, radius, mass, xV, yV, zV, rotationalSpeed, color,texture , star) {
        this.name = name;
        this.world = new World()
        this.position = new THREE.Vector3(x, y, z)
        this.radius = radius
        this.mass = mass
        this.color = color
        this.momentum = new THREE.Vector3(xV * mass, yV * mass, zV *mass)
        this.rotationalSpeed = rotationalSpeed
        this.orbit = new PathPoint(x * this.world.SCALE, y * this.world.SCALE, z * this.world.SCALE);
        if(star) {
            this.material = new THREE.MeshBasicMaterial();
            this.starLight = new THREE.PointLight(0xffffff , 1 , 0);
            this.starLight.position.set(x,y,z);

            // Shadow of the light
            this.starLight.castShadow = true;
            console.log(this.starLight.shadow);
            this.starLight.shadow.mapSize.width = 1024;
            this.starLight.shadow.mapSize.height = 1024;
            this.starLight.shadow.camera.top = 10
            this.starLight.shadow.camera.right = 10
            this.starLight.shadow.camera.bottom = -10
            this.starLight.shadow.camera.left = -10
            // this.starLight.shadow.radius = 20
            this.starLight.shadow.blurSamples = 0;

            this.experience = new Experience();
            this.scene = this.experience.scene;
            this.scene.add(this.starLight);
        }
        else {
            this.material = new THREE.MeshStandardMaterial();
        }
        
        if(texture !== null) this.material.map = texture;
        if(color !== null) this.material.color = new THREE.Color(this.color);
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius, 32, 32),
            this.material
        )
        // Shadow 
        if(!star){
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
        }

        this.mesh.position.x = this.position.x * this.world.SCALE
        this.mesh.position.y = this.position.y * this.world.SCALE
        this.mesh.position.z = this.position.z * this.world.SCALE
    }

    getVelocity() {
        return this.momentum.clone().divideScalar(this.mass)
    }

    rotate(){
        this.mesh.rotation.y += this.rotationalSpeed
    }

    gravitationalForce(planet) {
        const G = 6.67428e-11
        // const G = 1
        const posVec = planet.position 
        const r_vec = posVec.clone().sub(this.position)
        const r_mag = r_vec.length()
        const r_hat = r_vec.divideScalar(r_mag)
        const force = r_hat.multiplyScalar(-1 * G * this.mass * planet.mass / (r_mag * r_mag))
        return force
    }

    areCollided(planet1) {
        return this.position.distanceTo(planet1.position) <= this.radius + planet1.radius
    }
}
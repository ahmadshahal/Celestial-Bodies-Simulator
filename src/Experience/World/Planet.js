import * as THREE from 'three'
import PathPoint from './PathPoint'

export default class Planet {
    constructor(x, y, z, radius, color, mass, xM, yM, zM) {
        this.position = new THREE.Vector3(x, y, z)
        this.radius = radius
        this.mass = mass
        this.color = color
        this.momentum = new THREE.Vector3(xM, yM, zM)
        this.orbit = new PathPoint(x , y , z);
        this.mesh = new THREE.Mesh(
            new THREE.SphereGeometry(this.radius, 32, 32),
            new THREE.MeshBasicMaterial({ color: this.color })
        )
        this.mesh.position.x = this.position.x
        this.mesh.position.y = this.position.y
        this.mesh.position.z = this.position.z
    }

    getVelocity() {
        return this.momentum.clone().divideScalar(this.mass)
    }


    gravitationalForce(planet) {
        const G = 1
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
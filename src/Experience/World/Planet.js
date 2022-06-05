import * as THREE from 'three'
import PathPoint from './PathPoint'
import Experience from "../Experience";

export const earthConstants = {
    AU : 149.6e6 * 1000,
    SCALE : 200 / (149.6e6 * 1000), // AU value    // change from 10 to 200;    
    TIME_STEP : 2000, /// change from 24 * 60 * 60 to 2000
    earthMass : 5.97 * 10 ** 24,
    radiusScale : 1/(6378 * 2),
    earthRadius : 6378 * (1/(6378 * 2)), // radiusScale
    earthVelocity : -1 * 29.8 * 1000,
}

export default class Planet {
    constructor(name, x, y, z, radius, mass, xV, yV, zV, rotationalSpeed, color,texture , star , ring , ringTexture) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.name = name;
        x *= earthConstants.AU; y *= earthConstants.AU; z *= earthConstants.AU;
        this.position = new THREE.Vector3(x, y, z);
        this.radius = radius * earthConstants.earthRadius;
        this.mass = mass * earthConstants.earthMass; 
        this.momentum = new THREE.Vector3(xV * this.mass, yV * this.mass, zV * this.mass * earthConstants.earthVelocity);
        this.rotationalSpeed = rotationalSpeed
        this.orbit = new PathPoint(x * earthConstants.SCALE, y * earthConstants.SCALE, z * earthConstants.SCALE);
        this.star = star;
        this.ring = ring;

        if(star) {
            this.material = new THREE.MeshBasicMaterial();
            this.starLight = new THREE.PointLight(0xffffff , 1 , 11000);
            this.starLight.position.set(x * earthConstants.SCALE, y * earthConstants.SCALE, z * earthConstants.SCALE);

            // Shadow of the light
            this.starLight.castShadow = true;
            this.starLight.shadow.mapSize.width = 1024;
            this.starLight.shadow.mapSize.height = 1024;
            this.starLight.shadow.camera.top = 10
            this.starLight.shadow.camera.right = 10
            this.starLight.shadow.camera.bottom = -10
            this.starLight.shadow.camera.left = -10
            // this.starLight.shadow.radius = 20
            // this.starLight.shadow.blurSamples = 0;

            this.scene.add(this.starLight);
        }
        else {
            this.material = new THREE.MeshStandardMaterial();
        }

        if(texture !== null) this.material.map = texture;
        if(color !== null) this.material.color = new THREE.Color(color);

        this.mesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(this.radius, 32, 32),
            this.material
        )

        // Shadow 
        if(!star){
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
        }

        //ring
        if(ring){
            const ringGeometry = new THREE.RingBufferGeometry(7 , 11 , 64);
            let pos = ringGeometry.attributes.position;
            let v3 = new THREE.Vector3();
            for (let i = 0; i < pos.count; i++){
                v3.fromBufferAttribute(pos, i);
                ringGeometry.attributes.uv.setXY(i, v3.length() < 9 ? 0 : 1, 1);
            }
            this.planetRings = new THREE.Mesh(
                ringGeometry,
                new THREE.MeshStandardMaterial({map: ringTexture , side : THREE.BackSide})
            );
            this.planetRings.receiveShadow = true;
            this.planetRings.rotateX(Math.PI / 1.9);
            this.planetRings.rotateY(0.4);
            this.planetRings.position.set(x * earthConstants.SCALE , y * earthConstants.SCALE , z * earthConstants.SCALE);
            this.scene.add( this.planetRings );
        }

        this.mesh.position.x = this.position.x * earthConstants.SCALE
        this.mesh.position.y = this.position.y * earthConstants.SCALE
        this.mesh.position.z = this.position.z * earthConstants.SCALE
    }

    getVelocity() {
        return this.momentum.clone().divideScalar(this.mass)
    }

    rotate(){
        this.mesh.rotation.y += this.rotationalSpeed;
        if(this.ring) this.planetRings.rotation.z+= 0.001;
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
        // return this.position.distanceTo(planet1.position) <= this.radius + planet1.radius
        return this.mesh.position.distanceTo(planet1.mesh.position) <= this.radius + planet1.radius
    }
}
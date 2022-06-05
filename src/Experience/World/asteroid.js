import * as THREE from 'three'
import Experience from "../Experience";
import World from './World'
import Planet , {earthConstants} from './Planet'

export default class asteroid{
    constructor(name, x , y , z , radius , mass , xV , yV , zV , color , texture , alpha , hight , normal , roughness){
        this.name = name;
        this.world = new World()
        this.planet = new Planet()
        x *= earthConstants.AU; y *= earthConstants.AU; z *= earthConstants.AU;
        this.position = new THREE.Vector3(x, y, z);
        this.radius = radius * earthConstants.earthRadius;
        this.mass = mass * earthConstants.earthMass; 
        this.momentum = new THREE.Vector3(xV * this.mass, yV * this.mass, zV * this.mass * earthConstants.earthVelocity);
        this.color = color

        this.material = new THREE.MeshStandardMaterial();

        if(texture !== null){
            this.material.map = texture;
            this.transparent = true
            this.alphaMap = alpha
            this.displacementMap = hight
            this.displacementScale= 1
            this.normalMap = normal
            this.roughnessMap = roughness
        }

        if(color !== null) this.material.color = new THREE.Color(this.color);

        this.mesh = new THREE.Mesh(
            new THREE.DodecahedronBufferGeometry(this.radius),
            this.material
        )
        //shadow
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.mesh.position.x = this.position.x * earthConstants.SCALE
        this.mesh.position.y = this.position.y * earthConstants.SCALE
        this.mesh.position.z = this.position.z * earthConstants.SCALE

        this.experience = new Experience()
        this.experience.scene.add(this.mesh);
    }
}
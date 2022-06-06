import * as THREE from 'three'
import Experience from "../Experience";
import textures from '../Utils/TexturesLoader';

class Particle {
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene

        // particles number & position
        this.count = 50000
        this.particlesGeometry = new THREE.BufferGeometry()
        this.positions = new Float32Array(this.count * 3)
        for (let i = 0; i < (this.count * 3); i++) {
            this.positions[i] = ((Math.random() - 0.5) * 50000);
            this.positions[i] <=0 ? this.positions[i]-=80 : this.positions[i]+=80;
        }
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
        this.particlesMaterial = new THREE.PointsMaterial()

        // size & properties
        this.particlesMaterial.size = 30
        this.particlesMaterial.sizeAttenuation = true
        this.particlesMaterial.transparent = true
        this.particlesMaterial.alphaMap = textures.particle;
        this.particlesMaterial.alphaTest = 0.01
        this.particlesMaterial.depthTest = true
        this.particlesMaterial.depthWrite = false
        this.particlesMaterial.blending = THREE.AdditiveBlending
        this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)

        this.scene.add(this.particles);
    }
}

export default Particle
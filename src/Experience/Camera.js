import * as THREE from 'three'
import Experience from './Experience.js'
import Renderer from './Renderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';


export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas

        this.setInstance()
        this.setControls('Fly Controls');
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.instance.position.set(0, 0, 4)
        this.scene.add(this.instance)
    }

    setControls(cur)
    {
        // orbit control
        if(cur === 'Orbit Controls'){
            this.controls.dispose();
            this.controls = new OrbitControls(this.instance, this.canvas) ;
            this.controls.enableDamping = true;
        }

        // fly control
        else if(cur === 'Fly Controls'){
            if(this.controls !== undefined) this.controls.dispose();
            this.controls = new FlyControls( this.instance, this.canvas );
            this.controls.movementSpeed = 0.1;
            this.controls.rollSpeed = 0.01;
            this.controls.autoForward = false;
            this.controls.dragToLook = false;
            this.controls.dragToLook = true;
        }
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        this.controls.update(0.5);
    }
}
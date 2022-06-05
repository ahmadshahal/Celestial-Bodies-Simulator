import * as THREE from 'three'
import Experience from '../Experience';

class Axes{
    constructor() {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.mainAxes = new THREE.AxesHelper(100);
        this.mainAxes.visible = false;
        this.scene.add(this.mainAxes);
    }
}

export default Axes;
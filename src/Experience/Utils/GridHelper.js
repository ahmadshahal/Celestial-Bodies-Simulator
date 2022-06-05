import * as THREE from 'three';
import Experience from '../Experience';

class GridHelper{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.mainGridHelper = new THREE.GridHelper( 16000 , 500 , '#FF0000');
        this.mainGridHelper.visible = false;
        this.scene.add( this.mainGridHelper );
    }
}

export default GridHelper;
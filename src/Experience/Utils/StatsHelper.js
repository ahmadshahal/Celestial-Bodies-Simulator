import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module'
import Experience from '../Experience';

class StatsHelper{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.stats = Stats();
        this.stats.dom.hidden = true;
        this.stats.dom.style.marginTop = '25px';
        document.body.appendChild(this.stats.dom);
    }
}

export default StatsHelper;
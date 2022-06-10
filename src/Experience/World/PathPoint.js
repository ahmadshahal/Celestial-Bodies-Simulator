import * as THREE from 'three'

export default class PathPoint {
    constructor(x , y , z){
        const positions = new Float32Array(10000 * 3);
        positions[0] = x; positions[1] = y; positions[2] = z;
        positions[3] = x; positions[4] = y; positions[5] = z;
        const geometry = new THREE.BufferGeometry().setAttribute('position' , new THREE.BufferAttribute(positions , 3));
        const material = new THREE.LineBasicMaterial({ color: '#777777' , linewidth: 0.3 });
        geometry.setDrawRange(0 , 2);
        this.pointCount = 2;
        this.line = new THREE.Line(geometry , material);
    }
}

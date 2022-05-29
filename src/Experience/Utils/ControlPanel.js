import { guify } from 'guify';
import Experience from "../Experience";
import Planet from '../World/Planet';

class ControlPanel{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.gui = new guify({
            title: "Control Panel",
            theme: 'light',
            width: '350px',
            align: 'right',
            panelOverflowBehavior: 'scroll'
        });
        this.tempPlanet = {
            name: '',
            x : 0, y : 0, z : 0,
            radius: 1,
            color: '#FFFFFF',
            mass: 1, 
            xM: 0, yM: 0, zM: 0,
        };
        this.gui.Register([
            {type: 'folder' , label: 'Planets'},
            {type: 'folder' , label: 'Add Planet'},
            {type: 'folder' , label: 'Delete Planet'},
            {
                type: 'text' , label: 'Planet name:' , folder: 'Add Planet',
                object: this.tempPlanet , property: 'name',
            },
            {
                type: 'range' , label: 'X axis:' , folder: 'Add Planet',
                min: -100 , max: 100 , step: 1, scale: 'linear',
                object: this.tempPlanet , property : 'x',
            },
            {
                type: 'range' , label: 'Y axis:' , folder: 'Add Planet',
                min: -100 , max: 100 , step: 1, scale: 'linear',
                object: this.tempPlanet , property : 'y',
            },
            {
                type: 'range' , label: 'Z axis:' , folder: 'Add Planet',
                min: -100 , max: 100 , step: 1, scale: 'linear',
                object: this.tempPlanet , property : 'y',
            },
            {
                type: 'range' , label: 'Radius' , folder: 'Add Planet',
                min: 1 , max: 100 , step: 1, scale: 'linear',
                object: this.tempPlanet , property : 'radius',
            },
            {
                type: 'color' , label: 'Color' , folder: 'Add Planet',
                format: 'hex' , object: this.tempPlanet , property: 'color',
            },
            {
                type: 'range' , label: 'Mass(kg)' , folder: 'Add Planet',
                object: this.tempPlanet , property: 'mass',
                min: 1 , max: 1e30 , step: 1000 , scale: 'linear',
            },
            {
                type: 'range' , label: 'X momentum' , folder: 'Add Planet',
                min: 1 , max: 1000 , step: 1, scale: 'linear',
                object: this.tempPlanet , property : 'xM',
            },
            {
                type: 'range' , label: 'Y momentum' , folder: 'Add Planet',
                min: 1 , max: 1000 , step: 1, scale: 'linear',
                object: this.tempPlanet , property : 'yM',
            },
            {
                type: 'range' , label: 'Z momentum' , folder: 'Add Planet',
                min: 1 , max: 1000 , step: 1, scale: 'linear',
                object: this.tempPlanet , property : 'zM',
            },
            {
                type: 'button' , label: 'Add Planet' , folder: 'Add Planet',
                action: (value) => {
                    const planets = this.experience.world.planets;
                    let f = true;
                    if(this.tempPlanet.name === ''){
                        this.gui.Toast('Please insert name for the planet');
                        return;
                    }
                    planets.forEach(e => {
                        if(e.name.toLowerCase() === this.tempPlanet.name.toLowerCase()){
                            this.gui.Toast('Planet name is already exist');
                            f = false;
                        }
                    });
                    if(f === false) return;
                    const newPlanet = new Planet(this.tempPlanet.name , this.tempPlanet.x , this.tempPlanet.y, this.tempPlanet.z,
                                                this.tempPlanet.radius , this.tempPlanet.color , this.tempPlanet.mass, 
                                                this.tempPlanet.xM, this.tempPlanet.yM , this.tempPlanet.zM);
                    planets.forEach(e => {
                        if(newPlanet.areCollided(e)){
                            this.gui.Toast('Planet can not be added in this coordinates');
                            f = false;
                        }
                    }); 
                    if(f === false) return;
                    planets.push(newPlanet);
                    this.scene.add(newPlanet.mesh , newPlanet.orbit.line);
                    this.editPlanet(newPlanet);
                    this.deletePlanet(newPlanet);
                }
            }
        ]);
    }

    editPlanet(planet) {
        console.log(planet.mesh);
        this.gui.Register([
            {type: 'folder' , label: planet.name , folder: 'Planets'},
            {
                type: 'checkbox' , label: 'Visible' , folder: planet.name,
                object: planet.mesh , property: 'visible',
            },
            {
                type: 'checkbox' , label: 'wireframe' , folder: planet.name,
                object: planet.mesh.material , property: 'wireframe',
            },
            {
                type: 'color' , label: 'Color' , folder: planet.name,
                initial: planet.mesh.material.color.getHexString(), format : 'hex',
                onChange: (value) => { planet.mesh.material.color.set(value)}
            },
            {
                type: 'range' , label: 'Mass(kg)' , folder: planet.name,
                min: 1, max: 1e30, step: 1000 , scale: 'linear',    
                object: planet , property: 'mass'
            },
        ]);
    }

    deletePlanet(planet){
        this.gui.Register([
            {
                type: 'button' , label: `Delete ${planet.name}` , folder: 'Delete Planet',
                action: () => {
                    const planets = this.experience.world.planets;
                    const index = planets.indexOf(planet);
                    planets.splice(index , 1);
                    planet.mesh.removeFromParent();
                    planet.orbit.line.removeFromParent();
                    this.gui.loadedComponents.forEach(e => {
                        if(e.opts.label === `Delete ${planet.name}` || e.opts.label === planet.name){   
                            this.gui.Remove(e);
                        }
                    });
                } 
            }
        ]);
    }
}

export default ControlPanel;
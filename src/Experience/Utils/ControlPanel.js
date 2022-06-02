import { guify } from 'guify';
import Experience from "../Experience";
import Planet from '../World/Planet';

const earthMass = 5.97 * 10 ** 24
const AU =  149.6e6 * 1000
const SCALE = 5 / AU
const earthVelocity = -1 * 29.8 * 1000

class ControlPanel{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;

        // create template to the added planet
        this.tempPlanet = {
            name: '',
            x : 0, y : 0, z : 0,
            radius: 0.5,
            color: '#FFFFFF',
            mass: 1, 
            xV: 0, yV: 0, zV: earthVelocity,
            rotationSpeed : 0
        };

        // initial the panel
        this.initialization();

        // fill the add folder
        this.addPlanet();

        // fill the time step folder
        setTimeout(() => this.editTimeStep() , 500);

        // fill axes folder
        this.editAxes();
    }

    initialization(){
        // create the main control panel
        this.gui = new guify({
            title: "Control Panel",
            theme: 'dark',
            width: '350px',
            align: 'right',
            panelOverflowBehavior: 'scroll'
        });

        // create the main folders
        this.gui.Register([
            {type: 'folder' , label: 'Planets'},
            {type: 'folder' , label: 'Add Planet'},
            {type: 'folder' , label: 'Delete Planet'},
            {type: 'folder' , label: 'Time Step'},
            {type: 'folder' , label: 'Axes'}
        ]);
    }

    addPlanet(){
        this.gui.Register([
            {
                type: 'text' , label: 'Planet name:' , folder: 'Add Planet',
                object: this.tempPlanet , property: 'name',
            },
            {
                type: 'range' , label: 'X axis:' , folder: 'Add Planet',
                min: -100 , max: 100 , step: 0.001, scale: 'linear',
                object: this.tempPlanet , property : 'x',
            },
            {
                type: 'range' , label: 'Y axis:' , folder: 'Add Planet',
                min: -100 , max: 100 , step: 0.001, scale: 'linear',
                object: this.tempPlanet , property : 'y',
            },
            {
                type: 'range' , label: 'Z axis:' , folder: 'Add Planet',
                min: -100 , max: 100 , step: 0.001, scale: 'linear',
                object: this.tempPlanet , property : 'y',
            },
            {
                type: 'range' , label: 'Radius' , folder: 'Add Planet',
                min: 0.001 , max: 2 , step: 0.01, scale: 'linear',
                object: this.tempPlanet , property : 'radius',
            },
            {
                type: 'color' , label: 'Color' , folder: 'Add Planet',
                format: 'hex' , object: this.tempPlanet , property: 'color',
            },
            {
                type: 'range' , label: 'Mass(kg)' , folder: 'Add Planet',
                object: this.tempPlanet , property: 'mass',
                min: 0 , max: 1e7 , step: 0.00001 , scale: 'linear',
            },
            {
                type: 'range' , label: 'X velocity' , folder: 'Add Planet',
                min: -1e7 , max: 1e7 , step: 0.1, scale: 'linear',
                object: this.tempPlanet , property : 'xV',
            },
            {
                type: 'range' , label: 'Y velocity' , folder: 'Add Planet',
                min: -1e7 , max: 1e7 , step: 0.1, scale: 'linear',
                object: this.tempPlanet , property : 'yV',
            },
            {
                type: 'range' , label: 'Z velocity' , folder: 'Add Planet',
                min: -1e7 , max: 1e7 , step: 0.1, scale: 'linear',
                object: this.tempPlanet , property : 'zV',
            },
            {
                type: 'range' , label: 'Rotation speed' , folder: 'Add Planet',
                min: 0 , max: 1 , step: 0.001 , scale: 'linear',
                object: this.tempPlanet , property: 'rotationSpeed'
            },  
            {
                type: 'button' , label: 'Add Planet' , folder: 'Add Planet',
                action: (value) => {
                    const planets = this.experience.world.planets;
                    console.log(planets);
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
                                                this.tempPlanet.radius , this.tempPlanet.mass , this.tempPlanet.xV ,
                                                this.tempPlanet.yV , this.tempPlanet.zV , this.tempPlanet.rotationSpeed,
                                                this.tempPlanet.color , null);
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
                min: 1e15, max: 4e30, step: 1000 , scale: 'linear',    
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

    editTimeStep(){
        const world = this.experience.world;
        const TIME_STEP = world.TIME_STEP
        this.gui.Register([
            {
                type: 'range' , label: 'Time step' , folder: 'Time Step',
                min: 0 , max: TIME_STEP * 3 , step: 60 , scale: 'linear' , precision: 4,
                object: world , property: 'TIME_STEP',
            },
            {
                type: 'button' , label: 'Reset time step' , folder: 'Time Step',
                action: () => world.TIME_STEP = TIME_STEP,
            }
        ]);
    }

    editAxes(){
        const mainAxes = this.experience.axes.mainAxes;
        this.gui.Register([
            {
                type: 'checkbox' , label: 'visible' , folder: 'Axes',
                object: mainAxes , property: 'visible',
            }
        ]);
    }
}

export default ControlPanel;
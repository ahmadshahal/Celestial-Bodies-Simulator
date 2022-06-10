import { guify } from 'guify';
import Experience from "../Experience";
import Planet , {earthConstants} from '../World/Planet';

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
            xV: 0, yV: 0, zV: 1,
            rotationSpeed : 0,
            star : false
        };

        // initial the panel
        this.initialization();

        // fill the add folder
        this.addPlanet();

        // fill the time step folder
        this.editConstants();

        // fill Helper folder
        this.editHelper();

        // fill the controllers folder
        this.editControllers();

        //add reset world button
        this.resetWorld();
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
            {type: 'folder' , label: 'Constants'},
            {type: 'folder' , label: 'Helpers'},
            {type: 'folder' , label: 'Controllers'}
        ]);
    }

    addPlanet(){
        this.gui.Register([
            {
                type: 'text' , label: 'Warning' , folder: 'Add Planet',
                initial: 'All value on earth scale!!!' , enabled: false,
            },
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
                object: this.tempPlanet , property : 'z',
            },
            {
                type: 'range' , label: 'Radius' , folder: 'Add Planet',
                min: 0.001 , max: 10 , step: 0.01, scale: 'linear',
                object: this.tempPlanet , property : 'radius',
            },
            {
                type: 'color' , label: 'Color' , folder: 'Add Planet',
                format: 'hex' , object: this.tempPlanet , property: 'color',
            },
            {
                type: 'range' , label: 'Mass' , folder: 'Add Planet',
                object: this.tempPlanet , property: 'mass',
                min: 0.00001 , max: 1e7 , step: 0.00001 , scale: 'linear',
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
                type: 'checkbox' , label: 'star' , folder: 'Add Planet',
                object: this.tempPlanet , property: 'star',
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
                                                this.tempPlanet.radius , this.tempPlanet.mass , this.tempPlanet.xV ,
                                                this.tempPlanet.yV , this.tempPlanet.zV , this.tempPlanet.rotationSpeed,
                                                this.tempPlanet.color , null , this.tempPlanet.star , false , null);
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
        for(let i = 0; i < this.gui.loadedComponents.length ; i++){
            if(this.gui.loadedComponents[i].opts.label==='Warning'){
                this.gui.loadedComponents[i].SetEnabled(false);
            }
        }
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
                type: 'checkbox' , label: 'orbit' , folder: planet.name,
                object: planet.orbit.line , property: 'visible',
            },
            {
                type: 'checkbox' , label: 'Momentum Vector' , folder: planet.name,
                object: planet.momentumVector , property: 'visible',
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
        if(planet.star){
            this.gui.Register([
                {
                    type: 'checkbox' , label: 'Star light' , folder: planet.name,
                    object: planet.starLight , property: 'visible'
                }
            ]);
        }
        if(planet.ring){
            this.gui.Register([
                {
                    type: 'checkbox' , label: 'Planet rings' , folder: planet.name,
                    object: planet.planetRings , property: 'visible'
                }
            ]);
        }
        this.gui.Register([
            {
                type: 'button' , label: `Go to ${planet.name}` , folder: planet.name,
                action: () => {
                    this.experience.camera.instance.position.set(planet.mesh.position.x , planet.mesh.position.y+20+planet.radius , planet.mesh.position.z+20+planet.radius);
                    this.experience.camera.instance.lookAt(planet.mesh.position);
                }
            },
            {
                type: 'button' , label: `Delete ${planet.name}` , folder: planet.name,
                action: () => {
                    const planets = this.experience.world.planets;
                    const index = planets.indexOf(planet);
                    planets.splice(index , 1);
                    planet.mesh.removeFromParent();
                    planet.orbit.line.removeFromParent();
                    planet.nameMesh.removeFromParent();
                    if(planet.star) planet.starLight.removeFromParent();
                    if(planet.ring) planet.planetRings.removeFromParent();
                    this.gui.loadedComponents.forEach(e => {
                        if(e.opts.label === `Delete ${planet.name}` || e.opts.label === planet.name){   
                            this.gui.Remove(e);
                        }
                    });
                } 
            }
        ]);
    }

    editConstants(){
        const AU = earthConstants.AU;
        const SCALE = earthConstants.SCALE;
        const radiusScale = earthConstants.radiusScale;
        const TIME_STEP = earthConstants.TIME_STEP;
        const earthMass = earthConstants.earthMass;
        const earthRadius = earthConstants.earthRadius;
        const earthVelocity = earthConstants.earthVelocity;
        console.log(earthVelocity); 
        this.gui.Register([
            {
                type: 'range' , label: 'AU' , folder: 'Constants',
                min: 0 , max: AU * 10 , step: 1000 , scale: 'linear',
                object: earthConstants , property: 'AU',
            },
            {
                type: 'range' , label: 'Scale' , folder: 'Constants',
                min: 0 , max: 1 , setp: 0.00001, scale: 'linear', precision: 5,
                object: earthConstants , property: 'SCALE',
            },
            {
                type: 'range' , label: 'Radius Scale' , folder: 'Constants',
                min: 0 , max: 1 , step: 0.00001 , scale: 'linear', precision: 5,
                object: earthConstants , property: 'radiusScale',
            },
            {
                type: 'range' , label: 'Time step' , folder: 'Constants',
                min: 0 , max: TIME_STEP * 10 , step: 60 , scale: 'linear' , precision: 4,
                object: earthConstants , property: 'TIME_STEP',
            },
            {
                type: 'range' , label: 'Earth Mass' , folder: 'Constants',
                min: 0 , max: earthMass * 100 , step: 1000 , scale: 'linear',
                object: earthConstants , property: 'earthMass',
            },
            {
                type: 'range' , label: 'Earth Radius' , folder: 'Constants',
                min: 0 , max: 10 , step: 0.1 , scale: 'linear', precision: 5,
                object: earthConstants , property: 'earthRadius',
            },
            {
                type: 'range' , label: 'Earth Velocity' , folder: 'Constants',
                min: earthVelocity * 100 , max: earthVelocity * -100 , step: 1000 , scale: 'linear',
                object: earthConstants , property: 'earthVelocity',
            },
            {
                type: 'button' , label: 'Reset All' , folder: 'Constants',
                action: () => {
                    earthConstants.AU = AU;
                    earthConstants.SCALE = SCALE;
                    earthConstants.TIME_STEP = TIME_STEP;
                    earthConstants.earthMass = earthMass;
                    earthConstants.earthRadius = earthRadius;
                    earthConstants.earthVelocity = earthVelocity;
                    earthConstants.radiusScale = radiusScale;
                }
            }
        ]);
    }

    editHelper(){
        const mainAxes = this.experience.axes.mainAxes;
        const stats = this.experience.statsHelper.stats;
        const grid = this.experience.gridHelper.mainGridHelper;
        this.gui.Register([
            {
                type: 'folder' , label: 'Axes' , folder: 'Helpers',
            },
            {
                type: 'checkbox' , label: 'Axes' , folder: 'Axes',
                object: mainAxes , property: 'visible',
            },
            {
                type: 'range' , label: 'Axes size' , folder: 'Axes',
                min: 1 , max: 1000 , step: 1 , scale: 'linear', initial: 100,
                onChange: (value) => {
                    mainAxes.geometry.attributes.position.array[3] = value;
                    mainAxes.geometry.attributes.position.array[10] = value;
                    mainAxes.geometry.attributes.position.array[17] = value;
                    mainAxes.geometry.attributes.position.needsUpdate = true;
                }
            },
            {
                type: 'checkbox' , label: 'grid' , folder: 'Helpers',
                object: grid , property: 'visible',
            },
            {
                type: 'checkbox' , label: 'stats' , folder: 'Helpers',
                initial: false, onChange: (value) => stats.dom.hidden = !value
            },
        ]);
    }

    editControllers(){
        this.gui.Register([
            {
                type: 'select' , label: 'controls' , folder: 'Controllers',
                options: ['Fly Controls' , 'Orbit Controls' , 'First Person Controls'],
                onChange: (value) => this.experience.camera.setControls(value)
            }
        ]);
    }

    resetWorld(){
        this.gui.Register([
            {
                type: 'button' , label: 'Reset The World',
                action: () => document.location.reload(),
            },
        ]);
    }
}

export default ControlPanel;
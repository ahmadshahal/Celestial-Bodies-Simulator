import * as THREE from 'three';
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
            rotationSpeed : 0.01,
            type: 1,
        };

        // initial the panel
        this.initialization();

        // fill the add folder
        this.addBody();

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
            {type: 'folder' , label: 'All Bodies'},
            {type: 'folder' , label: 'Add Body'},
            {type: 'folder' , label: 'Constants'},
            {type: 'folder' , label: 'Helpers'},
            {type: 'folder' , label: 'Controllers'}
        ]);
    }

    addBody(){
        this.gui.Register([
            {
                type: 'text' , label: 'Warning' , folder: 'Add Body',
                initial: '! All values on earth scale !' , enabled: false,
            },
            {
                type: 'text' , label: 'Name:' , folder: 'Add Body',
                object: this.tempPlanet , property: 'name',
            },
            {
                type: 'range' , label: 'X axis:' , folder: 'Add Body',
                min: -100 , max: 100 , step: 0.001, scale: 'linear',
                object: this.tempPlanet , property : 'x',
            },
            {
                type: 'range' , label: 'Y axis:' , folder: 'Add Body',
                min: -100 , max: 100 , step: 0.001, scale: 'linear',
                object: this.tempPlanet , property : 'y',
            },
            {
                type: 'range' , label: 'Z axis:' , folder: 'Add Body',
                min: -100 , max: 100 , step: 0.001, scale: 'linear',
                object: this.tempPlanet , property : 'z',
            },
            {
                type: 'range' , label: 'Radius' , folder: 'Add Body',
                min: 0.001 , max: 500 , step: 0.01, scale: 'linear',
                object: this.tempPlanet , property : 'radius',
            },
            {
                type: 'color' , label: 'Color' , folder: 'Add Body',
                format: 'hex' , object: this.tempPlanet , property: 'color',
            },
            {
                type: 'range' , label: 'Mass' , folder: 'Add Body',
                object: this.tempPlanet , property: 'mass',
                min: 0.001 , max: 1e7 , step: 0.00001 , scale: 'linear',
            },
            {
                type: 'range' , label: 'X velocity' , folder: 'Add Body',
                min: -1e7 , max: 1e7 , step: 0.1, scale: 'linear',
                object: this.tempPlanet , property : 'xV',
            },
            {
                type: 'range' , label: 'Y velocity' , folder: 'Add Body',
                min: -1e7 , max: 1e7 , step: 0.1, scale: 'linear',
                object: this.tempPlanet , property : 'yV',
            },
            {
                type: 'range' , label: 'Z velocity' , folder: 'Add Body',
                min: -1e7 , max: 1e7 , step: 0.1, scale: 'linear',
                object: this.tempPlanet , property : 'zV',
            },
            {
                type: 'range' , label: 'Rotation speed' , folder: 'Add Body',
                min: 0 , max: 100 , step: 0.001 , scale: 'linear', precision: 10,
                object: this.tempPlanet , property: 'rotationSpeed'
            },  
            {
                type: 'select' , label: 'type' , folder: 'Add Body',
                options: ['Terrestrial Planet' , 'Gas Planet' , 'Star' , 'Asteroid'],
                onChange: (value) => {
                    if(value === 'Star') this.tempPlanet.type = 0;
                    else if(value === 'Terrestrial Planet') this.tempPlanet.type = 1;
                    else if(value === 'Gas Planet') this.tempPlanet.type = 2;
                    else this.tempPlanet.type = 3;
                }
            },
            {
                type: 'button' , label: 'Add Body' , folder: 'Add Body',
                action: (value) => {
                    const planets = this.experience.world.planets;
                    let f = true;
                    if(this.tempPlanet.name === ''){
                        this.gui.Toast('Please insert name for the body');
                        return;
                    }
                    if(this.tempPlanet.name.includes(' ')){
                        this.gui.Toast('Planet insert name without space');
                        return;
                    }
                    planets.forEach(e => {
                        if(e.name.toLowerCase() === this.tempPlanet.name.toLowerCase()){
                            this.gui.Toast('Body name already exists');
                            f = false;
                        }
                    });
                    if(f === false) return;
                    const newPlanet = new Planet(this.tempPlanet.name , this.tempPlanet.x , this.tempPlanet.y, this.tempPlanet.z,
                                                this.tempPlanet.radius , this.tempPlanet.mass , this.tempPlanet.xV ,
                                                this.tempPlanet.yV , this.tempPlanet.zV , this.tempPlanet.rotationSpeed,
                                                this.tempPlanet.color , null , this.tempPlanet.type , false , null);
                    planets.forEach(e => {
                        if(newPlanet.areCollided(e)){
                            this.gui.Toast('Body can not be added in this coordinates');
                            f = false;
                        }
                    }); 
                    if(f === false){
                        setTimeout(() => {
                            newPlanet.nameMesh.removeFromParent();
                            newPlanet.speedVector.removeFromParent();
                            newPlanet.forceVector.removeFromParent();
                            if(newPlanet.type === 0) newPlanet.starLight.removeFromParent();
                            if(newPlanet.ring) newPlanet.planetRings.removeFromParent();
                        } , 1000);
                        return;
                    }
                    planets.push(newPlanet);
                    this.scene.add(newPlanet.mesh , newPlanet.orbit.line);
                    this.experience.informationPanel.panel(newPlanet);
                    this.editPlanet(newPlanet);
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
            {type: 'folder' , label: planet.name , folder: 'All Bodies'},
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
                type: 'checkbox' , label: 'Speed & Gravitational Force' , folder: planet.name,
                initial: false,
                onChange: (value) => {
                    planet.speedVector.visible = value;
                    planet.forceVector.visible = value;
                }
            },
            {
                type: 'color' , label: 'Color' , folder: planet.name,
                initial: planet.mesh.material.color.getHexString(), format : 'hex',
                onChange: (value) => { planet.mesh.material.color.set(value)}
            },
            {
                type: 'range' , label: 'speed (km/s)' , folder: planet.name,
                min: 0 , max: 1e5 , step: 0.001 , scale: 'linear', precision: 5,
                object: planet , property: 'velocityLength',
                onChange: (value) => {
                    const temp = value * planet.mass;
                    planet.momentum.setLength(temp);
                }
            },
            {
                type: 'range' , label: 'Mass (kg)' , folder: planet.name,
                min: 1e15, max: 4e30, step: 1000 , scale: 'linear',    
                object: planet , property: 'mass'
            },
        ]);
        if(planet.type === 0){
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
                    const constant = (2 * planet.radius / earthConstants.earthRadius) 
                    this.experience.camera.instance.position.set(planet.mesh.position.x , planet.mesh.position.y+planet.radius + constant , planet.mesh.position.z+planet.radius + constant );
                    this.experience.camera.instance.lookAt(planet.mesh.position);
                    if(this.experience.camera.currentControls === 'First Person Controls'){
                        this.experience.camera.controls.lookAt(planet.mesh.position);
                    }
                    else if(this.experience.camera.currentControls === 'Orbit Controls'){
                        this.experience.camera.controls.target = planet.mesh.position;
                    }
                    this.experience.informationPanel.show(planet);
                }
            },
            {
                type: 'button' , label: `Delete ${planet.name}` , folder: planet.name,
                action: () => this.deletePlanet(planet),
            }
        ]);
    }

    editConstants(){
        const G = earthConstants.G;
        const AU = earthConstants.AU;
        const COR = earthConstants.COR;
        const SCALE = earthConstants.SCALE;
        const radiusScale = earthConstants.radiusScale;
        const TIME_STEP = earthConstants.TIME_STEP;
        const earthMass = earthConstants.earthMass;
        const earthRadius = earthConstants.earthRadius;
        const earthVelocity = earthConstants.earthVelocity;
        this.gui.Register([
            {
                type: 'range' , label: 'G' , folder: 'Constants',
                min : 0 , max : 1 , setp: 0.0001 , scale: 'linear',
                object: earthConstants , property: 'G',
            },
            {
                type: 'range' , label: 'AU' , folder: 'Constants',
                min: 0 , max: AU * 10 , step: 1000 , scale: 'linear',
                object: earthConstants , property: 'AU',
            },
            {
                type: 'range' , label : 'COR' , folder: 'Constants',
                min: 0 , max: 1 , step: 0.0001 , scale: 'linear',
                object: earthConstants , property: 'COR',
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
                    earthConstants.G = G;
                    earthConstants.AU = AU;
                    earthConstants.COR = COR;
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
                options: ['Orbit Controls' , 'Fly Controls' ,  'First Person Controls'],
                onChange: (value) => this.experience.camera.setControls(value)
            },
            {
                type: 'button' , label : 'Back to Center' , folder: 'Controllers',
                action: () => {
                    const centerVector = new THREE.Vector3(0 , 0 , 0);
                    this.experience.camera.instance.position.set(0 , 200 , 200);
                    this.experience.camera.instance.lookAt(centerVector);
                    if(this.experience.camera.currentControls === 'First Person Controls'){
                        this.experience.camera.controls.lookAt(centerVector);
                    }
                    else if(this.experience.camera.currentControls === 'Orbit Controls'){
                        this.experience.camera.controls.target = centerVector;
                    }
                    this.experience.informationPanel.hideAll();
                }
            }
        ]);
    }

    deletePlanet(planet){
        const planets = this.experience.world.planets;
        const index = planets.indexOf(planet);
        planets.splice(index , 1);
        this.experience.informationPanel.deletePanel(planet);
        planet.mesh.removeFromParent();
        planet.orbit.line.removeFromParent();
        planet.speedVector.removeFromParent();
        planet.forceVector.removeFromParent();
        if(planet.nameMesh !== undefined && planet.nameMesh !== null) 
            planet.nameMesh.removeFromParent();
        if(planet.type === 0) planet.starLight.removeFromParent();
        if(planet.ring) planet.planetRings.removeFromParent();
        this.gui.loadedComponents.forEach(e => {
            if(e.opts.label === `Delete ${planet.name}` || e.opts.label === planet.name){   
                this.gui.Remove(e);
            }
        });
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
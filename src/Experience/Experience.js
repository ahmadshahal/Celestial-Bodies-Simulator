import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Axes from './Utils/Axes';
import ControlPanel from './Utils/ControlPanel';
import Particle from './World/particles';
import StatsHelper from './Utils/StatsHelper';
import GridHelper from './Utils/GridHelper.js'
import InformationPanel from './Utils/InformationPanel.js'

let instance = null

export default class Experience
{
    constructor(canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        
        // Global access
        window.experience = this

        // Options
        this.canvas = canvas

        // Setup
        //this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene()
        this.camera = new Camera();
        this.axes = new Axes();
        this.statsHelper = new StatsHelper();
        this.gridHelper = new GridHelper();
        this.informationPanel = new InformationPanel();
        this.controlPanel = new ControlPanel();
        //this.resources = new Resources(sources)
        this.renderer = new Renderer();
        this.world = new World();
        this.Particle = new Particle();


        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        // Time tick event
        this.time.on('tick', () =>
        {
            this.update()
        })
    }

    resize()
    {
        this.camera.resize()
        this.renderer.resize()
    }

    update()
    {
        this.camera.update()
        this.world.update()
        this.renderer.update()
        this.statsHelper.stats.update();
    }
}
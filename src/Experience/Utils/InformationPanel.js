import Planet , {earthConstants} from '../World/Planet';

class InformationPanel{
    constructor(){
        this.planetMaterial = '';
    }
    panel(planet){
        if(planet.type === 0)        this.planetMaterial = 'Star';
        else if(planet.type === 1)   this.planetMaterial = 'Terrestrial Planet';
        else if(planet.type === 2)   this.planetMaterial = 'Gas Planet';
        else                         this.planetMaterial = 'Asteroid';

        const panel = document.createElement("div");
        panel.className = `information-panel ${planet.name}`;

        const exit = document.createElement("div");
        exit.className = "exit";
        exit.onclick = this.hideAll;
        panel.appendChild(exit);

        const title = document.createElement("h2");
        title.className = "planet-name";
        title.appendChild(document.createTextNode(`${planet.name}`));
        if(planet.color != null)    title.style.color = `${planet.color}`
        panel.appendChild(title);

        const material = document.createElement("div");
        material.className = "material"
        material.appendChild(document.createTextNode(this.planetMaterial));
        panel.appendChild(material);

        const content = document.createElement("div");
        content.className = "content";

        const X = document.createElement("div");
        X.className = "X";
        X.appendChild(document.createTextNode(`${planet.mesh.position.x.toFixed(4)}`));
        if(planet.color != null)    X.style.color = `${planet.color}`
        content.appendChild(X);

        const Y = document.createElement("div");
        Y.className = "Y";
        Y.appendChild(document.createTextNode(`${planet.mesh.position.y.toFixed(4)}`));
        if(planet.color != null)    Y.style.color = `${planet.color}`
        content.appendChild(Y);

        const Z = document.createElement("div");
        Z.className = "Z";
        Z.appendChild(document.createTextNode(`${planet.mesh.position.z.toFixed(4)}`));
        if(planet.color != null)    Z.style.color = `${planet.color}`
        content.appendChild(Z);

        const speed = document.createElement("div");
        speed.className = "speed";
        speed.appendChild(document.createTextNode(`${planet.getVelocity().length().toFixed(4)}`));
        if(planet.color != null)    speed.style.color = `${planet.color}`
        content.appendChild(speed);

        const Au = document.createElement("div");
        Au.className = "AU";
        Au.appendChild(document.createTextNode(`${(planet.mesh.position.length() / (earthConstants.AU * earthConstants.SCALE)).toFixed(4)}`));
        if(planet.color != null)    Au.style.color = `${planet.color}`;
        content.appendChild(Au);
        
        const rotationalSpeed = document.createElement("div");
        rotationalSpeed.className = "rotationalSpeed";
        rotationalSpeed.appendChild(document.createTextNode(`${Math.abs(planet.rotationalSpeed.toFixed(4))}`));
        if(planet.color != null)    rotationalSpeed.style.color = `${planet.color}`
        content.appendChild(rotationalSpeed);

        const radius = document.createElement("div");
        radius.className = "radius";
        radius.appendChild(document.createTextNode(`${(planet.radius / earthConstants.earthRadius).toFixed(4)}`));
        if(planet.color != null)    radius.style.color = `${planet.color}`
        content.appendChild(radius);

        const mass = document.createElement("div");
        mass.className = "mass";
        mass.appendChild(document.createTextNode(`${planet.mass}`));
        if(planet.color != null)    mass.style.color = `${planet.color}`
        content.appendChild(mass);

        panel.appendChild(content);

        document.body.appendChild(panel);
    }

    deletePanel(planet){
        if(document.querySelector(`.${planet.name}`) != null)
        document.querySelector(`.${planet.name}`).remove();
    }

    hideAll(){
        let planetInfo = document.querySelectorAll(".information-panel");
        for(let i = 0 ; i < planetInfo.length ; i ++){
            planetInfo[i].style.left = "-500px";
        }
    }

    update(planet){
        document.querySelector(`.${planet.name} .content .X`).firstChild.nodeValue = `${planet.mesh.position.x.toFixed(4)}`;
        document.querySelector(`.${planet.name} .content .Y`).firstChild.nodeValue = `${planet.mesh.position.y.toFixed(4)}`;
        document.querySelector(`.${planet.name} .content .Z`).firstChild.nodeValue = `${planet.mesh.position.z.toFixed(4)}`;
        document.querySelector(`.${planet.name} .content .speed`).firstChild.nodeValue = `${planet.getVelocity().length().toFixed(4)}`;
        document.querySelector(`.${planet.name} .content .AU`).firstChild.nodeValue = `${(planet.mesh.position.length() / (earthConstants.AU * earthConstants.SCALE)).toFixed(4)}`;
        document.querySelector(`.${planet.name} .content .mass`).firstChild.nodeValue = `${(planet.mass.toFixed(4))}`;
    }

    show(planet){
        this.update(planet);
        this.hideAll();
        document.querySelector(`.${planet.name}`).style.left = "0";
    }
}

export default InformationPanel;
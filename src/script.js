import './style.css'

import Experience from './Experience/Experience.js'


const button = document.querySelector('.start-button');
button.onclick = () => {
    const div = document.querySelector('.start-page');
    div.remove();
    const experience = new Experience(document.querySelector('canvas.webgl'))
}
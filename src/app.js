import * as PIXI from 'pixi.js';
import { Player } from './player';

const app = new PIXI.Application(640, 360, {

});

document.body.appendChild(app.view);

const player = new Player(500, 100);

PIXI.loader
    .add("s1", "./assets/images/s1.png")
    .add("s2", "./assets/images/s2.png")
    .add("s3", "./assets/images/s3.png")
    .add("s4", "./assets/images/s4.png")
    .add("s5", "./assets/images/s5.png")
    .add("s6", "./assets/images/s6.png")
    .add("s7", "./assets/images/s7.png")
    .add("s8", "./assets/images/s8.png")
    .add("coin", "./assets/images/coin.png")
    .add("spin", "./assets/images/spin.png")

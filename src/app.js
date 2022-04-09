import * as PIXI from 'pixi.js';

const app = new PIXI.Application(640, 360, {

});

document.body.appendChild(app.view);

const weights = [
    10,
    9,
    9,
    7,
    8,
    
];

const special = {};

let mat = [[]];

for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        mat[i][j] = (Math.random * 10) % 8;

    }



}
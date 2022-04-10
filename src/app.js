import * as PIXI from 'pixi.js';
import { Howl, Howler } from 'howler';
import { Player } from './player.js';
import { spinSlot, getReels } from './calculation.js';

const app = new PIXI.Application({
    width: 800, 
    height: 480, 
    backgroundColor: 0xeff0f1
});
document.body.appendChild(app.view);

// const reels = [
//     [1, 2, 5, 6], // 7 bar zvono pomorandza
//     [4, 5, 6, 2], 
//     [1, 4, 3, 7]
// ];

const reels = getReels();
let reelsContainer;
const player = new Player(500, 50);
const loader = PIXI.Loader.shared;
let running = false;
const stakeIncrement = 10;
const reelWidth = (app.screen.height - 100) / reels.length;
const symbolDim = reelWidth - 10;
const spinSound = new Howl({
    src: ["./assets/sounds/spinSound.mp3"]
});

const table = [];

loader
    .add("s1", "./assets/images/s1.png")
    .add("s2", "./assets/images/s2.png")
    .add("s3", "./assets/images/s3.png")
    .add("s4", "./assets/images/s4.png")
    .add("s5", "./assets/images/s5.png")
    .add("s6", "./assets/images/s6.png")
    .add("s7", "./assets/images/s7.png")
    .add("s8", "./assets/images/s8.png")
    .add("coins", "./assets/images/coin.png")
    .add("spin", "./assets/images/spin.png")
    .add("leftBtn", "./assets/images/leftButton.png")
    .add("rightBtn", "./assets/images/rightButton.png")
    .load(onAssetsLoaded);

function onAssetsLoaded() {
    const margin = 50;

    const headerContainer = new PIXI.Container();
    const header = new PIXI.Graphics();
    header.beginFill(0x234d57);
    header.drawRect(0, 0, app.screen.width, margin);

    let coins = new PIXI.Sprite(loader.resources["coins"].texture);
    coins.x = app.screen.width - 3 * margin;
    coins.y = margin / 9;
    coins.scale.x *= 0.03;
    coins.scale.y *= 0.03;

    const textStyle = new PIXI.TextStyle({
        dropShadow: false,
        dropShadowAngle: 7,
        dropShadowDistance: 8,
        fill: "#807680",
        fontFamily: "Arial",
        fontWeight: 900,
        letterSpacing: 4,
        lineJoin: "round",
        miterLimit: 0,
        stroke: "#eff0f1",
        strokeThickness: 5
    });
    const headerText = new PIXI.Text("Slot Machine", textStyle);
    headerText.x = (header.width - headerText.width) / 2;
    headerText.y = (margin - headerText.height) / 2;

    const balanceText = new PIXI.Text(`${player.balance}`, textStyle);
    balanceText.x = app.screen.width - 2 * margin;
    balanceText.y = (margin - headerText.height) / 2;

    headerContainer.addChild(
        header,
        coins,
        headerText,
        balanceText
    );

    reelsContainer = new PIXI.Container();

    for (let i = 0; i < reels.length; i++) {
        const reelColumn = new PIXI.Container();
        reelColumn.x = (app.screen.width - reels.length * reelWidth) / 2 + i * reelWidth + margin / 2 * (i - 1);
        reelsContainer.addChild(reelColumn);

        table.push(reelColumn);

        let index = Math.floor(Math.random() * reels[i].length);
        for (let j = 0; j < 3; j++) {
            const symbol = new PIXI.Sprite(loader.resources["s" + reels[i][index]].texture);
            symbol.x = 0;
            symbol.y = j * symbolDim + margin;
            symbol.scale.x *= 0.8;
            symbol.scale.y = symbol.scale.x;

            index = (index + 1) % reels[i].length;

            reelColumn.addChild(symbol);
        }
    }

    

    app.stage.addChild(reelsContainer);

    const footerContainer = new PIXI.Container();
    const footer = new PIXI.Graphics();
    footer.beginFill(0x234d57);
    footer.drawRect(0, app.screen.height - margin, app.screen.width, margin);

    const buttonsContainer = new PIXI.Container();
    buttonsContainer.x = 0;
    buttonsContainer.y = 0;

    const rightButton = makeButton(
        loader.resources["rightBtn"].texture,
        "./assets/sounds/buttonClick.mp3",
        app.screen.width / 2 + 2 * margin,
        app.screen.height - 4 / 5 * margin,
        0.05
    );

    const leftButton = makeButton(
        loader.resources["leftBtn"].texture,
        "./assets/sounds/buttonClick.mp3",
        app.screen.width / 2 - 2 * margin - rightButton.width,
        app.screen.height - 4 / 5 * margin,
        0.05
    );

    const spinButton = makeButton(
        loader.resources["spin"].texture,
        "./assets/sounds/spinClick.mp3",
        app.screen.width - 3 * margin,
        app.screen.height - 2 * margin - 10,
        0.2
    );

    buttonsContainer.addChild(
        leftButton,
        rightButton,
        spinButton
    );

    leftButton.addListener("pointerdown", () => {
        player.reduceStake(stakeIncrement);
        stakeText.text = player.stake;
    });

    rightButton.addListener("pointerdown", () => {
        player.addStake(stakeIncrement);
        stakeText.text = player.stake;
    });

    spinButton.addListener("pointerdown", () => {
        play();
        balanceText.text = player.balance;
    });

    const stakeText = new PIXI.Text(`${player.stake}`, textStyle);
    stakeText.x = (app.screen.width - stakeText.width) / 2;
    stakeText.y = app.screen.height - 5 / 6 * margin;

    footerContainer.addChild(
        footer,
        buttonsContainer,
        stakeText
    )

    app.stage.addChild(
        headerContainer,
        footerContainer
    );
}

function makeButton(texture, audio, x, y, scale) {
    const button = PIXI.Sprite.from(texture);

    const sound = new Howl({
        src: [audio]
    })
    button.sound = sound;

    button.interactive = true;
    button.buttonMode = true;
    button.on("pointerdown", e => sound.play());
    
    button.x = x;
    button.y = y;
    button.scale.set(scale);

    return button;
}

function play() {
    if (running) {
        return;
    }
    
    let line = new PIXI.Graphics();

    line.position.set(0, 0);
    line.lineStyle(10, 0xff0000, 1)
        .moveTo(reelsContainer.width/2, reelsContainer.height/3)
        .lineTo(reelsContainer.width*1.5, reelsContainer.height/3);

    app.stage.addChild(line);

    line = new PIXI.Graphics();
    line.position.set(0, 0);
    line.lineStyle(10, 0xff0000, 1)
    .moveTo(reelsContainer.width/2, 2*reelsContainer.height/3)
    .lineTo(reelsContainer.width*1.5, 2*reelsContainer.height/3)
    app.stage.addChild(line);

    line = new PIXI.Graphics();
    line.position.set(0, 0);
    line.lineStyle(10, 0xff0000, 1)
    .moveTo(reelsContainer.width/2, reelsContainer.height)
    .lineTo(reelsContainer.width*1.5, reelsContainer.height)

    app.stage.addChild(line);
    

    running = true;

    spinSound.stop();
    spinSound.play();

    const r = spinSlot(player);
    const mat = r.mat;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (mat !== undefined) {
                table[i].getChildAt(j).texture = loader.resources["s" + mat[j][i]].texture;
            }
        }
    }

    const lines = r.returnVal.lineHits;
    const points = r.returnVal.points;

    if (lines["upper"] === true) {

    }

    if (lines["middle"] === true) {
        
    }

    if (lines["lower"] === true) {

    }

    if (lines["upperZigZag"] === true) {
        
    }

    if (lines["lowerZigZag"] === true) {
        
    }

    // for (let i = 0; i < reels.length; i++) {
    //     const reel = table[i];
        
    //     let index = Math.floor(Math.random() * reels[i].length);
    //     for (let j = 0; j < 3; j++) {
    //         reel.getChildAt(j).texture = loader.resources["s" + reels[i][index]].texture;
    //         index = (index + 1) % reels[i].length;
    //     }
    // }

    running = false;
}
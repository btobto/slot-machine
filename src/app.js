import * as PIXI from 'pixi.js';
import { Howl, Howler } from 'howler';
import { Player } from './player.js';
import { spinSlot, getReels } from './calculation.js';

const app = new PIXI.Application({
    width: 800,
    height: 480,
    backgroundColor: 0x9845a3
});
document.body.appendChild(app.view);

const reels = getReels();
let reelsContainer;
const player = new Player(500, 100);
const loader = PIXI.Loader.shared;
let running = false;
const stakeIncrement = 10;
const reelWidth = (app.screen.height - 100) / reels.length;
const symbolDim = reelWidth - 10;
const spinSound = new Howl({
    src: ["./assets/sounds/spinSound.mp3"],
    volume: 0.75
});
let linesArr = [];

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
    .add("leftBtn", "./assets/images/left.png")
    .add("rightBtn", "./assets/images/right.png")
    .load(onAssetsLoaded);

function onAssetsLoaded() {
    const margin = 50;

    const headerContainer = new PIXI.Container();
    const header = new PIXI.Graphics();
    header.beginFill(0x32065F);
    header.drawRect(0, 0, app.screen.width, margin);

    let coins = new PIXI.Sprite(loader.resources["coins"].texture);
    coins.x = app.screen.width - 3 * margin - margin / 2;
    coins.y = margin / 9;
    coins.scale.x *= 0.03;
    coins.scale.y *= 0.03;

    const textStyle = new PIXI.TextStyle({
        dropShadow: false,
        dropShadowAngle: 7,
        dropShadowDistance: 8,
        fill: "#b8a016",
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
    balanceText.x = app.screen.width - 2 * margin - margin / 2;
    balanceText.y = (margin - headerText.height) / 2;

    const pointsText = new PIXI.Text("", textStyle);
    pointsText.x = margin / 2;
    pointsText.y = balanceText.y;

    headerContainer.addChild(
        header,
        coins,
        headerText,
        balanceText,
        pointsText
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
    footer.beginFill(0x32065F);
    footer.drawRect(0, app.screen.height - margin, app.screen.width, margin);

    const buttonsContainer = new PIXI.Container();
    buttonsContainer.x = 0;
    buttonsContainer.y = 0;

    const rightButton = makeButton(
        loader.resources["rightBtn"].texture,
        "./assets/sounds/buttonClick.mp3",
        app.screen.width / 2 + 2 * margin,
        app.screen.height - 4 / 5 * margin,
        0.06
    );

    const leftButton = makeButton(
        loader.resources["leftBtn"].texture,
        "./assets/sounds/buttonClick.mp3",
        app.screen.width / 2 - 2 * margin - rightButton.width,
        app.screen.height - 4 / 5 * margin,
        0.06
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
        const newPoints = play();

        if (newPoints === 0) {
            pointsText.text = "";
        } else if (newPoints !== undefined) {
            pointsText.text = "+" + newPoints;
        }

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

    running = true;

    for (const l of linesArr) {
        l.clear();
    }
    linesArr = [];

    spinSound.stop();

    const r = spinSlot(player);

    if (r === undefined) {
        running = false;
        return;
    }

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

    let line, line2;
    let startingPoint = (app.screen.width - reels.length * reelWidth) / 2 - 50 / 2;
    let endPoint = (app.screen.width - reels.length * reelWidth) / 2 + 3 * reelWidth + 2 * 50 / 2;

    if (lines["upper"] === true) {
        spinSound.play();

        line = new PIXI.Graphics();
        line.position.set(0, 0);
        line.lineStyle(10, 0xff0000, 1)
            .moveTo(startingPoint, reelsContainer.height / 3)
            .lineTo(endPoint, reelsContainer.height / 3);

        app.stage.addChild(line);

        linesArr.push(line);
    }

    if (lines["middle"] === true) {
        spinSound.play();

        line = new PIXI.Graphics();
        line.position.set(0, 0);
        line.lineStyle(10, 0xff0000, 1)
            .moveTo(startingPoint, 2 * reelsContainer.height / 3 - 50 / 2)
            .lineTo(endPoint, 2 * reelsContainer.height / 3 - 50 / 2);

        app.stage.addChild(line);

        linesArr.push(line);
    }

    if (lines["lower"] === true) {
        spinSound.play();

        line = new PIXI.Graphics();
        line.position.set(0, 0);
        line.lineStyle(10, 0xff0000, 1)
            .moveTo(startingPoint, reelsContainer.height - 50 / 2)
            .lineTo(endPoint, reelsContainer.height - 50 / 2);

        app.stage.addChild(line);

        linesArr.push(line);
    }

    if (lines["upperZigZag"] === true) {
        spinSound.play();

        line = new PIXI.Graphics();
        line.position.set(0, 0);
        line.lineStyle(10, 0x0000FF, 1)
            .moveTo(startingPoint + reelWidth / 2, reelsContainer.height / 3)
            .lineTo((startingPoint + endPoint) / 2, 2 * reelsContainer.height / 3 - 50 / 2 - 10);
        app.stage.addChild(line);

        line2 = new PIXI.Graphics();
        line2.position.set(0, 0);
        line2.lineStyle(10, 0x0000FF, 1)
            .moveTo((startingPoint + endPoint) / 2, 2 * reelsContainer.height / 3 - 50 / 2 - 10)
            .lineTo(endPoint - reelWidth / 2, reelsContainer.height / 3);
        app.stage.addChild(line2);

        linesArr.push(line);
        linesArr.push(line2);
    }

    if (lines["lowerZigZag"] === true) {
        spinSound.play();

        line = new PIXI.Graphics();
        line.position.set(0, 0);
        line.lineStyle(10, 0x0000FF, 1)
            .moveTo(startingPoint + reelWidth / 2, reelsContainer.height - 50 / 2)
            .lineTo((startingPoint + endPoint) / 2, 2 * reelsContainer.height / 3 - 50 / 2 + 10);
        app.stage.addChild(line);

        line2 = new PIXI.Graphics();
        line2.position.set(0, 0);
        line2.lineStyle(10, 0x0000FF, 1)
            .moveTo((startingPoint + endPoint) / 2, 2 * reelsContainer.height / 3 - 50 / 2 + 10)
            .lineTo(endPoint - reelWidth / 2, reelsContainer.height - 50 / 2);
        app.stage.addChild(line2);

        linesArr.push(line);
        linesArr.push(line2);
    }

    running = false;

    return points;
}
// ...

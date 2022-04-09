import * as PIXI from 'pixi.js';
import { Howl, Howler } from 'howler';
import { Player } from './player';

const app = new PIXI.Application({
    width: 640, height: 480, backgroundColor: 0xeff0f1
});
document.body.appendChild(app.view);

const player = new Player(500, 100);
const loader = PIXI.Loader.shared;

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
    coins.x = app.screen.width - 150;
    coins.y = 2;
    coins.scale.x *= 0.08;
    coins.scale.y *= 0.08;

    const textStyle = new PIXI.TextStyle({
        dropShadow: true,
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

    headerContainer.addChild(
        header,
        coins,
        headerText
    );

    const buttonsContainer = new PIXI.Container();
    // x y

    const leftButton = makeButton(
        buttonsContainer,
        loader.resources["leftBtn"].texture,
        "./assets/sounds/buttonClick.mp3",
        220,
        296,
        0,05
    );

    const footerContainer = new PIXI.Container();
    const footer = new PIXI.Graphics();
    footer.beginFill(0x234d57);
    footer.drawRect(0, 240 + margin, app.screen.width, margin);

    footerContainer.addChild(
        footer
    )

    app.stage.addChild(headerContainer);
    app.stage.addChild(footerContainer);
}

function makeButton(container, texture, audio, x, y, scale) {
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
    container.addChild(button);

    return button;
}

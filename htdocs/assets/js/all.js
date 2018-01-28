/// <reference path="easeljs.d.ts" />
var stage;
var myContext2D;

function test_simple() {
    var canvas = document.getElementById('canvas');
    var stage = new createjs.Stage(canvas);
    var shape = new createjs.Shape();
    shape.graphics.beginFill('rgba(255,0,0,1)').drawRoundRect(0, 0, 120, 120, 10);
    stage.addChild(shape);
    stage.update();
}

function test_animation() {
    var ss = new createjs.SpriteSheet({
        "frames": {
            "width": 200,
            "numFrames": 64,
            "regX": 2,
            "regY": 2,
            "height": 361
        },
        "animations": { "jump": [26, 63], "run": [0, 25] },
        "images": ["./assets/runningGrant.png"]
    });

    ss.getAnimation("run").speed = 2;
    ss.getAnimation("run").next = "jump";
    ss.getAnimation("jump").next = "run";

    var sprite = new createjs.Sprite(ss);
    sprite.scaleY = sprite.scaleX = .4;

    sprite.gotoAndPlay("run");

    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener('tick', stage);
    stage.addChild(sprite);
}

function test_graphics() {
    var g = new createjs.Graphics();
    g.setStrokeStyle(1);
    g.beginStroke(createjs.Graphics.getRGB(0, 0, 0));
    g.beginFill(createjs.Graphics.getRGB(255, 0, 0));
    g.drawCircle(0, 0, 3);
    var s = new createjs.Shape(g);
    s.x = 100;
    s.y = 100;
    stage.addChild(s);
    stage.update();

    var myGraphics;
    myGraphics.beginStroke("#F00").beginFill("#00F").drawRect(20, 20, 100, 50).draw(myContext2D);
}

function colorMatrixTest() {
    var shape = new createjs.Shape().set({ x: 100, y: 100 });
    shape.graphics.beginFill("#ff0000").drawCircle(0, 0, 50);

    var matrix = new createjs.ColorMatrix().adjustHue(180).adjustSaturation(100);
    shape.filters = [
        new createjs.ColorMatrixFilter(matrix)
    ];

    shape.cache(-50, -50, 100, 100);
}
///<reference path="pixi.d.ts"/>
///<reference path="webgl.d.ts"/>
function PixiTests() {
    var stage = new PIXI.Stage(0xFFFFFF, true);

    stage.interactive = true;

    var bg = PIXI.Sprite.fromImage("BGrotate.jpg");
    bg.anchor.x = 0.5;
    bg.anchor.y = 0.5;

    bg.position.x = 620 / 2;
    bg.position.y = 380 / 2;

    stage.addChild(bg);

    var container = new PIXI.DisplayObjectContainer();
    container.position.x = 620 / 2;
    container.position.y = 380 / 2;

    var bgFront = PIXI.Sprite.fromImage("SceneRotate.jpg");
    bgFront.anchor.x = 0.5;
    bgFront.anchor.y = 0.5;

    container.addChild(bgFront);

    var light2 = PIXI.Sprite.fromImage("LightRotate2.png");
    light2.anchor.x = 0.5;
    light2.anchor.y = 0.5;
    container.addChild(light2);

    var light1 = PIXI.Sprite.fromImage("LightRotate1.png");
    light1.anchor.x = 0.5;
    light1.anchor.y = 0.5;
    container.addChild(light1);

    var panda = PIXI.Sprite.fromImage("panda.png");
    panda.anchor.x = 0.5;
    panda.anchor.y = 0.5;

    container.addChild(panda);

    stage.addChild(container);

    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(620, 380);

    renderer.view.style.position = "absolute";
    renderer.view.style.marginLeft = "-310px";
    renderer.view.style.marginTop = "-190px";
    renderer.view.style.top = "50%";
    renderer.view.style.left = "50%";
    renderer.view.style.display = "block";

    // add render view to DOM
    document.body.appendChild(renderer.view);

    // lets create moving shape
    var thing = new PIXI.Graphics();
    stage.addChild(thing);
    thing.position.x = 620 / 2;
    thing.position.y = 380 / 2;
    thing.lineStyle(0);

    container.mask = thing;

    var count = 0;

    stage.click = stage.tap = function () {
        if (!container.filter) {
            container.mask = thing;
            PIXI.runList(stage);
        } else {
            container.mask = null;
        }
    };

    /*
    * Add a pixi Logo!
    */
    var logo = PIXI.Sprite.fromImage("../../logo_small.png");
    stage.addChild(logo);

    logo.anchor.x = 1;
    logo.position.x = 620;
    logo.scale.x = logo.scale.y = 0.5;
    logo.position.y = 320;
    logo.interactive = true;
    logo.buttonMode = true;

    logo.click = logo.tap = function () {
        window.open("https://github.com/GoodBoyDigital/pixi.js", "_blank");
    };

    var help = new PIXI.Text("Click to turn masking on / off.", { font: "bold 12pt Arial", fill: "white" });
    help.position.y = 350;
    help.position.x = 10;
    stage.addChild(help);

    requestAnimFrame(animate);

    function animate() {
        bg.rotation += 0.01;
        bgFront.rotation -= 0.01;

        light1.rotation += 0.02;
        light2.rotation += 0.01;

        panda.scale.x = 1 + Math.sin(count) * 0.04;
        panda.scale.y = 1 + Math.cos(count) * 0.04;

        count += 0.1;

        thing.clear();
        thing.lineStyle(5, 0x16f1ff, 1);
        thing.beginFill(0x8bc5ff, 0.4);
        thing.moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);
        thing.lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20);
        thing.lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20);
        thing.lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20);
        thing.lineTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);
        thing.rotation = count * 0.1;

        renderer.render(stage);
        requestAnimFrame(animate);
    }

    /* 13 */
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0xFFFFFF, true);

    stage.setInteractive(true);

    var sprite = PIXI.Sprite.fromImage("spinObj_02.png");

    //stage.addChild(sprite);
    // create a renderer instance
    // the 5the parameter is the anti aliasing
    var renderer = PIXI.autoDetectRenderer(620, 380, null, false, true);

    // set the canvas width and height to fill the screen
    //renderer.view.style.width = window.innerWidth + "px";
    //renderer.view.style.height = window.innerHeight + "px";
    renderer.view.style.display = "block";

    // add render view to DOM
    document.body.appendChild(renderer.view);

    var graphics = new PIXI.Graphics();

    // set a fill and line style
    graphics.beginFill(0xFF3300);
    graphics.lineStyle(10, 0xffd900, 1);

    // draw a shape
    graphics.moveTo(50, 50);
    graphics.lineTo(250, 50);
    graphics.lineTo(100, 100);
    graphics.lineTo(250, 220);
    graphics.lineTo(50, 220);
    graphics.lineTo(50, 50);
    graphics.endFill();

    // set a fill and line style again
    graphics.lineStyle(10, 0xFF0000, 0.8);
    graphics.beginFill(0xFF700B, 1);

    // draw a second shape
    graphics.moveTo(210, 300);
    graphics.lineTo(450, 320);
    graphics.lineTo(570, 350);
    graphics.lineTo(580, 20);
    graphics.lineTo(330, 120);
    graphics.lineTo(410, 200);
    graphics.lineTo(210, 300);
    graphics.endFill();

    // draw a rectangel
    graphics.lineStyle(2, 0x0000FF, 1);
    graphics.drawRect(50, 250, 100, 100);

    // draw a circle
    graphics.lineStyle(0);
    graphics.beginFill(0xFFFF0B, 0.5);
    graphics.drawCircle(470, 200, 100);

    graphics.lineStyle(20, 0x33FF00);
    graphics.moveTo(30, 30);
    graphics.lineTo(600, 300);

    stage.addChild(graphics);

    // lets create moving shape
    var thing = new PIXI.Graphics();
    stage.addChild(thing);
    thing.position.x = 620 / 2;
    thing.position.y = 380 / 2;

    var count = 0;

    stage.click = stage.tap = function () {
        graphics.lineStyle(Math.random() * 30, Math.random() * 0xFFFFFF, 1);
        graphics.moveTo(Math.random() * 620, Math.random() * 380);
        graphics.lineTo(Math.random() * 620, Math.random() * 380);
    };

    requestAnimFrame(animate);

    function animate1() {
        thing.clear();

        count += 0.1;

        thing.clear();
        thing.lineStyle(30, 0xff0000, 1);
        thing.beginFill(0xffFF00, 0.5);

        thing.moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);
        thing.lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count) * 20);
        thing.lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count) * 20);
        thing.lineTo(-120 + Math.cos(count) * 20, 100 + Math.sin(count) * 20);
        thing.lineTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count) * 20);

        thing.rotation = count * 0.1;
        renderer.render(stage);
        requestAnimFrame(animate);
    }

    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x000000);

    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(800, 600);

    // set the canvas width and height to fill the screen
    renderer.view.style.width = window.innerWidth + "px";
    renderer.view.style.height = window.innerHeight + "px";
    renderer.view.style.display = "block";

    // add render view to DOM
    document.body.appendChild(renderer.view);

    // OOH! SHINY!
    // create two render textures.. these dynamic textures will be used to draw the scene into itself
    var renderTexture = new PIXI.RenderTexture(800, 600);
    var renderTexture2 = new PIXI.RenderTexture(800, 600);
    var currentTexture = renderTexture;

    // create a new sprite that uses the render texture we created above
    var outputSprite = new PIXI.Sprite(currentTexture);

    // align the sprite
    outputSprite.position.x = 800 / 2;
    outputSprite.position.y = 600 / 2;
    outputSprite.anchor.x = 0.5;
    outputSprite.anchor.y = 0.5;

    // add to stage
    stage.addChild(outputSprite);

    var stuffContainer = new PIXI.DisplayObjectContainer();

    stuffContainer.position.x = 800 / 2;
    stuffContainer.position.y = 600 / 2;

    stage.addChild(stuffContainer);

    // create an array of image ids..
    var fruits = [
        "spinObj_01.png", "spinObj_02.png",
        "spinObj_03.png", "spinObj_04.png",
        "spinObj_05.png", "spinObj_06.png",
        "spinObj_07.png", "spinObj_08.png"];

    // create an array of items
    var items = [];

    for (var i = 0; i < 20; i++) {
        var item = PIXI.Sprite.fromImage(fruits[i % fruits.length]);
        item.position.x = Math.random() * 400 - 200;
        item.position.y = Math.random() * 400 - 200;

        item.anchor.x = 0.5;
        item.anchor.y = 0.5;

        stuffContainer.addChild(item);
        console.log("_");
        items.push(item);
    }
    ;

    // used for spinning!
    var count = 0;

    requestAnimFrame(animate);

    function animate2() {
        requestAnimFrame(animate);

        for (var i = 0; i < items.length; i++) {
            // rotate each item
            var item = items[i];
            item.rotation += 0.1;
        }
        ;

        count += 0.01;

        // swap the buffers..
        var temp = renderTexture;
        renderTexture = renderTexture2;
        renderTexture2 = temp;

        // set the new texture
        outputSprite.setTexture(renderTexture);

        // twist this up!
        stuffContainer.rotation -= 0.01;
        outputSprite.scale.x = outputSprite.scale.y = 1 + Math.sin(count) * 0.2;

        // render the stage to the texture
        // the true clears the texture before content is rendered
        renderTexture2.render(stage, new PIXI.Point(0, 0), true);

        // and finally render the stage
        renderer.render(stage);
    }

    ////
    function init() {
        var assetsToLoader = ["desyrel.fnt"];

        // create a new loader
        var loader = new PIXI.AssetLoader(assetsToLoader);

        // use callback
        loader.onComplete = onAssetsLoaded;

        //begin load
        // create an new instance of a pixi stage
        var stage = new PIXI.Stage(0x66FF99);

        loader.load();
        function onAssetsLoaded() {
            var bitmapFontText = new PIXI.BitmapText("bitmap fonts are\n now supported!", { font: "35px Desyrel", align: "right" });
            bitmapFontText.position.x = 620 - bitmapFontText.width - 20;
            bitmapFontText.position.y = 20;

            PIXI.runList(bitmapFontText);
            stage.addChild(bitmapFontText);
        }

        // add a shiney background..
        var background = PIXI.Sprite.fromImage("textDemoBG.jpg");
        stage.addChild(background);

        // create a renderer instance
        var renderer = PIXI.autoDetectRenderer(620, 400);

        // add the renderer view element to the DOM
        document.body.appendChild(renderer.view);

        requestAnimFrame(animate);

        // create some white text using the Snippet webfont
        var textSample = new PIXI.Text("Pixi.js can has\nmultiline text!", { font: "35px Snippet", fill: "white", align: "left" });
        textSample.position.x = 20;
        textSample.position.y = 20;

        // create a text object with a nice stroke
        var spinningText = new PIXI.Text("I'm fun!", { font: "bold 60px Podkova", fill: "#cc00ff", align: "center", stroke: "#FFFFFF", strokeThickness: 6 });

        // setting the anchor point to 0.5 will center align the text... great for spinning!
        spinningText.anchor.x = spinningText.anchor.y = 0.5;
        spinningText.position.x = 620 / 2;
        spinningText.position.y = 400 / 2;

        // create a text object that will be updated..
        var countingText = new PIXI.Text("COUNT 4EVAR: 0", { font: "bold italic 60px Arvo", fill: "#3e1707", align: "center", stroke: "#a4410e", strokeThickness: 7 });
        countingText.position.x = 620 / 2;
        countingText.position.y = 320;
        countingText.anchor.x = 0.5;

        stage.addChild(textSample);
        stage.addChild(spinningText);
        stage.addChild(countingText);

        var count = 0;
        var score = 0;

        function animate() {
            requestAnimFrame(animate);
            count++;
            if (count == 50) {
                count = 0;
                score++;

                // update the text...
                countingText.setText("COUNT 4EVAR: " + score);
            }

            // just for fun, lets rotate the text
            spinningText.rotation += 0.03;

            // render the stage
            renderer.render(stage);
        }
    }

    /////
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x97c56e, true);

    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null);

    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);
    renderer.view.style.position = "absolute";
    renderer.view.style.top = "0px";
    renderer.view.style.left = "0px";
    requestAnimFrame(animate);

    // create a texture from an image path
    var texture = PIXI.Texture.fromImage("p2.jpeg");

    // create a tiling sprite..
    // requires a texture, width and height
    // to work in webGL the texture size must be a power of two
    var tilingSprite = new PIXI.TilingSprite(texture, window.innerWidth, window.innerHeight);

    var count = 0;

    stage.addChild(tilingSprite);

    function animate33() {
        requestAnimFrame(animate);

        count += 0.005;
        tilingSprite.tileScale.x = 2 + Math.sin(count);
        tilingSprite.tileScale.y = 2 + Math.cos(count);

        tilingSprite.tilePosition.x += 1;
        tilingSprite.tilePosition.y += 1;

        // just for fun, lets rotate mr rabbit a little
        //stage.interactionManager.update();
        // render the stage
        renderer.render(stage);
    }

    /////
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x97c56e, true);

    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null);

    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);
    renderer.view.style.position = "absolute";
    renderer.view.style.top = "0px";
    renderer.view.style.left = "0px";
    requestAnimFrame(animate);

    // create a texture from an image path
    var texture = PIXI.Texture.fromImage("bunny.png");

    for (var i = 0; i < 10; i++) {
        createBunny(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
    }
    ;

    function createBunny(x, y) {
        // create our little bunny friend..
        var bunny = new PIXI.Sprite(texture);

        //	bunny.width = 300;
        // enable the bunny to be interactive.. this will allow it to respond to mouse and touch events
        bunny.interactive = true;

        // this button mode will mean the hand cursor appears when you rollover the bunny with your mouse
        bunny.buttonMode = true;

        // center the bunnys anchor point
        bunny.anchor.x = 0.5;
        bunny.anchor.y = 0.5;

        // make it a bit bigger, so its easier to touch
        bunny.scale.x = bunny.scale.y = 3;

        // use the mousedown and touchstart
        bunny.mousedown = bunny.touchstart = function (data) {
            // stop the default event...
            data.originalEvent.preventDefault();

            // store a refference to the data
            // The reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = data;
            this.alpha = 0.9;
            this.dragging = true;
        };

        // set the events for when the mouse is released or a touch is released
        bunny.mouseup = bunny.mouseupoutside = bunny.touchend = bunny.touchendoutside = function (data) {
            this.alpha = 1;
            this.dragging = false;

            // set the interaction data to null
            this.data = null;
        };

        // set the callbacks for when the mouse or a touch moves
        bunny.mousemove = bunny.touchmove = function (data) {
            if (this.dragging) {
                // need to get parent coords..
                var newPosition = this.data.getLocalPosition(this.parent);
                this.position.x = newPosition.x;
                this.position.y = newPosition.y;
            }
        };

        // move the sprite to its designated position
        bunny.position.x = x;
        bunny.position.y = y;

        // add it to the stage
        stage.addChild(bunny);
    }

    function animate44() {
        requestAnimFrame(animate);

        // just for fun, lets rotate mr rabbit a little
        //stage.interactionManager.update();
        // render the stage
        renderer.render(stage);
    }

    ////
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x66FF99);

    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(400, 300, null, true);

    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);
    renderer.view.style.position = "absolute";
    renderer.view.style.top = "0px";
    renderer.view.style.left = "0px";
    requestAnimFrame(animate);

    // create a texture from an image path
    var texture = PIXI.Texture.fromImage("bunny.png");

    // create a new Sprite using the texture
    var bunny = new PIXI.Sprite(texture);

    // center the sprites anchor point
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;

    // move the sprite t the center of the screen
    bunny.position.x = 200;
    bunny.position.y = 150;

    stage.addChild(bunny);

    function animate55() {
        requestAnimFrame(animate);

        // just for fun, lets rotate mr rabbit a little
        bunny.rotation += 0.1;

        // render the stage
        renderer.render(stage);
    }

    ///////
    // create an new instance of a pixi stage
    // the second parameter is interactivity...
    var interactive = true;
    var stage = new PIXI.Stage(0x000000, interactive);

    // create a renderer instance.
    var renderer = PIXI.autoDetectRenderer(620, 400);

    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);

    requestAnimFrame(animate);

    // create a background..
    var background = PIXI.Sprite.fromImage("button_test_BG.jpg");

    // add background to stage..
    stage.addChild(background);

    // create some textures from an image path
    var textureButton = PIXI.Texture.fromImage("button.png");
    var textureButtonDown = PIXI.Texture.fromImage("buttonDown.png");
    var textureButtonOver = PIXI.Texture.fromImage("buttonOver.png");

    var buttons = [];

    var buttonPositions = [
        175, 75,
        600 - 145, 75,
        600 / 2 - 20, 400 / 2 + 10,
        175, 400 - 75,
        600 - 115, 400 - 95];

    for (var i = 0; i < 5; i++) {
        var button = new PIXI.Sprite(textureButton);
        button.buttonMode = true;

        button.anchor.x = 0.5;
        button.anchor.y = 0.5;

        button.position.x = buttonPositions[i * 2];
        button.position.y = buttonPositions[i * 2 + 1];

        // make the button interactive..
        button.interactive = true;

        // set the mousedown and touchstart callback..
        button.mousedown = button.touchstart = function (data) {
            this.isdown = true;
            this.setTexture(textureButtonDown);
            this.alpha = 1;
        };

        // set the mouseup and touchend callback..
        button.mouseup = button.touchend = button.mouseupoutside = button.touchendoutside = function (data) {
            this.isdown = false;

            if (this.isOver) {
                this.setTexture(textureButtonOver);
            } else {
                this.setTexture(textureButton);
            }
        };

        // set the mouseover callback..
        button.mouseover = function (data) {
            this.isOver = true;

            if (this.isdown)
                return;

            this.setTexture(textureButtonOver);
        };

        // set the mouseout callback..
        button.mouseout = function (data) {
            this.isOver = false;
            if (this.isdown)
                return;
            this.setTexture(textureButton);
        };

        button.click = function (data) {
            // click!
            console.log("CLICK!");
            //	alert("CLICK!")
        };

        button.tap = function (data) {
            // click!
            console.log("TAP!!");
            //this.alpha = 0.5;
        };

        // add it to the stage
        stage.addChild(button);

        // add button to array
        buttons.push(button);
    }
    ;

    // set some silly values..
    buttons[0].scale.x = 1.2;

    buttons[1].scale.y = 1.2;

    buttons[2].rotation = Math.PI / 10;

    buttons[3].scale.x = 0.8;
    buttons[3].scale.y = 0.8;

    buttons[4].scale.x = 0.8;
    buttons[4].scale.y = 1.2;
    buttons[4].rotation = Math.PI;

    // var button1 =
    function animate66() {
        requestAnimFrame(animate);

        // render the stage
        // do a test..
        renderer.render(stage);
    }

    // add a logo!
    var pixiLogo = PIXI.Sprite.fromImage("pixi.png");
    stage.addChild(pixiLogo);

    pixiLogo.position.x = 620 - 56;
    pixiLogo.position.y = 400 - 32;

    pixiLogo.setInteractive(true);

    pixiLogo.click = pixiLogo.tap = function () {
        var win = window.open("https://github.com/GoodBoyDigital/pixi.js", '_blank');
    };

    //////
    var w = 1024;
    var h = 768;

    var n = 2000;
    var d = 1;
    var current = 1;
    var objs = 17;
    var vx = 0;
    var vy = 0;
    var vz = 0;
    var points1 = [];
    var points2 = [];
    var points3 = [];
    var tpoint1 = [];
    var tpoint2 = [];
    var tpoint3 = [];
    var balls = [];

    function start() {
        var ballTexture = PIXI.Texture.fromImage("assets/pixel.png");

        renderer = PIXI.autoDetectRenderer(w, h);

        stage = new PIXI.Stage(0x000000);

        document.body.appendChild(renderer.view);

        makeObject(0);

        for (var i = 0; i < n; i++) {
            tpoint1[i] = points1[i];
            tpoint2[i] = points2[i];
            tpoint3[i] = points3[i];

            var tempBall = new PIXI.Sprite(ballTexture);
            tempBall.anchor.x = 0.5;
            tempBall.anchor.y = 0.5;
            tempBall.alpha = 0.5;
            balls[i] = tempBall;

            stage.addChild(tempBall);
        }

        setTimeout(nextObject, 5000);

        requestAnimFrame(update);
    }

    function nextObject() {
        current++;

        if (current > objs) {
            current = 0;
        }

        makeObject(current);

        setTimeout(nextObject, 8000);
    }

    function makeObject(t) {
        var xd;

        switch (t) {
            case 0:
                for (var i = 0; i < n; i++) {
                    points1[i] = -50 + Math.round(Math.random() * 100);
                    points2[i] = 0;
                    points3[i] = 0;
                }
                break;

            case 1:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(xd) * 10) * (Math.cos(t * 360 / n) * 10);
                    points2[i] = (Math.cos(xd) * 10) * (Math.sin(t * 360 / n) * 10);
                    points3[i] = Math.sin(xd) * 100;
                }
                break;

            case 2:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(xd) * 10) * (Math.cos(t * 360 / n) * 10);
                    points2[i] = (Math.cos(xd) * 10) * (Math.sin(t * 360 / n) * 10);
                    points3[i] = Math.sin(i * 360 / n) * 100;
                }
                break;

            case 3:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(xd) * 10) * (Math.cos(xd) * 10);
                    points2[i] = (Math.cos(xd) * 10) * (Math.sin(xd) * 10);
                    points3[i] = Math.sin(xd) * 100;
                }
                break;

            case 4:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(xd) * 10) * (Math.cos(xd) * 10);
                    points2[i] = (Math.cos(xd) * 10) * (Math.sin(xd) * 10);
                    points3[i] = Math.sin(i * 360 / n) * 100;
                }
                break;

            case 5:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(xd) * 10) * (Math.cos(xd) * 10);
                    points2[i] = (Math.cos(i * 360 / n) * 10) * (Math.sin(xd) * 10);
                    points3[i] = Math.sin(i * 360 / n) * 100;
                }
                break;

            case 6:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(i * 360 / n) * 10) * (Math.cos(i * 360 / n) * 10);
                    points2[i] = (Math.cos(i * 360 / n) * 10) * (Math.sin(xd) * 10);
                    points3[i] = Math.sin(i * 360 / n) * 100;
                }
                break;

            case 7:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(i * 360 / n) * 10) * (Math.cos(i * 360 / n) * 10);
                    points2[i] = (Math.cos(i * 360 / n) * 10) * (Math.sin(i * 360 / n) * 10);
                    points3[i] = Math.sin(i * 360 / n) * 100;
                }
                break;

            case 8:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(xd) * 10) * (Math.cos(i * 360 / n) * 10);
                    points2[i] = (Math.cos(i * 360 / n) * 10) * (Math.sin(i * 360 / n) * 10);
                    points3[i] = Math.sin(xd) * 100;
                }
                break;

            case 9:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(xd) * 10) * (Math.cos(i * 360 / n) * 10);
                    points2[i] = (Math.cos(i * 360 / n) * 10) * (Math.sin(xd) * 10);
                    points3[i] = Math.sin(xd) * 100;
                }
                break;

            case 10:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(i * 360 / n) * 10) * (Math.cos(i * 360 / n) * 10);
                    points2[i] = (Math.cos(xd) * 10) * (Math.sin(xd) * 10);
                    points3[i] = Math.sin(i * 360 / n) * 100;
                }
                break;

            case 11:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(xd) * 10) * (Math.cos(i * 360 / n) * 10);
                    points2[i] = (Math.sin(xd) * 10) * (Math.sin(i * 360 / n) * 10);
                    points3[i] = Math.sin(xd) * 100;
                }
                break;

            case 12:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(xd) * 10) * (Math.cos(xd) * 10);
                    points2[i] = (Math.sin(xd) * 10) * (Math.sin(xd) * 10);
                    points3[i] = Math.sin(i * 360 / n) * 100;
                }
                break;

            case 13:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(xd) * 10) * (Math.cos(i * 360 / n) * 10);
                    points2[i] = (Math.sin(i * 360 / n) * 10) * (Math.sin(xd) * 10);
                    points3[i] = Math.sin(i * 360 / n) * 100;
                }
                break;

            case 14:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.sin(xd) * 10) * (Math.cos(xd) * 10);
                    points2[i] = (Math.sin(xd) * 10) * (Math.sin(i * 360 / n) * 10);
                    points3[i] = Math.sin(i * 360 / n) * 100;
                }
                break;

            case 15:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(i * 360 / n) * 10) * (Math.cos(i * 360 / n) * 10);
                    points2[i] = (Math.sin(i * 360 / n) * 10) * (Math.sin(xd) * 10);
                    points3[i] = Math.sin(i * 360 / n) * 100;
                }
                break;

            case 16:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(xd) * 10) * (Math.cos(i * 360 / n) * 10);
                    points2[i] = (Math.sin(i * 360 / n) * 10) * (Math.sin(xd) * 10);
                    points3[i] = Math.sin(xd) * 100;
                }
                break;

            case 17:
                for (var i = 0; i < n; i++) {
                    xd = -90 + Math.round(Math.random() * 180);
                    points1[i] = (Math.cos(xd) * 10) * (Math.cos(xd) * 10);
                    points2[i] = (Math.cos(i * 360 / n) * 10) * (Math.sin(i * 360 / n) * 10);
                    points3[i] = Math.sin(i * 360 / n) * 100;
                }
                break;
        }
    }

    function update() {
        var x3d, y3d, z3d, tx, ty, tz, ox;

        if (d < 250) {
            d++;
        }

        vx += 0.0075;
        vy += 0.0075;
        vz += 0.0075;

        for (var i = 0; i < n; i++) {
            if (points1[i] > tpoint1[i]) {
                tpoint1[i] = tpoint1[i] + 1;
            }
            if (points1[i] < tpoint1[i]) {
                tpoint1[i] = tpoint1[i] - 1;
            }
            if (points2[i] > tpoint2[i]) {
                tpoint2[i] = tpoint2[i] + 1;
            }
            if (points2[i] < tpoint2[i]) {
                tpoint2[i] = tpoint2[i] - 1;
            }
            if (points3[i] > tpoint3[i]) {
                tpoint3[i] = tpoint3[i] + 1;
            }
            if (points3[i] < tpoint3[i]) {
                tpoint3[i] = tpoint3[i] - 1;
            }

            x3d = tpoint1[i];
            y3d = tpoint2[i];
            z3d = tpoint3[i];

            ty = (y3d * Math.cos(vx)) - (z3d * Math.sin(vx));
            tz = (y3d * Math.sin(vx)) + (z3d * Math.cos(vx));
            tx = (x3d * Math.cos(vy)) - (tz * Math.sin(vy));
            tz = (x3d * Math.sin(vy)) + (tz * Math.cos(vy));
            ox = tx;
            tx = (tx * Math.cos(vz)) - (ty * Math.sin(vz));
            ty = (ox * Math.sin(vz)) + (ty * Math.cos(vz));

            balls[i].position.x = (512 * tx) / (d - tz) + w / 2;
            balls[i].position.y = (h / 2) - (512 * ty) / (d - tz);
        }

        renderer.render(stage);

        requestAnimFrame(update);
    }

    ///////
    //	Globals, globals everywhere and not a drop to drink
    var w = 1024;
    var h = 768;
    var starCount = 2500;
    var sx = 1.0 + (Math.random() / 20);
    var sy = 1.0 + (Math.random() / 20);
    var slideX = w / 2;
    var slideY = h / 2;
    var stars = [];

    function start2() {
        var ballTexture = PIXI.Texture.fromImage("assets/bubble_32x32.png");

        renderer = PIXI.autoDetectRenderer(w, h);

        stage = new PIXI.Stage(0x000000);

        document.body.appendChild(renderer.view);

        for (var i = 0; i < starCount; i++) {
            var tempBall = new PIXI.Sprite(ballTexture);

            tempBall.position.x = (Math.random() * w) - slideX;
            tempBall.position.y = (Math.random() * h) - slideY;
            tempBall.anchor.x = 0.5;
            tempBall.anchor.y = 0.5;

            stars.push({ sprite: tempBall, x: tempBall.position.x, y: tempBall.position.y });

            stage.addChild(tempBall);
        }

        document.getElementById('rnd').onclick = newWave;
        document.getElementById('sx').innerHTML = 'SX: ' + sx + '<br />SY: ' + sy;

        requestAnimFrame(update);
    }

    function newWave() {
        sx = 1.0 + (Math.random() / 20);
        sy = 1.0 + (Math.random() / 20);
        document.getElementById('sx').innerHTML = 'SX: ' + sx + '<br />SY: ' + sy;
    }

    function update22() {
        for (var i = 0; i < starCount; i++) {
            stars[i].sprite.position.x = stars[i].x + slideX;
            stars[i].sprite.position.y = stars[i].y + slideY;
            stars[i].x = stars[i].x * sx;
            stars[i].y = stars[i].y * sy;

            if (stars[i].x > w) {
                stars[i].x = stars[i].x - w;
            } else if (stars[i].x < -w) {
                stars[i].x = stars[i].x + w;
            }

            if (stars[i].y > h) {
                stars[i].y = stars[i].y - h;
            } else if (stars[i].y < -h) {
                stars[i].y = stars[i].y + h;
            }
        }

        renderer.render(stage);

        requestAnimFrame(update);
    }
}
///<reference path="./soundjs.d.ts"/>
// Sample from : http://www.createjs.com/Docs/SoundJS/modules/SoundJS.html
// Feature set example:
createjs.Sound.addEventListener("fileload", createjs.proxy(this.loadHandler, this));
createjs.Sound.registerSound("path/to/mySound.mp3|path/to/mySound.ogg", "sound");
function loadHandler(event) {
    // This is fired for each sound that is registered.
    var instance = createjs.Sound.play("sound");
    instance.addEventListener("complete", createjs.proxy(this.handleComplete, this));
    instance.setVolume(0.5);
}
///<reference path="./tweenjs.d.ts"/>
///<reference path="../easeljs/easeljs.d.ts"/>
var target = new createjs.DisplayObject();

// source : http://www.createjs.com/Docs/TweenJS/modules/TweenJS.html
// Chainable modules :
target.alpha = 1;
createjs.Tween.get(target).wait(500, false).to({ alpha: 0, visible: false }, 1000).call(onComplete);
function onComplete() {
    //Tween complete
}
var Input;
(function (Input) {
    Input.x = 0;
    Input.y = 0;
    Input.z = 0;
    Input.alt = false;
    Input.run = false;
})(Input || (Input = {}));
var Main = (function () {
    //private createJsView: CreateJsView;
    //private pixiView: PixiView;
    function Main() {
        this.setStageProperty();

        this.threeView = new ThreeView();

        //this.createJsView = new CreateJsView();
        //this.pixiView = new PixiView();
        //mouse Event
        document.onmousemove = this.mouseMoveHandler.bind(this);

        window.onkeydown = this.keyDown.bind(this);
        window.onkeyup = this.keyUp.bind(this);

        /*
        SoundManager.init();
        var soundBtn: HTMLElement = document.getElementById("sound-btn");
        soundBtn.addEventListener("click", this.soundBtnClickHandler);
        */
        this.animate();
        window.onresize = this.resize.bind(this);
        window.onbeforeunload = this.reload.bind(this);
        //setTimeout(this.reload.bind(this), 3000);
    }
    Main.prototype.soundBtnClickHandler = function () {
        //sound id, loop flag, duplication flag
        SoundManager.play(1, false);
    };

    Main.prototype.mouseMoveHandler = function (e) {
        var rect = e.target.getBoundingClientRect();
        Vars.mouseX = e.clientX;
        Vars.mouseY = e.clientY;
    };

    Main.prototype.keyDown = function (e) {
        e.preventDefault();

        // left or a
        if (e.keyCode === 37 || e.keyCode === 65) {
            Input.x = -1;
        }
        if (e.keyCode === 38 || e.keyCode === 87) {
            Input.z = 1;
        }

        // right or d
        if (e.keyCode === 39 || e.keyCode === 68) {
            Input.x = 1;
        }

        // down or s
        if (e.keyCode === 40 || e.keyCode === 83) {
            Input.z = -1;
        }

        //space key
        if (e.keyCode === 32) {
            Input.y = 1;
        }

        //shift key
        if (e.keyCode === 16) {
            Input.run = true;
        }

        //alt key
        if (e.keyCode === 18) {
            Input.alt = true;
        }
    };

    Main.prototype.keyUp = function (e) {
        e.preventDefault();

        // left or a
        if (e.keyCode === 37 || e.keyCode === 65) {
            Input.x = 0;
        }
        if (e.keyCode === 38 || e.keyCode === 87) {
            Input.z = 0;
        }

        // right or d
        if (e.keyCode === 39 || e.keyCode === 68) {
            Input.x = 0;
        }

        // down or s
        if (e.keyCode === 40 || e.keyCode === 83) {
            Input.z = 0;
        }

        //space key
        if (e.keyCode === 32) {
            Input.y = 0;
        }

        //shift key
        if (e.keyCode === 16) {
            Input.run = false;
        }

        //alt key
        if (e.keyCode === 18) {
            Input.alt = false;
        }
    };

    Main.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.animate();
        });

        TWEEN.update();
    };

    Main.prototype.resize = function () {
        this.setStageProperty();

        if (this.threeView)
            this.threeView.resize();
        //if ( this.createJsView ) this.createJsView.resize();
        //if ( this.pixiView ) this.pixiView.resize();
    };

    Main.prototype.setStageProperty = function () {
        Vars.stageWidth = window.innerWidth;
        Vars.stageHeight = window.innerHeight;
        Vars.windowHalfX = Vars.stageWidth / 2;
        Vars.windowHalfY = Vars.stageHeight / 2;
    };

    Main.prototype.reload = function (e) {
        var e = e || window.event;

        if (this.threeView)
            this.threeView.reload();

        //alert("memory cloer");
        return 'memory clear';
    };
    return Main;
})();

window.onload = function () {
    var main = new Main();
};
var SoundManager;
(function (SoundManager) {
    var preload;
    var instanceHash = {};
    var volumeObj = { volume: 1 };

    function init() {
        var assetsPath = "assets/sound/";
        var manifest = [
            { src: "denkiSwitch.mp3", type: "sound", id: 1, data: 1 }
        ];

        createjs.Sound.alternateExtensions = ["mp3"]; // add other extensions to try loading if the src file extension is not supported
        createjs.Sound.addEventListener("fileload", createjs.proxy(soundLoaded, this)); // add an event listener for when load is completed
        createjs.Sound.registerManifest(manifest, assetsPath);
    }
    SoundManager.init = init;

    function soundLoaded(event) {
        console.log("sound load comp");
    }

    function stop() {
        if (preload != null) {
            preload.close();
        }
        createjs.Sound.stop();
    }
    SoundManager.stop = stop;

    function play(id, loopFlag) {
        var loop = 0;
        if (loopFlag)
            loop = -1;
        var instance = createjs.Sound.createInstance(id);
        instance.play(createjs.Sound.INTERRUPT_ANY, 0, 0, loop, 1, 1);

        if (instance == null || instance.playState == createjs.Sound.PLAY_FAILED) {
            return;
        } else {
            instanceHash[instance.uniqueId] = instance;
            instance.addEventListener("succeeded", createjs.proxy(playSuccess, instance));
            instance.addEventListener("interrupted", createjs.proxy(playFailed, instance));
            instance.addEventListener("failed", createjs.proxy(playFailed, instance));
            instance.addEventListener("complete", createjs.proxy(soundComplete, instance));
        }

        return instance.uniqueId;
    }
    SoundManager.play = play;

    function playSuccess() {
    }

    function playFailed(e) {
        var instance = e.target;
        instance.removeAllEventListeners();
        delete (instanceHash[instance.uniqueId]);
    }

    function soundComplete(e) {
        var instance = e.target;
        instance.removeAllEventListeners();
        delete (instanceHash[instance.uniqueId]);
    }

    function pause(id) {
        if (instanceHash[id])
            instanceHash[id].pause();
    }
    SoundManager.pause = pause;

    function resume(id) {
        if (instanceHash[id])
            instanceHash[id].resume();
    }
    SoundManager.resume = resume;

    function allPause() {
        for (var id in instanceHash) {
            instanceHash[id].pause();
        }
    }
    SoundManager.allPause = allPause;

    function allResume() {
        for (var id in instanceHash) {
            instanceHash[id].resume();
        }
    }
    SoundManager.allResume = allResume;

    function setVolume(volume) {
        createjs.Sound.setVolume(volume);
    }
    SoundManager.setVolume = setVolume;

    function setSmoothVolume(volume, time, pauseFlag) {
        new TWEEN.Tween(volumeObj).to({ volume: volume }, time).easing(TWEEN.Easing.Quadratic.InOut).onUpdate(function () {
            createjs.Sound.setVolume(volumeObj.volume);
        }.bind(this)).onComplete(function (self) {
            if (pauseFlag)
                allPause();
        }.bind(this)).start();
    }
    SoundManager.setSmoothVolume = setSmoothVolume;
})(SoundManager || (SoundManager = {}));
var CameraManager;
(function (CameraManager) {
    var cameraY = 4;
    var cameraRadius = 5;
    var cameraRot = 0;
    CameraManager.camera;
    var speed = 10;
    var loopTime = 60;

    CameraManager.cameraTarget = new THREE.Vector3(0, 2, 0);

    var cameraMovePoints = [];
    var cameraMoveSpline;

    var moveSpline;

    function init() {
        var fov = 45;
        var aspect = Vars.stageWidth / Vars.stageHeight;
        CameraManager.camera = new THREE.PerspectiveCamera(fov, aspect, 1, 200);

        CameraManager.camera.position.set(0, cameraY, -cameraRadius);
        CameraManager.camera.lookAt(CameraManager.cameraTarget);
    }
    CameraManager.init = init;

    //CameraManagerのanimateはバグ対策の為にVars.tsにて実行させている。
    function animate() {
        if (true) {
            cameraRot += .1;
            var radian = cameraRot * Vars.toRad;
            var x = Math.cos(radian) * cameraRadius;
            var z = Math.sin(radian) * cameraRadius;
            CameraManager.camera.position.set(x, cameraY, z);
            CameraManager.camera.lookAt(CameraManager.cameraTarget);
        } else {
            //camera.position.z += .1;
            //camera.position.x += .1;
        }

        if (moveSpline)
            moveSpline.animate();
    }
    CameraManager.animate = animate;

    function addCameraMovePoints(_cameraMovePoints) {
        moveSpline = new CameraMoveSpline(CameraManager.camera, _cameraMovePoints, loopTime);
    }
    CameraManager.addCameraMovePoints = addCameraMovePoints;
})(CameraManager || (CameraManager = {}));
var CameraMoveSpline = (function () {
    function CameraMoveSpline(_object, movePoints, _loopTime) {
        this.object = _object;
        this.moveSpline = new THREE.SplineCurve3(movePoints);
        this.loopTime = _loopTime;
    }
    CameraMoveSpline.prototype.animate = function () {
        var time = Date.now();
        var looptime = this.loopTime * 1000;
        var t = (time % looptime) / looptime;

        var pos = this.moveSpline.getPointAt(t);
        this.object.position.copy(pos);
    };
    return CameraMoveSpline;
})();
var DeallocateManager;
(function (DeallocateManager) {
    var _gl;

    function init() {
        _gl = RendererManager.renderer.context;
    }
    DeallocateManager.init = init;

    var deleteBuffers = function (geometry) {
        if (geometry.__webglVertexBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglVertexBuffer);
        if (geometry.__webglNormalBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglNormalBuffer);
        if (geometry.__webglTangentBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglTangentBuffer);
        if (geometry.__webglColorBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglColorBuffer);
        if (geometry.__webglUVBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglUVBuffer);
        if (geometry.__webglUV2Buffer !== undefined)
            _gl.deleteBuffer(geometry.__webglUV2Buffer);

        if (geometry.__webglSkinIndicesBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglSkinIndicesBuffer);
        if (geometry.__webglSkinWeightsBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglSkinWeightsBuffer);

        if (geometry.__webglFaceBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglFaceBuffer);
        if (geometry.__webglLineBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglLineBuffer);

        if (geometry.__webglLineDistanceBuffer !== undefined)
            _gl.deleteBuffer(geometry.__webglLineDistanceBuffer);

        // custom attributes
        if (geometry.__webglCustomAttributesList !== undefined) {
            for (var id in geometry.__webglCustomAttributesList) {
                _gl.deleteBuffer(geometry.__webglCustomAttributesList[id].buffer);
            }
        }

        RendererManager.renderer.info.memory.geometries--;
    };

    DeallocateManager.deallocateGeometry = function (geometry) {
        geometry.__webglInit = undefined;

        if (geometry instanceof THREE.BufferGeometry) {
            var attributes = geometry.attributes;

            for (var key in attributes) {
                if (attributes[key].buffer !== undefined) {
                    _gl.deleteBuffer(attributes[key].buffer);
                }
            }

            RendererManager.renderer.info.memory.geometries--;
        } else {
            if (geometry.geometryGroups !== undefined) {
                for (var i = 0, l = geometry.geometryGroupsList.length; i < l; i++) {
                    var geometryGroup = geometry.geometryGroupsList[i];

                    if (geometryGroup.numMorphTargets !== undefined) {
                        for (var m = 0, ml = geometryGroup.numMorphTargets; m < ml; m++) {
                            _gl.deleteBuffer(geometryGroup.__webglMorphTargetsBuffers[m]);
                        }
                    }

                    if (geometryGroup.numMorphNormals !== undefined) {
                        for (var m = 0, ml = geometryGroup.numMorphNormals; m < ml; m++) {
                            _gl.deleteBuffer(geometryGroup.__webglMorphNormalsBuffers[m]);
                        }
                    }

                    deleteBuffers(geometryGroup);
                }
            } else {
                deleteBuffers(geometry);
            }
        }
    };

    DeallocateManager.deallocateTexture = function (texture) {
        if (texture.image && texture.image.__webglTextureCube) {
            // cube texture
            _gl.deleteTexture(texture.image.__webglTextureCube);
        } else {
            // 2D texture
            if (!texture.__webglInit)
                return;

            texture.__webglInit = false;
            _gl.deleteTexture(texture.__webglTexture);
        }
    };
})(DeallocateManager || (DeallocateManager = {}));
var DoorAnimationManager = (function () {
    function DoorAnimationManager(mesh, length) {
        this.meshArray = [];
    }
    return DoorAnimationManager;
})();
var GlowCameraManager;
(function (GlowCameraManager) {
    GlowCameraManager.camera;

    function init() {
        var fov = 45;
        var aspect = Vars.stageWidth / Vars.stageHeight;
        GlowCameraManager.camera = new THREE.PerspectiveCamera(fov, aspect, 1, 200);
        GlowCameraManager.camera.position.set(0, 4, -7);
        GlowCameraManager.camera.lookAt(new THREE.Vector3());

        animate();
    }
    GlowCameraManager.init = init;

    function animate() {
        requestAnimationFrame(function () {
            return animate();
        });

        GlowCameraManager.camera.position.copy(CameraManager.camera.position);
        GlowCameraManager.camera.rotation = CameraManager.camera.rotation;
        GlowCameraManager.camera.lookAt(CameraManager.cameraTarget);
    }
})(GlowCameraManager || (GlowCameraManager = {}));
var GlowObject = (function () {
    function GlowObject(_original, _copy) {
        this.original = _original;
        this.copy = _copy;
    }
    return GlowObject;
})();
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var GlowScene = (function (_super) {
    __extends(GlowScene, _super);
    function GlowScene() {
        _super.call(this);

        GlowCameraManager.init();
        this.initLight();
    }
    GlowScene.prototype.initLight = function () {
        var light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(300, 1000, -100);
        this.add(light);
    };
    return GlowScene;
})(THREE.Scene);
var Ground = (function (_super) {
    __extends(Ground, _super);
    function Ground() {
        _super.call(this);

        var url = 'assets/models/scene_test2.js';
        new LoadManager(url, "scene", this.modelLoadCompHandler.bind(this)); //scene or json

        this.animate();
    }
    Ground.prototype.modelLoadCompHandler = function (result) {
        /*
        //door
        var doorMesh: THREE.Mesh = result.objects.Cube;
        doorMesh.scale.multiplyScalar( 4 );
        doorMesh.updateMatrix(); //scaleを変更したらupdateMatrixが必要
        var meshs: Array<THREE.Mesh> = MeshManager.duplicates(doorMesh, 100);
        var obj: any = PropertyManager.rotations(meshs, 3);
        var mesh: THREE.Mesh = MeshManager.merge(obj.meshs);
        //this.add(mesh);
        mesh.material = new THREE.MeshLambertMaterial({ color: 0xffffff });
        PostprocessManager1.add(mesh);
        
        CameraManager.addCameraMovePoints(obj.positions);
        
        
        //house
        var houseMeshs: Array<THREE.Mesh> = [result.objects.home1, result.objects.home2, result.objects.home3 ];
        //PropertyManager.sizes(houseMeshs, 1);
        //PropertyManager.rotations(houseMeshs, 180 * Vars.toRad);
        PropertyManager.positions( houseMeshs, new THREE.Vector3( 0, 0, 10 ) );
        for (var i: number = 0; i < houseMeshs.length; i++) {
        houseMeshs[i].material = new THREE.MeshPhongMaterial({ color: 0x88dcff, specular:.8 });
        PostprocessManager1.add(houseMeshs[i]);
        }
        new RollDownManager(houseMeshs, 5);
        */
        //ground
        var ground1Mesh = result.objects.ground;
        var loader = new THREE.DDSLoader();
        var groundMap = loader.load("assets/models/bake2.dds");
        groundMap.minFilter = groundMap.magFilter = THREE.LinearFilter;

        /*
        //var groundMap = THREE.ImageUtils.loadTexture('assets/models/bake2.jpg');
        var toonMap = loader.load('img/toon3.dds');
        toonMap.minFilter = toonMap.magFilter = THREE.LinearFilter;
        //var toonMap = THREE.ImageUtils.loadTexture('img/toon3.png');
        var groundMaterial: THREE.ShaderMaterial = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('toon-vshader').textContent,
        fragmentShader: document.getElementById('toon-fshader').textContent,
        
        uniforms: {
        texture: {
        type: 't', value: groundMap
        },
        toonTexture: {
        type: 't', value: toonMap
        },
        lightDirection: {
        type: 'v3',
        value: new THREE.Vector3(1, 1, 0)
        },
        viewVector: {
        type: 'v3',
        value: CameraManager.camera.position.clone().normalize()
        }
        },
        transparent: false
        });
        */
        var groundMaterial = new THREE.MeshBasicMaterial({
            map: groundMap,
            transparent: false
        });
        ground1Mesh.material = groundMaterial;
        ground1Mesh.material.needsUpdate = true;

        var grassMesh = result.objects.grass;
        var grassAlphaMap = loader.load("assets/models/bake2mask.dds");
        grassAlphaMap.minFilter = grassAlphaMap.magFilter = THREE.LinearFilter;

        //var grassAlphaMap = THREE.ImageUtils.loadTexture('assets/models/bake2mask.jpg');
        /*
        var grassMaterial: THREE.ShaderMaterial = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('toon-alpha-vshader').textContent,
        fragmentShader: document.getElementById('toon-alpha-fshader').textContent,
        
        uniforms: {
        texture: {
        type: 't', value:groundMap
        },
        toonTexture: {
        type: 't', value: toonMap
        },
        alphaTexture: {
        type: 't', value: grassAlphaMap
        },
        lightDirection: {
        type: 'v3',
        value: new THREE.Vector3(1, 1, 0)
        },
        viewVector: {
        type: 'v3',
        value: CameraManager.camera.position.clone().normalize()
        }
        },
        side: THREE.DoubleSide,
        transparent: true
        });
        */
        var grassMaterial = new THREE.MeshBasicMaterial({
            map: groundMap,
            alphaMap: grassAlphaMap,
            transparent: true,
            alphaTest: .5,
            side: THREE.DoubleSide
        });
        grassMesh.material = grassMaterial;
        grassMesh.material.needsUpdate = true;

        var takibiMesh = result.objects.takibi;
        var takibiMap = THREE.ImageUtils.loadTexture('assets/models/takibi.jpg');
        var takibiMaterial = new THREE.MeshBasicMaterial({
            map: takibiMap
        });
        takibiMesh.material = takibiMaterial;
        takibiMesh.material.needsUpdate = true;

        var meshs = [ground1Mesh, grassMesh, takibiMesh];
        var groundMesh = MeshManager.merge(meshs);
        this.add(groundMesh);

        this.fireParticle1 = new FireParticle1();
        this.fireParticle1.position.copy(takibiMesh.position);
        this.fireParticle1.position.set(5.46, .91, 2.2);
        this.add(this.fireParticle1);

        /*var _grounds: Array<THREE.Mesh> = [ground1Mesh];
        
        GroundManager.init();
        var grounds: Array<THREE.Mesh> = GroundManager.initGround(_grounds);
        for (var i: number = 0; i < grounds.length; i++) this.add(grounds[i]);
        */
        /*
        //water rock
        var waterTex = THREE.ImageUtils.loadTexture('img/water1.jpg')
        waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping;
        this.waterMaterial = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('scroll-vshader').textContent,
        fragmentShader: document.getElementById('scroll-fshader').textContent,
        
        uniforms: {
        texture: {
        type: 't', value: THREE.ImageUtils.loadTexture('img/snow_negative_z.jpg')
        },
        overlayTexture: {
        type: 't', value: waterTex
        },
        lightDirection: {
        type: 'v3',
        value: this.light.position.clone().normalize()
        },
        time: {
        type: 'f',
        value: 0.0
        }
        },
        blending: THREE.NoBlending, transparent: true
        });
        
        
        var meshs: Array<THREE.Mesh> = [];
        for (var i: number = 0; i < 20; i++) {
        var geometry: THREE.Geometry = new THREE.SphereGeometry(4, 30, 30);
        var mesh: THREE.Mesh = new THREE.Mesh(geometry);
        var x:number = 40 * Math.random() - 20;
        var z:number = 300 * Math.random();
        mesh.position.set( x, 0, z );
        meshs.push(mesh);
        }
        var mesh: THREE.Mesh = MeshManager.merge(meshs);
        mesh.material = this.waterMaterial;
        this.add(mesh);
        */
        result = null;
        delete result;
    };

    Ground.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.animate();
        });
        //GroundManager.update();
    };
    return Ground;
})(THREE.Object3D);
var GroundManager;
(function (GroundManager) {
    var initFlag = false;
    var positions = [];
    GroundManager.groundSize = new THREE.Vector3(100, 100, 100);
    GroundManager.grounds = [];
    var oldCameraPos = new THREE.Vector3();

    function init() {
        for (var i = 0; i < 3; i++) {
            positions[i] = [];
            for (var j = 0; j < 3; j++) {
                positions[i].push(new THREE.Vector3());
            }
        }
    }
    GroundManager.init = init;

    function initGround(meshs) {
        var index = 0;
        var length = meshs.length;
        for (var i = 0; i < 9; i++) {
            var mesh = MeshManager.duplicate(meshs[index]);
            GroundManager.grounds.push(mesh);
            index++;
            if (index == length)
                index = 0;
        }

        setPositions();
        setGroundPosition();

        initFlag = true;

        return GroundManager.grounds;
    }
    GroundManager.initGround = initGround;

    function setPositions() {
        var cameraPos = getCameraPos();
        if (cameraPos.x != oldCameraPos.x || cameraPos.z != oldCameraPos.z)
            scrollGround(cameraPos);

        var pluseX = -1;
        var pluseZ = -1;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var x = cameraPos.x + pluseX;
                var z = cameraPos.z + pluseZ;
                positions[i][j] = new THREE.Vector3(x, 0, z);
                pluseZ++;
            }
            pluseZ = -1;
            pluseX++;
        }

        oldCameraPos = cameraPos.clone();
    }

    function getCameraPos() {
        var pos = CameraManager.camera.position.clone();
        var x = Math.round(pos.x / GroundManager.groundSize.x);
        var y = Math.round(pos.y / GroundManager.groundSize.y);
        var z = Math.round(pos.z / GroundManager.groundSize.z);

        return new THREE.Vector3(x, y, z);
    }

    function setGroundPosition() {
        var index = 0;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                var x = positions[i][j].x * GroundManager.groundSize.x;
                var z = positions[i][j].z * GroundManager.groundSize.z;
                GroundManager.grounds[index].position.set(x, 0, z);
                index++;
            }
        }

        return GroundManager.grounds;
    }

    function update() {
        if (initFlag) {
            setPositions();
            setGroundPosition();
        }
    }
    GroundManager.update = update;

    function scrollGround(cameraPos) {
        var index = 0;
        var g = [];
        for (var i = 0; i < 3; i++) {
            g[i] = [];
            for (var j = 0; j < 3; j++) {
                g[i].push(GroundManager.grounds[index]);
                index++;
            }
        }

        var x = cameraPos.x - oldCameraPos.x;
        var z = cameraPos.z - oldCameraPos.z;

        if (x > 0) {
            var xg = g.shift();
            g.push(xg);
        } else if (x < 0) {
            xg = g.pop();
            g.unshift(xg);
        }

        if (z > 0) {
            for (i = 0; i < 3; i++) {
                zg = g[i].shift();
                g[i].push(zg);
            }
        } else if (z < 0) {
            for (i = 0; i < 3; i++) {
                var zg = g[i].pop();
                g[i].unshift(zg);
            }
        }

        var index = 0;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                GroundManager.grounds[index] = g[i][j];
                index++;
            }
        }
    }
})(GroundManager || (GroundManager = {}));
var LoadManager = (function () {
    function LoadManager(url, type, _callbackFunc) {
        this.jsonLoader = new THREE.JSONLoader();
        this.sceneLoader = new THREE.SceneLoader();
        this.callbackFunc = _callbackFunc;

        switch (type) {
            case "scene":
                this.sceneLoader.load(url, this.sceneLoadCompHandler.bind(this));
                break;

            case "json":
                this.jsonLoader.load(url, this.jsonLoadCompHandler.bind(this));
                break;
        }
    }
    LoadManager.prototype.sceneLoadCompHandler = function (result) {
        //var scene = result.scene;
        /*
        for (var m in result.materials) {
        //alert( m );
        }
        for (var l in result.lights) {
        //alert(l);
        }
        for (var o in result.objects) {
        //alert(o);
        }
        
        alert(result.objects.Cube);
        */
        this.callbackFunc(result);
    };

    LoadManager.prototype.jsonLoadCompHandler = function (geometry, materials) {
        //var hasAnimation: boolean = false;
        //if (geometry.morphTargets.length) hasAnimation = true;
        //if (hasAnimation) {
        //var mesh: any = MeshManager.getAnimationMesh(geometry, materials);
        //geometry.dispose();
        //mesh.hasAnimation = true;
        /*} else {
        mesh = this.setNormalMesh(geometry, materials);
        }*/
        this.callbackFunc({ geometry: geometry });
    };

    //parseAnimations()を行うことによってmorphTargetsのnameが'attack001'、'attack002'となっているのを'attack'というふうにまとめてくれる。
    //morphTargetsのnameは_(アンダーバー)を含んではいけないらしい。
    //複数のアニメーションをこのやりかたで管理する場合は、morphTargetsのnameを事前にアニメーションごとに分ける必要があり、
    //現状blenderのexporterではそれを行うことはできない為、ひとつのアニメーションデータをsetAnimationLabelで
    //自力でラベル分けする方法でないと無理そうだ。
    LoadManager.prototype.setNormalMesh = function (geometry, materials) {
        var material = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.Mesh(geometry, material);
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();

        return mesh;
    };
    return LoadManager;
})();
var MaterialManager;
(function (MaterialManager) {
    function test() {
        var material = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('vshader').textContent,
            fragmentShader: document.getElementById('fshader').textContent,
            /*
            uniforms: {
            time: { type: 'f', value: 0 },
            size: { type: 'f', value: 0.13 },
            color: { type: 'c', value: new THREE.Color(0xffcc88) },
            texture: { type: 't', value: texture }
            },
            attributes: {
            lifetime: { type: 'f', value: [] },
            shift: { type: 'f', value: [] }
            },
            */
            blending: THREE.AdditiveBlending, transparent: true, depthTest: false
        });

        return material;
    }
    MaterialManager.test = test;
})(MaterialManager || (MaterialManager = {}));
var MeshManager;
(function (MeshManager) {
    function duplicate(_mesh) {
        var mesh = new THREE.Mesh(_mesh.geometry, _mesh.material);
        mesh.position.copy(_mesh.position);
        mesh.rotation.x = _mesh.rotation.x;
        mesh.rotation.y = _mesh.rotation.y;
        mesh.rotation.z = _mesh.rotation.z;
        mesh.scale.x = _mesh.scale.x;
        mesh.scale.y = _mesh.scale.y;
        mesh.scale.z = _mesh.scale.z;
        return mesh;
    }
    MeshManager.duplicate = duplicate;

    function duplicates(mesh, length) {
        var scale = mesh.scale.x;

        var meshs = [];
        for (var i = 0; i < length; i++) {
            var cloneMesh = new THREE.Mesh(mesh.geometry, mesh.material);
            cloneMesh.scale.multiplyScalar(scale);
            meshs.push(cloneMesh);
        }
        return meshs;
    }
    MeshManager.duplicates = duplicates;

    function merge(meshs) {
        var length = meshs.length;
        var geometry = new THREE.Geometry();
        var materials = [];

        for (var i = 0; i < length; i++) {
            materials.push(meshs[i].material);
            THREE.GeometryUtils.merge(geometry, meshs[i], i);
        }

        var material = new THREE.MeshFaceMaterial(materials);
        return new THREE.Mesh(geometry, material);
    }
    MeshManager.merge = merge;

    function getSize(mesh) {
        var min = mesh.geometry.vertices[0].clone();
        var max = min.clone();

        var length = mesh.geometry.vertices.length;
        for (var i = 0; i < length; i++) {
            var vertex = mesh.geometry.vertices[i];
            if (min.x > vertex.x)
                min.x = vertex.x;
            if (min.y > vertex.y)
                min.y = vertex.y;
            if (min.x > vertex.z)
                min.z = vertex.z;
            if (max.x < vertex.x)
                max.x = vertex.x;
            if (max.y < vertex.y)
                max.y = vertex.y;
            if (max.x < vertex.z)
                max.z = vertex.z;
        }

        var x = max.x - min.x;
        var y = max.y - min.y;
        var z = max.z - min.z;

        return new THREE.Vector3(x, y, z);
    }
    MeshManager.getSize = getSize;

    function getAnimationMesh(geometry, materials) {
        //メモリリーク
        geometry.computeMorphNormals();

        for (var i = 0; i < materials.length; i++)
            materials[i].morphTargets = true;

        var material = new THREE.MeshFaceMaterial(materials);
        var mesh = new THREE.MorphAnimMesh(geometry, material);
        geometry.dispose();

        //mesh.receiveShadow = true;
        mesh.parseAnimations();
        mesh.baseDuration = mesh.duration;

        //mesh.duration = 1000;
        //mesh.time = 1000 * Math.random();
        //mesh.matrixAutoUpdate = false;
        //mesh.updateMatrix();
        return mesh;
    }
    MeshManager.getAnimationMesh = getAnimationMesh;
})(MeshManager || (MeshManager = {}));
var PropertyManager;
(function (PropertyManager) {
    function rotations(meshs, dist) {
        var positions = [];
        var length = meshs.length;

        var rot = 0;
        var radius = 0;
        var radiusPlus = 200;

        for (var i = 0; i < length; i++) {
            meshs[i].position.z = i * dist;

            rot += 1;
            var radian = rot * Vars.toRad;
            radius += radiusPlus;
            if (radius > 1000 || radius < 100)
                radiusPlus = radiusPlus * -1;
            meshs[i].position.x = Math.cos(radian) * radius;
            meshs[i].position.y = Math.sin(radian) * radius + 500;

            positions.push(meshs[i].position.clone());
        }

        return { meshs: meshs, positions: positions };
    }
    PropertyManager.rotations = rotations;

    function sizes(meshs, scale) {
        var length = meshs.length;
        for (var i = 0; i < length; i++) {
            meshs[i].scale.multiplyScalar(scale);
        }

        return meshs;
    }
    PropertyManager.sizes = sizes;

    function randomSizes(meshs, min, max) {
        var length = meshs.length;
        for (var i = 0; i < length; i++) {
            var size = (max - min) * Math.random() + min;
            meshs[i].scale.multiplyScalar(size);
        }

        return meshs;
    }
    PropertyManager.randomSizes = randomSizes;

    function positions(meshs, position) {
        var length = meshs.length;
        for (var i = 0; i < length; i++) {
            meshs[i].position = position;
        }

        return meshs;
    }
    PropertyManager.positions = positions;
})(PropertyManager || (PropertyManager = {}));
var RollDown = (function () {
    function RollDown(_objects, _time) {
        this.objects = [];
        this.length = 0;
        this.time = 0;
        this.standby = true;
        this.objects = _objects;
        this.length = _objects.length;
        this.time = _time;
    }
    RollDown.prototype.start = function () {
        var x = 1000 * Math.random() - 500;
        var z = CameraManager.camera.position.z + 1000;
        for (var i = 0; i < this.length; i++) {
            this.objects[i].position.set(x, 1000, z);
            new TWEEN.Tween(this.objects[i].position).to({ y: 0 }, this.time).delay(i * 200).easing(TWEEN.Easing.Quadratic.InOut).onComplete(function (self) {
                this.standby = true;
            }.bind(this)).start();
        }
    };
    return RollDown;
})();
var RollDownManager = (function () {
    function RollDownManager(_objects, time) {
        this.rollDowns = [];
        this.length = 5;
        for (var i = 0; i < this.length; i++) {
            var rollDown = new RollDown(_objects, time);
            this.rollDowns.push(rollDown);
        }

        this.interval = setInterval(this.add.bind(this), 5000);
    }
    RollDownManager.prototype.add = function () {
        var addFlag = false;
        var length = this.rollDowns.length;
        for (var i = 0; i < length; i++) {
            if (this.rollDowns[i].standby && !addFlag) {
                this.rollDowns[i].standby = false;
                this.rollDowns[i].start();
                addFlag = true;
            }
        }
    };

    RollDownManager.prototype.remove = function () {
        clearInterval(this.interval);
    };
    return RollDownManager;
})();
var Snake = (function () {
    function Snake(meshArray) {
        this.meshLength = 0;
        this.vecArray = [];
        this.interval = 10;
        this.dist = 0;
        this.oldIndex = 0;
        this.targetPos = new THREE.Vector3();
        this.speed = 20;
        this.meshArray = meshArray;
        this.meshLength = meshArray.length;
        this.dist = this.interval * this.meshLength;

        for (var i = 0; i < this.dist; i++) {
            this.vecArray.push(new THREE.Vector3());
        }

        this.animate();
    }
    Snake.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.animate();
        });

        //set target position
        var obj = ThreeManager.getMouseTo(this.meshArray[0]);

        //var direction: THREE.Vector3 = ThreeManager.getCameraForward(obj.direction);
        //this.targetPos.add( direction.multiplyScalar( this.speed ) );
        //this.targetPos = ThreeManager.screen2world();
        this.targetPos = Vars.mousePosition;

        //set snake
        var index = this.oldIndex;
        for (var i = 0; i < this.meshLength; i++) {
            index = (index - this.interval + this.dist) % this.dist;
            this.meshArray[i].position.copy(this.vecArray[index]);
        }
        this.vecArray[this.oldIndex] = this.targetPos.clone();
        this.oldIndex = (this.oldIndex + 1) % this.dist;
    };
    return Snake;
})();
var MoveSpline = (function () {
    function MoveSpline(_object, movePoints, _loopTime) {
        this.object = _object;
        this.moveSpline = new THREE.SplineCurve3(movePoints);
        this.loopTime = _loopTime;

        this.animate();
    }
    MoveSpline.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.animate();
        });

        var time = Date.now();
        var looptime = this.loopTime * 1000;
        var t = (time % looptime) / looptime;

        var pos = this.moveSpline.getPointAt(t);
        this.object.position = pos;
    };
    return MoveSpline;
})();
var FireParticle1 = (function (_super) {
    __extends(FireParticle1, _super);
    function FireParticle1() {
        _super.call(this);
        this.clock = new THREE.Clock();

        var particleScale = 2;

        // Create particle group
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAgAElEQVR4Xu3dy5ImV3n9/67WEXy2JU5hAkwAAxjqAvBNcAu+Dq7AA2b2xHMzdITH9gV4ZnAEdhAYEyBhjPEZIan7vz6r9pP/rLerqqvV3fqpujIjUjtz5/HN6vxqPWs/e+fZvec7nV11+m9961uPbPva17621b355psXtn//+98/e+utt7bT/eAHP7iw/Td/8zcfOd8nPvGJK6/vRF/84hd7vh/+8IfbsvX333//4el9//rXv75Q93//938X1v/rv/7rwvq//uu/buvf+973Hjlffv8jdbtrXrft+f7FjrMfT+Bj/ASufaGf8r4vPfcpqPaQcr283Gff+MY3emmQUgLVHlB7OJ1C6bXXXrv0uq+++uq1v/XTn/70pZA4hdd+fQ+xPcD28NqDa/2+C9e5BlwHtJ7yH+Bx+Iv3BJ4HsJ4YVCA1j/azn/3stvx7v/d72/JAag+oPZz+7d/+7cJ194D6zGc+c+Ev94tf/KL7/v7v//6lUAi87j148ODhT37ykx73uc997t4HH3yw7buH1iw/KbxOVdcBrhfv5Tp+0bN/As8aWI+c7zpFJez727/92/6qy0B1Cqk9oAZIr7zyytnbb7/dc+whpf6mj+uNN954ZNc9oP7gD/7g4TvvvHNvQGbnU4AJK//wD/+wUBt43UR13RBch9q66R/z2O+FfgI3fqkf8xQeq6r2od8oKqHfhH2jpq6C1CmgLoPTyy+/3PuIgrq3B1bOfe+ll17a7vGXv/zlvd/93d+98JN++7d/+wIUKKzZYeB0CikA+/GPf3wBUu+++27Xr4LXVeHiHlyH2nqh37njxz3FE3gWwHqsqvrud7979s1vfrP+1NzrKKrrQDVQmnAvEDj72c9+VhgNnKYMCLZzT51rDah+53d+p5f+j//4j+1xTd3++e2h9Fu/9VsPB24DsCntN/tOWPjee+8VVvywqTsNGUd1XQauQ209xb/k49A78QSeFljXwgqoPMU9rG4CqgEUYO2V1R5Op8AaMP3v//5vrznrgc49dVFuj/2D/sZv/MbDgKT7WVbuAWV9IEWRXQWvDwOuq1oVr1BbR4j42L/mscOL+AQ+LLBupKo8sK9//euXqqrLQj+gGkApT5UUFTWgAqQ9pGY5CqZwsv7f//3f/ZsFLr2HQOje//zP/7ScyfpMADTbTkEFYOr+8z//817Ov6krALsMXnvVxdOaUJHC+spXvlKf61BbL+Irdfym5/kEPgywbqSq9rC6TFVNax8j/TJQBQwFVgzxM2EZUAUuBdbACpgAaiCltC2K6t79+/cvtDB+8pOfpLTuKWfKPTh+q9/7VrOcfTYlpQ6gqLaEluDWbfvw0DJYxSNr/VXg4nGdmvMTJh5q63n+kz/OfZufwJMC60awOlVVe59qQJWX8szyZWEfKI2aGjgJ62Z5wEQNAdOvfvWrswFUlEyXU9dtoGRS//rrr9+b9fmjqTM9zLRTXVs4mO0Xlmc/oBpYTTnKawAGVub8/p7DsnBxr7hOwfU4b+sIEW/z63bc+9M+gScB1hPBalTVT3/607PkO519+ctfvpfUgLNApqBy4wMrSoqi+tSnPrWBipoCuoDmPlANpCwDlBKQ9nCadecOFLaQMSqu8FKappyHl2sIGx+CnEmoNgor+3ZZaZtlEMv9tTTt4RUgPQCutFQWVoz7PbgGWuseGypeFyaO2rpBK+Lhaz3t23Ac/7F/AjcF1oeCFeAkR+osL+14SBdU1XhUe0U1gNpDKmALb87hNDMgmZTqAoquK0dt7cucYwPV5HOBzcALtEY9BVwbnNTl2EJJCVxRey0BS/1AK8oqq+ch4pS5vwJMXVolt/DxOrV16m0d0PrYv0fHDX5ET+AmwLqwzz4RdFoB3euEgZQVVZW8q3sDK6rq3//938/Sd+8s3g+lc5am//pR+9APmCb0y4teZQU62e++kM660voeXLN8CizwClS2+3dd4Jop1+hiwClMo/jugRXVYxmIbBsoAc9+yrbSalQXYMXo7zqlNf5XygcTJg64ojYbHsq234eJV4WIT+BrHUrrI3p5jst89E/gccC6MaxOQ0A/hbKaEBCwwAM0KKu8xPfHQN+rqmy7L+QbKEWJ3AciULK8L9ULHQOy1jt39nH+pjJYV2/dZP8FKJC6F1C0nqc0+1geCNkek77QMgOSbaAm1LNOaeUeWppy/QfCxQCvaiv1hRWD3rYBV37zg/G39morz3Ez6k9bEg9offQvyHHFj9cTuA5Yj4XVqKr0uetICuNXnYaACXHugwc1Ncoq61VQAyuKynFKKgq4BkRKoV9e9sJLST2BHkCZlAFit4OP9dk261oIB1IDrD2obAcbM3Vk34BT2sIDqgu0TPk9D5byKpSyT0FGcQkXleBkW1oLq7oGXONxCRWnFXHA5bynKRBf+MIXHkl/uGGIeCitj9e7dtzNM3gCVwHrSs9qwsA9rNxHOgjXXAcdamqU1V5VgdP4VoAVT6eAMk/oR1nlpS6gLIPVKCs7gd8KAQurQOE+896yc5Zea0pdwWV7znVBZU1r4fhWC2QDpIaDuTYYKR8ol/IqrKKyCqnlW7UOuKyb+V1K4NqrLcACsr23RW3t0yD2ISI/6ybQOloPn8HbcJziY/8ELgPWEymrm8BqQDVhIK+KugKqQKvAGm8qauR+vKJCCqxmtg4+1imsUVsDKRQTSoKTyfJSak1nUAda5gkNB1Z+w2SnK8GJ0hlIARdoLYg15Ms5gacT9ZXfUVCBFqU08AIsimvUVlpDH4y/paSyxuPK734QlfqIr3VTaPkdl4DrUFof+9fwuMGbPoFTYD2VshpzXdqC8A+MACShVv2qCQMBCrQoKSoqqqzLYGUdjAZUloV6A6nZBoLO4fxrG7/KftbrkwHWChEpvnkmm9pSsVIOCjLelIkfBVxmE4W06sGGqd4plwOrB+AFaGaTErQGYKCV31i1NYpLSWXxyAZY1t2PY68y4x/XgngorZv+0z/2u41P4FpgTYvgk4aB4MOzYohTS5QVgCzAFE48KvNAi4I6j8LOVZXQD6jUOQeYOR4nwCoAup/z3wfDUWi2g1X2KagsL2VFmVVZTRqDVsBs798MjLQSgoUpIKJKugxQgEVlKeNRFUo8KbBSAo0SuHLOD4SLJsACLxwdX0tpnnCRynIsU/7nP/+5lsVCywxyEx6OGX9Zl55TT+tQWbfxVTzu+SZPYA+sG4WCDPZ9GGgwPH31xrMCIKCimpa3VGBRV/YjQMCJkpr5XJSce1UARTENqKgmG0FqTWTM+F4FGBApZ5maCzRG1fV+wQu0dn0RCyxwWukNPKeuL3ABTX0sUJkUBsuU1fKlCqgFJeBpIhaQgRRwqZvwMPvZvecatZVtHyyDv6HieFvjaykfB63DhL/JP/VjnxfhCQyknhmsKCvQOoUVYFFUoJRtL4EVhRT19BI1lfWXgA288pIWYJYpKfAKk7bS+W1T1oHPNq2GO8Xm91RdUVtmnpk/2Cgtvhb/aHKxqCmJoBQMYAHVUlhVTuoWtMaT+iDbC66BVml0Hiq2tH4epX7QOuDKfXadX2XZ8eBFZQHW8rfqbdlHeQqtf/iHf3jEiD+g9SK8jsdveNwT6Iu93+myxNB9i+C0Bl6mrAZWIKMrzUo7qLrCiiisAivlS2AFRNm3igqAsv9LAcamsFDL9qWeEKRwAybLznXOh0ielGPAqwewaT0ELL9zkkYnmXS19vXnU1PWAWsMd6cFKiU44Z8y9/Qg6qlhnm0LUIVPjhWHfhDIbPBCqJxnlFghBl6juACL0hpoCQszTUviI9Ca7jzTenjaafox3XgOE/5xb8Wx/WP7BK4E1mW+1WWpC/oAxiCuZ3WqrIAjL+9L412NslLmhQeiwmipqwJpKSes6mTfnKfbeFq5RrNE1TmW5WRZqGd9Kbgz9Ux3sDKNwuJhWc8pdNWhXtplR9i1wsMqK/BY623xA7HcC9hUYQEM5UNI+U/qAOyDALXAWsrqQmmb8BG8bN+rLn7VChc/GJU1rYiUlsz4vacFWpMVz4i/ClqHn/WxffeOG/sQT+ACsE7V1Wl3m6vyrJjeVJXs8lFVwEEd5UXiYb1EFYGPecI9oAKivJgvB0YFFIW1zHdgKqyU6mY95yq0FuDqZy1QFWAgNWXqt9AQmIALrMw7ZVVgyZ0CgpXO0FwqJvsoK+ACMrCitIR0gKUEqfyGrg+MqKwBl+Xcd27nUVhRWiC487gegRY4XtZ6uE952EPrUFkf4m04DvnYP4ENWFeFgqcm+2Sj71MXRlntYTXKCoiEfAMrCgpozHlJZWMCVmGV5MmXM/ZVoZYn9/JOWdn8MuM9rYKFmm2UG6XGDwNB11leV6ElF2v8K6CyPGGhv8yuxbCqKlXTj3BaCdvKR+kMtIBJyJbdPwjMhHZVWjnv+xTWqKts04+o65nfB6wJDXOd95nxtgMY4OV3XQqtvad1Cq0A6sFeZflNoHX4WR/79+64wQ/5BB4B1nWh4PhWwJAXrPlPQsFJ9BxggZVtGa2hYBpgUUbUlLqlul4GsLy0L+c8hVK8ra7zvECLSqOsHHeitIishoWrvmkQWgfBa4agOfe974NVWwoHWPKuqCz1QkMlZQUQyjV0TGG18rAmlKsS0poHWoC0/ClSrgorx7/P41KCFGVVWsXKSnpG6wdm4OV46ozKyu8twPbh4bQeTsrDKC19GG/qZx2h4Yd8Q47DPlZPoMC6KhSkri4z2YVfefHOooi2rPSB1YIZ2LwEQtRPXuRCakJAQLIctfZyXr5uA6fsT0W9HHXi2JcBbCBFjTnnMuV7LutCv3OL6qWqK8b7ZNa7F7+PAS80BKUJCQEry4VUzt1xrlZLYLvdMODHVFeaQIjiWiHh5ldZT73Og4UXRZX7LMByP8quU1mW85tHjb0PTgMv+05oyLw3g6V5Dy33J4TlafHWBlr6LKZb1MOvfvWrNdYprSM0/Fi9b8fNPOUTuACsvboaWDk/72p5Uh1oj8k+5vYCVFsBwSIvY0M161oDwQh8RkktdQVYG6hWuPdyzgVKL4+aUj/QUkeVBWYFlzASoJxXCAlcfLRsa94XSFkGqAGWqM8yQJmUwGR5YDWtgur5VAsgTT0AoKWcukxhAdVSVrJOKSwQQmRZqSBWYAkRKSsTcNk26ipqtSpLWJl738JEntm0HjqGqhMWGikCtPYmfELpdrL2W770pS/VhD8SSp/y7TgO/9g9Aeqq7vPjQkEvv+TQCQUlhg6swIvKobjABLSoK8tUFKiMygKkhD8F0woFuwxEKyTsumWqSglWzpXrg5oQczPneVkrnaHlDqA13vOSt4XQ5HcKD43jLjTUQphtHcRPvhMfX3ioJTC7Nq1ADpZ1UBKmUUTANOEgVZV9Chz/AR1wAiOgUgKVOuszDbAmPLROaSnH0xr1RWEBFsPfPQkNF7ge+C6iD73ysxjwoDXA8nsPaH3s3rnjhp7iCRRYmX2Kqy+0lsFRVz4OkZdhy2QHplPfavwqXhNlNa1+gGUZqBjlyrxoo6wKq1yO1KmyWmDqel7Kl+0PWELEQKHH8sBsEw6CogRTdbrnuA9+FtVFYfGrLC9F1cECeVZSHfxOCaPWs08H6wMsrYLmbG6oRV1le1sG0Yqqkdow6mp5TVVYQAQ2FBWA5TrvU1/xmZRMKT5W63Lce6O2BmhUmfMA3q6Vscs6VgsPl79WpbUUVvsdXhYaXqWy/PYTP+vIy3qKF+g49KN9Ag2bTmHlFnhXgPVHf/RH94WB1BUgXOZbgYVwbSA10AITYKKMBlbe1bzQr+SFq5KSwgRYeVELq1Wv/Z9/1X3UOUfAVFOeYgOxMdvr1p8PS9PMeMuA5beVWlFVKzTsOPLGbudfmSisHOfjFNuwxkJB6xQVYDHCAQI0wAy0AGbyrnJ+y/WpAIlHpcx53gMuoMo+76lXgpQpv+e9nLchZK5n/0JPCyI/i2oDrGXyt0USrMwgSmlNaPijH/2oSmtCQ16W38fPeozKOoD10b5zx9We4glUYQkHr8tmX2FWWwWFgqCwPK1mm3vvzQMsIV/AUkVEJQFN9ntFPT8r+zKIWuYlLqiAi3TKC/7K8rQKLYpqGe49z0o4LaxMyyMrsNzfeFlKoFr3136E1rNPWwuV1JRIcVSWkJC5vnKxthEYeEnAtcI+YqtJokA06mpgA1rmbJOrUUABUn6nfkSFmDrH5hwFFkipo7oGWKvcTHnQAixe2oBLWAhaM/AfpfUhDPgDWE/xAh2HfrRPwCfkKzX2oeC6hXZWpq7efPNNKQN9+Wf0hXglL+X/6PoDFlbyrYRxDHCwWmBqaLfCuQ1IwOOdz0tIaWmCe2WpqbzDbZJ7OZ5MlZd6k9IMYK63TPdeV4g4asuuOe/WtxCcAol20wEsoaAQUIvheRR3PqY7WCmNGMqz0iYAXrLMc76mMCzju6pnGe5VWhMCWhYSgk3KqqucB7AmJHwv1wSmlsK/0syDDbCWKqtaA8AJD53fKSYRlacla57KorBAK9v5V/Wx8veiqvhw96bV8BqVdQDro33njqs9xRMosE7V1XhXOW+Ndq2CMwIDMEwKA9+KwuEnUUVAMmARwlFOgJW5sFrlK8oBlmXAorhmGbTysQqtiD3OOamtWRYSOjdomXhYlt3v8tGmv2HHxAKqnLJf7BEOnk78K3lXqdcy2I7PFJXQ0LTyn5rSkOcwyaHNraKKgEW4hz2Wc573Ao9CK9croEAssCyoKCvbcl4DbgkVCyte17Qmajl0jJmKW8d/IDylsJIT13QHymvys+Rl8d5Adgx4wDIo4De+8Y2r0hwOYD3FC3Qc+tE+gQ1Y1xntBuLLy7iFgjNOFd/K+y1MAyZgmVIYZxmYst8+7CugCJvU+1JDldZSWS3HxxIuCiMZ787H/1qhZENN100Y1HAQxFLX+zQx24EMsMCKh0Ul+nz9+FcUVnb1xKuulGaQorCEXCAFDKCR8xkPq8mhVBB48Z6EdxQRYPGeqCZAAh9AWgqrcMp5zL8GLZNbBTXHOcbsXIAltBylJXR0D+YAqTlgq/WwfpawkMJaIWLHpc/4+W01HGjlS0aF0+RmLfP9ANZH+84dV3uKJ8DD6mDnp8Daq6sZEXSUFSUFVsIx6mrCtAEWU50CGiMdhFYdX+pVEAsQCqq8kK8CWo59JedpiGi79aXQ6mUBlfNjieRRoadlqQwrS74Z9TLd+exCQD5Wjt2+npNrNg+LfyUkFBouUG15WAMsXpDQkNICLZ4VZWOd2pGPJTQEEt4UZSUcBKDsI42BqgKtgoqnlX2UmjmrqkALvKiu5XUVVpYBceA16mrfguj6q1WxYSFo6fcoDYPKMhigXKzPfOYzG7BOVdYBrKd4c45D/588gQJr318QqPbe1V5dAVZeAmrqpYSJkjhrtFNS1E9eqE1VLe+q8AEsc8KZwkrol5dKL+h6ViA2Kst2M9gpZcIDl+3OKZVBaJhj6p1N6yRImQAr12o3nWyvfyUaTV3LTPWuUt8HvvwsIeA2rIwQkZUmJMxyk0cBASB4Sfwr8HIbWg4ndWGZ7JvCAqJRW5RV7qGwoqiyb1XWUmC/BieTOqEhcOU3vOfcHhE/TOkegHJKSou6co9CQqoriupBukVVZRkKZ1oMhYaXqKx6Xcd0PIHb8AQ2YO274OzV1RjtSsBa41MVFgBC6ShBxUwZAY1QDpjyMjXss5y6AdOr1FTqXtV6mJfY102rwuynjn9lH+eirnhkKxyswhICrmtX6U3yqChLsii1NWGgkBC8VnioVbB5WBTXAIuiyjnn+4OsLGqlKguksm/9IssDDOsMczAxr244DesoKhNAgRK1FVD9Wn2Wffyw6sq+2acqC9Ryr62jqigty0JDcAQxoFJme+9DWOreJiS0DF48LPA6VVkHsG7Da3nc41VP4BFgrXSFtgiOuvLy84MWpPaqpt1rAGtCuFFGwDNzXtRXhYDCP3W8KyCznKnLedkbJoKY1AbAWq2Er8SHKbAoOHXUlfUst4WQutINKFMVVuaOHw9YVBWVRWGZhIKjrKgs4aHsdmqEymK45/xVJtalEQgJwUn+E/8KKKgp+Vh8KhP1AzJLJW0GOyUFRkAFUKA1aitALMDUOy7nr+oCqoGV0nntN6ASegoJjfAAWOAlHFyh64M0WHQML79JuQ8L/XbQ2vlYh8I6+HBrnsDZn/zJn7xy2sEZoGZQvrxMW6sgYI13xQincKQviGRAa6kjBrkQsEAyA5X1nPfVpaK6DFZLTSlfHXWmpMqoLucGqfGw+FnuCaiy39ahGqyY7oBlGaBW6+F0zenAfbrj5DiLTRoFrQWm+li55nzCaz6Q2nCQ4gIrM3iBFXBpHTRRQTwmMKKmKKOljqqccjxQ+QBjwSQ8VEdpgRjVlesUWI6zr22rS09htcBXdbUAWViZKSwhYfbRktiQlo8lNKSy0qr40IcsTsPCWAIHsG7N63rc6AVgzVhX1JUWtTHbAUIoqH6FZsBVdbU8qbbiAc1SUA0FzwXDK0D06oJWw7+co+u2BUjU16vMdssUmvPk5XuF6gJG0JqQEBizXnBSWCDKu1p9F+tjCf9Al7pa5nu/oANOwkMthSk7Hlau26FlQGtmIKNWcp1txAbZ58xtsDKDFThQO2CiBBRqaPlSBRdYAZLQULiX52K5Sgu0gMo2ywx5M2hh4DLwB35U1QCx/hlQgaTWTMvJcp/RJBjxBe5lYeFeZR3AOiBwm57ABqzcdM32N954g7HebwrKaOcJgcJ+lvgJVuNTUT1jlCMUaIHPQCrN8F0W7lFaK0QUBvKuuo0JD0yUFlAthdVs+Cy3c7SS2uJZuT5I8bKAC6jcr/DQLaS+3XPWcoGFZcu7KrwAKtcsvKirlA0JqazMHSKZhwVeJqBa6qam9zLgC5Kcv62F1BE/S84VYAGSumwrnAAJsJQDrBUSTl1hZV/gAjzgAsM578rRqspiulN9+T2j/uphCQslwbp3KuvUfE/vhofJv3t4AOs2va7HvfKwXp2hj/OSMdY7Njs1NQPzjcKiaiiepWqazQ5UWW/XmrxIm08FTOCTugKJigIsdcrUvcbLAjbHgtgCWhWWUFE9L8t1+FgrLASoDjUDVMAkPBQGmrPcQQUBCoSprZyrX3+W0pB9arbnZW4+Fog1LrTzOaDqW2Wf+QL0tBA22x0AQEvroBysgKHGO8VjWi2AbQmktJZKKoAmNASqzD4NxLsquMxUF7Cpz3Ou8nIcWC2lJuxskilYuR+g5GOBlilwaj4WdSW5NP8T2sz3fVgIWH7zd77znfOPMx7T8QRuwRPYgAVQstrzD75jpIMWxTKpDEJCygaw5F1RV6Os+FLgYgKbCQPByDIQCQPzEr1GUam3nvrXxnznaZmEhiDlfEupNRykrszgKSQchWWdusp6gcVsByz3T10BlgmT1AOUEJDSUgoLc+32KVSanc4LD1rCrWxreoMcJ2AQCvKwqCzrfCYeFoW1zPMtHKSyAIiisrzU07t8rAFWjnt3YKV+qatRZIXVCje7DFhAZXJd95B72xTWVeb7Aaxb8EYet3jtEyiw8rmo+8nVeSQcBAUgo6jMutuoo3aoKWGapE8qK9s2g338qQkDhX45z2uAlH2z2vUa75SYks8FYpTVynBvYqnMgFy7JTiN2Z/9thFHc2y752TaPqjKu7KupKyyveTCA/CirlZY6AEVWDyr8bEWxKipgovq4lvlmPkO4XzOaxv+GFQoLeoqv5G53pwqYMqzqunOw8o9VVHhTereXb7Wu1FKwsCqrFynwKLAgA6ohIgSUYEq/mJztMAKtHhs+VtUAaoTFvKveFljvv/zP//zgzHe/Wgq61BYByFu0xM4+/a3v/0as5260sJGmTDbAQCcrBvPioWTl6bqKi9UE0WpIDPPiVm+VBOVVQCBlNKUF+01YSFaUV0Bj0Hcq74AC8AotezXEBEEGftUllDQDJDgZKayQBSlxIMrHKzZnuNlt1dpUVj+IOqEhaCVaxVYFBY1BWKp61DJKyRskyCQZb2fqdewB1jWhV6pq/EuNAQMM+UjBMxUL0tIBzzABVZjtIMQUIFWnkNDw5yyqgus8rtVV4Glvob8KCzwMlNzvCx9Fl3PPVFZ7k/XnX1YCGLpxP4wof+F1sIDWLfpVT3u1RPYgOVdEQ4y3AELDISDQGWZ0a4bDmiBFfUjJFQCkVBQqGdasHo1EDSoUz2snIPCKqT4V6O+hIlCwGwvvLQsWndepWuBFy6tPoWlk/sSVQFWQGO9qe4y3CkqrZyA5dNj2R2n2kLIZLece9lGa8ixzGlhYjtBU1qrbvysflC1JtH//xXnLYkUrPhJA6tRVoBFbYEQFQVi+Z0FlXXLtilzn++CG0jluHcpLesgpw6klGgoHKS2lCCpfyOAublRWZaFtdNamHSGBwewjpf+tj+BAiuJhQ0Jx7/iXeX/yC8ZVobKWnCo2c67AhCwIpbwAnyABozMS2FVSeWFqbJK3Ws8q7VPgQVi43EFRs2Ctz31hZVrUFtAJRzMeTYPyz0ROtm3H57AydRt2e1CWYDK9auqAI2CIpyUy9PqMMkl93mSaI1oiaQUlVZDoWEY0WGSlep5V7mVzegWBuIIeFBEcrMABaCoJuHcwIe6yvK7wsFsr6oCrOxfYJFWWhHVSSyltAAO/ABr+iYKCxnwQDXAEhaaVifohodm4Jok0r2P5bfGEjgfY+eYjidwC57A2V/8xV+8PuEgVaJlMPCqugIowNIid1U4CDLCQe8P2Gj5o6CWL9WSispLVzhZzjs64WC3T2shAGZbO0PLdnfN8/e3g0rV5B9Q8bAoKrDK9Zo0anmpKXVVWJMomutYr6rSSmgCLryYkJBXRXmBlDBQMmbO09QA3pWZl2USEgJX1ptekG013akt6QcgBS5CQcoLeCwDFWABVSBCbVVNCRFBanlXm/KiwFZ2vFCRwE8vChMAACAASURBVOp5PZL8vXBrC0fByv2AZ0aGbRKpe5/0hgkL8xyaLCqJ9ADWLXhLj1vcnsAFYMm9you1+VcTDmodND5VXp5t1pqXl6ZhIGjp2ExZUU5ZbygIUiZcGYAtL4va6v55CetzrXBywkGeVkcpdc2cz4B+NfyBitriYaXsV6UzFVDnjZT3CyrbgAmodNWZkDDrM0pDH4L1SR4FLKEgkC011Y9SEGj65nn5c/6Orc67AiztCODFR6K0wCqnbc4UNUUFUVpAlGsVUiBkynUtg1dBJRTMud7NMVVgIKbeeRyT5So2peGVSytSMqA05zpVWECl286oK+kNlvc+Vjq8P0wPhwNYBwxu1RMosPhX8q8GWJTV3r8CjezTkRgmTAMr4ZrQLfs3CdQ0wBJZUUt5+aUyCAsbEuaYVwOfrk8IOfDSOZrwcV6wytTwE6hYMgtYyn50QiOBdAs08t5Shzm+fQdBK3U13QOJpjTkN01Kg0aGfotQaMjXoqiUS2X5jNbmZWlxE1YFQkLGDjEjDMuysLEdkhes8KLDyyQsa8vehIW5dj0p4R0A5d7ezT4bqKxTWGb7KrPflu7gOMADq9zrDApIcHU8+MBovsqjGbbmu8H+jPFuWUjofsfHOoB1q97T42bXEzj7y7/8y/x7/4RPX/WFp7DyEmypDBQMWIEW/0poRl2BCmUFVqvcAERh5eWqcqKyZs7/9XlXr/G1wArAAM5+gAeClBhSueY6b2FJ7QEmZbX8qqZcUFW8q9xHuxOt8LDQAisellKoR33xsKgt8Mp6vaylrO5RUeu51LsCLS85lbXCwOZjCQtBSoiIUNle053aIXCMdXUudNrpuWY74KzOzkz0tgICkvAQnKgtpW3AxtOisKQ6OBbQnEdYufysGZpmA9Z831BroVsBVsqKwvI7JJECLx/rANbBgNv4BC4FFiVDZU1pGbAABTSoHsBitKeuKQmAw6OipsxjvGfbrPOwXpPOYJK+MIrLcdRV1ttp2vldx/mVZvcgHNQiCFruDai0CgoJqSkgAyc+VrbJuSq0FqSqsISJ1oHKukldjtdJuB+m0EqY6gILzLzky9cqsCSTUlqUDDAIE80IJYmUZyVHivwBm2XAN/9KqIdWoAROQAROgMXPsp5rVGXZLlzkYZlyH/XBqCzwEha6DoDxztxLztUwlY8lbAWqmQ9g3cZX9Ljn/RMosIRW1ElaCf2vv5nuAyzvCQ9rFJakTsoHVKirFb61C460hbxAVU2W+VMECJOdj7XSGqqyKCzwEjbaf4DFy8q+7T/o3GAFUrgiZSnbCq68pPONxKor6xSUCaikM5ioKAqSV5V9VPX3AxYTPvexhYPM6QW3elmNF89zsSxOWFjVQr3kfKNkCiv9+pQ5pgARHoIMuIxxvtIUarQDE0DxrEZpARTlRW3l/rqPlAc/a0JC0BMWMuGlTQhBl2fGu+qgguYAqveZfTqCw/hYAHYorAMEt/EJbMC6ynCnZMBqlA5Y+aKNJE/darQQAhdPilICKCGgidKadbBST2UJGReoXgMoy1oKAcr5cs0CUfjJx3J9OWCgBU7Zx2inWx9CoAIsNMoxMzLDZLgXWgtU7aIjPLSefLO2EC41VYhRVdIZsr3AIob4W152KkwLm3DQS0/RCBXBSUgIGikxC0Ca4En9LIBtmesAJfNdgigwucworV3LYcGlHqzUCympqzx/Q9FswMo5CizXpqyAlMqiAAHLzMfaG+9///d/35bCP//zP3d/x3Q8gVvxBM7+9E//9BNGaOBbzXAyBsPjGU06g+XxlMa/AhegAjAJolSSGZCoKbDKOVuCldBwYEVhAZncqwW1gs/xKwxsdrtriENXaNosd+qKlDLlHNbbHUdYmHM0BKSwzNbBSR0lRWUJA9XJejcBFlFkW5aFf01rsAxklqNamkDqxQez1LOu6mWt5cIKyHIvM1JDoZV9OqwMtUUhCf9cFqSEgcuzamshOFkXGppBaoWF9bHsI8x0vPNRWNSbNAfQAqqB1nXAyleR+tFVKusA1q14T4+bXE/g7M/+7M8+eVULIWWT/Tr2VVqharpTPnKkKCOwyks2IzFsfQUBDJDAiKrKS/S68BCwrNvmOOY7Vca34oWBVY5pyJmXsAP3ueZ4WKlvsqhITwlSKZvhnrKpDdSWWT3FFNg0DORr+c3AJexLnlJDQsAyPhY4RcU1PKTIluHecJDaWnDqKKRaDYV/OWYbucGtrZSGGX+94RqogEvuZRuZIb+1eVigBUyglHPxrrQQ6Fs464WY0HASSlciac83wIriqrrKb6qPxUfLfh/4sKr7TMvgA98pTKNKGxEOYB3v/219Amd/9Vd/9UlZ7kLCtB71U+/e6/3Y7YCVuuZF8bAAS9iWunanUQIRmZT1gkop9MtL+zpQCRlBy7alsF4dv4thn5eVQtu65VBygJVzdOwYiovio/a0aAIUkz31m38FWNneYZFzzbYUTigIQis0bB2VlRd4y8HSmshsp7BAiZ8FVqtuPlJRH0t4Fd5UcVFV4JC6do0BDiEiJZRrdHiZ/OYZkK+pDRPmDbCEfrwq8AKtaTHMuWvIU1dzzFJX9cX4WKDoGnwsiaSBV41398S7yt91Pk12AOu2vqXHfW9PoMDapzRM/pUwDBz0IQQrIeE+pQGoqCSgGeDwrYBKKAhKACVRNC/U61IaRmEx4UEu121r4oBvpTM0B2upt+Z95ZwNTyk+DQLua0x36gqBAAyoKCm3sUJCP7RhoXphn1EbTOooMGpLPa+Kwsp1Uv2w62athitEnHCwLYXAJRcr+/KGqmyEYcts3774DCbAwofiW4EPCMnFoqbAyiTcy/QrEDOBldm6bcLJgRXo5XeMmd8vSGdb87B0C2K4Cw8By/2534SAjPYHSRY9FNYBgFv7BK4FltbB/KNvSAZWICIk5C3lJWo4aB6FBVZAleMa+vGt1JmFgal/fYWK+w7QzYIHK+dJeNawMMdXXVFZlhntk9IgJDTxroDKRE1RVSYMAy0AW6qqHZ+Fg8JACotvZRISqs8kjaEAo7BASlho4luJ4ISFQGUaT2tARV1RWeBFZdmFCjKBlVKL4Qr3CivwAqzMv6KuqCiAorCEjdaVgGW741PX2bkHhoAoHKWwBlhgtTytAsvsninDhIoP33777YdGIj08rFv77t7JG9+ARbnMkMgJlZrnRF1FFWyJo3tg8ZyAS+QDTksljWfVcBCwqKuB1958Bza5WCbHOh9QCQUprLzkNdxByz3wsoSAud42JPLysKqwKCjrFBU4Ce1ynkKKj0VFgZU62/ARrMDINssrBKy6chxIAZfQ7zza61gx8yXo+lfAkPuSAyH/qiEhpZOyiZ1mxvs5G89zqaQ2DIQY68JBcDILCbUiqqOwVihYWC0V1r6JboWpn+dSBbdvJXQPpwprgCW9AbgOYN3J9/3W/+hHgAVU+QddHyvg2j7jxQQXkoEWUAFM9q3C0ton5AMeRjoYgVXWXx91pY6PpR64KK3sO/0Na+ALM0ELsISCIBXF0LGwqCvjcomecmyN9xUOttDKyUKzvFoLz4caddIwEaQoLn8xgAIk0LJMXQkHqbH53FeuUwMevMBqpTNgVr8BCGIiUYpLCVbiQlnv5wIsORDnff+aPJpr1McCodxPTXRKisISIsq1GoWVc9THorZst78StIDPLLyU2pB7276o47rCQUoLSClBftZeYR3AuvXv7J3+AW0lNKzMdMsZYK0+egXWuTA4z3KftAbAMuelLrT4Uiv5s74VUCW8q7qyvEq5BNPZuTlYti2zvhBMXY13+VeuB5LCUmLLnG3Mng4rA1rZr1nuSkA6t9HOFRcAKXNM/8jL7iqoAEz4B1yAZDnnafccasu4WGBFZWVbgUWBgVXupx96wL7Mhk4usHLvVVepq/EOUuZcowPwUVhZbpY7cOl2QzWluoCirIAp16uXlfqu52/TjtITEvK/TIAlpSF/q/ZdBCz9BymsA1h3+r1+YX/8pQpLdxegAowBFu/qVGGBVerGfK/CopxAiKGel7SelXXKa8JE0Bpwee+cIy9fPaysF1iunbomjvKxKD7AErrmPO2WwzZaSqvAEvoBVvbFrI4yClIAxZ8aiFFclJV91lRgLQ+rLYIUFkBZprQCCYKlCmstN9PdeqYmaQKV0CznrpcFVrymnANwGsYBlHVA4ksJ/UCJurLNOnpNiJjzNm/LPqOuDP5nyu+qjwVQaR2U79WwdK+wfKBCesOEhD5bn/HPjpDwhX2lX+wf9ojC0kpo8L5ThcUzNo77Atf2DcFRV2CjlRCgqCmAMmdqWDiqS0uh8NA+2Xf79JfjhYVSJmTRCwv5V2YhIIkl9uNhESqUFtEEVAAVFdIPp1rOdetT6W4ETBQYIAGUOgpqbW8fQgrMTE35c08naMor+3WYZAb8gtfWSjg+EU8IoKyDFaWV5aqrmXKO5mHlfjtUjJAw2wutFfYVWpVaqLc8LftQY2Bl36XOKrGotmzrzGx3beGpVsPcz6Wm+wGsF/uFftF/3aWthAOsvCBbtxzAAitQyQu3dXwW1i3w1KPKuzb5VwUWvwqwqKvs+7p9lvfVTHfrFNY6Z6GVY+phCQUpLSpLGEhhuSfKitJiwpupLIMQgtGCU0NCIeJSSoBUeK0wcRsTSxgYmPZTX8uUL7CoKYACLca8deBK3fbZL0orc8fFyuHNcieOwMsyQ9zIDQDFy5IAugBkvSEeOGX/XzHfbVvrm6c1UAMrXtZSW1VsJlAELLAaWFJZUVVHK+GL/vbewd93bVpDXiLR1/bRCSEhHxdU+E3UFfjMMvjkHap6oqiEe0K/1L8OWOoBbCkwftWW6Q56lFVevs5MfiFh9m1YuloHqbyGq/oSUlkLWg0JAQuohIKMd0oq562XBVhUFGjpljN5WEuBNWlU3Rqds2NlmfcqC8AAy0RVnWdpNGWgZjdoWRai8ZfOBWFjyRkquQqLyc6AFwISVKC0/Kp6V3leM0rD1kVHP0LH8MPyP5R+1j6DKvZLOq6ZYwosYSH/CkST+d6QVZa7BFL3nOscaQ138EV/UX7yhUx36uU0cVSnY+oKuDJt42ABlzBuhYL1rnhaIERlaTBTl5eysDITMbwtigugdmqr3XOAEKzYMznv9j1CsALLbKvCysvavo9Z7uioYAVQoCQkVFo3ESGZm95gWts2w11IKFw086qme45dzcJEXtZSYPWvUt98rAUrkOoAfjlHDW8RHeUjLMw5L3TN4V8FPg3twEnol8O33Ctqa1oQbQe0MesBS1iZ7W113M8DLOrKvA8JA7iOkiop9gDWi/Lq3s3fcQFYUgbyGAqtmLgllHWwAi3QAC0+E1DlharSMrRMWqna2kc9mQFLnSTSHN/WQgADKapLSoNloKLUhJYgRWVRV8AlFMw1arqDVkA1n/jqfea4jpSa5flM/XySvuGh2w+ACi3mOyhRWZSUUBDE7MNs51XZxquiyEBqQJXf0U+9UyhUlpdfugBwZe7YUwCR5W3UBKykrHLvVVrCP7AR1oEUcE2rIDAJ+cCK0jKB2PhYUhisO1546dygRb3l2E1hZX+f/uqAgvoQumemu/veA+udd955qF/hkTh6N1/62/yrt+FlKJYZrYGSYbqDQl6M7dP0YCWtAajMQEMV5R9//ajxsibsExZSVWbAAi9hIlCNylrmfOGni49rrHP3A6pgSVUhZa7X8dyBNfU8eOZ7E0aFhhJGzQtOLUHIPuNVTUioHrCUWhGV1BS45VxNaeBdgZZ6oRUeL9XVIYjze6YTdJVV5kLrXNidf5twAauKCGzAKXUNB/O8G/qBlVndQAqgZMXP/sLABbF6YbyxAdZASxjoMe1VljGxhIQ6QFOETPcj0/02v7J3+94vAItikY8FCmCl1IfPSA3AER9kG61B2JbtNcuVQkEhoWZB4d9SXAUUYAEUOFFXtk9IKNt9qa3CasJCsOJf5fgqO9BKnbCw94dWU6a+0BICSmsArQCnprttjHfAEhpSVztA1c8CJaEgaBEt1NbAio9Fdcm7Ui+kAqZcj/le9cI7mnCQ6Z7baNIocC2PqUPLpG6GSa7hbjysXG/rLwhQoGVag/aN2prhlJvdLkQEwKindrCmrMbHAq09sEBqFFbuzTjvDymsz3/+88d4WHf73b+Vv34bD8sHVPMSyW6XiFkYmPdh4QKHLzK/svr8VRkt+DQJVCiYl7TLs6704Qmw2pvuOV8H8nO8Y1J2iGQ5Wa410BIOAqb7yT4dE2vlim25WHwsgDIBVvarwvJur/Ua8JmqrJTUlAmwrFNSUwIWpWVbjmsLoXn5VoWAsBC8hISUlWVKS4ugUii4Wgab7Z5zt/OzUFApxyr33PBvQsA8p230USEgg35N7dJDsUk4HWABImBRVsJBy8LBKKtmui9VJTcLeAusHP9AOPj973//4d/8zd8c3yW8la/u3bzpKizDy4CUIWaEhkKtAZbuMPmH3n6FgAIkPCxKaHlNMx7W1glaN528eFr96lsBFrOdwqK2gIr3RWmlvi2NC3p8q/lUva45HXU0x2+GO1hl/94fVSU8ZL5TVqvBoMoq0GiLIViNugIjPtaC1PQfLLzEfCuhlNoqrLzcJv4PQ55nlesVAiewKrjkP5kAa0GkoKKCqCIthFRWztMx28GKwlIKBSc8pK7ACtAsZ/8a7epMUbxVbq6T+6qaAyzqaloIR2m5d6oQrEDLR1b5Vz/4wQ8aGh7Aupsv/m391VVYcpj2wJoxsaQ1gJc+hUBlBhDA8v5RV3kxRhFVLZlGWfG1KCpgEjIKDwHMDFjgNeHg+GHOR8Gta9XDEgoClRBRq2X26fcIc3xhlfPWdAcndcJBt5Ft9bDUr1bAfkVnoKVkulNQYCX843Epc41+k1AoaH2VBZaXPvsxt1vyq5jugCWBk3clLASqBZ72IxxoAZY0BUAygRUPi5oKjAordbbnWs29WmZ81RVALRVXMOZZvZ+/UVMahIMUlhJYD2Dd1lfzuO/LnsCF7xKO8c6/8h6MjwUa01KoQzLjPS/ONjooVZR9tRQ2c52yAiN13mvQGlDlRerHJ2wHKcJmwWtGbeh5eWPZJiK1XP8KtHIewGwHaGFgXtx+lxDEhInCPspKODjgEvppTaS0ACz3PkMmd1QGsBIO+lahPKxcq6Egzwq4EIvBnuONdAAIbR3kY/GswAEssr8w7D3fCPRFmwWuDpFMIQkJwUhLYba37+BSTltIKDTUKkh1gZhuOGCXa/RYXXAmHMw+VVi+nKM/YX5DVZZ7E7Im7Gv54x//uJ8qy7FNbTgU1gGD2/oECiwh4em47kIuCstQM9TMmN+UD8skL1NVFhUlPOQ9gZV5mexVWpSVVkFwAjLhYPZtOgNFlpe5Bvw6vukMIJZ6eQZVWMDlmu5JOMjTMlNX6nL8dHyuusofowP6MdStm9bAfb6mMyM0NOudylpw2j7xpd6Lrt6Uwzu8zHnWxgNDENd4z/1vn9VaHlYz3Zd3xRvq122AS2gITiDE1wItCkqGOzXFnwIpSsosdLSvYyznPJt/Vdm2wk7AWgrP9ZowOiV1RREKByWOprXwIWD96Ec/eig8PELC2/ra3t37vvCp+tXPrhCgsJRmPhZg8bHyghUeYEIJLaiA1wYsCkosmO0FE3CBFMWlNIGSEBHIKCzQcr61T/OxqCqKKscYHrnXpagWQGfkhjYSUFdSG8BJiCgcFApm2V+3rYfUlcmXoM9v73wAvxxicT5LX7UFVujEfF+K6kF+f812s9FGTTlPjW4eUs7fsCzVSlxpKgMllLqCx+0BFA+Lyhq/CpmyvWZ8jmmyKH+L2gI3x+a4DolsMjqDUNAEWtQV013eFWDxrWS6K5MRX3XlsQPWz372sxp5B7Du7ot/W3/52be//e3X0nv/PpVlmBkv+xjvTGwqS04W7yo/Esj07avHRGEJ2UBGmAg8FJb3OPsVRhSVdIflVxVUPK1lrtf3AjX1maquclz7E7rGglivDWCc9hOl1Ux3E8UlJASn7FtogRSIqfdH4lFRUOqV1tfyhIIFFjUFWpQVYFnPfoUVUPGJqC1hIEAteLXT8xjhuZy0gyZ6AhB4ARIlBUBCQmIJrISCfK3Vp7DqasLBgZVj5V85r2tIcQAsPwswhaaTKEoBUldRyBcM97268jwO0/22vrp3874LrPyftiFhXgYZ7mcSSBecLvhYWgvHz2K8Uz8McsDKsW3hA6C8hFtoCGKrbkt5yP5VXiZgy3kaUublamrDWn/F6BAgJUx0YUpLKEhhrX6ONeBzGi2ZzcU650K/U3gmy11ERznysSxXSq0+hfwr6oo3pW6N574N2gdYwkGQok5wBRcXDAoHkMhx/R5gpprtoCUs3KssPpY6YCLsKK1cf0si1QUHsJjs2baZ7UJFoAK9ZcA3sz33sPlXgAVgEw66X3WA5b6FhONfnYSD/WTZ3fynf/zq2/gEzv76r//6tSQSnmkpzD/spjYwtaksSmblOzWRVFgIWFTWKC3+FaWlpKyY8eADVAMmSksoaLswkOLia1Fjsy+oUWvWncuUl7Kme4DU1IYVilZhZb/OwsBMHScLqISHlNWorVFZhBlAjdJKff9e+Z1tIcw5+8Uc8DILB7N/86/QzMuf9ZrYXnL+FYWlLuttHRxllfpCSyvhCvEmH6sqK+dofhVfKse2m47wb3lcDRkpMi2CIEiFuVWD9e3TGSYU5WGBlfmXv/ylzs3tOzj+1T4cPIB1G1/T457nCcjDApkOzwJW8TvqAe3DQrAygxWVNbCisHhYoAJaQjngyUu5hXkAZD37btntjHqqDLgmHAQvk/Pwryg4yorCWiqu4SCVNbCitgCVjSMsBKVcpypLGJjt23AzFNQorezb/oPUVc7dEFDdCgWbh4WXzHWpC1oLAYyyyv3UvwIqYSGROD4Wf4mHhTCApaXw/Dbe2xvnVUy+egNU41fl2jNQXz9Jz7tynNm5hIKA5ZyjsPbhoHsB0vyeBzo7g9UKZTf/ShedMdv9A0g4eCisgwW36gmcfetb33o1/czO+Fia/oWFAywv/xoUr6pGDhTJA1TnPnN7DBdYebFqwpspqVFOPCnLgJR9OiwyUI3pbt0xOlBTZdm3oHI+517rHRMr8Oi4WECVbc0Ry7Wqsigq0ALaARdoCQO1FAoJ1fvrgFPqCizL4DRqC5coK4Ba4Oon3nceVjPbqSsAW2HYZn6nHqAaEoILo1yrIFVFJVFOo66oLSpr1BVQmaZlcGDlHGbAEgq6GDVnpq6Aah8OjroCLKON/vznP38YA/7BJerKzz5Cwlv1yt7tm63CyhdU+Fb1sZjv3jeh1b6bDliN+Q5eoEVxCd2iLGqOL8A0kRS0ACjqbWs91G8QqGzL/h24zzpAgZjOz7yw1BdaYCU8pKooLSY8dSU0Baucf8sXy3JBm/N11FEeFoilbutPCMiMdqGfrz0rhYlCPqXwkMkOTmBlAi6qJfUNCSksvpWQcIWAkzjalkJKaLwryshMSZnBBoQAjPGuTtjH3+JVmYFtFxrWtAc6wEp9jfaBFU/NMnW11F9bBbVmTjjoK8+glVystoLu0hnOm0wPYN1tAtyyX2+I5FfSOng2YSEfi/E+3XSoLHAALDlZYEVd5cVodx3qCrxGEVkfcFFVuu8AEx/LuuTSgZnSNma9bevYKi7n41st1dbUButUFr4QGUr3owTZ7NuGA0oKwLJPWwdNAOZvA1iAxsOipqxTX+diseCqh+WFtz3129eegYqSUU42eQ5pKoMp9R0HS0lp8Z+yPrlYTU8QDgKVEri0BE7IaFlYaZsZ7KwrTeC04DUfSy2smP8+PgE+e3WV6z0SDvrxK52hraIAfMv+zR63e4efwAasUVlUivQG0PIOAhbvCLT4RXkhphPyJHLqDP1y9q/aAhrgEQbytPZ+lm08rgGVZaoqz7+wAi0thIBnnr6EzkNh4c7Kx+q47sLB7FNYCRWX8V6FJUwEKwqLGZ995kOqHbEhL3pBJRwUHgLWCg07nIwXH8CY7qnf1BVgCQlBS1iY9YZm1JXcqEC8Hlbqtk/Jy7kCHuXAKvsXYPEMCyZKi7IyL+htwLKe57uZ+kaJkN0OUK5L/eXavZ9RV9e1Dvr3vvyrA1h3+OW/jT/9EWDts951Ycknzht2ARc1A1yjspRRUD5wOmHbZKYXWEsddVnoR2WBFmCl3EYZHYCBFjit0RoaGi611Wx33YKW6nLdzcfKPtIc6l8RUXw3oAIw8Frz+ad0MgkNZbxTUsJCsFIPUNmlqQwBTPOvRIWMd3VUDGAJB3NsocV0B42cr4mj2V5FhN1moBIKCvtSVm1RXRSUukz9mo5wEKwcS5mtuoaBgMVon3Awz+EDAAOsmYWtuSfjXcm+byrDNdntEw4ewLqNb+0dvmem+8uf/exnJY2eUVngdNoZGqwmNBxgUTSMcEpHXCidYamfSSZtPhUPio8FRgFATfUsV1UJFy0DFs9K3hVF5hjHLp/MW90se5PlFQK2b2Fg0vHdLQsHqUAhIXjhD8Nd6yCVRXEJBRntFFa2z6frm3s1wFIKlYw0CgRUFlDxtnKOQgKcLK/wr2NgLaXV0A24GO/AtIDTUUL9BNACqxze/Cr7GNuKCQ9gud/3jNfuOHO2V70JO6krgDQqg9ZK9wKkYDXh4A2SRScc9E//CAnvMABu209/BFjMd8qECvHSzyiko7J4WaAFVIAl+ilJMuWFrOcEPgz5pY6aqgBUYGQbtcVcByuhn3pAAylqbR3fdekNzk1ZycfKOQvJ86jrPOvdOoNdyoWSkuLFOWz5WS15Wv5AQsCZAoB6WYDFv8o1N5WljrLK7+wXnsFBOJh7blqDEAxMqB/JoyAm94pBTikBlmVKC3CWsupwyfYDLOEjUNkHrJjuILWAWO/KNeR5uY57AKxJY7AOVsA6wKKurunsZ0mQsgAAF5FJREFUvFdXB7Bu2xt7x+93A5bn8NOf/vTsC1/4QlsK9yor+TsF16gsYBhogQZD3GwSui0oFViAA1bqhITCPetUlVKIKP8KnISAtjtOaLggV0ipBy3KzrVcdwGqrYXuDaQmtQFgQSrHFlTgRW0x2bNedaVztChRaMi3Aizwyj413cGKAjFSA2ABlFBwwkHgWMvbkDLUFVCZTUtBzfjuhRGFBVLKpcSEiPO5rpZCTBATEg6wcrotmx2oqD7elfs7VVdSGUDrzTfffGDsK3/fndludcB1KKw7DoHb9PMLLDcsLAQsOVmjspKAaL0pDoBgzKnxssCCsjGDlO4ygAUmy3j3NldpgRGVNdBSCgepK6a7ddtHZSlto+D0UVzAahqFFAqqCjA1AGRbvTX3k+OmP+H0I0SNbYx34SB4gVb27bxg1S/mDKyY2MJC0KJcMFn4JxwDBuEfUOX4mu4TDgILSFFHAARIlBaVZVkddWWfpbAaGqqnruwLeDysrNe7AizKim8GWECVe2or5U3U1SV9B/fh4H75Nv27Pe71jj6Bs29+85svff3rXz87BdZeZY2HNSprwi8qB7BGZQGMKf/Xr0EOKBTW5GopR1WtsoP1gZNZnZAwQGnH6hUuVmEBITAueAFUwWV2PwDGeF8A6zAz7puy0qcw+4gUt8TR3HP/5Ett1b9iVuMNYFFZTHetbiYiELiACrgQC0TyO6uAQAVscl/tlrMA1GW5WYCV47ZP1wOWyfYx04FtKbKec87r3KZRVZTVdHK+Tl1dMpTMaTh4AOuOvvi39WdvwDpVWb/4xS9AzGfrq7K0GAJAXuoCwkgOo7LAAkyUAxbrJiY5NZX3rWkPuEBRmQdmloFooEVheZfzkrc/4QoFez4wy74duSHXGlg2rSH79ms6FCEfblIalICVy5dZWa/Zbsp1qq4AisICLOESOGW/hoUDLOa7FjrgoHa0ElJXwCKEA6xRV+NnUU9mrYmgRT2N8gIwA/IBlfMx2ycE3INwAWprFWS2a7ncd8OZlsG9d/UYdTVh4UDstv4bPu77Dj2BAsvv3aus9fvv50MGm5cV1dThh1N3Px1sCy7pA0BhAqsoiUILZAZY0h7AinoS0vGplMLGFSLWr6LIlMLHCQXBaR2zdbgGrcm6B6xluPf67g9UlZm3tAawEhqqmxwsfQiFhAz43EcV1hjuwj4AACsqS6TLeE/9B2mBawlcVA5YgVFjxKWysq/VhoagBFCWwQojV3/AGW1hg5UwEPQmDGTkU3HOC1r7MBA0AVXYSgXmfyxNEpUsClr6Dfo7XpLZfpnKukP/5I+fepufAA/r/ne/+90zwPJDfvKTn5x97nOfq5dFZYEWCOSlaDlA4GcBx1I1W2iYt28D1sCLWgIsEMvxVVpKSorKAqZluhdotlFbQEehgZk66o2qcx7AnGFmXJPZToBlebLda7ovxdVxsYSJIqtco+ACKgpLaVC/BS4AaJecPI6qLJNolqLK+epdWV4+k47G9bGoImACHRQCGua78dZBa0GtoeECU0FmBrKBFTgBoWmpuO3jEgFT88GyaTPaQXWf1X4aCvq77hJF59/rKbhu87/j497vyBPYgDUqC7DeeuutthiClndGi6HQUCi41EtLfQ3VUVmgMVOO0SFZKNjUBypLCGcZbLz/AKSbjWXbqCtgs8y/WiqrIeCCG2XVHCy5V8JE1wMoSouJlf0K0NyreyusArgtB4tvRWWBl+Xs3w9QKHP9hoLKTP3CM1BRWdTMlEKx80udpxjwtgAHtLKt8AEu2ymqpbIKJPVKdSYhoFAQ+AAKsJTnrDtXVWY5V+seCiozkO77DFJVp52c/U2vaBnch4FHSHhHXvYX4WcWWH4IlTXQ2hvwo7IAK9trakvEHHCBFbUlNLMNrIBIaWLAK4FoDy0QWl5Wwz5KyjozHbioq6m3DFALVvWwKCzXSH09NWpvgApi7jFTu+eYrPt9VNbAioiS0a5eWkNJde5jFVhUFVBNwqjNwjIqC6imlVC5Qr7CitoCodR3eeVmbQqM0Q5uYOW4CQVFlQMsoaDjwSpToclgl8YwsJLYSl3NiAygdQOj3c89gPUivL138DdcCizP4RRaY8ALDeVl6RwNWgMJwLKel6xqSwkoQCQ0BBzl8qAKIEACLvMATWnceOEfNWbdOdb5eg6QDAQ6W6auXH9CVqEho11JUeUc/ewXo139/J2N2EBh8bKY7UtVzdedCywzRQNSSuoKWAAr91hoUUsLKAUQ0ExIZ5mnBWTLqK8So6YY9cJFUFph5QVlBVoAuboGbeoKUHlXEwrOiAzXhIJ7SJ0qqkNh3cEX/7b+5L7MUVl9ifcqa7ws9RMaUlnCw4FUXqQqrQkLKSxgURcYVGFZXz5UVdb4Wsuf6sgPPKqBV17EgdXkWfUY+wn5nEu54NfrWaeqtAxSVasxQH/BfquQl2UCLMtaCXlXfKus92vPExICl9ZArYaUDUhRVmZwMquX2gBY4zMx3q0D0VJbVUvgtIZQ7mgOZnlUttlvQsr1UYua7BMKuo5lymrSGMBqlFX+Fg/Ain814135e93AaJ9/rwesbuube0fv+wKwBlpjwF8VGiZ7GpC2sBCgwGrKUViAJfucmgIVIyso9QtMi9aMXLr1RwQ0wBolBk5UmlCQf0VROTfjPfsWhmA5peubco5JGG3n55l86kuICFhaB4WEVBVgNR4k6ZKsL+SivEBKSAgcwsIc0y46YGWZ2poSsJCMEhMGUlNgRF2ZhX3aGlZ6Q/0p0FI6z/hWrklx7aG1962uahV8QqP9ANYdfeFv+8/eRjK4TGX5cVe1GsrLkp8VZbCBa6AFIJbBZQGnUDEx09WBEjOeYb78qgoy9ULEUVWMe/vbR91SaJvZTlkx4YGLya5cSqupDLZTWcI+6iowmDGxmo+ltXB5VzPUTGHF28r+TWkAK6prgCX8A7EFGcsF0R5Y9gEuJWBRZgBlneoCJCkSPro6cHIdCguwhIHCwVNYSbc4bRU8HZzP3221Clq8qjXwUFe3/e29g/f/CLBGZSkpLcCyvE91ACOh4fhZ1ic8jHJqWMYUV4KWEnSMWDrhHDoNsABH/YAKxGbZ8SDFjHcdXpV15xfyLbAVVrYDVq6lHpzah9DEy7JMVQkHc3xDQhOzGqS83Oe7PpTm0JBQ2EVlZVvDQsABr1JqTVQPr2ptMyZVE0t5XdSYMNC2mflZ1BfgyeeaMBCkkuNWGE4o6KMSFB9Q7X2ryxJE/RatglHAD7/zne/sYXW6fNn6Hfznf/zk2/YENmC58VFZA63T3Kz4JcbHam7W+FmUFlCYAQKcLF8GrfG0bF8QapjIUed5gZGwTwg4YBpFpU4oOOrM+e0DVMLOHFdYmd0EaAn/Blpg1bd0ferL8DImrYLgxcPi/Vi3DBpKcFrKp6HhwApchH9gY6K+QAigqKlJRRhIqQMuYaF9HLdaIRv+rfBTZ+bCapSVbPaAubAybIyPok4Kg/IydbWAdV1L4KGubtubetxvn8AFYO2htTfg1U9oONDydZ20FJ7xstCH2roKWsapAhhDLPOXsm8H4BMmSvicURfAqQQ6Dxeng3PV1PKtmvPlXAAWThRQK1RsY4B7yMtuZIaGgvoRghXFRVnxsUBLaAhIudyMj1VYMbCpLGHXUlsdrcE2IdoKDQsr6otZDi5gBU6r1bBD0ICTUr1lIBJiWp8wcBJSXcDEz8qzrdk/sHKdKNcOyvc4WAkF03vhXhTWEQoeL/kL9wSuBNaoLOVVSusUWuAQBVZoyHcapbUg0q48lkFpSorJ8goDC6lZt9/yuBparn3qUTluqSzhaM87fhWQUVcTBkplADFKSkgoxUG5Wgb7R839FlhMd6BKVdWVdcqKwpkWw1X2k1pa7UZFUWKWhYJKtz/bFszqUVFYo64cM6BSupY5z/IhUDn/ZbC6YQqDn3akMbxwr+3d/UGTk7TlJnkUp6HhQGvvZ12ltECLSJrEzT20AIvaopgGMsBDDYHRHlSWeVsrXaH7CBcDycn9qsIKUKrehH4EinXKCjCpKiV/DbQAK8dUYWHmCv2a9Q5Sk4tlGbzGJwIu6/4DVtaXN9VcKDDqDucD+1FGXR9VRRkNsFY6RCFlP6HlTAMr1xAGXqWs9rDyt7kim/2A1d19r1/YX74H1TOD1lXhIWUzLYgLSPWfQItqMtvOj2LCCxd5UWA2Zr5QcPlTW97VGqO9666xlFXHxAItrYHqwMq6vyZIqQcl65PxTlFhD2gMuKicgdYsWwcnxjng7JfXgH+tH1BZ5mvxoagroFqeGP+Lf9b1FV422/5xyuqA1Qv7Xh4/7IoncAFS2edSaF3mZzmflsO90mLAM+TH06K2qJ8Vup3pe7j8pyZ3ypsyU0/ANSprjPsBl3UtgktJbaa+8a+WomrelX1WuNfM9ulHCFYBQUNB+VdAtZ9ASx1AAZZwzDIlQ+kwxLUigg7Vo9VO3YJYlwdaus7MoH8T4vl0fMYXK4x0owEsoSBAAZV6wHRe/QP5aGDlIxJpJWwfQfd4mbLyO44UhuP9vitP4Fpg7cPDJ4WW/KxPfepTQsBCa/XlGwV0AVjCxAEXeO29qaWa6k+pp672s9yqBbSW4ARMAEZhWaeqqCuT+5llme85f7vmLPO96gqkpBGAFlBRO9YHXNQRuJxbbA/qbw2c1AERc31m64Fr18FpFJbzAOSEgGAli33fGqjlMl2hngZWl4WGd+Xf9/E7X7AncAosP+9GoaEdr/K0RmkZMQG4gETYJgwEE0qLMtNpGqjUA0xUSAcGtG4GK+UoLkb6KC2QG1i53kpraDccfhXfCqgAirqaUNDytBKCkN8BWNlecAGUEM2sDrQoHlCyDZCm9RCITJMGYf0UWGAEVKl/aGiYUVfWQQ+wKDKgmnGtXG/fGvgEyuoyOB0pDC/YS3uXf85lwHoEWjdRWoZU/sxnPnPmA6w+GTYpDwOtaUEEErMhYJbfNHACl4aHoCUVwTJgMegdP/AacDHUl8c1/QWrsEBrAAVek3slrWGW548OQpaBzDhYQAVcQjTbQGvlXhUiDHR1A6oBFMMemMaHWgDcFJXzCQPNIAVWklMHWODp/Kd5Vk8Aq8vAdMDqLr/dL+BvvwpYT620nGDSHoCGwgIdoSFvadQWMx24qKj4NVVdK3+qymolfDa3iuICK+GhEqzAabUQAmGNdmByHduc071MvWWthabJeLcMTpNAatnM1wIeUKKiAIW/BUoAtTyolkLL1YK4/7x9w8lRU8oB1sqOr1cFWoC1HybGPT0BrA5l9QK+nMdPevQJXAesG0HLTvFYzr761a9uXXiEe+plxQ+0dOURug24lnJq2oFl5YCLKgIrYeLyrfoR1FkGLgBSB2jqrZtXSFhA2aYEHnCyPI8AnNSZQWnWgcm6Ut0Y8OoGVGBlXi2D2/hZ9gEoIWMaH2qkAxNQRXFuy8vYr9ICqow51nJCQaBynzMmu+WT1IVTQB25VsfbfSeewOOAdWNoSS5Na9U94NJ66MDTXK1TaI3aEiLuwTWgorQoK0CTUT/rK29rAxZwDbAGYq4/ddMqOMDShzD3srUWAo397QdUgGN9AagAA5EBFVW0WhQbHmrJU67uM13mVQEVA5+q4lFZN6cxgp+1QWqGiNm3BLr+DBNjedcSeMDqTryax4+87AncBFiPQEvFZcmllNYf//EfX2rGO+a0D+JpmDh9ESmsaekDL95Wxntqyx+AgdIAbADF3B9wASP4LB/sgrKS1rBC0gJp/1AWdDqYn/1AanlYWyn04zOtfQuu2QewVgjZugkBB1YU1agqamoPKvfxlCHgKciOf/HHE3jhnsBNgXUptFLZ4wOvC4P/qTttQVS37zht/VRx8bhADFAoLgosL3tDQyoMxISYoDXgAinnsk0dFZXjOu7VbAMfy0qpDFE32x9Sn0L7A5FyDT/TL0HbaQ8s69TUHlK2CxsndJwWQfX5vZtH5TiwArFpnZwQUAdm56awqCrLQkDlJTlWV4HpMNhfuNfz+EGnT+BJgHUptEZpgVY63fZ80/dwwDUh4nyJR/0lIz5QGDXmT8FFcQ20RmWtULFfch54DbgGVFOC0Czbx/pMe2BNnZbC3Ev7F44KU/KkJiNeqDdpDwM1MBIuDqwAakDl3AMroMpHPh5+8YtfvDejLdi+DwEPWB0v6/EEHn0CTwqsa6Fl4ySY7sG1V1vqx9uyvDfl33nnnXv7NAhdfJa31Y9HUFwDL+AyJru6PbwGTFPnGlRXAPPIr58hZnbw2lQK6BjZAaAGWoBDSQVKm/IS7iWNo8ppoCRktD6KSv2Y6kBl3bbpFjSq6u/+7u8uG2HhcR+MOJTV8WbfmSfwYYD1WGjtwXWqtmybLj1f+cpX7vkqzx5cvCnrPCnwWvlXBdYALEDgMzV8BI+B1vqoRI8HLsa6aeB1GbRmED/7gZHScbM8IJIztQcXJWXfvZqyvg/9rgKV+n34twOVTU8yLMwBqzvzqh4/9FLwPOFjeQR4QkTh4d7Xcs79EDUDLaUw8R//8R/rbw24pD8EavfAC7jU87V4XpbffvvthoiWV0frAsz6+ixZIQVmJmADs/1kPUB0ja0alGYFiBK2GpV0A5Nte1DtAUYx2b73qKIYq7Im9LP9UFVP+C/s2P14Arsn8GEV1v4hXgqt/Q6n/RBtuyxMVH8KLnWjsmJE+8QYQ3oLFYWI9hlgzTIVZtp7V1f95fcm/L7lcNSV46QhKPeQkj81dZ/+9Kcb9lkfj8rygOwaUNntUFXHa3k8gRs8gWcBLJe59DyXpT7Y+aow0bZ90ukPf/jDe7r5qF9DMW/wmtQE28bnArJApD97AJYuQ4+AKykSrUv4tj0icLJvrtc6PtRsHHANfNQbQUE52wZks88TgmoPrdPl/Z/xCAFv8I/62OXFfQLPCljzhG6stq4Cl3oeV1TZPX0TreufuIeW5QGW/Ky5+NRRYXvFtf/zBTT33njjjUf+our30x5OoKRBgIoaUO2V2HWQij81p73KPL9JlvoBqhf3HTx+2RM8gWcNLJd+rNqy02WtieonVLSsQ/X8llN4UV/52MIjsJr9R3XNenyv7bFMmLgP+U6fGTDlu4xbNT9qVgZQ7uHLX/7ylkM127X6PSNQOeUBqyf4B33s+mI/gecBrHliTwwuB04XH8vTP/EUXtOSqH78rbnoQCz5TRf+cuN1XfXnBKTPf/7z9/7lX/7lwi57pWXDfv2f/umfbqKaHqegrgLSAaoX+907ft2HeALPE1hu58rz7/0tO+4TT63r5rP/PQOvUS5f+tKXzr73ve/d+9rXvtbd9hCb405hpp4qetx0Cin7j2k+x0YhPgmILoPPdUA6YPW4P9Kx/U4+gecNrHmo112naRAznYLrMniNp7X/iwGYdRDbT6eh4eP+yqdgugZQNj0JtOZUB6ge90c4th9P4Ion8FEB68bg2sPLQdPdZ3//p+rLtssgdtlv3rcu2j5Z5tf9C1mq7qYq6cOEeIeiOl7R4wnc4Al81MC6Cbjsc+l9XQYvn2TPCBHX/g7D3rz11ltX7nMNkE4f4ZPC6HEgetz2G/wJj12OJ3B3nsD/K2DdnSd8/NLjCRxP4Jk9gQNYz+xRHic6nsDxBJ73EziA9byf8HH+4wkcT+CZPYEDWM/sUR4nOp7A8QSe9xM4gPW8n/Bx/uMJHE/gmT2BA1jP7FEeJzqewPEEnvcTOID1vJ/wcf7jCRxP4Jk9gQNYz+xRHic6nsDxBJ73EziA9byf8HH+4wkcT+CZPYEDWM/sUR4nOp7A8QSe9xM4gPW8n/Bx/uMJHE/gmT2BA1jP7FEeJzqewPEEnvcTOID1vJ/wcf7jCRxP4Jk9gQNYz+xRHic6nsDxBJ73EziA9byf8HH+4wkcT+CZPYEDWM/sUR4nOp7A8QSe9xM4gPW8n/Bx/uMJHE/gmT2BA1jP7FEeJzqewPEEnvcTOID1vJ/wcf7jCRxP4Jk9gQNYz+xRHic6nsDxBJ73EziA9byf8HH+4wkcT+CZPYEDWM/sUR4nOp7A8QSe9xP4/wBC/rFzKzPtCQAAAABJRU5ErkJggg=="),
            maxAge: 5,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.AdditiveBlending
        });

        // Create particle emitter 0
        var Untitled1Emitter = new SPE.Emitter({
            type: 'cube',
            particleCount: 100,
            position: new THREE.Vector3(0, 0, 0),
            positionSpread: new THREE.Vector3(0, 0, 0),
            acceleration: new THREE.Vector3(0, 0, 0),
            accelerationSpread: new THREE.Vector3(0, 0, 0),
            velocity: new THREE.Vector3(0, 0.8888888888888893, 0),
            velocitySpread: new THREE.Vector3(0.7777777777777778, 0, 0.888888888888889),
            sizeStart: 1.8333333333333333 * particleScale,
            sizeStartSpread: 0,
            sizeMiddle: 2.6666666666666665 * particleScale,
            sizeMiddleSpread: 0,
            sizeEnd: 4.055555555555555 * particleScale,
            sizeEndSpread: 0,
            angleStart: 0,
            angleStartSpread: 0,
            angleMiddle: 0,
            angleMiddleSpread: 0,
            angleEnd: 0,
            angleEndSpread: 0,
            angleAlignVelocity: false,
            colorStart: new THREE.Color(0xd37400),
            colorStartSpread: new THREE.Vector3(0, 0, 0),
            colorMiddle: new THREE.Color(0xd83b00),
            colorMiddleSpread: new THREE.Vector3(0, 0, 0),
            colorEnd: new THREE.Color(0xfff8e0),
            colorEndSpread: new THREE.Vector3(0, 0, 0),
            opacityStart: 1,
            opacityStartSpread: 0,
            opacityMiddle: 0.5,
            opacityMiddleSpread: 0,
            opacityEnd: 0,
            opacityEndSpread: 0,
            duration: null,
            alive: 1,
            isStatic: 0
        });

        this.particleGroup.addEmitter(Untitled1Emitter);

        // Add mesh to your scene. Adjust as necessary.
        this.particleGroup.mesh.scale.multiplyScalar(.6);
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;

        this.animate();
    }
    FireParticle1.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.animate();
        });

        var delta = this.clock.getDelta();
        this.particleGroup.tick(delta);
    };
    return FireParticle1;
})(THREE.Object3D);
var LeafParticle1 = (function (_super) {
    __extends(LeafParticle1, _super);
    function LeafParticle1() {
        _super.call(this);
        this.clock = new THREE.Clock();

        this.position.y = 4;
        var scale = 1;

        // Create particle group
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture("data:image/png;base64,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"),
            maxAge: 5,
            hasPerspective: 1,
            colorize: 1,
            transparent: 1,
            alphaTest: 0.5,
            depthWrite: false,
            depthTest: true,
            blending: THREE.NormalBlending
        });

        // Create particle emitter 0
        var Untitled1Emitter = new SPE.Emitter({
            type: 'cube',
            particleCount: 30,
            position: new THREE.Vector3(0, 0, 0),
            positionSpread: new THREE.Vector3(9.444444444444445, 0, 9.444444444444445),
            acceleration: new THREE.Vector3(0, 0, 0),
            accelerationSpread: new THREE.Vector3(0, 0, 0),
            velocity: new THREE.Vector3(-1.1111111111111107, -2, 0),
            velocitySpread: new THREE.Vector3(6.111111111111112, 3.4444444444444446, 4.444444444444445),
            sizeStart: 0.9999999999999999 * scale,
            sizeStartSpread: 0,
            sizeMiddle: 1 * scale,
            sizeMiddleSpread: 0,
            sizeEnd: 1 * scale,
            sizeEndSpread: 0,
            angleStart: 0,
            angleStartSpread: 2.0245819323134224,
            angleMiddle: 1.0471975511965974,
            angleMiddleSpread: 3.07177948351002,
            angleEnd: 1.919862177193763,
            angleEndSpread: 4.6774823953448035,
            angleAlignVelocity: false,
            colorStart: new THREE.Color(0x000000),
            colorStartSpread: new THREE.Vector3(0, 0, 0),
            colorMiddle: new THREE.Color(0xffffff),
            colorMiddleSpread: new THREE.Vector3(0, 0, 0),
            colorEnd: new THREE.Color(0xffffff),
            colorEndSpread: new THREE.Vector3(0, 0, 0),
            opacityStart: 1,
            opacityStartSpread: 0,
            opacityMiddle: 0.9888888888888889,
            opacityMiddleSpread: 0,
            opacityEnd: 0,
            opacityEndSpread: 0,
            duration: null,
            alive: 1,
            isStatic: 0
        });

        this.particleGroup.addEmitter(Untitled1Emitter);

        // Add mesh to your scene. Adjust as necessary.
        this.particleGroup.mesh.scale.multiplyScalar(scale);
        this.add(this.particleGroup.mesh);
        this.mesh = this.particleGroup.mesh;

        this.animate();
    }
    LeafParticle1.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.animate();
        });

        var delta = this.clock.getDelta();
        this.particleGroup.tick(delta);
    };
    return LeafParticle1;
})(THREE.Object3D);
var ParticleBase = (function (_super) {
    __extends(ParticleBase, _super);
    function ParticleBase() {
        _super.call(this);

        this.test = 1;
    }
    return ParticleBase;
})(THREE.Object3D);
var ParticleManager = (function (_super) {
    __extends(ParticleManager, _super);
    function ParticleManager() {
        _super.call(this);

        var geometry = new THREE.Geometry();

        var sprite1 = THREE.ImageUtils.loadTexture("img/sprites/snowflake1.png");
        var sprite2 = THREE.ImageUtils.loadTexture("img/sprites/snowflake2.png");
        var sprite3 = THREE.ImageUtils.loadTexture("img/sprites/snowflake3.png");
        var sprite4 = THREE.ImageUtils.loadTexture("img/sprites/snowflake4.png");
        var sprite5 = THREE.ImageUtils.loadTexture("img/sprites/snowflake5.png");

        for (var i = 0; i < 10000; i++) {
            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 10000 - 5000;
            vertex.y = Math.random() * 3000;
            vertex.z = Math.random() * 5000;

            geometry.vertices.push(vertex);
        }

        var parameters = [
            [[1.0, 0.2, 0.5], sprite2, 20],
            [[0.95, 0.1, 0.5], sprite3, 15],
            [[0.90, 0.05, 0.5], sprite1, 10],
            [[0.85, 0, 0.5], sprite5, 8],
            [[0.80, 0, 0.5], sprite4, 5]
        ];

        var materials = [];
        for (i = 0; i < parameters.length; i++) {
            var color = parameters[i][0];
            var sprite = parameters[i][1];
            var size = parameters[i][2];

            materials[i] = new THREE.ParticleSystemMaterial({ size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent: true });
            materials[i].color.setHSL(color[0], color[1], color[2]);

            var particles = new THREE.ParticleSystem(geometry, materials[i]);

            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;

            this.add(particles);
        }
    }
    return ParticleManager;
})(THREE.Object3D);
var Player = (function (_super) {
    __extends(Player, _super);
    function Player() {
        _super.call(this);
        this.materials = [];
        this.textures = [];

        this.setProperty();
        this.setShadow();
        this.animate();
    }
    Player.prototype.setProperty = function () {
        this.scale.multiplyScalar(1.5);
        this.updateMatrix();
        this.position.y = .1;

        this.name = "player";

        //add player
        var url = 'assets/models/player/player2.js';

        //url = 'assets/models/elderlyWalk.js';
        new LoadManager(url, "json", this.playerModelLoadCompHandler.bind(this));
    };

    Player.prototype.playerModelLoadCompHandler = function (result) {
        var loader = new THREE.DDSLoader();
        var map = loader.load('assets/models/player/diffuse2.dds');
        map.minFilter = map.magFilter = THREE.LinearFilter;

        /*
        var material1: THREE.ShaderMaterial = new THREE.ShaderMaterial({
        vertexShader: document.getElementById('toon-animate-vshader').textContent,
        fragmentShader: document.getElementById('toon-animate-fshader').textContent,
        
        uniforms: {
        texture: {
        type: 't',
        value: THREE.ImageUtils.loadTexture('assets/models/player/diffuse2.png')
        //type: 't', value: map
        },
        toonTexture: {
        type: 't',
        value: THREE.ImageUtils.loadTexture('img/toon3.png')
        },
        lightDirection: {
        type: 'v3',
        value: new THREE.Vector3( 1, 1, 0 )
        },
        viewVector: {
        type: 'v3',
        value: CameraManager.camera.position.clone().normalize()
        }
        },
        morphTargets: false,
        //morphNormals: true,
        transparent: true
        });
        */
        var material1 = new THREE.MeshBasicMaterial({
            map: map,
            transparent: true,
            alphaTest: .5,
            morphTargets: true
        });

        var material2 = new THREE.MeshBasicMaterial({
            color: 0x2d1d5f,
            morphTargets: true
        });

        this.materials = [material1, material2];
        var material = new THREE.MeshFaceMaterial(this.materials);

        //result.geometry.computeMorphNormals();
        this.mesh = MeshManager.getAnimationMesh(result.geometry, this.materials);
        Vars.morphs.push(this.mesh);
        Vars.morphsLength = Vars.morphs.length;
        this.add(this.mesh);
        //result = null;
        //delete result;
    };

    Player.prototype.setShadow = function () {
        var tex = THREE.ImageUtils.loadTexture('img/round_shadow.png');
        this.shadowMat = new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            alphaTest: .01
        });
        var geometry = new THREE.PlaneGeometry(1.5, 1.5, 1, 1);
        this.shadowMesh = new THREE.Mesh(geometry, this.shadowMat);
        this.shadowMesh.rotation.x = -90 * Vars.toRad;

        //SceneManager.scene.add(this.shadowMesh);
        var pos = this.position.clone();
        pos.y += 1;
        this.groundRay = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0));
    };

    Player.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.animate();
        });

        /*
        //shader
        if (this.mesh && this.mesh.material.materials[0].uniforms)
        this.mesh.material.materials[0].uniforms.viewVector.value = new THREE.Vector3().subVectors(CameraManager.camera.position.clone(), this.position.clone());
        */
        this.movement();
        this.shadowMove();
    };

    Player.prototype.movement = function () {
        var dist = this.position.clone().distanceTo(Vars.mousePosition.clone());
        if (dist > .5) {
            //move
            var direction = Vars.mousePosition.clone().sub(this.position.clone()).normalize();
            this.position.add(direction.multiplyScalar(.05));

            //rotation
            direction.y = 0;
            this.lookAt(this.position.clone().add(direction));
        }
    };

    Player.prototype.shadowMove = function () {
        if (this.shadowMesh) {
            var pos = this.position.clone();
            this.shadowMesh.position.x = pos.x;
            this.shadowMesh.position.z = pos.z;

            pos.y += 1;
            this.groundRay.ray.origin = pos;
            var obj = RaycastManager.hitCheck(this.groundRay, 10);
            if (obj.hitFlag) {
                this.shadowMesh.position.y = obj.point.y + .1;
            } else {
                this.shadowMesh.position.y = -10;
            }
        }
    };
    return Player;
})(THREE.Object3D);
var PostprocessManager1;
(function (PostprocessManager1) {
    PostprocessManager1.scene;
    PostprocessManager1.glowScene;
    var blurComposer;
    var layer2Composer;
    var layer1Composer;
    var glows = [];
    var glowsLength = 0;

    var toScreen = new THREE.ShaderPass(THREE.CopyShader);

    function init(_scene) {
        PostprocessManager1.scene = _scene;

        //layer1Composer
        layer1Composer = new THREE.EffectComposer(RendererManager.renderer);
        var renderPass = new THREE.RenderPass(PostprocessManager1.scene, CameraManager.camera);
        layer1Composer.addPass(renderPass);

        toScreen.renderToScreen = true;
        layer1Composer.addPass(toScreen);

        animate();
    }
    PostprocessManager1.init = init;

    function addEffect(type) {
        var w = Vars.stageWidth;
        var h = Vars.stageHeight;

        toScreen.renderToScreen = false;
        layer1Composer.addPass(toScreen);

        switch (type) {
            case "bloom1":
                RendererManager.renderer.autoClear = false;
                layer1Composer.addPass(new THREE.BloomPass(1, 13));
                break;

            case "bloom2":
                //----------------------glow effect-------------------
                //blurComposer
                var renderTarget = new THREE.WebGLRenderTarget(w, h);
                blurComposer = new THREE.EffectComposer(RendererManager.renderer, renderTarget);

                var renderPass = new THREE.RenderPass(PostprocessManager1.glowScene, GlowCameraManager.camera, null, null, 0);
                blurComposer.addPass(renderPass);

                var hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
                var vblur = new THREE.ShaderPass(THREE.VerticalBlurShader);

                var bluriness = 3;
                hblur.uniforms["h"].value = bluriness * 2 / w;
                vblur.uniforms["v"].value = bluriness / h;
                blurComposer.addPass(hblur);
                blurComposer.addPass(vblur);

                /*
                //コメントアウトを外すと画面に直接レンダリングされる（layer1Composerに上書きされるので確認はできないが）
                var toScreen = new THREE.ShaderPass(THREE.CopyShader);
                toScreen.renderToScreen = true;
                blurComposer.addPass(toScreen);
                */
                /*
                //layer2Composer
                var obj: Object = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };
                renderTarget = new THREE.WebGLRenderTarget(w, h, obj);
                layer2Composer = new THREE.EffectComposer(RendererManager.renderer, renderTarget);
                renderPass = new THREE.RenderPass(glowScene, GlowCameraManager.camera, null, null, 0);
                layer2Composer.addPass(renderPass);
                var mask = new THREE.MaskPass(glowScene, GlowCameraManager.camera);
                layer2Composer.addPass(mask);
                layer2Composer.addPass(new THREE.ClearMaskPass());
                */
                /*
                //コメントアウトを外すと画面に直接レンダリングされる（layer1Composerに上書きされるので確認はできないが）
                var toScreen = new THREE.ShaderPass(THREE.CopyShader);
                toScreen.renderToScreen = true;
                layer2Composer.addPass(toScreen);
                */
                var shader = {
                    uniforms: {
                        tDiffuse: { type: "t", value: null },
                        tBlur: { type: "t", value: blurComposer.renderTarget2 }
                    },
                    vertexShader: document.getElementById('vshader').textContent,
                    fragmentShader: document.getElementById('fshader').textContent
                };

                var shaderPass = new THREE.ShaderPass(shader);
                shaderPass.needsSwap = true;
                layer1Composer.addPass(shaderPass);

                break;

            case "dof":
                var hblur = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
                var vblur = new THREE.ShaderPass(THREE.VerticalTiltShiftShader);

                var bluriness = 3;

                hblur.uniforms['h'].value = bluriness / Vars.stageWidth;
                vblur.uniforms['v'].value = bluriness / Vars.stageHeight;
                hblur.uniforms['r'].value = vblur.uniforms['r'].value = 0.5;

                layer1Composer.addPass(hblur);
                layer1Composer.addPass(vblur);
                break;

            case "rgb":
                var rgbEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
                rgbEffect.uniforms['amount'].value = 0.003;
                rgbEffect.uniforms['angle'].value = 0;
                layer1Composer.addPass(rgbEffect);
                break;

            case "dot":
                var dotEffect = new THREE.ShaderPass(THREE.DotScreenShader);
                dotEffect.uniforms['angle'].value = 0;
                dotEffect.uniforms['scale'].value = 500; //でかいほど細かい目になる
                layer1Composer.addPass(dotEffect);
                break;
        }

        toScreen.renderToScreen = true;
        layer1Composer.addPass(toScreen);
    }
    PostprocessManager1.addEffect = addEffect;

    function animate() {
        requestAnimationFrame(animate);

        positionMerge();

        if (blurComposer)
            blurComposer.render(0.1);

        //layer2Composer.render(0.1);
        layer1Composer.render(0.1);
    }

    function positionMerge() {
        for (var i = 0; i < glowsLength; i++) {
            glows[i].copy.position.copy(glows[i].original.position);
            glows[i].copy.rotation = glows[i].original.rotation;
        }
    }

    function add(object) {
        PostprocessManager1.scene.add(object);
        var copyObject = MeshManager.duplicate(object);

        if (!PostprocessManager1.glowScene)
            PostprocessManager1.glowScene = new GlowScene();
        PostprocessManager1.glowScene.add(copyObject);

        glows.push(new GlowObject(object, copyObject));
        glowsLength = glows.length;
    }
    PostprocessManager1.add = add;
})(PostprocessManager1 || (PostprocessManager1 = {}));
var PostprocessManager2;
(function (PostprocessManager2) {
    PostprocessManager2.composer;

    var renderTargetParameters;
    PostprocessManager2.renderTarget;

    function init() {
        renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
        PostprocessManager2.renderTarget = new THREE.WebGLRenderTarget(Vars.stageWidth, Vars.stageWidth, renderTargetParameters);

        RendererManager.renderer.autoClear = false;
        PostprocessManager2.composer = new THREE.EffectComposer(RendererManager.renderer, PostprocessManager2.renderTarget);
        PostprocessManager2.composer.addPass(new THREE.RenderPass(SceneManager.scene, CameraManager.camera));
    }
    PostprocessManager2.init = init;

    function add(type) {
        switch (type) {
            case "bloom":
                addBloom();
                break;

            case "dof":
                addDof();
                break;

            case "rgbShift":
                addRgbShift();
                break;

            case "dot":
                addDot();
                break;
        }

        renderToScreen();
    }
    PostprocessManager2.add = add;

    function renderToScreen() {
        var toScreen = new THREE.ShaderPass(THREE.CopyShader);
        toScreen.renderToScreen = true;
        PostprocessManager2.composer.addPass(toScreen);
    }

    function addBloom() {
        PostprocessManager2.composer.addPass(new THREE.BloomPass(1, 25)); //なぜか第三引数を指定すると右上にずれる
        //renderToScreen();
    }

    function addDof() {
        var hblur = new THREE.ShaderPass(THREE.HorizontalTiltShiftShader);
        var vblur = new THREE.ShaderPass(THREE.VerticalTiltShiftShader);

        var bluriness = 3;

        hblur.uniforms['h'].value = bluriness / Vars.stageWidth;
        vblur.uniforms['v'].value = bluriness / Vars.stageHeight;
        hblur.uniforms['r'].value = vblur.uniforms['r'].value = 0.5;

        PostprocessManager2.composer.addPass(hblur);
        PostprocessManager2.composer.addPass(vblur);
    }

    function addRgbShift() {
        var rgbEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
        rgbEffect.uniforms['amount'].value = 0.001;
        rgbEffect.uniforms['angle'].value = 0;
        PostprocessManager2.composer.addPass(rgbEffect);
    }

    function addDot() {
        var effect = new THREE.ShaderPass(THREE.DotScreenShader);
        effect.uniforms['angle'].value = 0;
        effect.uniforms['scale'].value = 500; //でかいほど細かい目になる
        PostprocessManager2.composer.addPass(effect);
    }
})(PostprocessManager2 || (PostprocessManager2 = {}));
var RaycastManager;
(function (RaycastManager) {
    RaycastManager.raycastMesh;
    var octree;
    var intersected;
    var baseColor = 0x333333;
    var intersectColor = 0x00D66B;
    var raycastTargets = [];

    function init() {
        //addraycastMesh
        var geometry = new THREE.PlaneGeometry(100, 100, 1, 1);
        var material = new THREE.MeshBasicMaterial({ color: 0xff00ff, visible: false });

        //var material2: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({ color:0xff00ff, opacity:.1, transparent:true });//opacity:0だとエラー
        RaycastManager.raycastMesh = new THREE.Mesh(geometry, material);
        RaycastManager.raycastMesh.rotation.x = 270 * Vars.toRad;
        SceneManager.scene.add(RaycastManager.raycastMesh);

        octree = new THREE.Octree({
            undeferred: false,
            depthMax: Infinity,
            objectsThreshold: 8,
            overlapPct: 0.15
        });
        octree.add(RaycastManager.raycastMesh, { useFaces: false });
        raycastTargets.push(RaycastManager.raycastMesh);

        animate();
    }
    RaycastManager.init = init;

    function raycast(raycaster) {
        var intersections = raycaster.intersectObjects(raycastTargets, true);

        return intersections;
    }

    function octreeRaycast(raycaster) {
        var numFaces = 0;
        var octreeObjects = octree.search(raycaster.ray.origin, raycaster.ray.far, true, raycaster.ray.direction);
        var intersections = raycaster.intersectOctreeObjects(octreeObjects);
        var numObjects = octreeObjects.length;

        for (var i = 0, il = numObjects; i < il; i++) {
            numFaces += octreeObjects[i].faces.length;
        }

        octree.update();

        return intersections;
    }

    function hitCheck(raycaster, dist) {
        var obj = {};
        var hitFlag = false;

        //var intersections = octreeRaycast(raycaster);
        var intersections = raycast(raycaster);

        if (intersections.length > 0) {
            if (intersected != intersections[0].object) {
                //if (intersected) intersected.material.color.setHex(baseColor);
                intersected = intersections[0].object;
                //intersected.material.color.setHex(intersectColor);
            }

            //debug.innerHTML = "Hit @ " + intersections[0].point.z;
            document.body.style.cursor = 'pointer';

            var distance = intersections[0].distance;
            if (distance > 0 && distance < dist) {
                hitFlag = true;
                obj = intersections[0];
            }
        } else if (intersected) {
            //intersected.material.color.setHex(baseColor);
            intersected = null;

            document.body.style.cursor = 'auto';
        }

        obj.hitFlag = hitFlag;

        return obj;
        /*
        var intersections = raycast();
        
        var length = intersections.length;
        if (length > 0) {
        var index = length - 1;
        var distance = intersections[index].distance;
        if (distance > 0 && distance < dist) {
        hitFlag = true;
        }
        }
        
        if (hitFlag) obj = intersections[index];
        obj.hitFlag = hitFlag;
        
        return obj;
        */
    }
    RaycastManager.hitCheck = hitCheck;

    function animate() {
        requestAnimationFrame(function () {
            return animate();
        });

        if (CameraManager.camera) {
            RaycastManager.raycastMesh.position.copy(CameraManager.camera.position);
            RaycastManager.raycastMesh.position.y = .1;
        }
    }
})(RaycastManager || (RaycastManager = {}));
var RendererManager;
(function (RendererManager) {
    RendererManager.renderer;

    function init() {
        RendererManager.renderer = new THREE.WebGLRenderer({ antialias: true });
        var h = Vars.stageHeight;
        var w = Vars.stageWidth;
        RendererManager.renderer.setSize(w / Vars.resolution, h / Vars.resolution);
        RendererManager.renderer.domElement.style.width = w + "px";
        RendererManager.renderer.domElement.style.height = h + "px";
        //renderer.context.mozImageSmoothingEnabled = false;
    }
    RendererManager.init = init;
})(RendererManager || (RendererManager = {}));
var Vars;
(function (Vars) {
    Vars.resolution = 1;

    Vars.toRad = Math.PI / 180;
    Vars.stageWidth = 0;
    Vars.stageHeight = 600;
    Vars.windowHalfX = 0;
    Vars.windowHalfY = 0;
    Vars.mouseX = 0;
    Vars.mouseY = 0;
    Vars.mousePosition = new THREE.Vector3();

    Vars.morphs = [];
    Vars.morphsLength = 0;

    var raycaster;

    Vars.debug;

    function init() {
        Vars.debug = document.getElementById("debug");

        raycaster = new THREE.Raycaster(CameraManager.camera.position, new THREE.Vector3(0, -1, 0));

        animate();
    }
    Vars.init = init;

    function animate() {
        requestAnimationFrame(function () {
            return animate();
        });

        var vector = ThreeManager.screen2world();
        vector.sub(CameraManager.camera.position.clone()).normalize();
        raycaster.set(CameraManager.camera.position.clone(), vector);

        var obj = RaycastManager.hitCheck(raycaster, 99);
        if (obj.hitFlag) {
            Vars.mousePosition = obj.point;
        } else {
            Vars.mousePosition = new THREE.Vector3();
        }

        //raycastバグ対策の為raycast計算後にCameraManagerのanimate実行
        CameraManager.animate();
    }
})(Vars || (Vars = {}));
///<reference path="../Vars.ts"/>
var RollMesh = (function (_super) {
    __extends(RollMesh, _super);
    function RollMesh(g, m) {
        _super.call(this, g, m);
        this.defaultPosition = new THREE.Vector3();
        this.rot = 0;
        this.radius = 200;
        this.speed = 10;

        this.speed = this.speed * Math.random();

        this.animate();
    }
    RollMesh.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.animate();
        });

        this.rot += this.speed;

        var radian = this.rot * Vars.toRad;
        var x = Math.cos(radian) * this.radius;
        var z = Math.sin(radian) * this.radius;
        this.position = this.defaultPosition.clone().add(new THREE.Vector3(x, 0, z));
    };
    return RollMesh;
})(THREE.Mesh);
var Scene = (function (_super) {
    __extends(Scene, _super);
    function Scene() {
        _super.call(this);
        this.clock = new THREE.Clock();
        this.start = Date.now();

        CameraManager.init();
    }
    Scene.prototype.initObjects = function () {
        this.initLight();
        this.initMesh();
        this.animate();
    };

    Scene.prototype.initMesh = function () {
        //skybox
        this.skyBox = new SkyBox();
        this.add(this.skyBox);

        /*
        //add snake
        var geometry:THREE.Geometry = new THREE.SphereGeometry(1, 30, 30);
        var material: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        //var material: THREE.ShaderMaterial = MaterialManager.test();
        var mesh: THREE.Mesh = new THREE.Mesh(geometry, material);
        
        var meshs: Array<THREE.Mesh> = MeshManager.duplicates(mesh, 10);
        meshs = PropertyManager.randomSizes(meshs, .5, 2);
        for (var i = 0; i < meshs.length; i++) {
        this.add(meshs[i]);
        //PostprocessManager1.add(meshs[i]);
        }
        this.snake = new Snake(meshs);
        */
        //particle
        //this.particleManager = new ParticleManager();
        //this.add(this.particleManager);
        //add ground
        this.ground = new Ground();
        this.add(this.ground);

        this.player = new Player();
        this.add(this.player);

        this.leafParticle1 = new LeafParticle1();
        this.add(this.leafParticle1);
    };

    Scene.prototype.initLight = function () {
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        this.light.position.set(3, 10, -1);
        this.add(this.light);
    };

    Scene.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.animate();
        });

        var delta = this.clock.getDelta();
        if (Vars.morphsLength) {
            for (var i = 0; i < Vars.morphsLength; i++)
                Vars.morphs[i].updateAnimation(1000 * delta);
        }

        if (this.particleManager) {
            var time = Date.now() * 0.00005;
            for (i = 0; i < this.particleManager.children.length; i++) {
                var object = this.particleManager.children[i];

                if (object instanceof THREE.ParticleSystem) {
                    object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
                }
            }
            this.particleManager.position = CameraManager.camera.position.clone();
            this.particleManager.position.z += 20;
        }

        if (this.waterMaterial)
            this.waterMaterial.uniforms.time.value = .0001 * (Date.now() - this.start);

        if (this.skyBox) {
            this.skyBox.position = CameraManager.camera.position.clone();
            this.skyBox.position.y = 0;
        }
    };

    Scene.prototype.reload = function () {
        /*
        if (this.player) {
        this.player.memoryClear();
        this.remove(this.player);
        this.player = null;
        delete this.player;
        }
        
        if (this.ground) {
        this.ground.memoryClear();
        this.remove(this.ground);
        this.ground = null;
        delete this.ground;
        }
        
        if (this.skyBox) {
        this.skyBox.memoryClear();
        this.remove(this.skyBox);
        this.skyBox = null;
        delete this.skyBox;
        }
        
        if (this.leafParticle1) RendererManager.renderer.deallocateGeometry(this.leafParticle1.mesh.geometry);
        */
    };
    return Scene;
})(THREE.Scene);
var SceneManager;
(function (SceneManager) {
    SceneManager.scene;

    function init() {
        SceneManager.scene = new Scene();
    }
    SceneManager.init = init;

    function initObjects() {
        SceneManager.scene.initObjects();
    }
    SceneManager.initObjects = initObjects;
})(SceneManager || (SceneManager = {}));
var SkyBox = (function (_super) {
    __extends(SkyBox, _super);
    function SkyBox() {
        _super.call(this);
        this.materials = [];
        this.textures = [];

        var imagePrefix = "img/skybox/sunset_";
        var directions = ["posX", "negX", "posY", "negY", "posZ", "negZ"];
        var imageSuffix = ".dds";
        var skyGeometry = new THREE.CubeGeometry(200, 200, 200);

        var loader = new THREE.DDSLoader();

        for (var i = 0; i < 6; i++) {
            var map = loader.load(imagePrefix + directions[i] + imageSuffix);
            map.minFilter = map.magFilter = THREE.LinearFilter;
            this.textures.push(map);
            this.materials.push(new THREE.MeshBasicMaterial({
                map: map,
                side: THREE.BackSide
            }));
        }
        var skyMaterial = new THREE.MeshFaceMaterial(this.materials);
        this.mesh = new THREE.Mesh(skyGeometry, skyMaterial);
        this.add(this.mesh);
    }
    SkyBox.prototype.memoryClear = function () {
        if (this.mesh) {
            this.remove(this.mesh);
            RendererManager.renderer.deallocateGeometry(this.mesh.geometry);

            //this.mesh.geometry.dispose();
            this.mesh = null;
            delete this.mesh;
        }

        for (var i = 0; i < this.materials.length; i++) {
            //RendererManager.renderer.deallocateMaterial(this.materials[i]);
            this.materials[i].dispose();
        }
        this.materials = null;
        delete this.materials;

        for (i = 0; i < this.textures.length; i++) {
            RendererManager.renderer.deallocateTexture(this.textures[i]);
            //this.textures[i].dispose();
        }
        this.textures = null;
        delete this.textures;
        //alert("skybox ok");
    };
    return SkyBox;
})(THREE.Object3D);
var ThreeManager;
(function (ThreeManager) {
    var projector = new THREE.Projector();

    function screen2world() {
        var mouse = new THREE.Vector3(Vars.mouseX, Vars.mouseY, .5);
        mouse.x = (mouse.x / Vars.stageWidth) * 2 - 1;
        mouse.y = -(mouse.y / Vars.stageHeight) * 2 + 1;
        projector.unprojectVector(mouse, CameraManager.camera);

        return mouse;
    }
    ThreeManager.screen2world = screen2world;

    function world2screen(object) {
        /*
        var vector: THREE.Vector3 = new THREE.Vector3();
        projector.projectVector(vector.setFromMatrixPosition(object.matrixWorld), CameraManager.camera);
        
        vector.x = (vector.x * Vars.windowHalfX) + Vars.windowHalfX;
        vector.y = - (vector.y * Vars.windowHalfY) + Vars.windowHalfY;
        
        return vector;
        */
        var pos = object.position.clone();
        projector.projectVector(pos, CameraManager.camera);
        pos.x = (pos.x + 1) / 2 * Vars.stageWidth;
        pos.y = -(pos.y + 1) / 2 * Vars.stageHeight;

        return pos;
    }
    ThreeManager.world2screen = world2screen;

    function getMouseTo(target) {
        var worldToScreenVector = this.world2screen(target);
        var m = new THREE.Vector3(Vars.mouseX, Vars.mouseY, 0);
        var dist = m.distanceTo(worldToScreenVector);
        var direction = m.sub(worldToScreenVector);
        var direction2 = direction.clone();
        direction.normalize();

        var x = 0;
        var z = 0;
        if (dist > 20) {
            x = -direction.x;
            z = -direction.y;
        }

        return { direction: new THREE.Vector3(x, 0, z), dist: dist, direction2: direction2 };
    }
    ThreeManager.getMouseTo = getMouseTo;

    function getCameraForward(vec) {
        var forward = getForward(CameraManager.camera);
        forward.y = 0;

        var right = new THREE.Vector3(forward.z, 0, -forward.x);

        var a = right.multiplyScalar(vec.x);
        var b = forward.multiplyScalar(vec.z);
        var direction = a.add(b);

        return direction;
    }
    ThreeManager.getCameraForward = getCameraForward;

    function getForward(obj) {
        var vector = new THREE.Vector3(0, 0, -1);
        vector.applyEuler(obj.rotation); //, obj.eulerOrder
        return vector;
    }

    function deleteObjects(parent) {
        var length = parent.children.length;
        for (var i = 0; i < length; i++) {
            var child = parent.children[0];
            parent.remove(child);
            deleteObject(child);
        }

        if (!length) {
            parent = null;
            delete parent;
        }
    }
    ThreeManager.deleteObjects = deleteObjects;

    function deleteObject(child) {
        if (child.geometry) {
            RendererManager.renderer.deallocateGeometry(child.geometry);

            //child.geometry.dispose();
            child.geometry = null;
            delete child.geometry;
        }

        if (child.material) {
            //texture
            if (child.material.map) {
                deleteTexture(child.material.map);
                //child.material.map.dispose();
            }
            if (child.material.lightMap) {
                deleteTexture(child.material.lightMap);
            }
            if (child.material.specularMap) {
                deleteTexture(child.material.specularMap);
            }
            if (child.material.alphaMap) {
                deleteTexture(child.material.alphaMap);
            }
            if (child.material.envMap) {
                deleteTexture(child.material.envMap);
            }
            if (child.material.materials) {
                var length = child.material.materials.length;
                for (var i = 0; i < length; i++) {
                    var map = child.material.materials[i].map;
                    if (map)
                        deleteTexture(map);
                }
            }

            //material
            //RendererManager.renderer.deallocateMaterial(obj.material);
            if (child.material.dispose)
                child.material.dispose();
            child.material = null;
            delete child.material;
        }

        deleteObjects(child);
    }
    ThreeManager.deleteObject = deleteObject;

    function deleteTexture(map) {
        RendererManager.renderer.deallocateTexture(map);
        map = null;
        delete map;
    }
})(ThreeManager || (ThreeManager = {}));
/// <reference path="../../scripts/typings/threejs/three.d.ts" />
///<reference path="../Vars.ts"/>
var ThreeView = (function () {
    function ThreeView() {
        this.initRenderer();
        this.animate();
    }
    ThreeView.prototype.initRenderer = function () {
        RendererManager.init();

        SceneManager.init();
        Vars.init();
        RaycastManager.init();

        //PostprocessManager1.init( this.scene );
        SceneManager.initObjects();

        var container = document.getElementById("container");
        container.appendChild(RendererManager.renderer.domElement);

        //PostprocessManager1.addEffect("bloom1");
        //PostprocessManager1.addEffect("dof");
        PostprocessManager2.init();
        PostprocessManager2.add("dof"); //dof bloom rgbShift dot
    };

    ThreeView.prototype.animate = function () {
        var _this = this;
        requestAnimationFrame(function () {
            return _this.animate();
        });

        RendererManager.renderer.render(SceneManager.scene, CameraManager.camera);

        var composer = PostprocessManager2.composer;
        if (composer)
            composer.render();
    };

    ThreeView.prototype.resize = function () {
        var w = Vars.stageWidth;
        var h = Vars.stageHeight;

        RendererManager.renderer.setSize(w / Vars.resolution, h / Vars.resolution);
        RendererManager.renderer.domElement.style.width = w + "px";
        RendererManager.renderer.domElement.style.height = h + "px";

        CameraManager.camera.aspect = w / h;
        CameraManager.camera.updateProjectionMatrix();
        GlowCameraManager.camera.aspect = w / h;
        GlowCameraManager.camera.updateProjectionMatrix();
    };

    ThreeView.prototype.reload = function () {
        //SceneManager.scene.reload();
        ThreeManager.deleteObjects(SceneManager.scene);
        if (PostprocessManager2.composer) {
            RendererManager.renderer.deallocateRenderTarget(PostprocessManager2.renderTarget);
            PostprocessManager2.composer = null;
            delete PostprocessManager2.composer;
        }
    };
    return ThreeView;
})();
//# sourceMappingURL=all.js.map

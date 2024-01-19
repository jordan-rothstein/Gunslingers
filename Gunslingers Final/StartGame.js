//
//Init Variables
var stage, canvas;
var aiGame = false;

//Preload Bitmaps
var queue;
var manifest = [
         { id: "Background", src: "assets/background0.jpg" },
         { id: "Logo", src: "assets/logo.png" },
         { id: "Snow", src: "assets/background1.png" },
         { id: "Swamp", src: "assets/background2.png" },
         { id: "Desert", src: "assets/background3.png" },
         { id: "theme", src: "sounds/theme.mp3" },
];
createjs.Sound.addEventListener("fileload", handleFileLoad);
createjs.Sound.alternateExtensions = ["mp3"];
createjs.Sound.registerSounds(
    [{id: "theme", src: "theme.mp3" },
     {id: "shot", src: "shot.wav" },
     {id: "jump", src: "jump.wav" },
     {id: "fall", src: "fall.wav" }]
    ,"sounds/"
);

function handleFileLoad(event) {
    // A sound has been preloaded. This will fire TWICE
    console.log("Preloaded:", event.id, event.src);
}

function Init(){
    //Load canvas and create stage
	canvas = document.getElementById('canvas');
    stage = new createjs.Stage(canvas);

    //Preload then call StartMenu
    queue = new createjs.LoadQueue(false);
    queue.addEventListener("complete", StartMenu);
    queue.loadManifest(manifest);

}
//
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//
//Load Start Menu
function StartMenu() {
    LoadBackdrop("assets/background0.jpg");

	//Title text
    var imgL = new Image();
    imgL.src = "assets/logo.png";

    //Transform image
    title = new createjs.Bitmap(imgL);
    title.y = 25; title.x = canvas.width / 2; title.regX = 931 / 2;

    //Button text
    var sText = new createjs.Text("Start Game", "40px Arial", "#1b1b1b");
    sText.y = 675; sText.x = canvas.width/2; sText.textAlign = "center";

    //Stock Text
    var stockText = new createjs.Text(necWins + " Wins", "25px Arial", "#FFF");
    stockText.y = 520; stockText.x = canvas.width / 2; stockText.textAlign = "center";

    //Player Text
    var compText = new createjs.Text("Player vs Player", "25px Arial", "#FFF");
    compText.y = 580; compText.x = canvas.width / 2; compText.textAlign = "center";

    //Option Arrows
    var arrowR = new createjs.Graphics().beginFill("white").drawPolyStar(730, 535, 18, 3, 2, 0);
    var arrowL = new createjs.Graphics().beginFill("white").drawPolyStar(730, 535, 18, 3, 2, 180);
    var stockArrowR = new createjs.Shape(arrowR);
    var stockArrowL = new createjs.Shape(arrowL); stockArrowL.x -= 270;
    var pvpcArrowR = new createjs.Shape(arrowR); pvpcArrowR.y += 60;
    var pvpcArrowL = new createjs.Shape(arrowL); pvpcArrowL.x -= 270; pvpcArrowL.y += 60;

    var s = "s";
    stockArrowR.addEventListener("mouseover", function () { stockArrowR.alpha *= .5; stage.update(); });
    stockArrowR.addEventListener("mouseout", function () { stockArrowR.alpha *= 2; stage.update(); });
    stockArrowR.addEventListener("click", function (event) {
        if (necWins == 6) {
            necWins = necWins;
        } else {
            necWins++;
            s = "s";
        }
        stage.removeChild(stockText);
        stockText = new createjs.Text(necWins + " Win" + s, "25px Arial", "#FFF");
        stockText.y = 520; stockText.x = canvas.width / 2; stockText.textAlign = "center";
        stage.addChild(stockText);
        maxWins = necWins;
        stage.update();
    });

    stockArrowL.addEventListener("mouseover", function () { stockArrowL.alpha *= .5; stage.update(); });
    stockArrowL.addEventListener("mouseout", function () { stockArrowL.alpha *= 2; stage.update(); });
    stockArrowL.addEventListener("click", function (event) {
        if (necWins == 1) {
            necWins = necWins;
        } else if(necWins == 2) {
            necWins--;
            s = "";
        } else {
            necWins--;
        }
        stage.removeChild(stockText);
        stockText = new createjs.Text(necWins + " Win" + s, "25px Arial", "#FFF");
        stockText.y = 520; stockText.x = canvas.width / 2; stockText.textAlign = "center";
        stage.addChild(stockText);
        maxWins = necWins;
        stage.update();
    });

    pvpcArrowL.addEventListener("mouseover", function () { pvpcArrowL.alpha *= .5; stage.update(); });
    pvpcArrowL.addEventListener("mouseout", function () { pvpcArrowL.alpha *= 2; stage.update(); });
    pvpcArrowL.addEventListener("click", function (event) {
        stage.removeChild(compText);
        compText = new createjs.Text("Player vs Player", "25px Arial", "#FFF");
        aiGame = false;
        compText.y = 580; compText.x = canvas.width / 2; compText.textAlign = "center";
        stage.addChild(compText);
        stage.update();
    });

    pvpcArrowR.addEventListener("mouseover", function () { pvpcArrowR.alpha *= .5; stage.update(); });
    pvpcArrowR.addEventListener("mouseout", function () { pvpcArrowR.alpha *= 2; stage.update(); });
    pvpcArrowR.addEventListener("click", function (event) {
        stage.removeChild(compText);
        compText = new createjs.Text("Player vs AI", "25px Arial", "#FFF");
        compText.y = 580; compText.x = canvas.width / 2; compText.textAlign = "center";
        aiGame = true;
        stage.addChild(compText);
        stage.update();
    });

    //Button graphic
    var graphics = new createjs.Graphics().beginFill("white").drawRoundRect((canvas.width/2)-150, 650, 300, 100, 15, 15, 15, 15);

    //Button shape
    var square = new createjs.Shape(graphics);

    //Map Borders
    var gBack = new createjs.Graphics().beginFill("white").drawRoundRect((canvas.width / 2) - 142, 248, 275, 200, 15, 15, 15, 15);
    var mBack1 = new createjs.Shape(gBack);
    var mBack2 = new createjs.Shape(gBack);
    mBack2.x += 335;
    var mBack3 = new createjs.Shape(gBack);
    mBack3.x -= 335;

    //Select Map Events
    mBack1.addEventListener("mouseover", function () { mBack1.alpha *= .5; stage.update(); });
    mBack1.addEventListener("mouseout", function () { mBack1.alpha *= 2; stage.update(); });
    mBack1.addEventListener("click", function (event) {
        selectedM1 = true;
        selectedM2 = false;
        selectedM3 = false;
        stage.removeChild(textM1, textM2, textM3);
        textM1 = new createjs.Text("Small", "25px Arial", "#FFF");
        textM1.y = 460; textM1.x = 260; textM1.textAlign = "center";
        textM2 = new createjs.Text("[ Medium ]", "25px Arial", "#FFF");
        textM2.y = 460; textM2.x = 600; textM2.textAlign = "center";
        textM3 = new createjs.Text("Large", "25px Arial", "#FFF");
        textM3.y = 460; textM3.x = 930; textM3.textAlign = "center";
        stage.addChild(textM1, textM2, textM3);
        stage.update();
    });

    mBack2.addEventListener("mouseover", function () { mBack2.alpha *= .5; stage.update(); });
    mBack2.addEventListener("mouseout", function () { mBack2.alpha *= 2; stage.update(); });
    mBack2.addEventListener("click", function (event) {
        selectedM3 = true;
        selectedM2 = false;
        selectedM1 = false;
        stage.removeChild(textM1, textM2, textM3);
        textM1 = new createjs.Text("Small", "25px Arial", "#FFF");
        textM1.y = 460; textM1.x = 260; textM1.textAlign = "center";
        textM2 = new createjs.Text("Medium", "25px Arial", "#FFF");
        textM2.y = 460; textM2.x = 600; textM2.textAlign = "center";
        textM3 = new createjs.Text("[ Large ]", "25px Arial", "#FFF");
        textM3.y = 460; textM3.x = 930; textM3.textAlign = "center";
        stage.addChild(textM1, textM2, textM3);
        stage.update();
    });

    mBack3.addEventListener("mouseover", function () { mBack3.alpha *= .5; stage.update(); });
    mBack3.addEventListener("mouseout", function () { mBack3.alpha *= 2; stage.update(); });
    mBack3.addEventListener("click", function (event) {
        selectedM2 = true;
        selectedM3 = false;
        selectedM1 = false;
        stage.removeChild(textM1, textM2, textM3);
        textM1 = new createjs.Text("[ Small ]", "25px Arial", "#FFF");
        textM1.y = 460; textM1.x = 260; textM1.textAlign = "center";
        textM2 = new createjs.Text("Medium", "25px Arial", "#FFF");
        textM2.y = 460; textM2.x = 600; textM2.textAlign = "center";
        textM3 = new createjs.Text("Large", "25px Arial", "#FFF");
        textM3.y = 460; textM3.x = 930; textM3.textAlign = "center";
        stage.addChild(textM1, textM2, textM3);
        stage.update();
    });



    //Enagle mouse overs
    stage.enableMouseOver(20);

    //Roll on to 'Start Game' of button
    square.addEventListener("mouseover", function() { square.alpha *= .5; stage.update(); });

    //Roll out 'Start Game' of button
    square.addEventListener("mouseout", function () { square.alpha *= 2; stage.update(); });

    //Button navigation
    square.addEventListener("click", function (event) { stage.removeChild(square, sText, title, mBack1, mBack2, mBack3, stockText, compText); StartGame(); });

    //Add title and button
    stage.addChild(square, sText, title, mBack1, mBack2, mBack3, stockText, compText, stockArrowR, stockArrowL, pvpcArrowL, pvpcArrowR);
    MapSelect();
    stage.update();
}
//
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//
//Start Game function
function StartGame(){
    //Enable Keyboard Input
    window.onkeydown = MovePlayer;
    window.onkeyup = StopPlayer;

    PlayTheme();
    
    //Load backdrop
    stage.removeChild(backdrop);
    //Swamp
    if (selectedM1){
        canvas.width -= 200;
        canvas.height -= 200;
        LoadBackdrop("assets/background2.png", -2, 0, 1.2, 1.2);

        GeneratePlatforms(numPlats2);
    }
    //Snow
    else if(selectedM2){
        canvas.width -= 400;
        canvas.height -= 400;
        LoadBackdrop("assets/background1.png", -2, 0, 1.2, 1.2);

        GeneratePlatforms(numPlats1);
    }
    //Desert
    else if(selectedM3){
        LoadBackdrop("assets/background3.png", -2, 0, 1.2, 1.2);

        GeneratePlatforms(numPlats3);
    }
    else{
        LoadBackdrop("assets/background3.png", -2, 0, 1.2, 1.2);

        GeneratePlatforms(numPlats3);
    }

    //Add Player 1
    BuildPlayer1();

    //Add Player 2
    if (!aiGame) {
        BuildPlayer2();
    }
    //Add AI Player
    if (aiGame) {
        BuildPlayerAI();
    }
    gameManager();

    //Start Ticker
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", function(e){
        UpdateP1();
        RenderP1();
        IsKilledP1();

        if (!aiGame) {
            UpdateP2();
            RenderP2();
            IsKilledP2();
        }

        if (aiGame) {
            UpdateAI();
            RenderAI();
            IsKilledAI();
            ChanceToChange();
        }
        
        BulletHit();

        stage.update();
    });
}

function PlayTheme() {
    var instance = createjs.Sound.play("theme");
	instance.volume = .1;
}
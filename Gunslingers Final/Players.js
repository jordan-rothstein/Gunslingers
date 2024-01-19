function ShootSound() {
    var instance = createjs.Sound.play("shot");
	instance.volume = .1;
}
function JumpSound() {
    var instance = createjs.Sound.play("jump");
	instance.volume = .1;
}

function DieSound() {
    var instance = createjs.Sound.play("fall");
	instance.volume = .1;
}

//
//PLAYER 1
var player1;
var onGroundP1 = false;
var doubleJumpP1 = false;
var h1P1, h2P1, h3P1;
var hpP1 = 3;
var player1IsDead = false;
var p1Bullets = [];
var cb1;
//Input 1
const A_KEY = 65;
const D_KEY = 68;
const W_KEY = 87;
const SPACEBAR = 81;
var aKeyDown, dKeyDown, wKeyDown, spaceKeyDown= false;

//Build Player 1
function BuildPlayer1(){
    //Load Player 1 spritesheet data
    cb1 = new createjs.SpriteSheet(data1);

    //Create Player 1 Sprite
    player1 = new createjs.Sprite(cb1);

    //Transform Player 1
    player1.regX = 15; player1.regY = 19;
    player1.x = platForms[1].x + platForms[1].width/2; player1.y = platForms[1].y-100;

    //Add Player 1 velocity(gravity)
    player1.velocity = {x:0,y:5};

    //Player 1 Hearts
    var img = new Image();
    img.src = "assets/sprite_Heart0.png";

    //Heart1
    h1P1 = new createjs.Bitmap(img);
    //Heart1
    h2P1 = new createjs.Bitmap(img);
    //Heart1
    h3P1 = new createjs.Bitmap(img);

    stage.addChild(h1P1, h2P1, h3P1);

    stage.addChild(player1);
}
//Player 1 Functions
//Player 1 Jump
function JumpPlayer1(){
    if ( onGroundP1 ) {
        player1.velocity.y = -17;
        onGroundP1 = false;
        doubleJumpP1 = true;
    } else if ( doubleJumpP1 ) {
        player1.velocity.y = -17;
        doubleJumpP1 = false;
    }
    JumpSound();
}
//Player 1 Shoot Bullet
function ShootBulletP1() {
    var img = new Image();
    img.src = "assets/bulletPic.png";
    var bulletp1 = new createjs.Bitmap(img);
    bulletp1.scaleX = 2; bulletp1.scaleY = 2;
    if (!player1IsDead) {
        if (player1.scaleX != -1) {
            bulletp1.x = player1.x + 15; bulletp1.y = player1.y + 1;
            createjs.Tween.get(bulletp1).to({ x: player1.x + 1200 }, 1200).call(ShootSound());
        }
        else {
            bulletp1.x = player1.x - 15; bulletp1.y = player1.y + 1;
            createjs.Tween.get(bulletp1).to({ x: player1.x - 1200 }, 1200).call(ShootSound());
        }
        stage.addChild(bulletp1);
        p1Bullets.push(bulletp1);
    }
}
//Update Player 1 Movement
function UpdateP1(){
    //Left & Right
    var nextX1 = player1.x;
    if(aKeyDown){
        nextX1 = player1.x - 5;
        if(nextX1<0){
            nextX1 = canvas.width;
        }
    }
    else if(dKeyDown){
        nextX1 = player1.x + 5;
        if(nextX1 > canvas.width){
            nextX1 = 0;
        }
    }
    player1.nextX1 = nextX1;

    //Player 1 Velocity Check
    if(player1.velocity.y < 15)
        player1.velocity.y +=1;
    player1.y += player1.velocity.y;

    //Player 1 Out of Bounds
    if (player1.y > canvas.height + 200) {
        if (hpP1 <= 1) {
            hpP1--;
            player1.y = -2000;
        }
        else {
            hpP1--;
            player1.x = platForms[1].x + platForms[1].width / 2;
            player1.y = -50;
        }
    }

    //Player 1 Decrease Hearts if respawn
    if(hpP1 == 2){
        h3P1.visible = false;
    } else if(hpP1 == 1){
        h2P1.visible = false;
    } else if (hpP1 == 0){
        h1P1.visible = false;
    }

    //Player 1 Platform Collisions
    for(var i = 0; i < numPlats; i++){
        if(CheckCollision(player1, platForms[i])){
            onGroundP1 = true;
            player1.y = (platForms[i].y - platForms[i].height)
        }
    }
}
//Draw Player 1 Movement
function RenderP1(){
    player1.x = player1.nextX1;

    //Animate Player 1 Movement
    if(dKeyDown){
        player1.advance();
    }else if(aKeyDown){
        player1.advance();
    }else{
        player1.stand;
    }

    //Animate Player 1 Hearts
    if( player1.scaleX != -1){
		createjs.Tween.get(h1P1).to({x: player1.x -30,y:player1.y - 60}, 150);
		createjs.Tween.get(h2P1).to({x: player1.x -15,y:player1.y - 60}, 100);
		createjs.Tween.get(h3P1).to({x: player1.x,y:player1.y - 60}, 50);
	}
	else{
		createjs.Tween.get(h1P1).to({x: player1.x -30,y:player1.y - 60}, 50);
		createjs.Tween.get(h2P1).to({x: player1.x -15,y:player1.y - 60}, 100);
		createjs.Tween.get(h3P1).to({x: player1.x,y:player1.y - 60}, 150);
	}
}
//Checks if Player 1 is Killed
function IsKilledP1()
{
    if(hpP1 == 0)
    {
        player1IsDead = true;
        createjs.Tween.get(player1).to({ rotation: 1080 }, 1000).call(IsDeadP1);
        hpP1 = 3;
    }
}
//Removes Player 1 if he's Dead
function IsDeadP1() {
    if(p2Wins != maxWins - 1){
        player1IsDead = false;
        if (!aiGame) {
            stage.removeChild(player1, h1P1, h2P1, h3P1, player2, h1P2, h2P2, h3P2, p2WText);
        }
        else {
            stage.removeChild(player1, h1P1, h2P1, h3P1, playerAI, h1AI, h2AI, h3AI, p2WText);
        }

        hpP1 = 3;

        ++p2Wins;

        p2WText = new createjs.Text("P2: Wins = " + p2Wins, "40px Arial", "#FFF");
        p2WText.y = canvas.height-45; p2WText.x = canvas.width-5; p2WText.textAlign = "right";

        BuildPlayer1();
        if (!aiGame) {
            BuildPlayer2();
        }
        else {
            BuildPlayerAI();
        }
        stage.addChild(p2WText);
    } else {
        stage.removeChild(player1, h1P1, h2P1, h3P1, player2, h1P2, h2P2, h3P2, p2WText);
        LoadBackdrop("assets/background0.jpg");
        var t = new createjs.Text("P2 is Victorious", "100px Arial", "#FFF");
        t.x = canvas.width / 2; t.y = (canvas.height / 2)-100; t.textAlign = "center";
        stage.addChild(t);
        stage.update();

        //Button graphic
        var graphics = new createjs.Graphics().beginFill("white").drawRoundRect((canvas.width/2)-150, (t.y) + 150, 300, 100, 15, 15, 15, 15);

        //Button shape
        var square = new createjs.Shape(graphics);

        var bt = new createjs.Text("Play Again", "40px Arial", "#1b1b1b");
        bt.x = canvas.width / 2; bt.y = (t.y) + 175; bt.textAlign = "center";

        square.addEventListener("mouseover", function() { square.alpha *= .5; stage.update(); });

        //Roll out 'Start Game' of button
        square.addEventListener("mouseout", function () { square.alpha *= 2; stage.update(); });

        //Button navigation
        square.addEventListener("click", function (event) { location.reload(); });

        stage.addChild(square, bt);
    }

}
//Player 1 Sprite Data
data1 = {
images:["assets/smallcowboy.png"],
frames:[
  [9, 16, 27, 34], [64, 15, 27, 35], [119, 16, 27, 34], [174, 15, 27, 35]
],
animations:{
  stand: 0,
  walkF: [0,3,"walkF", 200],
}
};
//
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//
//PLAYER 2
var player2;
var onGroundP2 = false;
var doubleJumpP2 = false;
var h1P2, h2P2, h3P2;
var hpP2 = 3;
var player2IsDead = false;
var p2Bullets = [];
var cb2;
//Input 2
const ARROW_KEY_LEFT = 37;
const ARROW_KEY_RIGHT = 39;
const ARROW_KEY_UP = 38;
const INS_KEY = 96; //96
var leftKeyDown, rightKeyDown, upKeyDown, insKeyDown= false;

//Build Player 2
function BuildPlayer2(){
    //Load Player 2 spritesheet data
    cb2 = new createjs.SpriteSheet(data2);

    //Create Player 2 Sprite
    player2 = new createjs.Sprite(cb2);

    //Transform Player 2
    player2.regX = 15; player2.regY = 19;
    player2.x = platForms[3].x + platForms[3].width/2; player2.y = platForms[3].y-100;

    //Add Player 2 velocity(gravity)
    player2.velocity = {x:0,y:5};

    //Player 2 Hears
    var img = new Image();
    img.src = "assets/sprite_Heart1.png";

    //Heart1
    h1P2 = new createjs.Bitmap(img);
    //Heart1
    h2P2 = new createjs.Bitmap(img);
    //Heart1
    h3P2 = new createjs.Bitmap(img);

    stage.addChild(h1P2, h2P2, h3P2);

    stage.addChild(player2);
}
//Player 2 Functions
//Player 2 Jump
function JumpPlayer2(){
    if ( onGroundP2 ) {
        player2.velocity.y = -17;
        onGroundP2 = false;
        doubleJumpP2 = true;
    } else if ( doubleJumpP2 ) {
        player2.velocity.y = -17;
        doubleJumpP2 = false;
    }
    JumpSound();
}

//Player 2 Shoot Bullet
function ShootBulletP2() {
    var img = new Image();
    img.src = "assets/bulletPic.png";
    var bulletp2 = new createjs.Bitmap(img);
    bulletp2.scaleX = 2; bulletp2.scaleY = 2;
    if (!player2IsDead) {
        if (player2.scaleX != -1) {
            bulletp2.x = player2.x + 15; bulletp2.y = player2.y + 1;
            createjs.Tween.get(bulletp2).to({ x: player2.x + 1200 }, 1200).call(ShootSound());
        }
        else {
            bulletp2.x = player2.x - 15; bulletp2.y = player2.y + 1;
            createjs.Tween.get(bulletp2).to({ x: player2.x - 1200 }, 1200).call(ShootSound());
        }
        stage.addChild(bulletp2);
        p2Bullets.push(bulletp2);
    }
}
//Update Player 2 Movement
function UpdateP2(){
    //Left & Right
    var nextX2 = player2.x;
    if(leftKeyDown){
        nextX2 = player2.x - 5;
        if(nextX2<0){
            nextX2 = canvas.width;
        }
    }
    else if(rightKeyDown){
        nextX2 = player2.x + 5;
        if(nextX2 > canvas.width){
            nextX2 = 0;
        }
    }
    player2.nextX2 = nextX2;

    //Player 2 Velocity Check
    if(player2.velocity.y < 15)
        player2.velocity.y +=1;
    player2.y += player2.velocity.y;

    //Player 2 Out of Bounds
    if (player2.y > canvas.height + 200) {
        if (hpP2 <= 1) {
            hpP2--;
            player2.y = -2000;
        }
        else {
            hpP2--;
            player2.x = platForms[3].x + platForms[3].width / 2;
            player2.y = -50;
        }
    }

    //Player 2 Decrease Hearts if respawn
    if(hpP2 == 2){
        h3P2.visible = false;
    } else if(hpP2 == 1){
        h2P2.visible = false;
    } else if (hpP2 == 0){
        h1P2.visible = false;
    }

    //Player 2 Platform Collisions
    for(var i = 0; i < numPlats; i++){
        if(CheckCollision(player2, platForms[i])){
            onGroundP2 = true;
            player2.y = (platForms[i].y - platForms[i].height)
        }
    }
}
//Draw Player 2 Movement
function RenderP2(){
    player2.x = player2.nextX2;

    //Animate Player 2 Movement
    if(rightKeyDown){
        player2.advance();
    }else if(leftKeyDown){
        player2.advance();
    }else{
        player2.stand;
    }

    //Animate Player 2 Hearts
    if( player2.scaleX != -1){
		createjs.Tween.get(h1P2).to({x: player2.x -30,y:player2.y - 60}, 150);
		createjs.Tween.get(h2P2).to({x: player2.x -15,y:player2.y - 60}, 100);
		createjs.Tween.get(h3P2).to({x: player2.x,y:player2.y - 60}, 50);
	}
	else{
		createjs.Tween.get(h1P2).to({x: player2.x -30,y:player2.y - 60}, 50);
		createjs.Tween.get(h2P2).to({x: player2.x -15,y:player2.y - 60}, 100);
		createjs.Tween.get(h3P2).to({x: player2.x,y:player2.y - 60}, 150);
	}
}
//Checks if Player 2 is Killed
function IsKilledP2()
{
    if(hpP2 == 0)
    {
        player2IsDead = true;
        createjs.Tween.get(player2).to({ rotation: 1080 }, 1000).call(IsDeadP2);
        hpP2 = 3;
    }
}
//Removes Player 2 if he's Dead
function IsDeadP2() {
    if(p1Wins != maxWins - 1){
        player2IsDead = false;
        stage.removeChild(player1, h1P1, h2P1, h3P1, player2, h1P2, h2P2, h3P2, p1WText);

        hpP2 = 3;

        ++p1Wins;

        p1WText = new createjs.Text("P1: Wins = " + p1Wins, "40px Arial", "#FFF");
        p1WText.y = canvas.height-45; p1WText.x = 5; p1WText.textAlign = "left";

        BuildPlayer1();
        BuildPlayer2();

        stage.addChild(p1WText);
    } else {
        stage.removeChild(player1, h1P1, h2P1, h3P1, player2, h1P2, h2P2, h3P2, p1WText);
        LoadBackdrop("assets/background0.jpg");
        var t = new createjs.Text("P1 is Victorious", "100px Arial", "#FFF");
        t.x = canvas.width / 2; t.y = (canvas.height / 2)-100; t.textAlign = "center";
        stage.addChild(t);
        stage.update();

        //Button graphic
        var graphics = new createjs.Graphics().beginFill("white").drawRoundRect((canvas.width/2)-150, (t.y) + 150, 300, 100, 15, 15, 15, 15);

        //Button shape
        var square = new createjs.Shape(graphics);

        var bt = new createjs.Text("Play Again", "40px Arial", "#1b1b1b");
        bt.x = canvas.width / 2; bt.y = (t.y) + 175; bt.textAlign = "center";

        square.addEventListener("mouseover", function() { square.alpha *= .5; stage.update(); });

        //Roll out 'Start Game' of button
        square.addEventListener("mouseout", function () { square.alpha *= 2; stage.update(); });

        //Button navigation
        square.addEventListener("click", function (event) { location.reload(); });

        stage.addChild(square, bt);
    }

}
//Player 2 Sprite Data
data2 = {
images:["assets/smallcowboy2.png"],
frames: [
    [9, 16, 27, 34], [64, 15, 27, 35], [119, 16, 27, 34], [174, 15, 27, 35]
   ],
animations:{
  stand:0,
  walkF:[0,3,"walkF", 200],   // start,end,next*,speed*
}
};
//
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//
//COMPUTER
//Build Player AI

function OnPlat(platform, player) {
    if (CheckCollision(player, platform)) {
       // if ((player.y + player.height <= platform.y + 2) && (player.y + player.height >= playform.y - 2)) {
          //  if (player.x >= platform.x && player.x <= platform.x + platform.width) {
                return true;
          //  }
       // }
    }
    else return false;
}

function Nearest(player) {
    availablePlats = [];
    for (var i = 0; i < platForms.length; i++) {
        if(platForms[i].x < player.x)
        {
            if (platForms[i].y < player.y && player.y - platForms[i].y < 250 && player.x - platForms[i].x <= 300) {
                availablePlats.push(platForms[i]);
            }
            else if (platForms[i].y > player.y && player.x - platForms[i].x <= 300) {
                availablePlats.push(platForms[i]);
            }
        }
        else if(platForms[i].x > player.x)
        {
            if (platForms[i].y < player.y && player.y - platForms[i].y < 250 && platForms[i].x - player.x <= 300) {
                availablePlats.push(platForms[i]);
            }
            else if (platForms[i].y > player.y && platForms[i].x - player.x <= 300) {
                availablePlats.push(platForms[i]);
            }
        }
    }
}

function CurrentPlat(player) {
    for (var i = 0; i < platForms.length; i++) {
        if(OnPlat(platForms[i], player)){
            currentPlatform = platForms[i];
            break;
        }
    }
}

//COMPUTER
//Build Player AI
var playerAI;
var onGroundAI = false;
var doubleJumpAI = false;
var h1AI, h2AI, h3AI;
var hpAI = 3;
var playerAIIsDead = false;
var aiBullets = [];
var cbAI;
var nextXAI;
var movingLeft = false;
var movingRight = false;
var changingPlats = false;
var stopped = false;
var currentPlatform;

//Input 2


function BuildPlayerAI(){
    cbAI = new createjs.SpriteSheet(data2);



    playerAI = new createjs.Sprite(cbAI);


    playerAI.regX = 15; playerAI.regY = 19;
   
    playerAI.x = platForms[3].x + platForms[3].width / 2; playerAI.y = platForms[3].y - 100;


    playerAI.velocity = {x:0,y:5};

    nextXAI = playerAI.x;

    var img = new Image();
    img.src = "assets/sprite_Heart1.png";

    setInterval(ChanceShoot, 250);
    setInterval(WanderAI, 750);
    //Heart1
    h1AI = new createjs.Bitmap(img);
    //Heart1
    h2AI = new createjs.Bitmap(img);
    //Heart1
    h3AI = new createjs.Bitmap(img);

    stage.addChild(h1AI, h2AI, h3AI);

    stage.addChild(playerAI);
}

function JumpPlayerAI(){
    if ( onGroundAI ) {
        playerAI.velocity.y = -17;
        onGroundAI = false;
        doubleJumpAI = true;
    } else if ( doubleJumpAI ) {
        playerAI.velocity.y = -17;
        doubleJumpAI = false;
    }
}

function ChanceShoot() {
    var randNum = Math.floor((Math.random() * 5) + 1);
    if (randNum == 3) {
        FacePlayer();
        ShootBulletAI();
    }
}

function MoveLeft() {
    if (!changingPlats && onGroundAI) {
        movingRight = false;
        movingLeft = true;
        stopped = false;
        playerAI.scaleX = -1;

        var myVar = setInterval(function () {
            nextXAI = playerAI.x - 3;
            if (!movingRight && !stopped) {
                if (nextXAI <= 0) {
                    nextXAI = 0;
                    movingLeft = false;
                    clearInterval(myVar);
                }
                else if ((nextXAI <= currentPlatform.x)) {
                    movingLeft = false;
                    nextXAI = currentPlatform.x - 3;
                    playerAI.x = nextXAI;
                    playerAI.advance();
                    clearInterval(myVar);
                }
                else {
                    playerAI.x = nextXAI;
                    playerAI.advance();
                }
            }
        }, 25);
    }


    /*while (movingLeft) {

        nextXAI = playerAI.x - 5;
        if (nextXAI <= 0) {
            nextXAI = 0;
            movingLeft = false;
            break;
        }
        else if ((nextXAI <= currentPlatform.x + 3)) {
            movingLeft = false;
            nextXAI = playerAI.x;
        }
        else {
            playerAI.x = nextXAI;
            playerAI.advance();
        }
    }*/

}

function MoveRight() {
    if (!changingPlats) {
        movingLeft = false;
        movingRight = true;
        stopped = false;
        playerAI.scaleX = 1;
        var myVar2 = setInterval(function () {
            if (!movingLeft && !stopped) {
                nextXAI = playerAI.x + 3;
                if (nextXAI > 1200) {
                    nextXAI = 1200;
                    movingRight = false;
                    clearInterval(myVar2);
                }
                else if ((nextXAI >= currentPlatform.x + currentPlatform.width - 3)) {
                    movingRight = false;
                    nextXAI = playerAI.x;
                    clearInterval(myVar2);
                }
                else {
                    playerAI.x = nextXAI;
                    playerAI.advance();
                }
            }
        }, 25);
    }

    /*while (movingRight) {
        nextXAI = playerAI.x + 5;
        if (nextXAI > 1200) {
            nextXAI = 1200;
        }
        if (onGroundAI && (nextXAI >= currentPlatform.x + currentPlatform.width)) {
            movingRight = false;
            nextXAI = playerAI.x;
        }
        playerAI.nextXAI = nextXAI;
        //playerAI.advance();
    }*/
}

function StopMoving() {
    movingLeft = false;
    movingRight = false;
    stopped = true;
    nextXAI = playerAI.x;
}

function WanderAI() {
    var randNum = Math.floor((Math.random() * 3) + 1)
    if (!changingPlats) {
        if (randNum == 1 && !changingPlats && onGroundAI) {
            MoveLeft();
        }
        else if (randNum == 2 && !changingPlats && onGroundAI) {
            MoveRight();
        }
        else if (randNum == 3 && !changingPlats && onGroundAI) {
            StopMoving();
        }
    }
}

function ChanceToChange() {
    var randNum = Math.floor((Math.random() * 200) + 1)
    if (randNum == 200)
        ChangePlatforms();
}
var platToGoTo;
function ChangePlatforms() {
    if (onGroundAI) {
        StopMoving();
        var above = false;
        var left = true;
        var right = false;
        CurrentPlat(playerAI);
        if (!changingPlats) {
            changingPlats = true;
            Nearest(playerAI);
            var randNum = Math.floor((Math.random() * availablePlats.length));
            platToGoTo = availablePlats[randNum];
            CurrentPlat(playerAI);
            while (platToGoTo == currentPlatform) {
                CurrentPlat(playerAI);
                randNum = Math.floor((Math.random() * availablePlats.length));
                platToGoTo = availablePlats[randNum];
            }
            if (platToGoTo.y < currentPlatform.y)
                above = true;
            else above = false;

            /*
            if (platToGoTo.x + platToGoTo.width < currentPlatform.x) {
                left = true;
                right = false;
            }

            if (platToGoTo.x > currentPlatform.x + currentPlatform.width) {
                left = false;
                right = true;
            }
            */
            if (above) {
                if (left) {
                    if (playerAI.x > currentPlatform.x + 5) {
                        var myVar = setInterval(function () {
                            if (playerAI.x > currentPlatform.x + 3) {
                                nextXAI = playerAI.x - 5;
                                playerAI.x = nextXAI;
                                playerAI.advance();
                            }
                            else clearInterval(myVar);
                        }, 23);
                    }

                    var jump = false;
                    JumpPlayerAI();
                    var movingTowardsPlat = setInterval(function () {
                        if (playerAI.x > platToGoTo.x + platToGoTo.width/2) {
                            nextXAI = playerAI.x - 5;
                            playerAI.x = nextXAI;
                            playerAI.advance;
                            CurrentPlat(playerAI);
                        }
                        else clearInterval(movingTowardsPlat);
                        if (!jump || onGroundAI) {
                            setTimeout(JumpPlayerAI, 300);
                            jump = true;
                        }
                    }, 23);
                    StopMoving();
                    changingPlats = false;
                    return;
                }
                else if (right) {
                    if (playerAI.x < currentPlatform.x + currentPlatform.width - 3) {
                        var myVar = setInterval(function () {
                            if (playerAI.x < currentPlatform.x + currentPlatform.width - 3) {
                                nextXAI = playerAI.x + 5;
                                playerAI.x = nextXAI;
                                playerAI.advance();
                                CurrentPlat(playerAI);
                            }
                            else clearInterval(myVar);
                        }, 23);
                    }

                    var jump = false;
                    JumpPlayerAI();
                    var movingTowardsPlat = setInterval(function () {
                        if (playerAI.x < platToGoTo.x + platToGoTo.width / 2) {
                            nextXAI = playerAI.x + 5;
                            playerAI.x = nextXAI;
                            playerAI.advance;
                            CurrentPlat(playerAI);
                        }
                        else clearInterval(movingTowardsPlat);
                        if (!jump || onGroundAI) {
                            setTimeout(JumpPlayerAI, 300);
                            jump = true;
                        }
                    }, 23);
                    StopMoving();
                    changingPlats = false;
                    return;
                }
                else {
                    if (platToGoTo.x + 20 < currentPlat.x) {
                        if (playerAI.x > currentPlatform.x + 5) {
                            var myVar = setInterval(function () {
                                if (playerAI.x > currentPlatform.x + 3) {
                                    nextXAI = playerAI.x - 5;
                                    playerAI.x = nextXAI;
                                    playerAI.advance();
                                }
                                else clearInterval(myVar);
                            }, 23);
                        }

                        var jump = false;
                        JumpPlayerAI();
                        var movingTowardsPlat = setInterval(function () {
                            if (playerAI.x > platToGoTo.x + platToGoTo.width / 2) {
                                nextXAI = playerAI.x - 5;
                                playerAI.x = nextXAI;
                                playerAI.advance;
                                CurrentPlat(playerAI);
                            }
                            else clearInterval(movingTowardsPlat);
                            if (!jump || onGroundAI) {
                                setTimeout(JumpPlayerAI, 300);
                                jump = true;
                            }
                        }, 23);
                        StopMoving();
                        changingPlats = false;
                        return;
                    }
                    else if (platToGoTo.x + platToGoTo.width - 20 > currentPlatform.x + currentPlatform.width) {
                        if (playerAI.x < currentPlatform.x + currentPlatform.width - 3) {
                            var myVar = setInterval(function () {
                                if (playerAI.x < currentPlatform.x + currentPlatform.width - 3) {
                                    nextXAI = playerAI.x + 5;
                                    playerAI.x = nextXAI;
                                    playerAI.advance();
                                    CurrentPlat(playerAI);
                                }
                                else clearInterval(myVar);
                            }, 23);
                        }

                        var jump = false;
                        JumpPlayerAI();
                        var movingTowardsPlat = setInterval(function () {
                            if (playerAI.x < platToGoTo.x + platToGoTo.width / 2) {
                                nextXAI = playerAI.x + 5;
                                playerAI.x = nextXAI;
                                playerAI.advance;
                                CurrentPlat(playerAI);
                            }
                            else clearInterval(movingTowardsPlat);
                            if (!jump || onGroundAI) {
                                setTimeout(JumpPlayerAI, 300);
                                jump = true;
                            }
                        }, 23);
                        StopMoving();
                        changingPlats = false;
                        return;
                    }
                    else StopMoving(); return;
                }
            }
            else {
                if (left) {
                    if (playerAI.x > currentPlatform.x + 3) {
                        var myVar = setInterval(function () {
                            CurrentPlat(playerAI);
                            if (playerAI.x > currentPlatform.x + 3) {
                                nextXAI = playerAI.x - 5;
                                playerAI.x = nextXAI;
                                playerAI.advance();

                            }
                            else clearInterval(myVar);
                        }, 23);
                    }

                    var jump = false;
                    JumpPlayerAI();
                    var movingTowardsPlat = setInterval(function () {
                        if (playerAI.x > platToGoTo.x) {
                            nextXAI = playerAI.x - 5;
                            playerAI.x = nextXAI;
                            playerAI.advance;

                        }
                        else clearInterval(movingTowardsPlat);

                    }, 23);
                    StopMoving();
                    changingPlats = false;
                    return;
                }
                else if (right) {
                    if (playerAI.x < currentPlatform.x + currentPlatform.width - 3) {
                        var myVar = setInterval(function () {
                            CurrentPlat(playerAI);
                            if (playerAI.x < currentPlatform.x + currentPlatform.width - 3) {
                                nextXAI = playerAI.x + 5;
                                playerAI.x = nextXAI;
                                playerAI.advance();
                            }
                            else clearInterval(myVar);
                        }, 23);
                    }

                    var jump = false;
                    JumpPlayerAI();
                    var movingTowardsPlat = setInterval(function () {
                        if (playerAI.x < platToGoTo.x + platToGoTo.width) {
                            nextXAI = playerAI.x + 5;
                            playerAI.x = nextXAI;
                            playerAI.advance;

                        }
                        else clearInterval(movingTowardsPlat);
                    }, 23);
                    StopMoving();
                    changingPlats = false;
                    return;
                }
                else {
                    if (platToGoTo.x + 20 < currentPlat.x) {
                        if (playerAI.x > currentPlatform.x + 3) {
                            var myVar = setInterval(function () {
                                CurrentPlat(playerAI);
                                if (playerAI.x > currentPlatform.x + 3) {
                                    nextXAI = playerAI.x - 5;
                                    playerAI.x = nextXAI;
                                    playerAI.advance();

                                }
                                else clearInterval(myVar);
                            }, 23);
                        }

                        var jump = false;
                        JumpPlayerAI();
                        var movingTowardsPlat = setInterval(function () {
                            if (playerAI.x > platToGoTo.x) {
                                nextXAI = playerAI.x - 5;
                                playerAI.x = nextXAI;
                                playerAI.advance;

                            }
                            else clearInterval(movingTowardsPlat);

                        }, 23);
                        StopMoving();
                        changingPlats = false;
                        return;
                    }
                    else if (platToGoTo.x + platToGoTo.width - 20 > currentPlatform.x + currentPlatform.width) {
                        if (playerAI.x < currentPlatform.x + currentPlatform.width - 3) {
                            var myVar = setInterval(function () {
                                CurrentPlat(playerAI);
                                if (playerAI.x < currentPlatform.x + currentPlatform.width - 3) {
                                    nextXAI = playerAI.x + 5;
                                    playerAI.x = nextXAI;
                                    playerAI.advance();
                                }
                                else clearInterval(myVar);
                            }, 23);
                        }

                        var jump = false;
                        JumpPlayerAI();
                        var movingTowardsPlat = setInterval(function () {
                            if (playerAI.x < platToGoTo.x + platToGoTo.width) {
                                nextXAI = playerAI.x + 5;
                                playerAI.x = nextXAI;
                                playerAI.advance;

                            }
                            else clearInterval(movingTowardsPlat);
                        }, 23);
                        StopMoving();
                        changingPlats = false;
                        return;
                    }
                    else StopMoving(); return;
                }
            }
        }
    }
}

function ShootBulletAI() {
    var img = new Image();
    FacePlayer();
    img.src = "assets/bulletPic.png";
    var bulletAI = new createjs.Bitmap(img);
    if (!playerAIIsDead) {
        if (playerAI.scaleX != -1) {
            bulletAI.x = playerAI.x + 15; bulletAI.y = playerAI.y + 1;
            createjs.Tween.get(bulletAI).to({ x: playerAI.x + 1200 }, 1200).call(ShootSound());
        }
        else {
            bulletAI.x = playerAI.x - 15; bulletAI.y = playerAI.y + 1;
            createjs.Tween.get(bulletAI).to({ x: playerAI.x - 1200 }, 1200).call(ShootSound());
        }
        stage.addChild(bulletAI);
        aiBullets.push(bulletAI);
    }
}

function UpdateAI(){

    
    if(playerAI.velocity.y < 15)
        playerAI.velocity.y +=1;
    playerAI.y += playerAI.velocity.y;

    CurrentPlat(playerAI);

    if (playerAI.y >= 1000 && hpAI > 1) {
        hpAI--;
        nextXAI = platForms[3].x + platForms[3].width / 2; playerAI.y = platForms[3].y - 100;
    } else if (playerAI.y >= 1000 && hpAI <= 1) {
        hpAI = 0;
        IsDeadAI();
    }

    for (var i = 0; i < platForms.length; i++) {
        if (CheckCollision(playerAI, platForms[i])) {
            onGroundAI = true;
            playerAI.y = platForms[i].y - platForms[i].height;
        }
    }

    /*
        for (var i = 0; i < platForms.length; i++) {
        if (CheckCollision(player2, platForms[i])) {
            onGroundP2 = true;
            player2.y = platForms[i].y - platForms[i].height;
        }
    }
    */

    if(hpAI == 2){
        h3AI.visible = false;
    } else if(hpAI == 1){
        h2AI.visible = false;
    } else if (hpAI == 0){
        h1AI.visible = false;
    }



}
//Draw Player 2 Movement
function RenderAI(){
    //playerAI.x = playerAI.nextXAI;
    if (!movingLeft && !movingRight)
    {
        playerAI.stand;
    }
    //Animate Player 2 Movement


    //Animate Player 2 Hearts
    if( playerAI.scaleX != -1){
        createjs.Tween.get(h1AI).to({x: playerAI.x -30,y:playerAI.y - 60}, 150);
        createjs.Tween.get(h2AI).to({x: playerAI.x -15,y:playerAI.y - 60}, 100);
        createjs.Tween.get(h3AI).to({x: playerAI.x,y:playerAI.y - 60}, 50);
    }
    else{
        createjs.Tween.get(h1AI).to({x: playerAI.x -30,y:playerAI.y - 60}, 50);
        createjs.Tween.get(h2AI).to({x: playerAI.x -15,y:playerAI.y - 60}, 100);
        createjs.Tween.get(h3AI).to({x: playerAI.x,y:playerAI.y - 60}, 150);
    }
}

function IsKilledAI() {
    if (hpAI == 0) {
        playerAIIsDead = true;
        if (playerAIIsDead && !player1IsDead) {
            var p1winText = new createjs.Text("Player 1 Wins!", "35px Arial", "#000");
            p1winText.x = 488; p1winText.y = 75;
            stage.addChild(p1winText);
            stage.update();
        }
        createjs.Tween.get(playerAI).to({ rotation: 1080 }, 1000).wait(200).call(IsDeadP1);

    }
}

function FacePlayer() {
    if (player1.x < playerAI.x)
        playerAI.scaleX = -1;
    else playerAI.scaleX = 1;
}



function IsDeadAI() {
    
    if (p1Wins != maxWins - 1) {
        playerAIIsDead = false;
        stage.removeChild(player1, h1P1, h2P1, h3P1, playerAI, h1AI, h2AI, h3AI, p1WText);

        hpAI = 3;

        ++p1Wins;

        p1WText = new createjs.Text("P1: Wins = " + p1Wins, "40px Arial", "#FFF");
        p1WText.y = canvas.height - 45; p1WText.x = 5; p1WText.textAlign = "left";

        BuildPlayer1();
        BuildPlayerAI();

        stage.addChild(p1WText);
    } else {
        stage.removeChild(player1, h1P1, h2P1, h3P1, playerAI, h1AI, h2AI, h3AI, p1WText);
        LoadBackdrop("assets/background0.jpg");
        var t = new createjs.Text("P1 is Victorious", "100px Arial", "#FFF");
        t.x = canvas.width / 2; t.y = (canvas.height / 2) - 100; t.textAlign = "center";
        stage.addChild(t);
        stage.update();

        //Button graphic
        var graphics = new createjs.Graphics().beginFill("white").drawRoundRect((canvas.width / 2) - 150, (t.y) + 150, 300, 100, 15, 15, 15, 15);

        //Button shape
        var square = new createjs.Shape(graphics);

        var bt = new createjs.Text("Play Again", "40px Arial", "#1b1b1b");
        bt.x = canvas.width / 2; bt.y = (t.y) + 175; bt.textAlign = "center";

        square.addEventListener("mouseover", function () { square.alpha *= .5; stage.update(); });

        //Roll out 'Start Game' of button
        square.addEventListener("mouseout", function () { square.alpha *= 2; stage.update(); });

        //Button navigation
        square.addEventListener("click", function (event) { location.reload(); });

        stage.addChild(square, bt);
    }
}

//Checks if Player AI is Killed
function IsKilledAI() {
    if (hpAI == 0) {
        playerAIIsDead = true;
        createjs.Tween.get(playerAI).to({ rotation: 1080 }, 1000).call(IsDeadAI);
        hpAI = 3;
    }
}


dataAI = {
    images:["assets/smallcowboy2.png"],
    frames: [
        [9, 16, 27, 34], [64, 15, 27, 35], [119, 16, 27, 34], [174, 15, 27, 35]
    ],
    animations:{
        stand:0,
        walkF:[0,3,"walkF", 200],   // start,end,next*,speed*
    }
};


//Start Player 1 & Player 2 Input
function MovePlayer(e){
    e = !e ? window.event : e;
    switch(e.keyCode){
        case A_KEY:
            player1.scaleX = -1;
            aKeyDown = true;
            dKeyDown = false;
            break;
        case D_KEY:
            player1.scaleX = 1;
            dKeyDown = true;
            aKeyDown = false;
            break;
        case W_KEY:
            wKeyDown = true;
            JumpPlayer1();
            break;
        case SPACEBAR:
            ShootBulletP1();
            spaceKeyDown = true;
            break;
		//Player2
		case ARROW_KEY_LEFT:
            player2.scaleX = -1;
            leftKeyDown = true;
            rightKeyDown = false;
            break;
        case ARROW_KEY_RIGHT:
            player2.scaleX = 1;
            rightKeyDown = true;
            leftKeyDown = false;
            break;
        case ARROW_KEY_UP:
            upKeyDown = true;
            JumpPlayer2();
            break;
        case INS_KEY:
			ShootBulletP2();
            insKeyDown = true;
            break;
    }
}
//Stop Player 1 & Player 2 Input
function StopPlayer(e){
    e = !e ? window.event : e;
    switch (e.keyCode) {
        case A_KEY:
            aKeyDown = false;
            break;
        case D_KEY:
            dKeyDown = false;
            break;
        case W_KEY:
            wKeyDown = false;
            break;
        case SPACEBAR:
            spaceKeyDown = false;
            break;
		//Player2
		case ARROW_KEY_LEFT:
            leftKeyDown = false;
            break;
        case ARROW_KEY_RIGHT:
            rightKeyDown = false;
            break;
        case ARROW_KEY_UP:
            upKeyDown = false;
            break;
        case INS_KEY:
            insKeyDown = false;
            break;
    }
}
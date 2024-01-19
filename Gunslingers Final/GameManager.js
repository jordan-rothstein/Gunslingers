

var p1Wins = 0;
var p2Wins = 0;
var p1WText, p2WText;
var maxWins = 3;

function gameManager(){
	p1WText = new createjs.Text("P1: Wins = " + p1Wins, "40px Arial", "#FFF");
    p1WText.y = canvas.height-45; p1WText.x = 5; p1WText.textAlign = "left";

    p2WText = new createjs.Text("P2: Wins = " + p2Wins, "40px Arial", "#FFF");
    p2WText.y = canvas.height-45; p2WText.x = canvas.width-5; p2WText.textAlign = "right";

    stage.addChild(p1WText, p2WText);
}

var necWins = 3;
var map1, map2, map3;
var selectedM1, selectedM2, selectedM3 = false;
var textM1, textM2, textM3;

function MapSelect() {
    //MAP 1
    //Grab image
    var img1 = new Image();
    img1.src = "assets/background1.png";

    //Transform image
    map1 = new createjs.Bitmap(img1);
    map1.scaleX = .25;
    map1.scaleY = .25;
    map1.x = (canvas.width / 2) - 465;
    map1.y = 260;

    //MAP1 text
    textM1 = new createjs.Text("Small", "25px Arial", "#FFF");
    textM1.y = 460; textM1.x = 260; textM1.textAlign = "center";

    //MAP 2
    //Grab image
    var img2 = new Image();
    img2.src = "assets/background2.png";

    //Transform image
    map2 = new createjs.Bitmap(img2);
    map2.scaleX = .25;
    map2.scaleY = .25;
    map2.x = (canvas.width / 2) - 130;
    map2.y = 260;

    //MAP2 text
    textM2 = new createjs.Text("Medium", "25px Arial", "#FFF");
    textM2.y = 460; textM2.x = 600; textM2.textAlign = "center";

    //MAP 3
    //Grab image
    var img3 = new Image();
    img3.src = "assets/background3.png";

    //Transform image
    map3 = new createjs.Bitmap(img3);
    map3.scaleX = .25;
    map3.scaleY = .25;
    map3.x = (canvas.width / 2) + 205;
    map3.y = 260;

    //MAP3 text
    textM3 = new createjs.Text("Large", "25px Arial", "#FFF");
    textM3.y = 460; textM3.x = 930; textM3.textAlign = "center";

    stage.addChild(map1, map2, map3, textM1, textM2, textM3);
    stage.update();
}
//Checks any kind of Collision
function CheckCollision(p, e){
    if(p.x >= e.x-p.regX && p.x <= e.x+e.width
      && p.y >= e.y - p.regY && p.y + 38 <= e.y + e.height) {
        return true;
    }else{
		return false;
    }
}
//Bullet Hit Collision Check
function BulletHit() {
    var i;
    var j;
    for (i = 0; i < p2Bullets.length; i++) {
        if ((p2Bullets[i].x >= player1.x) && (p2Bullets[i].x <= (player1.x + 27) && (p2Bullets[i].y) <= player1.y + 15) && (p2Bullets[i].y >= player1.y - 19)) {
            stage.removeChild(p2Bullets[i]);
            p2Bullets.splice(i, 1);
            hpP1--;
            DieSound();
        }
    }

    for (j = 0; j < p1Bullets.length; j++) {
        if (!aiGame) {
            if ((p1Bullets[j].x >= player2.x) && (p1Bullets[j].x <= (player2.x + 27) && (p1Bullets[j].y) <= player2.y + 15) && (p1Bullets[j].y >= player2.y -19)) {
                stage.removeChild(p1Bullets[j]);
                p1Bullets.splice(j, 1);
                hpP2--;
                DieSound();
            }
        }
        if (aiGame) {
            if ((p1Bullets[j].x >= playerAI.x) && (p1Bullets[j].x <= (playerAI.x + 27) && (p1Bullets[j].y) <= playerAI.y + 15) && (p1Bullets[j].y >= playerAI.y- 19)) {
                stage.removeChild(p1Bullets[j]);
                p1Bullets.splice(j, 1);
                hpAI--;
                DieSound();
            }
        }
    }

    for (i = 0; i < aiBullets.length; i++) {
        if ((aiBullets[i].x >= player1.x) && (aiBullets[i].x <= (player1.x + 27) && (aiBullets[i].y) <= player1.y + 15) && (aiBullets[i].y >= player1.y - 19)) {
            stage.removeChild(aiBullets[i]);
            aiBullets.splice(i, 1);
            hpP1--;
            DieSound();
        }
    }
}
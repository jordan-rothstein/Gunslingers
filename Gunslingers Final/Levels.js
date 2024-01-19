//
//ENVIRONMENT
var backdrop;

//Load Backdrop(s)
function LoadBackdrop(g, x, y, sx, sy){
    //Grab image
	var img = new Image();
    img.src = g;

    //Transform image
	backdrop = new createjs.Bitmap(img);
	backdrop.x = x;
	backdrop.y = y;
	backdrop.scaleX = sx;
    backdrop.scaleY = sy;

    //Add image
    stage.addChild(backdrop);
}
//
//=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
//
//Platforms
var numPlats1 = Math.floor((Math.random() * (6-4)) + 4);
var numPlats2 = Math.floor((Math.random() * (8-6)) + 6);
var numPlats3 = Math.floor((Math.random() * (12-10)) + 10);
var numPlats;
var platForms = [];
var availablePlats = [];
//
//Generate Platforms
function GeneratePlatforms(n){
    var img = new Image();
    img.src = "assets/platform.png";
    numPlats = n;

    var canv = document.getElementById("canvas");
    var maximumX = canv.clientWidth;
    var maximumY = canv.clientHeight - 50;
    var platScale;

    for (var i = 0; i < n; i++) {
        platForms[i] = new createjs.Bitmap(img);
        platForms[i].regY = 32 / 2;
        platForms[i].regX = 0;
        platScale = (Math.random() * (1 - .35) + .35);
        platForms[i].scaleX = platScale;
        platForms[i].width = (250 * platScale);
        platForms[i].height = 32;
    }
    var farX = maximumX - 200;
    platForms[0].x = Math.floor((Math.random() * farX) + 1);
    platForms[0].y = Math.floor((Math.random() * maximumY) + 50);

    for (var i = 0; i < n; i++) {
        platForms[i].x = Math.floor((Math.random() * farX) + 1);
        platForms[i].y = Math.floor((Math.random() * maximumY) + 50);
        for (var j = 1; j < i; j++) {
            if (j != i) {
                while (((platForms[j].y + 50 >= platForms[i].y) && (platForms[j].y - 50 <= platForms[i].y + 20)) && ((platForms[j].x - 180 <= platForms[i].x) && (platForms[j].x + platForms[j].width + 180 >= platForms[i].x + platForms[i].width))) {
                    platForms[i].x = Math.floor((Math.random() * farX) + 1);
                    platForms[i].y = Math.floor((Math.random() * maximumY) + 50);
                }
            }
        }
    }

    for (var i = 0; i < n; i++) {
        stage.addChild(platForms[i]);
    }
}
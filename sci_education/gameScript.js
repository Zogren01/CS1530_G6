var obstacles = [];
var keyPressed = false;
var player;

var numLevels = 1;
var levelNo = 0; //store the current level of the game
var subject = localStorage.getItem("subject"); //store value of subject, so that different map textures may be used
var gameOver = false;
var levelClear = false;

const cw = document.body.clientWidth * .8;
const tileSize = cw/48;
const ch = tileSize * 24;
const gravity = tileSize/10;
const spriteWidth = 2*tileSize;
const spriteHeight = 2*tileSize;

function startGame(){
    console.log(subject);
    myGameArea.start();
    player = new p(tileSize, ch - spriteHeight, spriteWidth, spriteHeight);//should put player in bottom left corner
    wall = new obstacle(0, 0, tileSize, ch, 0, 0, 'w');
    wall0 = new obstacle(cw-tileSize, 0, tileSize, ch, 0, 0, 'w');
    floor = new obstacle(0, ch/2-tileSize/2, cw-spriteWidth*3, tileSize, 0, 0, 'w');
    goal = new obstacle(tileSize,floor.y-2*tileSize,2*tileSize,2*tileSize,0,0,'g');
    test = new obstacle(tileSize, ch - 6 * tileSize, 3*tileSize,1*tileSize,tileSize*.1,cw-tileSize * 5, 'w');
    test2 = new obstacle(8*tileSize, ch - 4 * tileSize, 2*tileSize, 4*tileSize, 0, 0, 'w');
    test3 = new obstacle(30*tileSize, ch - 4 * tileSize, 2*tileSize, 4*tileSize, 0, 0, 'w');
    test4 = new obstacle(cw-3*tileSize, floor.y + 5*tileSize, 2*tileSize, tileSize, 0, 0, 'w');
    test5 = new obstacle(32*tileSize, ch-tileSize, 15*tileSize, tileSize, 0, 0, 'r');
}
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
      this.canvas.width = cw;
      this.canvas.height = ch;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.interval = setInterval(updateGameArea, 20);
      window.addEventListener("keydown",function(e){
            keyPressed = e.key;
      });
      window.addEventListener("keyup",function(e){
            if(e.key == 'ArrowDown'){
                player.height = spriteHeight;
                player.y = player.y - 24;
                player.actionType = 0;
            }
            if(e.key == keyPressed){
                keyPressed = false;
            }
      });
      },
    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
function obstacle(x, y, width, height, dx, range, type){

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.initPos = x;
    this.range = range; //restricts how far from initial position obstacle can travel
    this.type = type;
    obstacles.push(this);
    this.draw = function(){
        ctx = myGameArea.context;
        if(type == 'w'){
            ctx.fillStyle = "black";
        }
        else if(type == 'r'){
            ctx.fillStyle = "red";
        }
        else if(type == 'g'){
            ctx.fillStyle = "yellow";
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.updatePosition = function(){
      if(this.x + this.dx < this.initPos || this.x + this.dx > this.range + this.initPos){
        this.dx = this.dx * -1;
      }
      this.x += this.dx;
    }
}
function p(x, y, width, height){ //function for the player character

    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.width = width;
    this.height = height;
    this.onSurface = true;
    this.actionType = 0; //0 is for idle player facing right
    this.actionFrame = 0;
    this.keepFrame = true;
    this.step = false;
    this.myImage = new Image(this.width, this.height);
    this.myImage.src = './testing.png';
    this.updateImage = function(){
        ctx = myGameArea.context;
        ctx.drawImage(this.myImage, this.actionFrame * spriteWidth, this.actionType * spriteHeight,
            spriteWidth, spriteHeight, this.x, this.y, spriteWidth, spriteHeight);
    }
    this.updatePosition = function(){
        this.checkCollision();
        this.x += this.dx;
        this.y += this.dy;
    }
    this.idle = function(){
      this.dx = 0;
    }
    this.moveRight = function(){
        if(this.actionType < 6){
            this.dx = tileSize/3;
        }
    }
    this.moveLeft = function(){
        if(this.actionType < 6){
            this.dx = -tileSize/3;
        }
    }
    this.jump = function(){ //this function in particular needs lots of editing once jump sprites are complete
        if(this.actionType < 6 && this.onSurface){
            this.dy = -tileSize;
        }
    }
    this.crouch = function(){
        /*
        if(this.actionType != 6){
            this.actionType = 6;
            this.height = 24;
            this.y = this.y + 24;
        }
        */
    }
    this.checkCollision = function(){ //issue when player gets hit by moving object, causes player to teleport on top of said object (current thoughts to fix: NA)
        this.onSurface = false; //default to falling
        if(this.y + this.height + this.dy >= ch){
            this.y = ch - this.height;
            this.dy = 0;
            this.onSurface = true;
        }
        for(i = 0; i < obstacles.length; i ++){
            let current = obstacles[i];
            let sameX = this.inLine(this.x, this.width, current.x, current.width);
            let sameY = this.inLine(this.y, this.height, current.y, current.height);
            let collideX = this.inLine(this.x+this.dx, this.width+this.dx, current.x, current.width);
            let collideY = this.inLine(this.y+this.dy, this.height+this.dy, current.y, current.height);
            if(sameX && sameY){
                console.log("collision occuring");
                if(current.dx > 0){
                    this.x = current.x + current.width;
                }
                else{
                    this.x = current.x - this.width;
                }
            }
            else{
                if(sameX && collideY){
                    if(this.dy > 0){
                        console.log('surface below');
                        this.y = current.y - this.height;
                    }
                    else{
                        console.log('surface above');
                        this.y = current.y + current.height;
                    }
                    if(current.type == 'r'){
                        gameOver = true;
                    }
                    else if(current.type == 'g'){
                        levelClear = true;
                    }
                    this.dy = 0;
                }
                if(sameY && collideX){
                    if(this.dx > 0){
                        console.log('wall on right');
                        this.x = current.x - this.width;
                    }
                    else{
                        console.log('wall on left');
                        this.x = current.x + current.width;
                    }
                    this.dx = 0;
                    if(current.type == 'r'){
                        gameOver = true;
                    }
                    else if(current.type == 'g'){
                        levelClear = true;
                    }
                }
            }
            if(sameX && this.y == current.y - this.height){
                this.onSurface = true;
            }
        }
        if(!this.onSurface){
            this.dy = this.dy+gravity;
        }
    }
    this.inLine = function(pos1, len1, pos2, len2){
        return (pos1 < pos2 + len2 && pos1 + len1 > pos2);
    }
}

function loadLevel(){
 //this will load the current map, which will be a text file of obstacles
}
function updateGameArea() {
  if(gameOver){
    alert("Game over, don't touch the red");
    player.x = tileSize;
    player.y = myGameArea.canvas.height - spriteHeight;
    gameOver = false;
    keyPressed = false;
  }
  else if(levelClear){
    alert("Level clear");
    levelClear = false;
    keyPressed = false;
  }
    myGameArea.clear();
    if(keyPressed == 'ArrowLeft'){
        player.moveLeft();
    }
    else if(keyPressed == 'ArrowRight'){
        player.moveRight();
    }
    else if(keyPressed == 'ArrowDown'){
        player.crouch();
    }
    if(keyPressed == 'ArrowUp'){
        player.jump();
    }
    if(keyPressed == false){
      player.idle();
    }
    for(i = 0; i < obstacles.length; i++){
        obstacles[i].updatePosition();
        obstacles[i].draw();
    }
    player.updatePosition();
    player.updateImage();
  }

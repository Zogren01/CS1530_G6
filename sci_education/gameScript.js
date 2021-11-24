var obstacles = [];
var keyPressed = false;
var player;

var numLevels = 1;
var levelNo = 0; //store the current level of the game
var subject = localStorage.getItem("subject"); //store value of subject, so that different map textures may be used
var gameOver = false;
var levelClear = false;

const cw = document.body.clientWidth * .8;
const TS = cw/48;
const ch = TS * 24;
const gravity = 0.1;
    var bg = new Image(cw, ch);
    
    function startGame(){
        console.log(subject);
        myGameArea.start();
        bg.src = "./"+subject+"_bg.png";
        player = new p(2, 22, 2, 2);//should put player in bottom left corner
        wall = new obstacle(0, 0, 1, 24, 0, 0, 'w');    
        wall0 = new obstacle(47, 0, 1, 24, 0, 0, 'w');  
        floor = new obstacle(0, 11, 20, 1, 0, 0, 'w');
        test6 = new obstacle(24, 11, 18, 1, 0, 0, 'w');
        goal = new obstacle(1, 9, 2, 2, 0, 0, 'g'); 
        test = new obstacle(1, 18, 3, 1, .1, 43, 'w'); 
        test2 = new obstacle(8, 20, 2, 4, 0, 0, 'w');
        test3 = new obstacle(30, 20, 2, 4, 0, 0, 'w');
        test4 = new obstacle(45, 16, 2, 1, 0, 0, 'w');
        test5 = new obstacle(32, 23, 15, 1, 0, 0, 'r');
        test7 = new obstacle(3, 10, 1, 1, .2, 44, 'r');
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
    this.image = new Image(this.width, this.height);
    obstacles.push(this);
    this.draw = function(){
        ctx = myGameArea.context;
        if(type == 'w'){
            this.image.src = "./math_tile.png"
            ctx.drawImage(this.image, this.x * TS, this.y*TS, this.width*TS, this.height*TS);
        }
        else if(type == 'r'){
            this.image.src = "./lava.png"
            ctx.drawImage(this.image, this.x * TS, this.y*TS, this.width*TS, this.height*TS);
        }
        else if(type == 'g'){
            ctx.fillStyle = "yellow";
            ctx.fillRect(this.x * TS, this.y*TS, this.width*TS, this.height*TS);
        }
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
    this.updateImage = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x*TS, this.y*TS, this.width*TS, this.height*TS);
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
            this.dx = 1/2;
        }
    }
    this.moveLeft = function(){
        if(this.actionType < 6){
            this.dx = -1/2;
        }
    }
    this.jump = function(){ //this function in particular needs lots of editing once jump sprites are complete
        if(this.actionType < 6 && this.onSurface){
            this.dy = -1;
        }
    }
    this.crouch = function(){

    }
    this.checkCollision = function(){ //issue when player gets hit by moving object, causes player to teleport on top of said object (current thoughts to fix: NA)
        this.onSurface = false; //default to falling
        if(this.y + this.height + this.dy >= 24){
            this.y = 22;
            this.dy = 0;
            this.onSurface = true;
        }
        for(i = 0; i < obstacles.length; i ++){
            let current = obstacles[i];
            let sameX = this.inLine(this.x, this.width, current.x, current.width);
            let sameY = this.inLine(this.y, this.height, current.y, current.height);
            let collideX = this.inLine(this.x+this.dx, this.width+this.dx, current.x, current.width);
            let collideY = this.inLine(this.y+this.dy, this.height+this.dy, current.y, current.height);
            let contact = false;
            if(sameX && sameY){
                console.log("collision occuring");
                console.log(i);
                if(current.dx > 0){
                    this.x = current.x + current.width;
                }
                else{
                    this.x = current.x - this.width;
                }
                contact = true;
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
                    this.dy = 0;
                    contact = true;
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
                    contact = true;
                }
            }
            if(sameX && this.y == current.y - this.height){
                this.onSurface = true;
            }
            if(contact){
                if(current.type == 'r'){
                    gameOver = true;
                }
                else if(current.type == 'g'){
                    levelClear = true;
                }
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
    player.x = 2;
    player.y = 22;
    gameOver = false;
    keyPressed = false;
  }
  else if(levelClear){
    alert("Level clear");
    levelClear = false;
    keyPressed = false;
  }
    myGameArea.clear();
    ctx = myGameArea.context;
    ctx.drawImage(bg, 0, 0, cw, ch);
    if(keyPressed == 'ArrowLeft'){
        console.log("left");
        player.moveLeft();
    }
    else if(keyPressed == 'ArrowRight'){
        console.log("right");
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

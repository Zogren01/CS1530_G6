var obstacles = [];
var keyPressed = false;
var player;
const gravity = 1;
const spriteWidth = 48;
const spriteHeight = 48;
var numLevels = 1;
var levelNo = 0; //store the current level of the game
var subject; //store value of subject, so that different map textures may be used
var gameOver = false;
var levelClear = false;

function startGame(){

    myGameArea.start();
    player = new p(20, myGameArea.canvas.height - spriteHeight, spriteWidth, spriteHeight);//should put player in bottom left corner
    //obstacle(x, y, width, height, dx, range, isGoal)
    wall = new obstacle(0, 0, 20, myGameArea.canvas.height, 0, 0, 'w');
    wall0 = new obstacle(myGameArea.canvas.width-20, 0, 20, myGameArea.canvas.hieght, 0, 0, 'w');
    test0 = new obstacle(300, myGameArea.canvas.height - spriteHeight, 500, spriteHeight, 0, 0, 'w');
    test1 = new obstacle(100, test0.y - 80, 150, 30, 0, 0, 'w');
    test2 = new obstacle(250, test1.y - 60, 100, 30, 2, 500, 'w');
    test3 = new obstacle(850, test2.y - 75, 100, 500, 0, 0, 'w');
    test4 = new obstacle(950, test2.y - 150, 25, 25, 1, 200, 'r');
    test5 = new obstacle(1175, test4.y - 200, 100, 300, 0, 0, 'w');
    test6 = new obstacle(950, test0.y + 20, 600, 28, 0, 0, 'r');
    test7 = new obstacle(1000, test6.y - 20, 20, 20, 3, 400, 'g');
    test8 = new obstacle(1050, test7.y - 25, 100, 10, 0, 0, 'w');
}
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
      this.canvas.width = document.body.clientWidth * .6;
      this.canvas.height = document.body.clientHeight * .6;
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
            this.dx = 4;
        }
    }
    this.moveLeft = function(){
        if(this.actionType < 6){
            this.dx = -4;
        }
    }
    this.jump = function(){ //this function in particular needs lots of editing once jump sprites are complete
        if(this.actionType < 6 && this.onSurface){
            this.dy = -16;
        }
    }
    this.crouch = function(){
        if(this.actionType != 6){
            this.actionType = 6;
            this.height = 24;
            this.y = this.y + 24;
        }
    }
    this.checkCollision = function(){ //issue when player gets hit by moving object, causes player to teleport on top of said object (current thoughts to fix: NA)
        this.onSurface = false; //default to falling
        if(this.y + this.height + this.dy >= myGameArea.canvas.height){
            this.y = myGameArea.canvas.height - this.height;
            this.dy = 0;
            this.onSurface = true;
        }
        if(this.x + this.dx < 0){
            this.x = 0;
            this.dx = 0;
        }
        else if(this.x + this.width + this.dx> myGameArea.canvas.width){
            this.x = myGameArea.canvas.width - this.width;
            this.dx = 0;
        }
        for(i = 0; i < obstacles.length; i ++){
            current = obstacles[i];
            if(this.x + this.width > current.x && this.x < current.x + current.width){ //check and update y based on position
                if(this.y + this.dy + this.height >= current.y && this.y < current.y + current.height){
                    if(current.type == 'r'){
                        gameOver = true;
                    }
                    else if(current.type == 'g'){
                      levelClear = true;
                    }
                    this.onSurface = true;
                    this.y = current.y - this.height;
                    this.dy = 0;
                }
                else if(this.y + this.dy <= current.y + current.height && this.y + this.height > current.y){
                  if(current.type == 'r'){
                      gameOver = true;
                  }
                  else if(current.type == 'g'){
                    levelClear = true;
                  }
                    this.y = current.y + current.height;
                    this.dy = 0;
                }
            }
            if(this.y + this.height > current.y && this.y < current.y + current.height){ //check and update x based on position
                if(this.x + this.dx + this.width >= current.x && this.x < current.x + current.width){
                  if(current.type == 'r'){
                      gameOver = true;
                  }
                  else if(current.type == 'g'){
                    levelClear = true;
                  }
                    this.x = current.x - this.width;
                    this.dx = 0;
                }
                else if(this.x + this.dx <= current.x + current.width && this.x + this.width > current.x){
                  if(current.type == 'r'){
                      gameOver = true;
                  }
                  else if(current.type == 'g'){
                    levelClear = true;
                  }
                    this.x = current.x + current.width;
                    this.dx = 0;
                }

            }
        }
        if(!this.onSurface){
            this.dy = this.dy+gravity;
        }
    }
}

function loadLevel(){
 //this will load the current map, which will be a text file of obstacles
}
function updateGameArea() {
  if(gameOver){
    alert("Game over, don't touch the red");
    player.x = 0;
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

var obstacles = [];
var keyPressed = false;
var player;
const gravity = 0.98;
const spriteWidth = 48;
const spriteHeight = 48;
var numLevels = 1;
var levelNo = 0; //store the current level of the game
var subject; //store value of subject, so that different map textures may be used

function startGame(){
    myGameArea.start();
    player = new p(0, myGameArea.canvas.height - spriteHeight, spriteWidth, spriteHeight);//should put player in bottom left corner
    //obstacle(x, y, width, height, dx, range, isGoal)
    test0 = new obstacle(300, myGameArea.canvas.height - spriteHeight, 500, spriteHeight, 0, 0, false);
    test1 = new obstacle(100, test0.y - 80, 150, 30, 0, 0, false);
    test2 = new obstacle(250, test1.y - 60, 100, 30, 2, 500, false);
    test3 = new obstacle(850, test2.y - 100, 100, 500, 0, 0, false);

}
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
      this.canvas.width = document.body.clientWidth;
      this.canvas.height = document.body.clientHeight;
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
function obstacle(x, y, width, height, dx, range, isGoal){

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.initPos = x;
    this.range = range; //restricts how far from initial position obstacle can travel
    this.isGoal = isGoal;
    obstacles.push(this);
    this.draw = function(){
      console.log("displaying obstacle");
        ctx = myGameArea.context;
        if(isGoal){
            ctx.fillStyle = "red";
        }
        else{
            ctx.fillStyle = "black";
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
        if(this.actionType < 6 && this.dy == 0){
            this.dy = -15;
        }
    }
    this.crouch = function(){
        if(this.actionType != 6){
            this.actionType = 6;
            this.height = 24;
            this.y = this.y + 24;
        }
    }
    this.checkCollision = function(){
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
                    if(current.isGoal){
                        alert("end of level, teacher question will appear here")
                    }
                    this.onSurface = true;
                    this.y = current.y - this.height;
                    this.dy = 0;
                }
                else if(this.y + this.dy <= current.y + current.height && this.y + this.height > current.y){
                    if(current.isGoal){
                        alert("end of level, teacher question will appear here")
                    }
                    this.y = current.y + current.height;
                    this.dy = 0;
                }
            }
            if(this.y + this.height > current.y && this.y < current.y + current.height){ //check and update x based on position
                if(this.x + this.dx + this.width >= current.x && this.x < current.x + current.width){
                    if(current.isGoal){
                        alert("end of level, teacher question will appear here")
                    }
                    this.x = current.x - this.width;
                    this.dx = 0;
                }
                else if(this.x + this.dx <= current.x + current.width && this.x + this.width > current.x){
                    if(current.isGoal){
                        alert("end of level, teacher question will appear here")
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

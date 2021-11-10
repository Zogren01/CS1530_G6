var obstacles = [];
var keyPressed = false;
var player;
const gravity = 0.98;
const spriteWidth = 48;
const spriteHeight = 48;
var levelNo = 0; //store the current level of the game 
var subject; //store value of subject, so that different map textures may be used

function startGame(){
    myGameArea.start();
    player = new p(0, myGameArea.canvas.height - spriteHeight, spriteWidth, spriteHeight);//should put player in bottom left corner
    test = new obstacle(100, myGameArea.canvas.height - spriteHeight, 500, 20, false);
    test2 = new obstacle(200, test.y - (spriteHeight*2), 500, 20, false);
    test3 = new obstacle(750, test.y - (spriteHeight*2), 500, 20, false);
    test4 = new obstacle(1000, test2.y - 75, 20, 20, true);
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
function obstacle(x, y, width, height, isGoal){

    this.x = x; 
    this.y = y;
    this.width = width;
    this.height = height;
    this.isGoal = isGoal;
    obstacles.push(this);
    this.draw = function(){
        ctx = myGameArea.context;
        if(isGoal){
            ctx.fillStyle = "red";
        }
        else{
            ctx.fillStyle = "black";
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
        this.dx = 0; //reset x motion before updating position
    }
    this.updatePosition = function(){
        this.checkCollision();
        this.x += this.dx;
        this.y += this.dy;
    }
    this.moveRight = function(){
        if(this.actionType < 6){
            this.dx = 4;
        }
        /*
        if(this.actionType < 4){
            if(this.actionType == 0){
                this.actionType = 2;
                this.actionFrame = 0;
            }
            else if(this.actionType == 1 || this.actionType == 3){
                this.actionType = 0;
                this.actionFrame = 0;
            }
            else{
                this.dx = 4;
                if(this.keepFrame){
                    this.keepFrame = false;
                }
                else{
                    this.keepFrame = true;
                    this.actionFrame = (this.actionFrame + 1) % 5;
                    if(this.actionFrame == 0){
                        keyPressed = false;
                        this.actionType = 0;
                        this.step = !this.step;
                    }
                    else if(this.step){
                        this.actionFrame += 5;
                    }
                }
            }
        }*/
    }
    this.moveLeft = function(){
        if(this.actionType < 6){
            this.dx = -4;
        }
        /*
        if(this.actionType < 4){
            if(this.actionType == 1){
                this.actionType = 3;
                this.actionFrame = 0;
            }
            else if(this.actionType == 0 || this.actionType == 2){
                this.actionType = 1;
                this.actionFrame = 0;
            }
            else{
                this.dx = -4;
                if(this.keepFrame){
                    this.keepFrame = false;
                }
                else{
                    this.keepFraem = true;
                    this.actionFrame = (this.actionFrame + 1) % 5;
                    if(this.actionFrame == 0){
                        keyPressed = false;
                        this.actionType = 1;
                        this.step = !this.step;
                    }
                    else if(this.step){
                        this.actionFrame += 5;
                    }
                }
            }
        }
        */
    }
    this.jump = function(){ //this function in particular needs lots of editing once jump sprites are complete
        if(this.actionType < 6 && this.dy == 0){
            this.dy = -15;
        }
        /*
        if(this.actionType < 6){
            if(this.actionType == 0 || this.actionType == 2){
                this.actionType = 4;
                this.actionFrame = 0;
            }
            else if(this.actionType == 1 || this.actionType == 3){
                this.actionType = 5;
                this.actionFrame = 0;
            }
            else{
                this.actionFrame = this.actionFrame + 1;
                if(this.actionFrame = 1){
                    if(this.dy == 0){
                        this.dy = -15;
                    }
                }
                keyPressed = false;
                this.actionType = 0;
            }
        } 
        */
    }
    this.crouch = function(){
        if(this.actionType != 6){
            this.actionType = 6;
            this.height = 24;
            this.y = this.y + 24;
        }
        /*
        if(this.actionType != 4 && this.actionType != 5){
            if(this.actionType == 0 || this.actionType == 2){
                this.actionType = 6;
                this.actionFrame = 0;
            }
            else if(this.actionType == 1 || this.actionType == 3){
                this.actionType = 7;
                this.actionFrame = 0;
            }
            else{
                this.actoinFrame = (this.actionFrame + 1) % 8;
                if(this.actionFrame == 0){
                    this.actionType = 0;
                    this.keyPressed = false;
                }
            }
        }
        */
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
            if(this.y + this.height > current.y && this.y < current.y + current.height){ 
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
            if(this.x + this.width > current.x && this.x < current.x + current.width){
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
    for(i = 0; i < obstacles.length; i++){
        obstacles[i].draw();
    }
    player.updatePosition();
    player.updateImage();
  }

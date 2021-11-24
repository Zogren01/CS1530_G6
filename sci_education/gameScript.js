/*
Things to do (necessity):
    -player collision sometimes behaves weirdly (fix this)
    -add levels
    -finish adding backgrounds
    -finish adding tiles for different objects and fix current ones
    -modify object code so object images don't stretch in weird ways
    -make player stick to moving objects
Things to do (wish list):
    -add animations for player
    -refine player movement based on animations (refine feel of controls)
    -add blocks that switch gravity
    -add portals
    -add ladders
    -add more levels
*/
/*
code to implement all levels 
levels array holds arrays of objects
objects have format:
  [x, y, width, height, speed, range, type]
all values are scaled based on TS, the size of game tiles
*/
var levels = [];
const l0 = [ //this level sucks, fix it later
    [0, 11, 20, 1, 0, 0, 1],
    [24, 11, 18, 1, 0, 0, 1],
    [1, 9, 2, 2, 0, 0, 3],
    [1, 28, 3, 1, .1, 33, 1],
    [8, 20, 2, 4, 0, 0, 1],
    [30, 20, 2, 4, 0, 0, 1],
    [45, 16, 2, 1, 0, 0, 1],
    [32, 23, 15, 1, 0, 0, 2],
    [3, 10, 1, 1, .2, 44, 2]
    ];
const l1 = [
    [4, 4, 4, 1, 0, 0, 1],
    [11, 4, 6, 1, .1, 23, 1],
    [30, 2.5, 1.5, 1.5, 0, 0, 2],
    [10, 8, 4, 1, 0, 0, 1],
    [18, 9, 4, 1, 0, 0, 1],
    [8, 21, 2, 3, 0, 0, 1],
    [10, 22, 6, 2, 0, 0, 2],
    [16, 21, 2, 3, 0, 0, 1],
    [19, 17, 3, 7, 0, 0, 1],
    [22, 23, 13, 1, 0, 0, 2],
    [23, 20, 3, 1, .1, 8, 1],
    [26, 11, 5, 5, 0, 0, 1],
    [26, 16, 5, 1, 0, 0, 2],
    [35, 17, 3, 7, 0, 0, 1],
    [38, 23, 9, 1, 0, 0, 2],
    [38, 13, 3, 1, 0, 0, 1],
    [33, 11, 2, 1, 0, 0, 1],
    [43, 0, 2, 2, 0, 0, 3]
    ];
levels.push(l0);
levels.push(l1);
//end code to implement all levels

//constants needed for game
const toClear = 2;                          //store the number of levels in a given assignment
const cw = document.body.clientWidth * .8;  //canvas width
const TS = cw/48;                           //tile size based on canvase width
const ch = TS * 24;                         //canvas height based on tile size
const gravity = 0.1;                        //gravity (to be scaled by tile size when used in code)

//variables needed for game
var levelNo = 0;                                //store the current level of the game, when equal to toClear, assignment is complete
var player;                                     //the player character
var obstacles = [];                             //stores all objects of current level
var keyPressed = false;                         //stores key most recently pressed
var subject = localStorage.getItem("subject");  //store value of subject to set map textures based on subject
var gameOver = false;                           //used for collision with a hazard obstacle
var levelClear = false;                         //used for collision with a goal obstacle
var bg = new Image(cw, ch);                     //stores the background image

//starts the game
function startGame(){
    console.log(subject);
    myGameArea.start();
    bg.src = "./"+subject+"_bg.png";
    player = new p(2, 22, 2, 2);//should put player in bottom left corner
    wall0 = new obstacle(0, 0, 1, 24, 0, 0, 1);    //left and right side walls
    wall1 = new obstacle(47, 0, 1, 24, 0, 0, 1);  
    loadLevel();
}

//defines the game area
var myGameArea = {
    canvas : document.createElement("canvas"),
    //initializes the canvas used by the game
    start : function() {
      this.canvas.width = cw;
      this.canvas.height = ch;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.interval = setInterval(updateGameArea, 20);
      window.addEventListener("keydown",function(e){ //listener for key pressed
            keyPressed = e.key;
      });
      window.addEventListener("keyup",function(e){ //listener for key released
            if(e.key == 'ArrowDown'){
                //might implement later, special case for when player is ducking
            }
            if(e.key == keyPressed){
                keyPressed = false;
            }
      });
      },
    //clears canvas so it can be redrawn every frame
    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

//very similar to java class, takes details for an object and provides methods for that object
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
    //draws image of object based on type and locaiton
    this.draw = function(){
        ctx = myGameArea.context;
        if(type == 1){
            this.image.src = "./math_tile.png"
            ctx.drawImage(this.image, this.x * TS, this.y*TS, this.width*TS, this.height*TS);
        }
        else if(type == 2){
            this.image.src = "./lava.png"
            ctx.drawImage(this.image, this.x * TS, this.y*TS, this.width*TS, this.height*TS);
        }
        else if(type == 3){
            ctx.fillStyle = "yellow";
            ctx.fillRect(this.x * TS, this.y*TS, this.width*TS, this.height*TS);
        }
    }
    //updates position of moving objects, flips direction when outside of objects range
    this.updatePosition = function(){
      if(this.x + this.dx < this.initPos || this.x + this.dx > this.range + this.initPos){
        this.dx = this.dx * -1;
      }
      this.x += this.dx;
    }
}

//similar to java class, defines player and their functions
function p(x, y, width, height){ //function for the player character

    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.width = width;
    this.height = height;
    this.onSurface = true;
    this.actionType = 0; //0 is for idle player facing right
    //draws the player
    this.updateImage = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x*TS, this.y*TS, this.width*TS, this.height*TS);
    }
    //checks for collision and updates player position
    this.updatePosition = function(){
        this.checkCollision();
        this.x += this.dx;
        this.y += this.dy;
    }
    //will be used to implement frame changes for idle player
    this.idle = function(){
      this.dx = 0;
    }
    //move right command
    this.moveRight = function(){
        if(this.actionType < 6){
            this.dx = 1/3;
        }
    }
    //move left command
    this.moveLeft = function(){
        if(this.actionType < 6){
            this.dx = -1/3;
        }
    }
    //jump command
    this.jump = function(){ //this function in particular needs lots of editing once jump sprites are complete
        if(this.actionType < 6 && this.onSurface){
            this.dy = -1;
        }
    }
    //crouch command
    this.crouch = function(){
        //might implement later
    }
    //checks if player is hit by a moving object or will hit a moving object based on current motion
    this.checkCollision = function(){ //THERE ARE STILL GLITCHES WITH THIS FUNCTION
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
                if(current.type == 2){
                    gameOver = true;
                }
                else if(current.type == 3){
                    levelClear = true;
                }
            }
        }
        if(!this.onSurface){
            this.dy = this.dy+gravity;
        }
    }
    this.inLine = function(pos1, len1, pos2, len2){ //helps prevent redundancy in code
        return (pos1 < pos2 + len2 && pos1 + len1 > pos2);
    }
}

//clears old level, selects a random new level from levels, and loads all objects into objects[]
function loadLevel(){
    while(obstacles.length > 2){
        obstacles.pop();
    }
    map = levels[Math.floor(Math.random() * levels.length)];
    levels.splice(levels.indexOf(map),1);
    let i;
    for(i=0; i<map.length; i++){
        temp = new obstacle(map[i][0],map[i][1],map[i][2],map[i][3],map[i][4],map[i][5],map[i][6]);
    }
}

//checks variables for level failure or completion, calls player fucntions based on keyPressed, and updates all object&player positions
function updateGameArea() {
  if(gameOver){
    alert("Game over, don't touch the red");
    player.x = 1;
    player.y = 22;
    gameOver = false;
    keyPressed = false;
  }
  else if(levelClear){
    levelNo++;
    if(levelNo == toClear){
        alert("Game complete, returning to home page");
        //update assignment database
        window.location.href = "studentHome.html";
    }
    else{
        levelClear = false;
        keyPressed = false;
        loadLevel();
        player.x = 1;
        player.y = 22;
    }
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

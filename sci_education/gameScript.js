var obstacles = [];
var player;
const gravity = 0.98;

function startGame(){
    console.log('startGame called');
    myGameArea.start();
    player = new sprite(0, myGameArea.canvas.height - 64, 32, 64, 0, 0, 'p');//should put player in bottom left corner

}
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
      this.canvas.width = document.body.clientWidth;
      this.canvas.height = document.body.clientHeight;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      this.frameNo = 0;
      this.interval = setInterval(updateGameArea, 20);
      window.addEventListener("keydown",doKeyDown);
      window.addEventListener("keyup", doKeyUp);
      },
    clear : function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
function doKeyDown(e) {
    if(e.key == 'ArrowLeft' && player.x > 0){
        player.dx = -5;
    }
    else if(e.key == 'ArrowRight' && player.x < myGameArea.canvas.width - player.width){
        player.dx = 5;
    }
    else if(e.key == 'ArrowDown'){
        if(player.onSurface && !player.crouching){
            player.crouching = true;
            player.height -= 32;
            player.y += 32;
        }
    }
    if(e.key == 'ArrowUp' && player.onSurface){
        player.onSurface = false;
        player.dy = -15;
    }
}
function doKeyUp(e) {
    if(e.key == 'ArrowLeft'){
        player.dx = 0;
    }
    if(e.key == 'ArrowRight'){
        player.dx = 0;
    }
    if(e.key == 'ArrowDown' && player.crouching){
        player.height += 32;
        player.y += 32;
        player.crouching = false;
    }
}
function updateGameArea() {
    myGameArea.clear();
    myGameArea.frameNo += 1;
    player.updatePosition();
    player.updateImage();
  }

function sprite(x, y, width, height, dx, dy, type){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dx = dx;
    this.dy =dy;
    this.accelaration = 0;
    this.onSurface = true;
    this.crouching = false;
    this.updateImage = function(){
        ctx = myGameArea.context;
        if(type == 'p'){
            ctx.fillStyle = "blue";
        }
        if(type == 'w'){
            ctx.fillStyle = "black";
        }
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if(this.motion == 0){
            //motion for stationary player
        }
        else if(this.motion == 1){
            //motion for moving up
        }
        else if(this.motion == 2){
            //right
        }
        else if(this.motion == 3){
            //right
        }
        else if(this.motion == 4){
            //right
        }
    }
    this.updatePosition = function(){
        this.checkCollision();
        if(!this.onSurface){
            this.dy = this.dy + gravity;
        }
        this.x += this.dx;
        this.y += this.dy;
    }
    this.checkCollision = function(){
        if(this.y > myGameArea.canvas.height - this.height)
        {
            this.y = myGameArea.canvas.height - this.height;
            this.dy = 0;
            this.onSurface = true;
        }
    }
}

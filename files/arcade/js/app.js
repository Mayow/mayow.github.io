//The height and weight of the tiles
var TILE_WIDTH = 83,
    TILE_HEIGHT = 83;


// Enemies, player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of the instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for  enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/images/enemy-bug.png';
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + (this.speed * dt);
    if (this.x >= 1000) {
        this.x = 0;
    }
    this.collision();
};
Enemy.prototype.collision = function() {
    if (
       ((player.y + 40) >= this.y) &&
       ((player.y - 40) <= this.y) &&
       ((player.x + 40) >= this.x) &&
       ((player.x - 40) <= this.x)){

              player.x = 450;
              player.y = 400;
    }

};
// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
var player = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/images/char-boy.png';
};
player.prototype.update = function() {
    //  Multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.y > 370) {
        this.y = 370;
    }
    if (this.x > 900) {
        this.x = 900;
    }
    if (this.x < 2.5) {
        this.x = 2.5;
    }
    if (this.y <= -30) {
        console.log("YOU MADE IT");
        this.x = 400;
        this.y = 400;
        var enemy = new Enemy(47, (Math.random() * (230 - 40) + 40), Math.random() *
            200);
        allEnemies.push(enemy);
        score += 1;
        level += 1;
        displayScoreLevel(score, level, gemCount);
    }
};
var Gem = function(x, y) {
    // Variables applied to each of the instances go here,
    this.x = x;
    this.y = y;
    // The image/sprite for the gem, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/images/Star.png';
};
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Gem.prototype.update = function() {
  if (((player.y + 50) >= this.y) && ((player.y - 50) <= this.y) && ((
         player.x + 50) >= this.x) && ((player.x - 50) <= this.x)) {
         gemCount += 1;
         displayScoreLevel(score, level, gemCount);
         this.x = ((Math.floor(Math.random() * (8 - 1) + 1))*TILE_WIDTH);
         this.y = ((Math.floor(Math.random() * (4 - 1) + 1))*TILE_HEIGHT);

     }};


var displayScoreLevel = function(score, level, gemCount) {
    var c = document.getElementById("canvasss");
    
    ctx.clearRect(0, 580, 1005, 1000);

    ctx.font = "30px Arial";
    ctx.strokeStyle="black";
    ctx.fillStyle= "black";
    ctx.fillText("Score: " + score, 40, 615);
    ctx.fillText("Level: " + level, 180, 615);
    ctx.fillText("Gems: " + gemCount, 300, 615);

}


player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//  player class
// This class requires an update(), render() and
// a handleInput() method.
player.prototype.handleInput = function(inputKey) {
    if (inputKey == 'up') {
        this.y = this.y - TILE_HEIGHT;
    }
    if (inputKey == 'left') {
        this.x = this.x - TILE_WIDTH;
    }
    if (inputKey == 'right') {
        this.x = this.x + TILE_WIDTH;
    }
    if (inputKey == 'down') {
        this.y = this.y + TILE_HEIGHT;
    }
};
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var score = 0;
var level = 1;
var gemCount = 0;
var enemy = new Enemy(47, (Math.random() * (230 - 40) + 40), (Math.random() * (
    200 - 50) + 50));
var player = new player(200, 400, 50);
var Gem = new Gem((Math.random() * (630 - 600) + 40), (Math.random() * (230 - 40) +40));
allEnemies.push(enemy);
// This listens for key presses and sends the keys to to
// Player.handleInput() method. 
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

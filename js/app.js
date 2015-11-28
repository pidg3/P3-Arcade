var diff = 1; // TODO - will be used to alter difficulty settings 

var allEnemies = [];

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images

    function yRandomiser() {
        var yPosRand = Math.random(); // generates number between 0 and 1
        var yPosFixed; // will be used to return a fixed value - one of the three layers in the game

        if (yPosRand < 0.33) {
            yPosFixed = 55; // top layer
        }
        else if (yPosRand > 0.66) {
            yPosFixed = 225; // bottom layer
        }
        else {
            yPosFixed = 140; // middle layer
        }

        return yPosFixed;
    };

    function speedRandomiser(diff) { // 
        return (Math.random() * 300 * (Math.sqrt(diff))) + 20;
    };

    this.sprite = 'images/enemy-bug.png';
    this.x = -100;
    this.y = yRandomiser();
    this.speed = speedRandomiser(diff);


};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt);
    if (this.x > 500) {
        this.x = -100; 
    };
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 400; 
};

Player.prototype.update = function(dt) {
    for (i = 0; i < diff * 3; i++) {
        // console.log(allEnemies[i].x);
        if (this.x < allEnemies[i].x + 75 &&
            this.x > allEnemies[i].x - 60 &&
            this.y < allEnemies[i].y + 50 &&
            this.y > allEnemies[i].y - 50)
        {
            this.x = 202;
            this.y = 400;
        }
    };
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(input) {
    if (input === "right") {
        this.x += 100;
        console.log("Move Right");
    }
    else if (input === "left") {
        this.x -= 100;
        console.log("Move Left");
    }
    else if (input === "up") {
        this.y -= 85;
        console.log("Move Up");
    }
    else if (input === "down") {
        this.y += 85;
        console.log("Move Down");
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();

for (i = 0; i < diff * 3; i++) {
    allEnemies[i] = new Enemy();
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

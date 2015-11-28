var diff = 1; // TODO - will be used to vary difficulty level, selectable at start menu
var score = 0;
/*
Used to randomly distribute enemies across three lines
Defined in global scope as needed for constructor AND update method. TODO - is there a better way of doing this? 
*/
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

/* 
Enemy class constructor
Player must avoid these - collision detection contained within separate Player class (update method)
*/
var Enemy = function() {

    /*
    Randomises speed of bugs, depending on difficulty level defined
    'sqrt' is used to dampen effects of higher difficulty to ensure still playable, and still allow 'diff'  to be defined as an integer
    '+ 20' sets a minimum speed for bugs
    */
    function speedRandomiser(diff) { // 
        return (Math.random() * 300 * (Math.sqrt(diff))) + 20;
    };

    this.sprite = 'images/enemy-bug.png'; // use correct image (uses resources.js for processing)
    this.x = -100; // start off-screen: produces a nice smooth animation
    this.y = yRandomiser(); // sets starting row
    this.speed = speedRandomiser(diff); // sets speed
};

/*
Updates enemy position
*/
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += (this.speed * dt);
    if (this.x > 500) {
        this.x = -100; 
        this.y = yRandomiser();
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

Player.prototype.update = function(dt) { // collision detection
    for (i = 0; i < diff * 3; i++) {
        if (this.x < allEnemies[i].x + 75 &&
            this.x > allEnemies[i].x - 60 &&
            this.y < allEnemies[i].y + 50 &&
            this.y > allEnemies[i].y - 50)
        {
            this.x = 202;
            this.y = 400;
        }
    };

    if (this.y < 60) {
        this.x = 202;
        this.y = 400;
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(input) {
    if (input === "right") {
        if (this.x < 402) {
            this.x += 100;
        }
    }
    else if (input === "left") {
        if (this.x > 2) {
            this.x -= 100;
        }
    }
    else if (input === "up") { // Don't need extra 'if' due to player.prototype.update function, water reset
        this.y -= 85;
    }
    else if (input === "down") {
        if (this.y < 400) {
            this.y += 85;
        }
    }
};

var Gem = function(colour) {
    var xPos = 20 + (Math.random() * 400); // position on x axis
    this.x = xPos;

    if (colour === 'blue') {
        this.sprite = 'images/Gem-Blue.png';
        this.y = 268; 
        this.points = 200;   
    }

    else if (colour === 'green'){
        this.sprite = 'images/Gem-Green.png';
        this.y = 185; 
        this.points = 500;
    }

    else if (colour === 'orange'){
        this.sprite = 'images/Gem-Orange.png';
        this.y = 102; 
        this.points = 1000;
    }
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Gem.prototype.update = function() {
    if (this.x < player.x + 75 &&
    this.x > player.x - 60 &&
    this.y < player.y + 50 &&
    this.y > player.y - 10) {
        console.log("Woohoo, Gem");
        score += this.points;
        this.x = 20 + (Math.random() * 400);
    }
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var player = new Player();

var allEnemies = [];
for (i = 0; i < diff * 3; i++) {
    allEnemies[i] = new Enemy();
};

var gemBlue = new Gem('blue');
var gemGreen = new Gem('green');
var gemOrange = new Gem('orange');

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

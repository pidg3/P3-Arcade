/* App.js
Main game: defined gameplay, classes, methods and input
*/

/*
Variable difficulty levels. Must be an integer at least one. 
Can in theory be any value above one, however becomes unplayable beyond 3.
Affects the following classes/methods:
* Enemy constructor: speed of bugs
* Instantiation of enemies (using allEnemies array)
* PLayer.update method: Collision detection (used allEnemies array)
TODO - make selectable at start menu
*/
var difficulty = 2;

/*
Track overall score
Displayed in top-left of canvas
*/
var score = 0;

/*
Set time for gem regeneration
Defined as global variable as used in Gem constructor and all methods
*/
var gemTimer = 100;

/* 
Enemy (bug) class constructor
Player must avoid these - collision detection contained within separate Player class (update method)
*/
var Enemy = function() {

    this.sprite = 'images/enemy-bug.png';
    this.x = -100; // start off-screen: produces a nice smooth animation

    /*
    Randomly distribute starting enemies across three lines (y-position)
    Math.floor means there are three discrete options, one for each line
    */
    this.y = Math.floor((Math.random() * 3)) * 83 + 60;

    /*
    Randomise speed of bugs, depending on difficulty level defined
    'sqrt' is used to dampen effects of higher difficulty to ensure still playable, and still allow 'difficulty'  to be defined as an integer
    '+ 20' sets a minimum speed for bugs
    */
    this.speed = (Math.random() * 300 * (Math.sqrt(difficulty))) + 20;
};

/*
Update enemy position
dt parameter used to ensure speed is consistent for all devices
Triggered by main() in engine.js
*/
Enemy.prototype.update = function(dt) {

    this.x += (this.speed * dt); // 'normal' L-R movement

    if (this.x > 500) { // reset position when off to right of screen
        this.x = -100; 
        this.y = Math.floor((Math.random() * 3)) * 83 + 60; // re-randomise y position - same code as above

        // note speed not randmomised - remains the same - a deliberate design desision as results in better gameplay
    }
};

/*
Draw enemies on canvas
Triggered by main() in engine.js
*/
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
Class constructor for controllable player
Always start on same spot (bottom row middle)
*/
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 400; 
};

/*
Collision detection for enemies and when enter water
Both reset score to zero and reset player position to start
Triggered by main() in engine.js
*/
Player.prototype.update = function() {
    for (i = 0; i < difficulty * 3; i++) { // collisions with enemies
        if (this.x < allEnemies[i].x + 75 &&
        this.x > allEnemies[i].x - 60 &&
        this.y < allEnemies[i].y + 50 &&
        this.y > allEnemies[i].y - 50) {
            this.x = 202;
            this.y = 400;
            score = 0;
            console.log("HIT: Score reset to zero");
        }
    };

    if (this.y < 60) { // collisions with water
        this.x = 202;
        this.y = 400;
        score = 0;
        console.log("DUNKED: Score reset to zero");
    }
};

/*
Draw enemies on canvas
Triggered by main() in engine.js
*/
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/*
Accept input from document-wide EventListener
Triggered by EventListener
Secondary if statements used to prevent movement off playable area
*/
Player.prototype.handleInput = function(input) {
    if (input === "right") {
        if (this.x < 402) {
            this.x += 102;
        }
    }
    else if (input === "left") {
        if (this.x > 2) {
            this.x -= 102;
        }
    }
    else if (input === "up") { // Don't need secondary 'if' due to water reset functionality in player.prototype.update function
        this.y -= 85;
    }
    else if (input === "down") {
        if (this.y < 400) {
            this.y += 85;
        }
    }
};

/*
Gem constuctor
Gems are collected by the player to gain points
Single constructor used for three gem types
Gems vary on line which they spawn on, and points they are worth. Both defined here
*/
var Gem = function(colour) {

    this.x = Math.floor((Math.random() * 5)) * 102 + 18; // position on x-axis, same logic to enemy distribution on y-axis
    this.delayTimer = gemTimer; // start delayTimer value at a positive integer - this is needed for gem to spawn using .update method

    if (colour === 'blue') {
        this.sprite = 'images/Gem-Blue.png';
        this.y = 268; // all on bottom row
        this.points = 200;   
    }

    else if (colour === 'green'){
        this.sprite = 'images/Gem-Green.png';
        this.y = 185; // all on middle row
        this.points = 500;
    }

    else if (colour === 'orange'){
        this.sprite = 'images/Gem-Orange.png';
        this.y = 102; // all on top row
        this.points = 1000;
    }
};

/*
Draw gems on canvas
Cannot be generated unless delayTimer has increased to globl gemTimer variable
Triggered by main() in engine.js
*/
Gem.prototype.render = function() {
    if (this.delayTimer === gemTimer) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};
/*
Collision detection for gems
Triggered by main() in engine.js
*/
Gem.prototype.update = function() {
    if (this.x < player.x + 75 && // collisions with gems
    this.x > player.x - 60 &&
    this.y < player.y + 50 &&
    this.y > player.y - 10 &&
    this.delayTimer === gemTimer) {
        score += this.points; // add score depending on gem type
        this.x = Math.floor((Math.random() * 5)) * 102 + 18; // randomly spawn on x-axis
        this.delayTimer = 0; // set timer to zero so gem does not instantly spawn
        console.log("GEM: Score = " + score);
    }

    if (this.delayTimer < gemTimer) {
        this.delayTimer += 1; // increases delayTimer until at a level where Gem.render method can re-spawn gem (i.e. delayTimer === gemTimer)
    }
};

/*
Instantiate objects
Number of enemies dependent on difficulty level
Gems are separate - necessary as they have different properties e.g. points, y-location
Objects only instantiated once - respawn handled by update methods
*/
var player = new Player();

var allEnemies = [];
for (i = 0; i < difficulty * 3; i++) {
    allEnemies[i] = new Enemy();
};

var gemBlue = new Gem('blue');
var gemGreen = new Gem('green');
var gemOrange = new Gem('orange');

/*
Listed for key presses and send output to Player.handleInput method
*/
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
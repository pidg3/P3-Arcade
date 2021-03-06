'use strict'; 
/* App.js
Main game: defined gameplay, classes, methods and input
*/

/*
Variable difficulty levels. Must be an integer at least one. 
Incremented as levels are completed by achieving maxScore
Affects the following classes/methods:
* Enemy constructor: speed of bugs
* Instantiation of enemies (using allEnemies array)
* Player.update method: Collision detection (used allEnemies array)
*/
var level = 1;

/*
Track overall score
Displayed in top-left of canvas
*/
var score = 0;

/*
Score required to advance levels
*/
var maxScore = 5000;

/*
Set time for gem regeneration
Defined as global variable as used in Gem constructor and all methods
*/
var gemTimer = 100;

/*
Used to control game states. starter, play, gameover
Starter countdown coded in engine.js
*/
var gameState = 'starter';

/*
Controls number of extra lives remaining
Remains consistent across levels so defined globally
*/
var lives = 5;

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
    Randomise speed of bugs, depending on level
    'cbrt' is used to dampen effects of higher level to ensure still playable, and still allow 'level'  to be defined as an integer
    '+ 20' sets a minimum speed for bugs
    */
    this.speed = (Math.random() * 300 * (Math.cbrt(level))) + 20;
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
Both reset player position to start and remove a life
Triggered by main() in engine.js
*/
Player.prototype.update = function() {
    for (var i = 0; i < level * 2; i++) { // collisions with enemies
        if (this.x < allEnemies[i].x + 75 &&
        this.x > allEnemies[i].x - 60 &&
        this.y < allEnemies[i].y + 50 &&
        this.y > allEnemies[i].y - 50) {
            this.x = 202;
            this.y = 400;
            lives--;
        }
    }

    if (this.y < 60) { // collisions with water
        this.x = 202;
        this.y = 400;
        lives--;
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
    if (input === 'right' && this.x < 402) {
        this.x += 102;
    }
    else if (input === 'left' && this.x > 2) {
        this.x -= 102;
    }
    else if (input === 'up') { // Don't need && due to water reset functionality in player.prototype.update function
        this.y -= 85;
    }
    else if (input === 'down' && this.y < 400) {
        this.y += 85;
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
    }

    if (this.delayTimer < gemTimer) {
        this.delayTimer += 1; // increases delayTimer until at a level where Gem.render method can re-spawn gem (i.e. delayTimer === gemTimer)
    }
};

/*
Create variables in global namespace
Do NOT instantiate classes at this stage - this is done by newGame()
This is so new objects can be created for each level
*/
var player;
var allEnemies=[];
var gemBlue;
var gemGreen;
var gemOrange;

/* 
Instantiate objects for a level
Number of enemies dependent on level
Gems are separate - necessary as they have different properties e.g. points, y-location
Objects only instantiated once per game - in-game respawn handled by update methods
*/
function newGame() {
    player = new Player();

    for (var i = 0; i < level * 2; i++) {
        allEnemies[i] = new Enemy();
    }

    gemBlue = new Gem('blue');
    gemGreen = new Gem('green');
    gemOrange = new Gem('orange');

    /*
    Listen for key presses and send output to Player.handleInput method
    If statement means only called on level 1, to avoid duplication
    */
    if (level === 1) {
        /*
        Listen for key presses and send output to Player.handleInput method
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
    }

}


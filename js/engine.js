'use strict';
/* Engine.js
Provides the game loop functionality (update entities and render),
draws the initial game board on the screen, and then calls  update and
render methods on your player/enemy/gems/score - defined in your app.js
Engine is available globally via the Engine variable
*/

var Engine = (function(global) {

    var doc = global.document, // set up canvas
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime, // used to control timing
        starterCountdown = 5,
        countdownTimer; // used for starter screen

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /*
    Kickoff main game loop
    */
    function main() {

        /*
        Get time delta information, used to smooth animations and ensure
        consistent performance across devices
        */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* 
        Switch for gameState
        This is only place where this var is used
        */
        if (gameState === 'play') {

            /* 
            Call  update()/render(), pass time delta to update function 
            as used for smooth animation
            */
            updateEntities(dt); // needs to be invoked before render functions for smooth animations
            renderGame();

            /*
            Check to see if score has been achieved
            If yes, set gameState to 'starter' - in effect break the game loop
            Also increase level/reset score
            */
            if (score >= maxScore) {
                score = 0;
                level += 1;
                countdownTimer = 250;
                gameState = 'starter';
            }

            else if (lives === -1) {
                gameState = 'gameover';
            }
        }

        /*
        Call functions used to generate starter scree
        */
        else if (gameState === 'starter') {
            updateStarter(dt);
            renderStarter();
        }

        else if (gameState === 'gameover') {
            renderGameOver();
        }

        /* 
        Set  lastTime variable used to determine the time delta for the next
        function call
        */
        lastTime = now;



        /*
        Use the browser's requestAnimationFrame function to call this
        function again as soon as the browser is able to draw another frame.
        */
        win.requestAnimationFrame(main);
    }

    /* 
    Initial setup - only called once
    */
    function init() {
        lastTime = Date.now(); // for main() to determine initial time delta
        countdownTimer = 250;
        main();
    }

    /* 
    Called when gameState = play
    Called by the update() within main()  
    Calls all required update() methods in app.js
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
        gemBlue.update();
        gemGreen.update();
        gemOrange.update();

    }

    /* 
    Called when 'play' = true
    Render the game
    Called every loop of the game engine (same as update()) 
    */
    function renderGame() {

        ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas to title

        var rowImages = [ // generate game background
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* 
        Loop through of rows and columns defined above
        Use rowImages array to draw the correct image for that portion of the 'grid'
        */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
        renderScore();
    }

    /* 
    Called when 'gameState' = play
    Render enemies, player and gems
    Uses methods defined in app.js
    */
    function renderEntities() {

        allEnemies.forEach(function(enemy) { // loop through allEnemies array
            enemy.render();
        });

        player.render();

        gemBlue.render();
        gemGreen.render();
        gemOrange.render();

    }

    /*
    Called when 'play' = true
    Displays score in top left corner using canvas
    Displays lives in top right corner using canvas
    */
    function renderScore() {

        ctx.fillStyle = 'white';

        ctx.font = '30px calibri';

        ctx.fillText('Score:', 50, 85);
        ctx.fillText(score, 50, 118);

        ctx.fillText('Lives:', 456, 85);
        ctx.fillText(lives, 456, 118);
    }

    /*
    Called when 'play' = false
    Counts down to zero to drive starter screen
    When zero, sets 'play' = true and re-instantiates objects
    */
    function updateStarter(dt) {
        
        if (countdownTimer > 30) {
            countdownTimer -= 1;
            starterCountdown = Math.round(countdownTimer / 50);
        }

        else {
            gameState = 'play';
            newGame();
        }
    }

    /*
    Called when 'play' = false
    Draws starter screen
    */
    function renderStarter() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.textAlign= 'center'; 

        ctx.font = '80px calibri';
        ctx.fillText('DEBUGGER', canvas.width / 2, 100);

        ctx.font = '30px calibri';
        ctx.fillText('Level ' + level + ' starting in...', canvas.width / 2, 160);

        ctx.font = '180px impact';
        ctx.fillText(starterCountdown, canvas.width / 2, 340);

        ctx.drawImage(Resources.get('images/enemy-bug.png'), 85, 300); 
        ctx.drawImage(Resources.get('images/enemy-bug.png'), 205, 300);
        ctx.drawImage(Resources.get('images/enemy-bug.png'), 325, 300);

        ctx.font = '18px calibri'; // game instructions
        ctx.fillText('Use the arrow keys to move', canvas.width / 2, 490);
        ctx.fillText('Pick up gems to earn points', canvas.width / 2, 520);
        ctx.fillText('Avoid the bugs and the water', canvas.width / 2, 550);
        ctx.fillText('Get to ' + maxScore + ' points for the next level. Good luck!', canvas.width / 2, 580);

    }

    /*
    Render canvas for gameover state
    Currently no 'start again button' - need to refresh
    */
    function renderGameOver() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';

        ctx.font = '80px calibri';
        ctx.fillText('GAME OVER', canvas.width / 2, 120);

        ctx.font = '30px calibri';
        ctx.fillText('You reached level ' + level, canvas.width / 2, 250);

        ctx.drawImage(Resources.get('images/enemy-bug.png'), 85, 340);
        ctx.drawImage(Resources.get('images/enemy-bug.png'), 205, 340);
        ctx.drawImage(Resources.get('images/enemy-bug.png'), 325, 340);
    }

    /* 
    Load all images needed for game
    Uses resources.js image loading utility
    */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/Gem-Blue.png',
        'images/Gem-Green.png',
        'images/Gem-Orange.png'
    ]);

    Resources.onReady(init); // start game when images loaded

    /*
    Assign the canvas' context object to the global variable
    Facilitates ease of use in app.js
    */
    global.ctx = ctx;
})(this);
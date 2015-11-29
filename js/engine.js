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
        lastTime; // used to control timing

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
        Call  update()/render(), pass time delta to update function 
        as used for smooth animation
        */
        updateEntities(dt);
        render();

        /* 
        Set  lastTime variable used to determine the time delta for the next
        function  call
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
        main();
    }

    /* 
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
    Render the game
    Called every loop of the game engine (same as update()) 
    */
    function render() {

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
        Use rowImages array to draw the correct image for that portion of the "grid"
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
    Displays score in top left corner using canvas
    */
    function renderScore() {

        ctx.fillStyle = "white";

        ctx.font = "30px impact";
        ctx.fillText("Score:", 10, 85);

        ctx.font = "27px impact";
        ctx.fillText(score, 10, 118);

    };

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

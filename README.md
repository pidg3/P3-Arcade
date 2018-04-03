# Front-end Nanodegree Arcade Game: P3

__UPDATE April 18:__ I've removed most of my Nanodegree projects as I don't think they reflect my current level of experience. However I've left this one in for two reasons: 
- It's an interesting example of the 'old', prototypical way of doing Javascript - if you look at the code you'll see things like `Enemy.prototype.update = function(dt) {`: no sugary classes here!
- It's quite a fun little game...

This project is for P3 in the Udacity Nanodegree.

Repository was cloned from the main Udacity one: https://github.com/udacity/frontend-nanodegree-arcade-game

I've re-written the comments - I thought this would be helpful in making sure I understood what the Udacity code was doing, and the rubric seems to place a premium on well-written documentation. 

##How to play

Go to this link for GitHub hosted page: 
[pidg3.github.io/P3-Arcade](http://pidg3.github.io/P3-Arcade)

Arrow keys control the character
Earn points by collecting gems
Don't get hit by a bug or fall in the water, or you'll lose all your points
Get to 2,000 points to advance to the next level

That's about it at the moment - more features to come soon...

## Things to do to 'meet specification'

All done! (I think...)

## Ideas to 'exceed specification'

Some more things I'd like to do when I have time:

* Sound effects
* Selectable characters
* Mobile version

## DONE list

* Proper collision detection (i.e. reset)
* Reset when enter water
* Player cannot move off screen
* Gems
* Score system
* Selectable difficulty levels with title screen (using 'diff' var) - actually implemented as a level system which I quite like

## Known bugs

* If gem re-spawns on player tile, player will flicker. Minor and doesn't affect gameplay. TODO - add code to prevent re-spawn on player tile. 

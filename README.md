#Front-end Nanodegree Arcade Game: P3

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

##Things to do to 'meet specification'

* Better README: steps to run and play the game
* Better comments

##Ideas to 'exceed specification'

* Selectable difficulty levels with title screen (using 'diff' var)
* Sound effects
* Selectable characters

##DONE list

* Proper collision detection (i.e. reset)
* Reset when enter water
* Player cannot move off screen
* Gems
* Score system

##Known bugs

* If gem re-spawns on player tile, player will flicker. TODO - add code to prevent re-spawn on player tile. 
* Formatting of score doesn't work beyond 5 figs - timing to be implemented will make this unlikely to happen
/* UPDATED: added match fx and go away. still need timer, counter, refresh */
/*
Help from:
https://tiny.cc/MemoryGameResources
Matt C tutuorial and Mike W webinar
For modal using:
sweetalert
https://lipis.github.io/bootstrap-sweetalert/
*/
/*
 * Create a list that holds all of your cards
 */
var cards = ['fa-diamond', 'fa-diamond',
				 'fa-paper-plane-o', 'fa-paper-plane-o',
				 'fa-anchor', 'fa-anchor',
				 'fa-bolt', 'fa-bolt', 
				 'fa-cube', 'fa-cube',
				 'fa-bomb', 'fa-bomb',
				 'fa-leaf', 'fa-leaf',
				 'fa-bicycle', 'fa-bicycle',
				 ];	
//going to add data-card attribute 45:44

function generateCard(card) {
	return `<li class='card' data-card='${card}'><i class='fa ${card}'></i></li>`;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//global variables
let deck = document.querySelector('.deck');
let openCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
//track matched cards
//****REMEMBER TO CHANGE BK--TESTING
let matched = 7;
//eval if 8 pairs to win game
let allMatch = 8;
// selects restart game not sure if add here
let restartGm = document.querySelector('.restart');
//for clock
let clock = document.querySelector('.clock');



//So need to dynamically generate cards

function initGame() {
	var deck = document.querySelector('.deck');
	var cardHTML = shuffle(cards).map(function(card) {
		return generateCard(card);
	});
	
	deck.innerHTML = cardHTML.join('');
	
}
initGame();
startClock();

//game timer function 
function startClock() {
	clockId = setInterval(() => {
		time++;
		displayTime();
		//console.log(time);
	}, 1000);
}

//display clock
function displayTime() {
	
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;
	//seeing if help clock display on modal
	clock.innerHTML = time;

		if (seconds < 10) {
	clock.innerHTML = `${minutes}:0${seconds}`;
}	else {
	clock.innerHTML = `${minutes}:${seconds}`;
}	
	//console.log(clock);
/*took this out and time show up correctly
so I put it above the if statement?*/
//clock.innerHTML = time;
}
//moved below and it stops time now
displayTime();

/*if I move allCards and openCard
to global it will not flip*/ 
let allCards = document.querySelectorAll('.card');
/*
let openCards = [];
*/
allCards.forEach(function(card) {
	card.addEventListener('click', function(e) {

		if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match')) {
			openCards.push(card);
			card.classList.add('open', 'show');

/*add moves and check stars here?? 
if a match is made, adds to move count*/
      		addMove();
			checkScore();

		//check	if they match inside fx 
	    if (openCards.length == 2) {
				if (openCards[0].dataset.card == openCards[1].dataset.card) {
					openCards[0].classList.add('match');
					openCards[0].classList.add('open');
					openCards[0].classList.add('show');

					openCards[1].classList.add('match');
					openCards[1].classList.add('open');
					openCards[1].classList.add('show');

					openCards = [];		
/*Not sure if this goes here, trying to trigger gameover*/
					matched++;
				if (matched === allMatch) {
					endGame();
					console.log("game over!");
				}					
			}	else {	

		//if no match, hide 		
				setTimeout(function() {
					openCards.forEach(function(card) {
					card.classList.remove('open', 'show');
				});	

				openCards = [];	
			}, 1000);
		}
	}
	}		
	});
});
//stop clock
function stopClock() {
/*stop clock, but not clearing it*/	
  clearInterval(clockId);
}

//Restart game button 
restartGm.addEventListener('click', gameReset);

//Resets the game
function gameReset() {
  moves.innerHTML = "";
  window.location.reload();
}

//add moves
function addMove() {
    moves++;
    const moveNum = document.querySelector('.moves');
    moveNum.innerHTML = moves;
}

//remove stars based on move counts
function checkScore() {
    if(moves === 12 || moves === 24)  {
        hideStar();
    }
}
/* 
Trying to get stars to wk in modal
Below (const stars) only works inside fx, outside it moves star count up and modal
does not show up
const stars = document.querySelectorAll('.stars li');
--adding finalStars-- here to get finalStar number to show up correctly--
*/
function hideStar() {
    const stars = document.querySelectorAll('.stars li');
    for (star of stars){
        if (star.style.display !== 'none') {
            star.style.display = 'none';
		finalStars--;//decrease count of stars after hiding	
            	break;
        }
    }
}

function gameOver() {
    stopClock();
}

/*trying to get the clock and stars in the modal, 
have to figure out how to grab the data and have it shown in modal*/
function finalTime() {
	const endTime = document.querySelector('.clock');
	/*not sure if above will show time correctly trying to show
	the min and sec so added the .innerHTML to the end
	.innerHTML = `${minutes}:${seconds}`;*/
	//Below helps display time on modal
	endTime.innerHTML = time;
	
}
/*Tyring to get final stars -- stars is not defined! 
const finalStars = document.querySelectorAll('.stars li');
finalStars.innerHTML = `Stars = ${stars}`;
*/
/*
only working in modal if I set finalStars outside of function, if I don't
the modal does not show up--Prob only grabbing what its set to ex:
let finalStars=3; It always comes up as three not the count of stars.
*/
let finalStars = 3;
 function starCount() {
    findStars = document.querySelectorAll('.stars li');
    //finalStars = 0;// testing without this to see if can have final stars show up correctly
    for (findStar of findStars) {
      if (findStar.style.display !== 'none') {
        finalStars++;
        officialStars.innerHTML = `Stars: ${finalStars}`;
        console.log(finalStars);
      }
    }
  }
/* I think that I need to select score-panel and then use the innerHTML on stars?*/
/*trying to test 
wks when cards are all matched by itself but will not work 
inside gameOver fx*/
/* testing */
function endGame() {
  stopClock();
  swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations! You Won!',
    /*trying to get stars to wk*/
    text: 'With ' + moves + ' Moves and ' + finalStars + ' Star Rating\n Plus ' + time + ' Seconds on the Clock.\n Great job!' ,
		type: 'success',
    confirmButtonColor: '#02ccba',
		confirmButtonText: 'Play Again!'
	})
}

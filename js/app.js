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

//added data-card attribute from video
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
let matched = 0;
//eval if 8 pairs to win game
let allMatch = 8;
// selects restart game 
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
	clock.innerHTML = time;

		if (seconds < 10) {
	clock.innerHTML = `${minutes}:0${seconds}`;
}	else {
	clock.innerHTML = `${minutes}:${seconds}`;
}	

}
//moved below and it stops time now
displayTime();

let allCards = document.querySelectorAll('.card');

allCards.forEach(function(card) {
	card.addEventListener('click', function(e) {

		if (!card.classList.contains('open') && !card.classList.contains('show') && !card.classList.contains('match') && openCards.length <= 1) {
			openCards.push(card);
			card.classList.add('open', 'show');

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
    if(moves === 20 || moves === 32)  {
        hideStar();
    }
}

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

function finalTime() {
	const endTime = document.querySelector('.clock');
	//Below helps display time on modal
	endTime.innerHTML = time;
}

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

function endGame() {
  stopClock();
  swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'Congratulations! You Won!',
    text: 'With ' + moves + ' Moves and ' + finalStars + ' Star Rating\n Plus ' + time + ' Seconds on the Clock.\n Great job!' ,
		type: 'success',
    confirmButtonColor: '#02ccba',
		confirmButtonText: 'Play Again!'
	}).then(function(isConfirm) {
		if (isConfirm) {
			gameReset();
		}
	});
}

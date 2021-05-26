const gameContainer = document.getElementById("game");
localStorage.setItem('highscore', '0');
let scores = [];

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// create a 'color lookup' for each div, key will be each div's eventual id
let coloredDivs = {};

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createcoloredDivsForColors(colorArray) {
  // initialize a counter variable to use when setting the id / lookup keys
  let i = 0;
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.classList.toggle(color);
    // give each div a unique id and set the coloredDivs lookup at that id, equal to the color
    newDiv.id = 'a' + i;
    coloredDivs['a'+i] = color;
    i++

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

let ids = [];
// ids is an array that is used to store div ids for comparison
let count = 0;
// count is used to determine if we have two cards turned over. If count is even,
// we know there are two cards that are turned over.
let checkingCards = false;
// checkingCards is a boolean. It is used to check to see if there are two cards already
// turned over. If there are, we return and don't allow the color change, UNLESS there's 
// a match. In that case, we continue to allow clicks to generate color changes.

// TODO: Implement this function!
function handleCardClick(event) {
  if (checkingCards) {
      checkingCards = false;
      return;
  };
  // you can use event.target to see which element was clicked

  // set the background color on click, even though the class is toggled off initially
  event.target.style.backgroundColor = coloredDivs[event.target.id];
  count++
  
  if (count % 2 === 0) {
      checkingCards = true;

      // card2: ids are being saved on each click. Here, we are taking the last id saved, which
      // would be the previous card that was selected. 
      
      let card1 = document.querySelector(`#${event.target.id}`);
      let card2 = document.querySelector(`#${ids.slice(-1)[0]}`);
      card1.classList.toggle(coloredDivs[card1.id]);
      card2.classList.toggle(coloredDivs[card2.id]);

      // handling the case where a user clicks the same card twice. A second click will
      // now remove the color from the card, allowing the user to select two new cards.
      if (card1 === card2) {
          card1.classList.toggle(coloredDivs[event.target.id]);
          card1.style.backgroundColor = '';
          card2.classList.toggle(coloredDivs[card2.id]);
          card2.style.backgroundColor = '';
      };

      // we then compare the two cards and, if their colors are the same, leave them alone.
      // if not, we use set timeout (set to 1s) to change all background-color related aspects.
      if (coloredDivs[card1.id] === coloredDivs[card2.id]) {
          checkingCards = false;
          changeScore(card1, card2, madeMatch = true);
      } else {
          setTimeout(() => {
              card1.classList.toggle(coloredDivs[event.target.id]);
              card1.style.backgroundColor = '';
              card2.classList.toggle(coloredDivs[card2.id]);
              card2.style.backgroundColor = '';
              checkingCards = false;
          },1000);
          changeScore(card1, card2);
      };
  }; 
  // push the event.target's id to the array to use for comparison later
  ids.push(event.target.id);
};

// selecting the elements needed for the code below
const startButton = document.querySelector('#start');
const restartButton = document.querySelector('#restart');
const gameDiv = document.querySelector('#game');
const scoreBoard = document.querySelector('h4');
const highScore = document.querySelector('#leader');
const newHighScore = document.querySelectorAll('.msg');
const h4Message = document.querySelector('#winningMessage');
h4Message.style.display = 'none';

// add a start button that creates the divs for the game when clicked
startButton.addEventListener('click', () => {
    if (gameDiv.childElementCount === 0) {
        createcoloredDivsForColors(shuffledColors);
    };
});

// add a restart button that will restart the game whenever the user clicks it
// also triggers the messaging at the top to change
restartButton.addEventListener('click', () => {
    if (gameDiv.childElementCount === 10) {
        let shuffleAgain = shuffle(COLORS);
        gameDiv.innerHTML = '';
        createcoloredDivsForColors(shuffleAgain);
        scoreBoard.innerText = 'Your Score: 0';
        h4Message.style.display = 'none';
    };
});

// add a little pizzaz to the new high score message!
function RGB() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`
};

setInterval(() => {
    for (let letter of newHighScore) {
        letter.style.color = RGB();
    }
}, 500);


// this function serves to update the current score and high score
function changeScore(firstCard, secondCard, madeMatch = false) {
    if (firstCard === secondCard) {
        return;
    }
    let score = parseInt(scoreBoard.innerText.split(': ')[1])
    if (!madeMatch) {
        score -= 20;
    } else {
        score += 100;
    };
    scoreBoard.innerText = `Your Score: ${score}`;
    scores.push(score);
    let currentScore = scores.slice(-1)[0];
    let highestScore = parseInt(localStorage.getItem('highscore'));
    
    if (currentScore > highestScore) {
        highScore.innerText = 'High Score: ' + currentScore.toString();
        localStorage.setItem('highscore', currentScore);
        h4Message.style.display = 'block';
    };
};



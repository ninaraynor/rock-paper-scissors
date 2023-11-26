/*----- constants -----*/
const AUDIO = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3');
const RPS_LOOKUP = {
    r: {img: 'imgs/rock.png', beats: 's'},
    p: {img: 'imgs/paper.png', beats: 'r'},
    s: {img: 'imgs/scissors.png', beats: 'p'}
};

/*----- app's state (variables) -----*/
let scores; // object 'p' /> player; 't' -> tie score; 'c' -> computer

let results; // object key of 'p' for players...
                // values of 'r' for rock, 's' for scissors, 'p' for paper
let winner; // string 'p' if player wins; 't' for tie, 'c' for computer if wines

/*----- cached element references -----*/
const pResultEl = document.getElementById('p-result');
const cResultEl = document.getElementById('c-result');
const countdownEl = document.getElementById('countdown');

/*----- event listeners -----*/
document.querySelector('main')
.addEventListener('click', handleChoice);

/*----- functions -----*/
init();

// initialize all state, then call render();
function init() {
    scores = {
        p: 0,
        t: 0,
        c: 0,
    };
    results = {
        p: 'r',
        c: 'r',
    };
    winner = 't';
    render();
}

// in response to user interaction (player makes a move), 
// we update all impacted state, then finally call render
function handleChoice (evt) {
    // guard: (do nothing unless one of the three buttons were clicked)
    if (evt.target.tagName !== 'BUTTON') return;
    // player has made a choice:
    results.p = evt.target.innerText.toLowerCase();
    // computer a random choice for the computer:
    results.c = getRandomRPS();
    // update winner
    winner = getWinner();
    scores[winner]+= 1;
    render();
}

function getWinner() {
    if (results.p === results.c) return 't';
    // if what the player has beats what the computer has, player has won
    return RPS_LOOKUP[results.p].beats === results.c ? 'p' : 'c';
}


function getRandomRPS() {
    const rps = Object.keys(RPS_LOOKUP);
    // generate random index:
    const rndIdx = Math.floor(Math.random() * rps.length);
    // return one of 3 elements from rps array:
    return rps[rndIdx];
}

function renderScores() {
    for (let key in scores) {
        const scoreEl = document.getElementById(`${key}-score`);
        scoreEl.innerText = scores[key];
    }
}

function renderResults() {
    pResultEl.src = RPS_LOOKUP[results.p].img;
    cResultEl.src = RPS_LOOKUP[results.c].img;
    pResultEl.style.borderColor = winner === 'p' ? 'grey' : 'white';
    cResultEl.style.borderColor = winner === 'c' ? 'grey' : 'white';
}

// transfer/visualize to DOM
function render() {
    renderCountdown(function() {
    renderScores();
    renderResults();
    });
}

function renderCountdown(cb) {
    let count = 3;
    // audio longer than 3 seconds so must be reset (issue in DOM)
    AUDIO.currentTime = 0;

    AUDIO.play();
    countdownEl.style.visibility = 'visible';
    countdownEl.innerText = count;
    const timerID = setInterval(function() {
        count--;
        if (count) {
            countdownEl.innerText = count;  
         } else {
            clearInterval(timerID);
            countdownEl.style.visibility = 'hidden';
            cb();
        }
    }, 1000);
}
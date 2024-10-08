// Game Sounds
const gameMusic = new Audio('music/music.mp3');
const foodSound = new Audio('music/food.mp3');
const moveSound = new Audio('music/move.mp3');
const gameOverSound = new Audio('music/gameover.mp3');

// Get elements
const gameStartUi = document.querySelector('.game-start-ui');
const playGameBtn = document.querySelector('#playGame');
const currentScore = document.querySelector('#currentScore span');
const currentHighScore = document.querySelector('#currentHighScore span');
const gameBoard = document.querySelector('#gameBoard');
const gameContainer = document.querySelector('.game-container');
const gameOverUi = document.querySelector('.game-over-ui');
const OverGameScore = document.querySelector('#OverGameScore span');
const OverHighScore = document.querySelector('#OverHighScore span');
const playAgainBtn = document.querySelector('#playAgain')

const snakeSize = document.querySelector('.snake-size');

// Mobile Controls buttons
const leftBtn = document.querySelector('#leftBtn');
const rightBtn = document.querySelector('#rightBtn');
const upBtn = document.querySelector('#upBtn');
const downBtn = document.querySelector('#downBtn');

// Game Size
let boxSize = snakeSize.offsetWidth;
let gameSize = gameBoard.offsetWidth;

// Initialize game variables
let snake = [{ x: 10 * boxSize, y: 10 * boxSize }];
let food = generateFood();
let direction = null;
let score = 0;
let highScore = document.cookie;
let isGameOver = true;

// Game Start Function
playGameBtn.addEventListener('click', playGame);
function playGame() {
    gameStartUi.classList.add('hide');
    gameContainer.classList.add('show');
    isGameOver = false;
    gameMusic.play();
    direction = 'UP';
    currentHighScore.innerText = highScore;
}

// Generate Food On random position
function generateFood() {
    return {
        x: Math.floor(Math.random() * (gameSize / boxSize)) * boxSize,
        y: Math.floor(Math.random() * (gameSize / boxSize)) * boxSize
    }
}

// Function of set direction
document.addEventListener('keydown', setDirection);
function setDirection(event) {
    if (isGameOver != true) {
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            moveSound.play();
        }
    } else {
        moveSound.pause();
    }
    if (event.keyCode == 37 && direction != 'RIGHT') direction = 'LEFT';
    if (event.keyCode == 38 && direction != 'DOWN') direction = 'UP';
    if (event.keyCode == 39 && direction != 'LEFT') direction = 'RIGHT';
    if (event.keyCode == 40 && direction != 'UP') direction = 'DOWN';
}
leftBtn.addEventListener('click', () => { direction = 'LEFT'; moveSound.play(); });
upBtn.addEventListener('click', () => { direction = 'UP'; moveSound.play(); });
rightBtn.addEventListener('click', () => { direction = 'RIGHT'; moveSound.play(); });
downBtn.addEventListener('click', () => { direction = 'DOWN'; moveSound.play(); });


// Function draw snake and food
function draw() {
    gameBoard.innerText = '';
    snake.forEach(segment => {
        const snakeElement = document.createElement('div');
        snakeElement.style.left = `${segment.x}px`;
        snakeElement.style.top = `${segment.y}px`;
        snakeElement.classList.add('snake');
        gameBoard.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.left = `${food.x}px`;
    foodElement.style.top = `${food.y}px`;
    foodElement.classList.add('food');
    gameBoard.appendChild(foodElement);
}

function update() {
    if (!direction) return;

    let snakeHead = { ...snake[0] };

    if (direction == 'LEFT') snakeHead.x = snakeHead.x - boxSize;
    if (direction == 'UP') snakeHead.y = snakeHead.y - boxSize;
    if (direction == 'RIGHT') snakeHead.x = snakeHead.x + boxSize;
    if (direction == 'DOWN') snakeHead.y = snakeHead.y + boxSize;

    if (snakeHead.x == food.x && snakeHead.y == food.y) {
        foodSound.play();
        score++;
        currentScore.innerText = score;
        food = generateFood();
        if (score > highScore) {
            highScore = document.cookie = `${score}`;
        }
        currentHighScore.innerText = document.cookie;
    } else {
        snake.pop();
    }


    if (
        snakeHead.x < 0 || snakeHead.y < 0 || snakeHead.x >= gameSize || snakeHead.y >= gameSize
        || snake.some(segment => segment.x == snakeHead.x && segment.y == snakeHead.y)
    ) {
        gameOver();
    }

    snake.unshift(snakeHead);
    draw();
}

let game;
function gameStart() {
    return game = setInterval(update, 150);
}
gameStart();

function gameOver() {
    gameOverSound.play();
    gameMusic.pause();
    clearInterval(game);
    isGameOver = true;
    gameOverUi.classList.add('showGameOver')
    gameContainer.classList.add('hide');
    OverGameScore.innerText = score;
    OverHighScore.innerText = highScore;
}

playAgainBtn.addEventListener('click', playAgainGame);

function playAgainGame() {
    gameOverUi.classList.remove('showGameOver');
    gameContainer.classList.remove('hide');
    gameMusic.play();
    isGameOver = false;
    score = 0;
    currentScore.innerText = score;
    gameStart();
    snake = [{ x: 10 * boxSize, y: 10 * boxSize }];
    direction = 'UP';
}
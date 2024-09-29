document.addEventListener('DOMContentLoaded', function () {
    const gameBoard = document.getElementById('game-board');
    const currentScoreElement = document.getElementById('current-score');
    const startMessage = document.getElementById('start-message');

    const boardSize = 20;
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 5, y: 5 };
    let direction = { x: 0, y: 0 };
    let nextDirection = null;
    let score = 0;
    let speed = 300;
    let interval = null;
    let gameStarted = false;

    function drawBoard() {
        gameBoard.innerHTML = '';
        for (let i = 0; i < boardSize * boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('game-cell');
            gameBoard.appendChild(cell);
        }
    }

    function updateSnake() {
        if (!nextDirection) return;

        direction = nextDirection;
        const newHead = {
            x: snake[0].x + direction.x,
            y: snake[0].y + direction.y,
        };

        if (newHead.x < 0 || newHead.x >= boardSize || newHead.y < 0 || newHead.y >= boardSize || snake.some(part => part.x === newHead.x && part.y === newHead.y)) {
            clearInterval(interval);
            handleGameOver();
            return;
        }

        snake.unshift(newHead); // Add new head to the snake

        // Check if the snake eats the food
        if (newHead.x === food.x && newHead.y === food.y) {
            score += 10;
            updateScore();
            spawnFood(); // Spawn new food
        } else {
            snake.pop(); // Remove the last segment if not eating
        }

        drawSnake();
        drawFood();
    }

    function drawSnake() {
        const cells = document.querySelectorAll('.game-cell');
        cells.forEach(cell => cell.classList.remove('snake'));
        snake.forEach(part => {
            const index = part.y * boardSize + part.x;
            cells[index].classList.add('snake');
        });
    }

    function drawFood() {
        const cells = document.querySelectorAll('.game-cell');
        cells.forEach(cell => cell.classList.remove('food')); // Clear previous food
        const index = food.y * boardSize + food.x;
        cells[index].classList.add('food'); // Draw new food
    }

    function spawnFood() {
        do {
            food.x = Math.floor(Math.random() * boardSize);
            food.y = Math.floor(Math.random() * boardSize);
        } while (snake.some(part => part.x === food.x && part.y === food.y)); // Ensure food does not spawn on the snake
    }

    function updateScore() {
        currentScoreElement.textContent = `Score: ${score}`;
    }

    function increaseSpeed() {
        speed = Math.max(100, speed - 20);
        clearInterval(interval);
        interval = setInterval(updateSnake, speed);
    }

    function changeDirection(event) {
        if (!gameStarted) {
            startGame(event); // Start the game on first arrow key press
            return;
        }

        switch (event.key) {
            case 'ArrowUp':
                if (direction.y === 0) nextDirection = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
                if (direction.y === 0) nextDirection = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
                if (direction.x === 0) nextDirection = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
                if (direction.x === 0) nextDirection = { x: 1, y: 0 };
                break;
        }
    }

    function handleGameOver() {
        alert('Game Over! Your score: ' + score);
        resetGame();
    }

    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        direction = { x: 0, y: 0 };
        nextDirection = null;
        score = 0;
        speed = 300;
        gameStarted = false;
        updateScore();
        spawnFood();
        drawSnake();
        drawFood();
        startMessage.style.display = 'block'; // Show start message
    }

    function startGame(event) {
        if (!gameStarted) {
            gameStarted = true;
            startMessage.style.display = 'none';
            interval = setInterval(updateSnake, speed);
            changeDirection(event); // Set the initial direction based on the key pressed
        }
    }

    document.addEventListener('keydown', changeDirection);
    drawBoard();
    spawnFood();
    drawSnake();
    drawFood();
});

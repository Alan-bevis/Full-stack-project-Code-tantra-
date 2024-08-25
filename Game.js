document.addEventListener('DOMContentLoaded', () => {
    const cells = document.querySelectorAll('.cell');
    const player1ImageOptions = document.getElementById('player1-image-options');
    const player2ImageOptions = document.getElementById('player2-image-options');
    const computerImageOptions = document.getElementById('computer-image-options');
    const startGameBtn = document.getElementById('lets-begin-game');
    const restartBtn = document.getElementById('restart-btn');
    const backBtn = document.getElementById('back-btn');
    const statusDisplay = document.getElementById('game-status');
    const randomImageBtn = document.getElementById('random-image');
    const playVsComputerBtn = document.getElementById('play-vs-computer');
    const playVsPlayerBtn = document.getElementById('play-vs-player');

    const imageURLs = [
        'X.png','O.png','antman.png','captain.jpeg','falcon.jpeg','hulk.jpeg','ironman.png','panther.png','spider.jpeg','thor.png','wanda.jpeg','widow.png'
    ];

    let player1Image = '';
    let player2Image = '';
    let computerImage = '';
    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let isVsComputer = false;

    // Update the image options
    const updateImageOptions = () => {
        const imageOptionsHTML = imageURLs.map(url =>
            `<img src="${url}" alt="Image" data-image="${url}">`
        ).join('');
        player1ImageOptions.innerHTML = imageOptionsHTML;
        player2ImageOptions.innerHTML = imageOptionsHTML;
        computerImageOptions.innerHTML = imageOptionsHTML;
    };

    // Select an image for player or computer
    const selectImage = (event) => {
        if (event.target.tagName === 'IMG') {
            const selectedImage = event.target.dataset.image;
            if (event.target.closest('#player1-image-options')) {
                player1Image = selectedImage;
                updateSelectedImage('#player1-image-options', selectedImage);
            } else if (event.target.closest('#player2-image-options')) {
                player2Image = selectedImage;
                updateSelectedImage('#player2-image-options', selectedImage);
            } else if (event.target.closest('#computer-image-options')) {
                computerImage = selectedImage;
                updateSelectedImage('#computer-image-options', selectedImage);
            }
        }
    };

    // Update the selected image's border
    const updateSelectedImage = (selector, selectedImage) => {
        document.querySelectorAll(`${selector} img`).forEach(img => {
            img.classList.toggle('selected', img.dataset.image === selectedImage);
        });
    };

    // Initialize the game board
    const initializeGame = () => {
        cells.forEach(cell => {
            cell.style.backgroundImage = '';
            cell.classList.remove('taken');
        });
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        updateStatusDisplay();
    };

    // Update the status display
    const updateStatusDisplay = () => {
        if (isVsComputer) {
            statusDisplay.textContent = currentPlayer === 'X' ? "Player 1's turn" : "Computer's turn";
        } else {
            statusDisplay.textContent = currentPlayer === 'X' ? "Player 1's turn" : "Player 2's turn";
        }
    };

    // Handle cell click
    const handleCellClick = (event) => {
        const clickedCell = event.target;
        const clickedCellIndex = clickedCell.dataset.index;

        if (gameBoard[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameBoard[clickedCellIndex] = currentPlayer;
        clickedCell.style.backgroundImage = `url(${currentPlayer === 'X' ? player1Image : isVsComputer ? computerImage : player2Image})`;
        clickedCell.classList.add('taken');

        if (checkWinner()) {
            gameActive = false;
            statusDisplay.textContent = currentPlayer === 'X' ? "Player 1 Wins!" : isVsComputer ? "Computer Wins!" : "Player 2 Wins!";
        } else if (gameBoard.includes('')) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatusDisplay();
            if (isVsComputer && currentPlayer === 'O') {
                setTimeout(computerMove, 500);
            }
        } else {
            gameActive = false;
            statusDisplay.textContent = "It's a Draw!";
        }
    };

    // Computer move
    const computerMove = () => {
        let availableCells = [];
        gameBoard.forEach((cell, index) => {
            if (cell === '') {
                availableCells.push(index);
            }
        });

        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        gameBoard[randomIndex] = 'O';
        cells[randomIndex].style.backgroundImage = `url(${computerImage})`;
        cells[randomIndex].classList.add('taken');

        if (checkWinner()) {
            gameActive = false;
            statusDisplay.textContent = "Computer Wins!";
        } else if (gameBoard.includes('')) {
            currentPlayer = 'X';
            updateStatusDisplay();
        } else {
            gameActive = false;
            statusDisplay.textContent = "It's a Draw!";
        }
    };

    // Check for a winner
    const checkWinner = () => {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
        });
    };

    // Handle game start
    startGameBtn.addEventListener('click', () => {
        document.getElementById('game-mode').classList.add('hidden');
        document.getElementById('image-selection').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        initializeGame();
    });

    // Handle play vs computer
    playVsComputerBtn.addEventListener('click', () => {
        isVsComputer = true;
        document.getElementById('game-mode').classList.add('hidden');
        document.getElementById('computer-selection').classList.remove('hidden');
        document.getElementById('player-selection').classList.remove('hidden');
        document.getElementById('player2-selection').classList.add('hidden');
        document.getElementById('image-selection').classList.remove('hidden');
    });

    // Handle play vs player
    playVsPlayerBtn.addEventListener('click', () => {
        isVsComputer = false;
        document.getElementById('game-mode').classList.add('hidden');
        document.getElementById('computer-selection').classList.add('hidden');
        document.getElementById('player-selection').classList.remove('hidden');
        document.getElementById('player2-selection').classList.remove('hidden');
        document.getElementById('image-selection').classList.remove('hidden');
    });

    // Handle image selection
    player1ImageOptions.addEventListener('click', selectImage);
    player2ImageOptions.addEventListener('click', selectImage);
    computerImageOptions.addEventListener('click', selectImage);

    // Handle random image selection for computer
    randomImageBtn.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * imageURLs.length);
        computerImage = imageURLs[randomIndex];
        updateSelectedImage('#computer-image-options', computerImage);
    });

    // Handle cell clicks
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));

    // Handle restart button
    restartBtn.addEventListener('click', initializeGame);

    // Handle back button
    backBtn.addEventListener('click', () => {
        document.getElementById('game-container').classList.add('hidden');
        document.getElementById('image-selection').classList.remove('hidden');
        initializeGame();
    });

    // Initialize the image options on page load
    updateImageOptions();
});

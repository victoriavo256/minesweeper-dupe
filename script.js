// create 2d array of tiles in a 10 x 10 grid
let board = [];
const size = 10
const numBombs = 10;
const directions = [
    [-1,-1], [-1,0], [-1,1],
    [0,-1],          [0,1],
    [1,-1],  [1,0],  [1,1]
];
// keeps track of number of revealed tiles - if >= (size * size) - numBombs, game ends
let revealedTiles = 0;

function initializeBoard() {
    // hide game over texts
    document.getElementById("win-lose-text").classList.add('hidden');
    document.getElementById("score-text").classList.add('hidden');
    document.getElementById("play-again-btn").classList.add('hidden');

    // clear board
    board = Array(size).fill().map(() => Array(size).fill(0));
    /*board = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];*/
    revealedTiles = 0;
    let placedBombs = 0;
    
    // randomly populate grid with 10 bombs
    while (placedBombs < numBombs) {
        let row = Math.floor(Math.random() * size);  // randomly generates row number from 0 to 9
        let col = Math.floor(Math.random() * size);  // randomly generates col number from 0 to 9
        if (board[row][col] === 0) {
            board[row][col] = -1;     // this tile is now a bomb (-1)
            placedBombs += 1;
        } 
    }

    // fill in non-bomb tiles with the number of bombs in their proximity
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] != -1) {  // tile is not a bomb
                
                let nearbyBombs = 0;

                // check each direction in tile's proximity for bombs
                for (let [dx,dy] of directions) {
                    let newRow = row+dx;
                    let newCol = col+dy;
                    if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                        // array indexes are valid
                        if (board[newRow][newCol] === -1) {
                            nearbyBombs++;
                        }
                    }
                }

                // update 2d array tile with number of bombs
                board[row][col] = nearbyBombs;
            }
        }
    }

    displayBoard();
}

function displayBoard() {
    const gridContainer = document.getElementById("board");
    gridContainer.innerHTML = '';  // clear the board before populating it

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            // create grid item
            const tile = document.createElement("div");
            tile.className = "grid-item";
            tile.dataset.row = row;
            tile.dataset.col = col;
            tile.dataset.value = board[row][col];

            // assign light or dark green color for checkered board pattern
            if ((row%2 === 0 && col%2 === 0) || (row%2 === 1 && col%2 === 1)) {
                tile.classList.add("grid-item-light");
            } else {
                tile.classList.add("grid-item-dark");
            }

            // when clicked, reveals bomb or number of nearby bombs
            tile.addEventListener("click", () => {
                revealTiles(tile);
            });

            // add grid item to grid container
            gridContainer.appendChild(tile);
        }
    }
}

// recursive function
function revealTiles(tile) {
    const row = Number(tile.dataset.row);
    const col = Number(tile.dataset.col);
    const value = Number(tile.dataset.value);

    if (tile.classList.contains('revealed')) {
        return;
    }

    tile.classList.add('revealed');
    revealedTiles++;

    if (value === -1) {     // is a bomb
        tile.innerHTML = '💣';
        tile.style.backgroundColor = 'red';
        gameOver('lose');
    } else if (value > 0) { // has nearby bombs
        tile.innerHTML = value;
        tile.style.color = getTextColor(value);   
    } else {                // empty tile (recursively reveals nearby tiles!)
        for (let [dx,dy] of directions) {
            let newRow = row + dx;
            let newCol = col + dy;
            if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size) {
                const adjTile = document.querySelector(`.grid-item[data-row='${newRow}'][data-col='${newCol}']`);
                if (adjTile) {
                    revealTiles(adjTile);
                }
                
            }
        }
    }

    // assign light or dark brown color for checkered board pattern 
    if (tile.dataset.value != -1) {    // bomb tiles are red
        if (tile.classList.contains('grid-item-light')) {
            tile.style.backgroundColor = 'rgb(255, 242, 171)';    // light
        } else {
            tile.style.backgroundColor = 'rgb(247, 207, 121)';    // dark
        }
    }
    
    if (revealedTiles === (size * size) - numBombs) {
        gameOver('win');
    }
}

function getTextColor(num) {
    switch(num) {
        case 1:
            return 'darkblue';
        case 2:
            return 'darkgreen';
        case 3:
            return 'darkred';
        case 4:
            return 'darkorchid';
        case 5:
            return 'darkorange';
        case 6:
            return 'darkcyan';
        case 7:
            return 'darkpink';
        case 8:
            return 'darkolivegreen';
        case 9:
            return 'darkslategrey';
    }
}

function gameOver(winOrLose) {
    // left side of screen: "you win" or "you lose" text
    const winLose = document.getElementById("win-lose-text");
    winLose.classList.remove('hidden');
    if (winOrLose === 'win') {
        winLose.textContent = 'You Win!';
    } else {
        winLose.textContent = 'Game Over :(';
    }

    // right side of screen: score + stats
    const score = document.getElementById("score-text");
    score.classList.remove('hidden');
    score.textContent = "Your score is lorem ipsum."

    document.getElementById('play-again-btn').classList.remove('hidden');
}

// BUTTONS

document.getElementById('play-again-btn').addEventListener('click', function() {
    initializeBoard();
});

function switchScreens(fromScreen, toScreen) {
    document.getElementById(fromScreen).classList.add('hidden');
    document.getElementById(toScreen).classList.remove('hidden');
}

document.getElementById('start-game-btn').addEventListener('click', function() {
    switchScreens('start-screen', 'game-screen');
    initializeBoard();
});

document.getElementById('home-to-rules-btn').addEventListener('click', function() {
    switchScreens('start-screen', 'rules-screen');
});


document.getElementById('rules-to-home-btn').addEventListener('click', function() {
    switchScreens('rules-screen', 'start-screen');
});

document.getElementById('home-to-credits-btn').addEventListener('click', function() {
    switchScreens('start-screen', 'credits-screen');
});

document.getElementById('credits-to-home-btn').addEventListener('click', function() {
    switchScreens('credits-screen', 'start-screen');
});

//initializeBoard();
//displayBoard();

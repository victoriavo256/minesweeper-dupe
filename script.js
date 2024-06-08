// create 2d array of tiles in a 10 x 10 grid
let board = [
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
];  // 10 x 10
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
    
    // randomly populate grid with 10 bombs
    let placedBombs = 0;
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

    return board;
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

    if (value === -1) {     // is a bomb
        tile.innerHTML = '💣';
        tile.style.backgroundColor = 'red';
        // TODO: gameOverLose();
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
        if ((tile.dataset.row%2 === 0 && tile.dataset.col%2 === 0) || (tile.dataset.row%2 === 1 && tile.dataset.col%2 === 1)) {
            tile.style.backgroundColor = 'rgb(255, 242, 171)';    // light
        } else {
            tile.style.backgroundColor = 'rgb(247, 207, 121)';    // dark
        }
    }

    tile.style.cursor = 'default';  // resets cursor to default

    tile.classList.add('revealed');
    revealedTiles++;
    /* TODO: 
    if (revealedTiles === (size * size) - numBombs) {
        gameOverWin();
    } */
    
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

initializeBoard();
displayBoard();

// read input for difficulty level: easy, medium, hard (possible implementation: drop down menu?)
    //  easy: 10 by 10, 10 bombs
    //  medium: 15 by 15, 30 bombs
    //  hard: 20 by 20, 50 bombs
// note: can make a customizable difficulty where player selects board dimensions and num of bombs?

// create 2d array [n][m]
// populate array with random bomb spots or empty spots

// generate board with clickable green tiles (n x m)
    // (indicate when a tile is hovered over)
// tile properties:
    // isBomb, isRevealed, numNearbyBombs
    // if isBomb != 0, numNearbyBombs does not matter
    // if isBomb == 0 and numNearbyBombs == 0, it is an empty tile

// player clicks a tile... (recursive function)
    // note: to check around tile[a][b] check these spots...
    //  [a-1][b-1]      [a-1][b]      [a-1][b+1]
    //  [a][b-1]        [a][b]        [a][b+1]
    //  [a+1][b-1]      [a+1][b]      [a+1][b+1] 
// if tile has no bombs around it, reveal all tiles surrounding it 
//      (until you get to a tile with a bomb nearby)
// if tile has bombs around it, reveal how many
// if tile is a bomb, game over

// other notes: add a timer, and update remaining count of bombs

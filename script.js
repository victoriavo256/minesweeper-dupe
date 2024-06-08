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
    let directions = [
        [-1,-1], [-1,0], [-1,1],
        [0,-1],          [0,1],
        [1,-1],  [1,0],  [1,1]
    ];

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

            // make it clickable
            tile.addEventListener("click", () => {
                tile.innerHTML = board[row][col] === -1 ? '💣' : board[row][col];
                tile.style.backgroundColor = '#bbb';
            });

            // add grid item to grid container
            gridContainer.appendChild(tile);
        }
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

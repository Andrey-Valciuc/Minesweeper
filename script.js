let cellArray = [];
const size = 5
const startBtn = document.getElementById('startBtn')



class Cell {
    constructor(row, col, isBomb, bombsAround) {
        this.row = row;
        this.col = col;
        this.isBomb = isBomb;
        this.bombsAround = bombsAround;
        this.state = 'hidden'; 
    }
}


function createCellArray() {
    
    cellArray = [];
  
    
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const isBomb = Math.random() < 0.2;
        cellArray.push(new Cell(row, col, isBomb, 0)); 
      }
    }
  
   
    for (const cell of cellArray) {
      cell.bombsAround = countBombsAround(cell.row, cell.col);
    }
  
    renderBoard()
    return cellArray;
  }

function countBombsAround(row, col) {
    

    let bombsCount = 0;

   
    for (let i = Math.max(0, row - 1); i <= Math.min(row + 1, size - 1); i++) {
        for (let j = Math.max(0, col - 1); j <= Math.min(col + 1, size - 1); j++) {
           
            if (!(i === row && j === col) && cellArray.find(cell => cell.row === i && cell.col === j)?.isBomb) {
                bombsCount++;
            }
        }
    }

    return bombsCount;
}

function renderBoard() {
  const boardElement = document.getElementById("board");

  boardElement.innerHTML = "";

  for (const cell of cellArray) {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell", cell.state);

      boardElement.appendChild(cellElement);
  }
}


startBtn.onclick  = createCellArray
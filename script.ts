let cellArray: Cell[] = [];
let size :number = 10;
const mockData = document.getElementById("mock") as HTMLElement;
let defeat: boolean = false;
const topBar = document.getElementById('topBar') as HTMLElement;



enum enumCellState {
  Hidden = 'hidden',
  Revealed = 'revealed',
  Flagged = 'flagged',
  GameOver = 'gameOver',
}

enum enumCellContent {
  Empty = 'empty',
  Mine = 'mine',
  MineNumber = 'mineNumber'
}

let seconds = 0;
let timerId: number = 0; // Store timer ID for later stopping




/********************************************** */
document.addEventListener('DOMContentLoaded', () =>{
  renderStepInitGame()
  const startBtn = document.getElementById('startBtn') as HTMLButtonElement
  const gridSizeInput = document.getElementById('gridSizeInput') as HTMLInputElement
  startBtn.addEventListener('click', () => {
    size = Number(gridSizeInput.value);
    // renderTopBar()
    generateGame();
    // renderBombCounter();
    // renderTimer();
    // startTimer();
    
    const inputContainer = document.getElementById('inputContainer') as HTMLElement;
    inputContainer.style.display = 'none';
    renderBoard(size);
  });
})

/***************************************************** */


class Cell {
  private row: number;
  private col: number;
  private viewState: enumCellState = enumCellState.Hidden; 
  private content: enumCellContent =  enumCellContent.Empty; 
  private id :number;

  constructor(n: number, gridSize: number) {
    this.id = n+1;
    this.col = (n % gridSize)+1;
    this.row = Math.floor(n / gridSize)+1;

    // const stateKeys = Object.keys(enumCellState);
    // const randomStateKey = stateKeys[Math.floor(Math.random() * stateKeys.length)];
    // this.viewState = enumCellState[randomStateKey as keyof typeof enumCellState];
      
   
    // this.content = Math.random() < 0.2 ? enumCellContent.Mine : enumCellContent.Empty;
  }
  setViewState(state: enumCellState): void {
    this.viewState = state;
  }
  setContent(){
    this.content = enumCellContent.Mine
  }
  getContent(){
    return this.content;
  }
  getRow(){
    return this.row;
  }
  getCol(){
    return this.col;
  }
  setBombsAround(count: number) {
    if (count === 0) {
      this.content = enumCellContent.Empty;
    } else {
      this.content = enumCellContent.MineNumber + count.toString() as enumCellContent;
    }
  }
  getCurrentHtml(): string {
    return `<div
    id = "${this.id}" 
    class=" ${this.viewState}
    ${this.content} cell"
    ></div>`; 
  }
}

//==============================================================================
// function renderTopBar(){
//   const topBar: HTMLElement = document.getElementById('topBar') as HTMLElement;
//  topBar.innerHTML = 
//  ` <div id="bombCounter"></div>
//    <button id="resetBtn"></button>
//    <div id = "timer"></div>`
 
// }
//=============================================================================

// function startTimer() {
//   seconds = 0; 
//   timerId = setInterval(() => {
//     seconds++;
//     if (seconds > 999) {
//       clearInterval(timerId); 
//       timerId = 0; 
      
//     } else {
//       renderTimer();
//     }
//   }, 1000);
// }
//===========================================================================
// function renderTimer() {
//   const timer = document.getElementById('timer') as HTMLElement;
//   const secondsString = seconds.toString();
//   let formattedTimeString = secondsString; 

//   if (secondsString.length < 3) {
//     const neededZeros = 3 - secondsString.length;
//     let leadingZeros:string = "";
//     for (let i = 0; i < neededZeros; i++) {
//       leadingZeros += "0";
//     }
//     formattedTimeString = leadingZeros + secondsString;
//   }

//   let timerHtml:string = '';
//   for (const digit of formattedTimeString) {
//     timerHtml += `<div class="digit-sprite digit-${digit}"></div>`;
//   }
//     timer.innerHTML = timerHtml;
// }


//=====================================================================
function renderBoard(gridSize: number) {
  const boardElement = document.getElementById("board") as HTMLElement;

  let htmlContent:string = `<div 
  style="width: 300px;  
  font-size: 0; display: 
  grid;grid-template-columns: repeat(${gridSize}, 0fr);">`;
  

  for (const cell of cellArray) {
    htmlContent += cell.getCurrentHtml();
  }
  htmlContent += `</div>`
  boardElement.innerHTML = htmlContent;
  boardElement.addEventListener("click", handleCellClick);
  // mockData.innerHTML = `<pre> ${JSON.stringify(cellArray, null, 2)}</pre>`;
}

//==================================================================================
// function renderBombCounter() {
//   const bombCounter = document.getElementById('bombCounter') as HTMLElement;
//   const bombCount = getTotalBombCount();
//   console.log(bombCount)
//   let bombCountString = bombCount.toString();

//   for (let i = bombCountString.length; i < 3; i++) {
//     bombCountString = "0" + bombCountString;
//   }

//   let htmlContent = '';
//   for (const digit of bombCountString) {
//     htmlContent += `<div class="digit-sprite digit-${digit}"></div>`;
//   }

//   bombCounter.innerHTML = htmlContent;
// }


// function getTotalBombCount(): number {
//   return cellArray.filter((cell) => cell.getContent() === enumCellContent.Mine).length;
// }


//===========================================================================

function renderStepInitGame(){
   const inputContainer: HTMLElement = document.getElementById('inputContainer') as HTMLElement;
  inputContainer.innerHTML = 
  `<label for="gridSizeInput">Enter Grid Size:</label>
  <input type="number" id="gridSizeInput">
  <button id="startBtn">Start!</button>`
  
}
//========================================================================



function generateGame() {
  for (let i = 0; i < size * size; i++) {
    cellArray.push(new Cell(i, size));
  }

  const totalCells = size * size;
  const numberOfBombs = Math.round(0.2 * totalCells);

  for (let i = 0; i < numberOfBombs; i++) {
   
    const randomCellIndex = Math.floor(Math.random() * totalCells);

    if (cellArray[randomCellIndex].getContent() !== enumCellContent.Mine) {
      
      cellArray[randomCellIndex].setContent();
    } else {
      i--;
    }
  }

 
  for (let i = 0; i < size * size; i++) {
    getCountBobmsForCell(i + 1);
  }
}


//======================================================================

function getCountBobmsForCell(id:number):number{
  const currentCell = cellArray[id - 1];


  if (currentCell.getContent() === enumCellContent.Mine) {
    return 0;
  }

  const bombCount = cellArray
    .filter((cell) => {
      const rowDiff = Math.abs(currentCell.getRow() - cell.getRow());
      const colDiff = Math.abs(currentCell.getCol() - cell.getCol());
      const isNeighbor = rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
      return isNeighbor && cell.getContent() === enumCellContent.Mine;
    })
    .length;

  currentCell.setBombsAround(bombCount);

  return bombCount;
}
//=============================================================================================

function handleCellClick(event) {
  const clickedCell = event.target.closest(".cell");
  if(defeat){
    return;
  }
  if (clickedCell) {
    const id = Number(clickedCell.id);
    if (id) {
      const clickedCellObj = cellArray[id - 1];

      if (clickedCellObj.getContent() === enumCellContent.Mine) {
          
        for (const cell of cellArray) {
          if (cell.getContent() === enumCellContent.Mine) {
            cell.setViewState(enumCellState.Revealed); 
          }
        }
        clickedCellObj.setViewState(enumCellState.GameOver);
        defeat = true;
        renderBoard(size);
      } else {
        clickedCellObj.setViewState(enumCellState.Revealed);
        renderBoard(size);
      }
    }
  }
}



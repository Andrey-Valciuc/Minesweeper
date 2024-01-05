let cellArray: Cell[] = []
const size = 10
const startBtn = document.getElementById('startBtn') as HTMLButtonElement
const mockData = document.getElementById("mock") as HTMLElement

enum enumCellState {
  Hidden = 'hidden',
  Revealed = 'revealed',
  Flagged = 'flagged',
}

enum enumCellContent {
  Empty = 'empty',
  Mine = 'mine',
}

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

    const stateKeys = Object.keys(enumCellState);
    const randomStateKey = stateKeys[Math.floor(Math.random() * stateKeys.length)];
    this.viewState = enumCellState[randomStateKey as keyof typeof enumCellState];

   
    this.content = Math.random() < 0.2 ? enumCellContent.Mine : enumCellContent.Empty;
  }

  getCurrentHtml(): string {
    return `<div
    id = "${this.id}" 
    class=" ${this.viewState}
    ${this.content} cell"
    ></div>`; 
  }
}

for (let i = 0; i < size * size; i++) {
  cellArray.push(new Cell(i, size)) 
}

function renderBoard() {
  const boardElement = document.getElementById("board") as HTMLElement;
  let htmlContent:string = `<div 
  style="width: 300px;  
  font-size: 0; display: 
  grid;grid-template-columns: repeat(${size}, 0fr);">`;
  

  for (const cell of cellArray) {
    htmlContent += cell.getCurrentHtml();
  }
  htmlContent += `</div>`
  boardElement.innerHTML = htmlContent;
  boardElement.addEventListener("click", handleCellClick);
  mockData.innerHTML = `<pre> ${JSON.stringify(cellArray, null, 2)}</pre>`;
}

startBtn.addEventListener('click', renderBoard)


function handleCellClick(event) {
  const clickedCell = event.target.closest(".cell"); 

  if (clickedCell) {
      console.log(clickedCell.id); 
  }
}



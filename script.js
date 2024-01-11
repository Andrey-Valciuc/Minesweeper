var cellArray = [];
var size = 10;
var mockData = document.getElementById("mock");
var defeat = false;
var topBar = document.getElementById('topBar');
var enumCellState;
(function (enumCellState) {
    enumCellState["Hidden"] = "hidden";
    enumCellState["Revealed"] = "revealed";
    enumCellState["Flagged"] = "flagged";
    enumCellState["GameOver"] = "gameOver";
})(enumCellState || (enumCellState = {}));
var enumCellContent;
(function (enumCellContent) {
    enumCellContent["Empty"] = "empty";
    enumCellContent["Mine"] = "mine";
    enumCellContent["MineNumber"] = "mineNumber";
})(enumCellContent || (enumCellContent = {}));
var seconds = 0;
var timerId = 0; // Store timer ID for later stopping
/********************************************** */
document.addEventListener('DOMContentLoaded', function () {
    renderStepInitGame();
    var startBtn = document.getElementById('startBtn');
    var gridSizeInput = document.getElementById('gridSizeInput');
    startBtn.addEventListener('click', function () {
        size = Number(gridSizeInput.value);
        // renderTopBar()
        generateGame();
        // renderBombCounter();
        // renderTimer();
        // startTimer();
        var inputContainer = document.getElementById('inputContainer');
        inputContainer.style.display = 'none';
        renderBoard(size);
    });
});
/***************************************************** */
var Cell = /** @class */ (function () {
    function Cell(n, gridSize) {
        this.viewState = enumCellState.Hidden;
        this.content = enumCellContent.Empty;
        this.id = n + 1;
        this.col = (n % gridSize) + 1;
        this.row = Math.floor(n / gridSize) + 1;
        // const stateKeys = Object.keys(enumCellState);
        // const randomStateKey = stateKeys[Math.floor(Math.random() * stateKeys.length)];
        // this.viewState = enumCellState[randomStateKey as keyof typeof enumCellState];
        // this.content = Math.random() < 0.2 ? enumCellContent.Mine : enumCellContent.Empty;
    }
    Cell.prototype.setViewState = function (state) {
        this.viewState = state;
    };
    Cell.prototype.setContent = function () {
        this.content = enumCellContent.Mine;
    };
    Cell.prototype.getContent = function () {
        return this.content;
    };
    Cell.prototype.getRow = function () {
        return this.row;
    };
    Cell.prototype.getCol = function () {
        return this.col;
    };
    Cell.prototype.setBombsAround = function (count) {
        if (count === 0) {
            this.content = enumCellContent.Empty;
        }
        else {
            this.content = enumCellContent.MineNumber + count.toString();
        }
    };
    Cell.prototype.getCurrentHtml = function () {
        return "<div\n    id = \"".concat(this.id, "\" \n    class=\" ").concat(this.viewState, "\n    ").concat(this.content, " cell\"\n    ></div>");
    };
    return Cell;
}());
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
function renderBoard(gridSize) {
    var boardElement = document.getElementById("board");
    var htmlContent = "<div \n  style=\"width: 300px;  \n  font-size: 0; display: \n  grid;grid-template-columns: repeat(".concat(gridSize, ", 0fr);\">");
    for (var _i = 0, cellArray_1 = cellArray; _i < cellArray_1.length; _i++) {
        var cell = cellArray_1[_i];
        htmlContent += cell.getCurrentHtml();
    }
    htmlContent += "</div>";
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
function renderStepInitGame() {
    var inputContainer = document.getElementById('inputContainer');
    inputContainer.innerHTML =
        "<label for=\"gridSizeInput\">Enter Grid Size:</label>\n  <input type=\"number\" id=\"gridSizeInput\">\n  <button id=\"startBtn\">Start!</button>";
}
//========================================================================
function generateGame() {
    for (var i = 0; i < size * size; i++) {
        cellArray.push(new Cell(i, size));
    }
    var totalCells = size * size;
    var numberOfBombs = Math.round(0.2 * totalCells);
    for (var i = 0; i < numberOfBombs; i++) {
        var randomCellIndex = Math.floor(Math.random() * totalCells);
        if (cellArray[randomCellIndex].getContent() !== enumCellContent.Mine) {
            cellArray[randomCellIndex].setContent();
        }
        else {
            i--;
        }
    }
    for (var i = 0; i < size * size; i++) {
        getCountBobmsForCell(i + 1);
    }
}
//======================================================================
function getCountBobmsForCell(id) {
    var currentCell = cellArray[id - 1];
    if (currentCell.getContent() === enumCellContent.Mine) {
        return 0;
    }
    var bombCount = cellArray
        .filter(function (cell) {
        var rowDiff = Math.abs(currentCell.getRow() - cell.getRow());
        var colDiff = Math.abs(currentCell.getCol() - cell.getCol());
        var isNeighbor = rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
        return isNeighbor && cell.getContent() === enumCellContent.Mine;
    })
        .length;
    currentCell.setBombsAround(bombCount);
    return bombCount;
}
//=============================================================================================
function handleCellClick(event) {
    var clickedCell = event.target.closest(".cell");
    if (defeat) {
        return;
    }
    if (clickedCell) {
        var id = Number(clickedCell.id);
        if (id) {
            var clickedCellObj = cellArray[id - 1];
            if (clickedCellObj.getContent() === enumCellContent.Mine) {
                for (var _i = 0, cellArray_2 = cellArray; _i < cellArray_2.length; _i++) {
                    var cell = cellArray_2[_i];
                    if (cell.getContent() === enumCellContent.Mine) {
                        cell.setViewState(enumCellState.Revealed);
                    }
                }
                clickedCellObj.setViewState(enumCellState.GameOver);
                defeat = true;
                renderBoard(size);
            }
            else {
                clickedCellObj.setViewState(enumCellState.Revealed);
                renderBoard(size);
            }
        }
    }
}

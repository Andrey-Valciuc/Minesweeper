var cellArray = [];
var size = 10;
var startBtn = document.getElementById('startBtn');
var mockData = document.getElementById("mock");
var enumCellState;
(function (enumCellState) {
    enumCellState["Hidden"] = "hidden";
    enumCellState["Revealed"] = "revealed";
    enumCellState["Flagged"] = "flagged";
})(enumCellState || (enumCellState = {}));
var enumCellContent;
(function (enumCellContent) {
    enumCellContent["Empty"] = "empty";
    enumCellContent["Mine"] = "mine";
})(enumCellContent || (enumCellContent = {}));
var Cell = /** @class */ (function () {
    function Cell(n, gridSize) {
        this.viewState = enumCellState.Hidden;
        this.content = enumCellContent.Empty;
        this.id = n + 1;
        this.col = (n % gridSize) + 1;
        this.row = Math.floor(n / gridSize) + 1;
        var stateKeys = Object.keys(enumCellState);
        var randomStateKey = stateKeys[Math.floor(Math.random() * stateKeys.length)];
        this.viewState = enumCellState[randomStateKey];
        this.content = Math.random() < 0.2 ? enumCellContent.Mine : enumCellContent.Empty;
    }
    Cell.prototype.getCurrentHtml = function () {
        return "<div\n    id = \"".concat(this.id, "\" \n    class=\" ").concat(this.viewState, "\n    ").concat(this.content, " cell\"\n    ></div>");
    };
    return Cell;
}());
for (var i = 0; i < size * size; i++) {
    cellArray.push(new Cell(i, size));
}
function renderBoard() {
    var boardElement = document.getElementById("board");
    var htmlContent = "<div \n  style=\"width: 300px;  \n  font-size: 0; display: \n  grid;grid-template-columns: repeat(".concat(size, ", 0fr);\">");
    for (var _i = 0, cellArray_1 = cellArray; _i < cellArray_1.length; _i++) {
        var cell = cellArray_1[_i];
        htmlContent += cell.getCurrentHtml();
    }
    htmlContent += "</div>";
    boardElement.innerHTML = htmlContent;
    boardElement.addEventListener("click", handleCellClick);
    mockData.innerHTML = "<pre> ".concat(JSON.stringify(cellArray, null, 2), "</pre>");
}
startBtn.addEventListener('click', renderBoard);
function handleCellClick(event) {
    var clickedCell = event.target.closest(".cell");
    if (clickedCell) {
        console.log(clickedCell.id);
    }
}

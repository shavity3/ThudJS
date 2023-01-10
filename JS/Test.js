"use strict";

const DWARFOBJECT = "D";
const TROLLOBJECT = "T";

let thudBoard = [];
let selectedCell = undefined;
let turnCount=0;

function repopulateBoard()
{
    createBoardObj();
    repopulateBoardWithDwarves();
    repopulateBoardWithTrolls();

    rePaintBoard();
    turnCount=0;
}

function createBoardObj()
{
    thudBoard = [];
    let boardTable = document.getElementById("tableBoard");
    let rowsLength = boardTable.rows.length;
    let boardRow;
    let cellItem;
    let tempCells
    let columnLength;
    for(let rowRunner=0;rowRunner<rowsLength;rowRunner++)
    {
        boardRow = [];
        tempCells= boardTable.rows[rowRunner];
        columnLength=tempCells.cells.length;
        for(let cellRunner=0;cellRunner<columnLength;cellRunner++)
        {
            cellItem = new BoardCell(rowRunner,cellRunner,"");
            boardRow.push(cellItem);
        }
        thudBoard.push(boardRow);
    }
}

function repopulateBoardWithDwarves()
{
    let rowsLength = thudBoard.length;
    let columnLength;
    let tempCells;
    for(let rowRunner=0;rowRunner<rowsLength;rowRunner++)
    {
        tempCells= thudBoard[rowRunner];
        columnLength=tempCells.length;
        for(let cellRunner=0;cellRunner<columnLength;cellRunner++)
        {
            //if we are at the edge of the table
            if(rowRunner == 0 || cellRunner == 0 || rowRunner == (rowsLength-1) || cellRunner == (columnLength-1))
            {
                thudBoard[rowRunner][cellRunner].value=DWARFOBJECT;
            }
        }
    }
}

function repopulateBoardWithTrolls()
{
    let rowsLength =thudBoard.length;
    let tempCellsLength;

    //if table rows are even numbered exit with error
    if(rowsLength % 2 == 0)
    {
        alert("Board is incompatible.")
        return;
    }

    //temporarily only put troll in the center
    let middleRow=Math.ceil(rowsLength/2);
    let tempCells = thudBoard[middleRow];
    tempCellsLength=tempCells.length;
    //if table columns are even numbered exit with error
    if(tempCellsLength % 2 == 0)
    {
        alert("Board is incompatible.")
        return;
    }
    let middleColumn=Math.ceil(tempCellsLength/2);
    thudBoard[middleRow-1][middleColumn-1].value = TROLLOBJECT;
}

function rePaintBoard()
{
    let boardTable = document.getElementById("tableBoard");
    let rowsLength = boardTable.rows.length;

    let tempCells
    let columnLength;
    for(let rowRunner=0;rowRunner<rowsLength;rowRunner++)
    {
        tempCells= boardTable.rows[rowRunner];
        columnLength=tempCells.cells.length;
        for(let cellRunner=0;cellRunner<columnLength;cellRunner++)
        {
            boardTable.rows[rowRunner].cells[cellRunner].innerHTML=thudBoard[rowRunner][cellRunner].toString();
            boardTable.rows[rowRunner].cells[cellRunner].className="plainCell";
        }
    }

    //boardTable.rows[1].cells[1].className="deadCell";
}

function tableClick(event)
{
    let target  = event.target;

    let cell =target.closest("td");
    let columnNumber=cell.cellIndex;
    let rowNumber=cell.parentNode.rowIndex;

    if(selectedCell === undefined)
    {
        if(thudBoard.length>0)
        {
            if(thudBoard[rowNumber][columnNumber].value !== "")
            {
                selectedCell=new BoardCell(rowNumber,columnNumber,thudBoard[rowNumber][columnNumber].value);
                //also change the border color so the chosen cell would be highlighted
                cell.className="selectedCell";
            }
            else
            {
                //an empty space was chosen
                return;
            }
        }

    }
    else
    {
        let boardTable = document.getElementById("tableBoard");
        if(columnNumber == selectedCell.columnNumber && rowNumber==selectedCell.rowNumber)
        {
            //the user chooses the samecell twice and deselect the cell
            boardTable.rows[selectedCell.rowNumber].cells[selectedCell.columnNumber].className="plainCell";
            selectedCell=undefined;
        }
        else if(tryMove(rowNumber,columnNumber))
        {

            //TODO need bigger logic handling for moves (captures and moving)
            
            //switch cells in thudBoard
            let tempBoardCell = new BoardCell(rowNumber,columnNumber,thudBoard[rowNumber][columnNumber].value);
            let checkedRowNumber = selectedCell.rowNumber;
            let checkedColumnNumber = selectedCell.columnNumber;

            thudBoard[rowNumber][columnNumber].value=selectedCell.value;
            thudBoard[checkedRowNumber][checkedColumnNumber].value=tempBoardCell.value;

            boardTable.rows[selectedCell.rowNumber].cells[selectedCell.columnNumber].innerHTML=tempBoardCell.toString();
            boardTable.rows[rowNumber].cells[columnNumber].innerHTML=selectedCell.toString();

            boardTable.rows[selectedCell.rowNumber].cells[selectedCell.columnNumber].className="plainCell";
            selectedCell=undefined;
        }
        //else

    }
}


function tryMove(rowNumber,columnNumber)
{
    //check validity here
    if(thudBoard[rowNumber][columnNumber].value !== "")
    {
        return false;
    }

    else
    {
        return true;
    }
    
}

class BoardCell
{
    constructor (rowNumber,columnNumber,value)
    {
        this.rowNumber=rowNumber;
        this.columnNumber=columnNumber;
        this.value=value;
    }

    toString()
    {
        return this.value;
    }
}
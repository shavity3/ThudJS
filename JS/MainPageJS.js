"use strict";

import { DwarfPieceClass } from './DwarfPiece.js';
import { TrollPieceClass } from './TrollPiece.js';
import { BoardClass,SIDE_LENGTH } from './BoardClass.js';

export function test()
{
    let temp= new DwarfPieceClass(5,7);
    console.log(temp);
}

const MAX_ROW_LENGTH = 15;
const MAX_COLUMN_LENGTH = 15;
const REMOVAL_LENGTH=5;

let thudBoard = [];
let selectedCell = undefined;
let turnCount=0;

function repopulateBoard()
{
    thudBoard = new BoardClass();
    //createBoardObj();
    //repopulateBoardWithDwarves();
    //repopulateBoardWithTrolls();

    rePaintBoard();
    turnCount=0;
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
                //add new dwarf
                thudBoard[rowRunner][cellRunner].value=new DwarfPieceClass(rowRunner,cellRunner);
            }
        }
    }
}

function rePaintBoard()
{
    let boardTable = document.getElementById("tableBoard");

    for(let rowRunner=0;rowRunner<SIDE_LENGTH;rowRunner++)
    {
        for(let cellRunner=0;cellRunner<SIDE_LENGTH;cellRunner++)
        {
            paintCell(rowRunner,cellRunner);
        }
    }
}

function paintCell(xCoordinate,yCoordinate)
{
    let boardTable = document.getElementById("tableBoard");//if it's one of the removed edges
    if(thudBoard.isValidLocation(xCoordinate,yCoordinate))
    {
        //if the cell is empty
        if(thudBoard.board[xCoordinate][yCoordinate] === "")
        {
            boardTable.rows[xCoordinate].cells[yCoordinate].innerHTML="";
            boardTable.rows[xCoordinate].cells[yCoordinate].className="plainCell";
        }
        //else draw the object
        else
        {
            boardTable.rows[xCoordinate].cells[yCoordinate].innerHTML=thudBoard.board[xCoordinate][yCoordinate].toString();
            boardTable.rows[xCoordinate].cells[yCoordinate].className="plainCell";
        }
    }
    else
    {
        boardTable.rows[xCoordinate].cells[yCoordinate].innerHTML="";
        boardTable.rows[xCoordinate].cells[yCoordinate].className="deadCell";
    }
}

function tableClick(eventObj)
{
    let target  = eventObj.target;

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

//create the board table
let rowToAdd;
let cellToAdd;
let tBodyToAdd=document.createElement("tbody");
let boardToChange=document.getElementById("tableBoard");

for(let rowRunner=0;rowRunner<SIDE_LENGTH;rowRunner++)
{
    rowToAdd=document.createElement("tr");
    for(let columnRunner=0;columnRunner<SIDE_LENGTH;columnRunner++)
    {
        cellToAdd=document.createElement("td");

        cellToAdd.innerHTML = "" + rowRunner + ", " +columnRunner;

        rowToAdd.appendChild(cellToAdd);
    }
    tBodyToAdd.appendChild(rowToAdd);
}
boardToChange.appendChild(tBodyToAdd);

document.getElementById("resetBoard").addEventListener("click",repopulateBoard);
document.getElementById("tableBoard").addEventListener("click",tableClick);


//document.getElementById("resetBoard").addEventListener("click",test);

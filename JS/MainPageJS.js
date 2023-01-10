"use strict";

import { DwarfPieceClass } from './DwarfPiece.js';
import { TrollPieceClass } from './TrollPiece.js';
import { BoardClass } from './BoardClass.js';
import { SIDE_LENGTH } from './BoardDefinitionClass.js';

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

    document.getElementById("dwarfPointsSpan").innerHTML=thudBoard.totalDwarfPoints;
    document.getElementById("trollPointsSpan").innerHTML=thudBoard.totalTrollPoints;
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
        if(thudBoard.isValidLocation(rowNumber,columnNumber))
        {
            if(thudBoard.hasMovablePiece(rowNumber,columnNumber))
            {
                selectedCell=new BoardCell(rowNumber,columnNumber);
                //also change the border color so the chosen cell would be highlighted
                cell.className="selectedCell";
            }
            else
            {
                return;
            }
        }
        else
        {
            //an empty space was chosen
            return;
        } 
    }
    else
    {
        let boardTable = document.getElementById("tableBoard");
        if(columnNumber == selectedCell.columnNumber && rowNumber==selectedCell.rowNumber)
        {
            //the user chooses the same cell twice and deselect the cell
            boardTable.rows[selectedCell.rowNumber].cells[selectedCell.columnNumber].className="plainCell";
            selectedCell=undefined;
        }
        //try and move the slected cell to the new location
        else if(thudBoard.tryMove(selectedCell.rowNumber,selectedCell.columnNumber,rowNumber,columnNumber))
        {
            //if it succedded
            //paintCell(selectedCell.rowNumber,selectedCell.columnNumber);
            //paintCell(rowNumber,columnNumber);

            rePaintBoard();

            selectedCell=undefined;
        }
        //else it failed
        {

        }

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
    constructor (rowNumber,columnNumber)
    {
        this.rowNumber=rowNumber;
        this.columnNumber=columnNumber;
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

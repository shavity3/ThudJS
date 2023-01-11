"use strict";

import { DwarfPieceClass } from './DwarfPiece.js';
import { TrollPieceClass } from './TrollPiece.js';
import { BoardClass } from './BoardClass.js';
import { SIDE_LENGTH,TROLL_BASE_VALUE,DWARF_BASE_VALUE } from './BoardDefinitionClass.js';

export function test()
{
    let temp= new DwarfPieceClass(5,7);
    console.log(temp);
}

const TURN_TEXT_START = "It is currently the ";
const TURN_TEXT_END = " player's turn.";
const DWARF_PLAYER_TEXT="Dwarf";
const TROLL_PLAYER_TEXT="Troll";

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
    document.getElementById("turnTextSpan").innerHTML=TURN_TEXT_START+DWARF_PLAYER_TEXT+TURN_TEXT_END;
    document.getElementById("spanDwarfPlayerText").innerHTML=DWARF_PLAYER_TEXT;
    document.getElementById("spanTrollPlayerText").innerHTML="";
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
        if(thudBoard.isValidLocation(rowNumber,columnNumber))
        {
            if(thudBoard.hasMovablePiece(rowNumber,columnNumber))
            {
                let boardPiece = thudBoard.board[rowNumber][columnNumber];
                //if it's a dwarf turn and the chosen piece wasn't a dwarf exit
                if(turnCount % 2 == 0 && boardPiece.className() != DwarfPieceClass.staticClassName())
                {
                    return;
                }
                //else if it's a troll turn and the chosen peice wasn't a troll exit
                else if(turnCount % 2 == 1 && boardPiece.className() != TrollPieceClass.staticClassName())
                {
                    return;
                }
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

            //change the player turn
            turnCount++;
            //if it is dwarf turn 
            if(turnCount%2 == 0)
            {
                document.getElementById("turnTextSpan").innerHTML=TURN_TEXT_START+DWARF_PLAYER_TEXT+TURN_TEXT_END;
                document.getElementById("spanDwarfPlayerText").innerHTML=DWARF_PLAYER_TEXT;
                document.getElementById("spanTrollPlayerText").innerHTML="";
            }
            else
            {
                document.getElementById("turnTextSpan").innerHTML=TURN_TEXT_START+TROLL_PLAYER_TEXT+TURN_TEXT_END;
                document.getElementById("spanDwarfPlayerText").innerHTML="";
                document.getElementById("spanTrollPlayerText").innerHTML=TROLL_PLAYER_TEXT;
            }
        }
        //else it failed
        else {
            //paint an X for a while on the invalid cell
            let cellItem = boardTable.rows[rowNumber].cells[columnNumber];
            paintInvalid(cellItem)

        }

    }
}

async function paintInvalid(boardCellItem)
{
    let originalText=boardCellItem.innerHTML;
    boardCellItem.innerHTML="X";
    let textPromise = new Promise(function(resolve)
        {
            setTimeout(function()
            {
                resolve();
            }
            , 300)
        }
    );
    await textPromise;
    boardCellItem.innerHTML = originalText;
}

function endGame()
{
    let trollScore=thudBoard.numberOfTrolls*TROLL_BASE_VALUE;
    let dwarfScore=thudBoard.numberofDwarves*DWARF_BASE_VALUE;

    let absScoreValue=Math.abs(trollScore-dwarfScore);
    //troll player won
    if(trollScore>dwarfScore)
    {
        alert("The Troll player won the game with " + absScoreValue + " points.");
    }
    //dwarf player won
    else if(dwarfScore>trollScore)
    {
        alert("The Dwarf player won the game with " + absScoreValue + " points.");
    }
    //there was no winner
    else
    {
        alert("A tie, neither player wins.");
    }

    //TODO: end game board cleaning
    repopulateBoard();
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

        //cellToAdd.innerHTML = "" + rowRunner + ", " +columnRunner;

        rowToAdd.appendChild(cellToAdd);
    }
    tBodyToAdd.appendChild(rowToAdd);
}
boardToChange.appendChild(tBodyToAdd);

repopulateBoard();

document.getElementById("resetBoard").addEventListener("click",repopulateBoard);
document.getElementById("buttonEndGame").addEventListener("click",endGame);
document.getElementById("tableBoard").addEventListener("click",tableClick);


//document.getElementById("resetBoard").addEventListener("click",test);

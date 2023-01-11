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

//inits the game board
function repopulateBoard()
{
    thudBoard = new BoardClass();

    //paints the html board.
    rePaintBoard();
    //inits the turn count and presentation
    turnCount=0;
    document.getElementById("spanCurrentPlayer").className="spanDwarfPlayerText";
    document.getElementById("spanCurrentPlayer").innerHTML=DWARF_PLAYER_TEXT;
}

//paint all the cells in the html board object
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

//paint a specific cell in the html object according to the given coordinates
function paintCell(xCoordinate,yCoordinate)
{
    let boardTable = document.getElementById("tableBoard");
    //if it's not one of the removed edges
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

//table click has two modes, first no item is selected than it selects one item and paints its background
// the second is trying to move the object to the chosen location or it deselects item if the same location was clicked twice
function tableClick(eventObj)
{
    let target  = eventObj.target;

    let cell =target.closest("td");
    let columnNumber=cell.cellIndex;
    let rowNumber=cell.parentNode.rowIndex;

    //if there is no chosen cell
    if(selectedCell === undefined)
    {
        //if a valid location was chosen
        if(thudBoard.isValidLocation(rowNumber,columnNumber))
        {
            //if the location has a valid piece that can be moved
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
                //otherwise select the new cell
                selectedCell=new BoardCell(rowNumber,columnNumber);
                //also change the border color so the chosen cell would be highlighted
                cell.className="selectedCell";
            }
            else
            {
                //thudstone was chosen
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
        //if the same cell was selected
        if(columnNumber == selectedCell.columnNumber && rowNumber==selectedCell.rowNumber)
        {
            //the user chose the same cell twice and deselect the cell
            boardTable.rows[selectedCell.rowNumber].cells[selectedCell.columnNumber].className="plainCell";
            selectedCell=undefined;
        }
        //try and move the slected cell to the new location
        else if(thudBoard.tryMove(selectedCell.rowNumber,selectedCell.columnNumber,rowNumber,columnNumber))
        {
            //if it succedded

            //repaint the board
            rePaintBoard();

            //unselect the cell
            selectedCell=undefined;

            //change the player turn
            turnCount++;
            //if it is dwarf turn 
            if(turnCount%2 == 0)
            {
                document.getElementById("spanCurrentPlayer").className="spanDwarfPlayerText";
                document.getElementById("spanCurrentPlayer").innerHTML=DWARF_PLAYER_TEXT;
            }
            //else it is a troll turn
            else
            {
                document.getElementById("spanCurrentPlayer").className="spanTrollPlayerText";
                document.getElementById("spanCurrentPlayer").innerHTML=TROLL_PLAYER_TEXT;
            }
        }
        //else it failed
        else 
        {
            //paint an X for a while on the invalid cell
            let cellItem = boardTable.rows[rowNumber].cells[columnNumber];
            paintInvalid(cellItem)
        }

    }
}

//paints a 'X' for small while on a given cell
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

//this function ends the game, totalling the points, alerting who won and restarting the board
function endGame()
{
    let trollScore=thudBoard.numberOfTrolls*TROLL_BASE_VALUE;
    let dwarfScore=thudBoard.numberofDwarves*DWARF_BASE_VALUE;

    let absScoreValue=Math.abs(trollScore-dwarfScore);
    //troll player won
    if(trollScore>dwarfScore)
    {
        alert("The Troll player won the game with a net of " + absScoreValue + " points.");
    }
    //dwarf player won
    else if(dwarfScore>trollScore)
    {
        alert("The Dwarf player won the game with a net of " + absScoreValue + " points.");
    }
    //there was no winner
    else
    {
        alert("A tie, neither player wins.");
    }
    repopulateBoard();
}

//a small class to hold the chosen cell
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

//loading the events for the HTML page
document.getElementById("resetBoard").addEventListener("click",repopulateBoard);
document.getElementById("buttonEndGame").addEventListener("click",endGame);
document.getElementById("tableBoard").addEventListener("click",tableClick);


//document.getElementById("resetBoard").addEventListener("click",test);

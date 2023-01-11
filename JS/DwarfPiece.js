"use strict";

import { BoardPieceClass } from './BoardPiece.js';
import { TrollPieceClass } from './TrollPiece.js';
import { SIDE_LENGTH } from './BoardDefinitionClass.js';

//extends the BoardPieceClass class
//dwarves move either by straight, orthogonal or diagonal, unoccupied lines (like a chess queen); and need to be hurled if the target location has a troll piece in it.
//hurling is defined by having a line of dwarves in the opposite direction of the move that is at least the number of square to the new location 
//  (a dwarf always counts as at least a line of 1), you can only hurl if the new loation has a troll piece on it.

export class DwarfPieceClass extends BoardPieceClass
{
    constructor(cooridnateX,cooridnateY)
    {
        super(cooridnateX,cooridnateY)
    }

    //return the strin value of the piece ("D")
    toString()
    {
        return "D";
    }

    //a boolean method that returns if it's valid for the piece to move to a new location.
    //this function recives the new location coordinates and the board it is on.
    isValidMove(newXCord,newYCord,board)
    {
        let absRowDistance=Math.abs(newXCord-this.cooridnateX);
        let absColumnDistance=Math.abs(newYCord-this.cooridnateY);
        //staying in place is illegal
        if(newXCord == this.cooridnateX && newYCord == this.cooridnateY)
        {
            return false;
        }
        //check if valid movement type, dwarf can move in unlimited orthogonal or diagonal lines
        else if (absRowDistance === 0 || absColumnDistance === 0 || (absRowDistance === absColumnDistance))
        {
            //if the location is unoccupied treat it as simple movement
            if (board[newXCord][newYCord] === "")
            {
                return this.#moveIsPossible(newXCord,newYCord,board,false);
            }
            //else of the location is occupied by a troll piece check if the dwarf can be hurled
            else if(board[newXCord][newYCord].className() === TrollPieceClass.staticClassName())
            {
                return this.#moveIsPossible(newXCord,newYCord,board,true);
            }
            //else the space is occupied by a piece that isn't a troll
            else
            {
                return false;
            }
        }
        //invalid movement type
        else
        {
            return false;
        }
    }

    //this private function checks if the dwarf can move to the given location, either by hurling or normal movment.
    //get the coordinate of the new location, the board itself and whether we should check that the dwarf should be hurled
    #moveIsPossible(newXCord,newYCord,board,isHurl)
    {
        //get absloute distance
        let absRowDistance=Math.abs(newXCord-this.cooridnateX);
        let absColumnDistance=Math.abs(newYCord-this.cooridnateY);
        //see if shove is possible
        let rowDirection;
        let colDirection;
        //if the new location row index is higher than the current one the counter will move forwards
        if(newXCord>this.cooridnateX)
        {
            rowDirection=1;
        }
        //else if it's smaller it will move backwards
        else if(newXCord<this.cooridnateX)
        {
            rowDirection=-1;
        }
        //else it on the same row
        else
        {
            rowDirection=0;
        }
        //if the new location column index is higher than the current one the counter will move forwards
        if(newYCord>this.cooridnateY)
        {
            colDirection=1;
        }
        //else if it's smaller it will move backwards
        else if(newYCord<this.cooridnateY)
        {
            colDirection=-1;
        }
        //else it on the same column
        else
        {
            colDirection=0;
        }
        
        let maxMovement=Math.max(absRowDistance,absColumnDistance);
        let hadDwarfHurl=false;
        let boardItem;

        for(let runner=0;runner<=maxMovement;runner++)
        {
            if(runner == 0)
            {
                //self always count as 1 dwarf line
                hadDwarfHurl=true;
            }
            //if the dwarf is hurled and ran out of dwarves in line
            else if(isHurl && !hadDwarfHurl)
            {
                return false
            }
            else
            {
                boardItem=board[this.cooridnateX+runner*rowDirection][this.cooridnateY+runner*colDirection];
                //if the dwarf is hurled
                if(isHurl)
                {
                    //if the dwarf is hurled we need to make sure all the spaces EXCEPT the last one are empty
                    if(runner!=maxMovement && boardItem!="")
                    {
                        //the piece encountered a non empty space and thus the move is illegal
                        return false;
                    }
                    //if the the runner for dwarf line check ran out of bound treat it as line automatically being broken
                    if((this.cooridnateX+runner*rowDirection*-1<0) || (this.cooridnateX+runner*rowDirection*-1>=SIDE_LENGTH) || 
                        (this.cooridnateY+runner*colDirection*-1<0) || this.cooridnateY+runner*colDirection*-1>=SIDE_LENGTH)
                    {
                        hadDwarfHurl=false;
                    }
                    else
                    {
                        //check if there's another dwarf in the line opposite to where the current piece wants to go
                        boardItem=board[this.cooridnateX+runner*rowDirection*-1][this.cooridnateY+runner*colDirection*-1];
                        if(boardItem !== "" && boardItem.className() === DwarfPieceClass.staticClassName())
                        {
                            hadDwarfHurl=true;
                        }
                        //else the dwarf line has ended.
                        else
                        {
                            hadDwarfHurl=false;
                        }
                    }
                }
                //else normal movment, check that the intervining steps are empty
                else if(boardItem!="")
                {
                    //the piece encountered a non empty space and thus the move is illegal
                    return false;
                }
            }
        }
        return true;
    }

    //move the dwarf to the new location on the board, if there was a troll piece there capture it
    //this function assumes isValidMove was check beforehand
    move(newXCord,newYCord,board)
    {
        let capturedPieces=0;
        let cellItem = board[newXCord][newYCord];
        //there's an item there
        if(cellItem!=="")
        {
            //there's a troll
            if(cellItem.className()===TrollPieceClass.staticClassName())
            {
                //a troll is captured
                capturedPieces++;
                //removing it from the board
                board[newXCord][newYCord]="";
            }
        }

        board[this.cooridnateX][this.cooridnateY]="";

        this.cooridnateX=newXCord;
        this.cooridnateY=newYCord;

        board[newXCord][newYCord]=this;

        return capturedPieces;
    }

    static staticClassName()
    {
        return "DwarfPieceClass";
    }

    className()
    {
        return "DwarfPieceClass";
    }
}
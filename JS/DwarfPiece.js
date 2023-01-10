"use strict";

import { BoardPieceClass } from './BoardPiece.js';
import { TrollPieceClass } from './TrollPiece.js';
import { SIDE_LENGTH } from './BoardDefinitionClass.js';

export class DwarfPieceClass extends BoardPieceClass
{
    constructor(cooridnateX,cooridnateY)
    {
        super(cooridnateX,cooridnateY)
    }

    toString()
    {
        return "D";
    }

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
            //if the square is unoccupied treat it as simple movement
            if (board[newXCord][newYCord] === "")
            {
                return this.#moveIsPossible(newXCord,newYCord,board,false);
            }
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

    //get the coordinate of the new location, the board itself and wther we should check that the dwarf is hurled
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
                //check if the spaces to move are empty
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
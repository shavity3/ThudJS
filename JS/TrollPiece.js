"use strict";

import {BoardPieceClass} from './BoardPiece.js';
import { DwarfPieceClass } from './DwarfPiece.js';
import { SIDE_LENGTH } from './BoardDefinitionClass.js';

export class TrollPieceClass extends BoardPieceClass
{
    constructor(cooridnateX,cooridnateY)
    {
        super(cooridnateX,cooridnateY)
    }
    
    toString()
    {
        return "T";
    }

    //trolls are only allowed to move one square
    isValidMove(newXCord,newYCord,board)
    {
        let absRowDistance=Math.abs(newXCord-this.cooridnateX);
        let absColumnDistance=Math.abs(newYCord-this.cooridnateY);
        //staying in place is illegal
        if(newXCord == this.cooridnateX && newYCord == this.cooridnateY)
        {
            return false;
        }
        //else if the square is occupied return false
        else if (board[newXCord][newYCord] !== "")
        {
            return false;
        }
        //else if it's a single step
        else if(absRowDistance<=1 && absColumnDistance<=1)
        {
            return true;
        }
        //computing shove logic
        else
        {
            //if the line is not straight or diagonal 
            if(absRowDistance!==absColumnDistance && !(absColumnDistance===0 || absRowDistance===0))
            {
                return false;
            }
            else if(!TrollPieceClass.#willAtLeastCapture(newXCord,newYCord,board))
            {
                //if the shoving won't end up capturing at least one dwarf it is illegal
                return false;
            }
            else
            {
                //check to see if movement is valid via shove
                return this.#shoveIsPossible(newXCord,newYCord,board);
            }
        }
    }
    

    move(newXCord,newYCord,board)
    {
        let capturedPieces=0;
        let cellItem;
        for(let rowRunner=newXCord-1;rowRunner<=newXCord+1 && rowRunner < SIDE_LENGTH ;rowRunner++)
        {
            for(let colRunner=newYCord-1;colRunner<=newYCord+1 && colRunner < SIDE_LENGTH;colRunner++)
            {
                if(rowRunner == newXCord && colRunner === newYCord)
                {
                    //skip
                }
                else
                {
                    cellItem=board[rowRunner][colRunner];
                    //there's an item there
                    if(cellItem!=="")
                    {
                        //there's a dwarf
                        if(cellItem.className()===DwarfPieceClass.staticClassName())
                        {
                            //a dwarf is captured
                            capturedPieces++;
                            //removing it from the board
                            board[rowRunner][colRunner]="";
                        }
                    }
                }
            }
        }

        board[this.cooridnateX][this.cooridnateY]="";

        this.cooridnateX=newXCord;
        this.cooridnateY=newYCord;

        board[newXCord][newYCord]=this;

        return capturedPieces;
    }

    //checks if a troll piece moving to this location will capture at least 1 dwarf
    static #willAtLeastCapture(rowNum,colNum,board)
    {
        let willCapture=false;
        let cellItem;
        for(let rowRunner=rowNum-1;rowRunner<=rowNum+1 && rowRunner < SIDE_LENGTH ;rowRunner++)
        {
            for(let colRunner=colNum-1;colRunner<=colNum+1 && colRunner < SIDE_LENGTH;colRunner++)
            {
                if(rowRunner == rowNum && colRunner === colNum)
                {
                    //skip
                }
                else
                {
                    cellItem=board[rowRunner][colRunner];
                    //there's an item there
                    if(cellItem!=="")
                    {
                        //there's a dwarf
                        if(cellItem.className()===DwarfPieceClass.staticClassName())
                        {
                            willCapture=true;
                            //program exits since there's at least one dwarf
                            return willCapture;
                        }
                    }

                }
            }
        }
        return willCapture;
    }

    #shoveIsPossible(newXCord,newYCord,board)
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
        let hadTrollShove=false;
        let boardItem;
        for(let runner=0;runner<=maxMovement;runner++)
        {
            if(runner == 0)
            {
                //self always count as 1 troll line
                hadTrollShove=true;
            }
            //if the piece still tries to move but ran out of trolls to shove it return false
            else if(!hadTrollShove)
            {
                return false
            }
            else
            {
                //check if the spaces to move are empty
                boardItem=board[this.cooridnateX+runner*rowDirection][this.cooridnateY+runner*colDirection];
                if(boardItem!="")
                {
                    //the piece encountered a non empty space and thus the move is illegal
                    return false;
                }
                //if the the runner for troll line check ran out of bound treat it as line automatically being broken
                if((this.cooridnateX+runner*rowDirection*-1<0) || (this.cooridnateX+runner*rowDirection*-1>=SIDE_LENGTH) || 
                    (this.cooridnateY+runner*colDirection*-1<0) || this.cooridnateY+runner*colDirection*-1>=SIDE_LENGTH)
                {
                    hadTrollShove=false;
                }
                else
                {
                    //check if there's another troll in the line opposite to where the current piece wants to go
                    boardItem=board[this.cooridnateX+runner*rowDirection*-1][this.cooridnateY+runner*colDirection*-1];
                    if(boardItem !== "" && boardItem.className() === TrollPieceClass.staticClassName())
                    {
                        hadTrollShove=true;
                    }
                    //else the troll line has ended.
                    else
                    {
                        hadTrollShove=false;
                    }
                }
            }
        }
        return true;
    }

    static staticClassName()
    {
        return "TrollPieceClass";
    }

    className()
    {
        return "TrollPieceClass";
    }
}
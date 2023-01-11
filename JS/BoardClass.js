"use strict";

import { DwarfPieceClass } from './DwarfPiece.js';
import { TrollPieceClass } from './TrollPiece.js';
import { ThudStonePieceClass } from './ThudStonePiece.js';
import { SIDE_LENGTH,REMOVAL_LENGTH } from './BoardDefinitionClass.js';

//the board is defined as a square that has a triangle at the length and height of REMOVAL_LENGTH removed from each corner
export class BoardClass
{
    //this class contains the board as a matrix array, the thudstone object as a quick reference to where the thud stone sits and how many dwarve and troll pieces are still in play.
    constructor()
    {
        this.board=this.#createBoardObj();
        this.thudStone=this.#createThudStone();

        this.numberofDwarves=0;
        this.numberOfTrolls=0;

        this.#repopulateBoardWithTrolls();
        this.#repopulateBoardWithDwarves();
    }


    //inits the board
    #createBoardObj()
    {
        let thudBoard = [];
        let boardRow;
        for(let rowRunner=0;rowRunner<SIDE_LENGTH;rowRunner++)
        {
            boardRow = [];
            for(let cellRunner=0;cellRunner<SIDE_LENGTH;cellRunner++)
            {
                boardRow.push("");
            }
            thudBoard.push(boardRow);
        }

        return thudBoard;
    }

    //create thud stone object in the board and return it
    #createThudStone()
    {
        //the thudstone is in the middle of the board
        let midRow = Math.floor(SIDE_LENGTH/2);
        let midCol = Math.floor(SIDE_LENGTH/2);

        let thudStone = new ThudStonePieceClass(midRow,midCol);
        this.board[midRow][midCol]=thudStone;

        return thudStone;
    }

    //all trolls starting location should be surrounding the Thud stone
    #repopulateBoardWithTrolls()
    {
        this.numberOfTrolls=0;
        let thudStoneCordX=this.thudStone.cooridnateX;
        let thudStoneCordY=this.thudStone.cooridnateY;
        for(let rowRunner=thudStoneCordX-1;rowRunner<=thudStoneCordX+1;rowRunner++)
        {
            for(let columnRunner=thudStoneCordY-1;columnRunner<=thudStoneCordY+1;columnRunner++)
            {
                //if the location is not the thud stone create trolls
                if(columnRunner!=thudStoneCordY || rowRunner !=thudStoneCordX)
                {
                    this.board[rowRunner][columnRunner] = new TrollPieceClass(rowRunner,columnRunner);
                    this.numberOfTrolls++;
                }
            }
        }
    }

    //set all dwarves starting locations at the edge of the cut off triangles
    //plus 8 more to create point parity
    #repopulateBoardWithDwarves()
    {
        this.numberofDwarves=0;
        let absDistance;
        for(let rowRunner=0;rowRunner<SIDE_LENGTH;rowRunner++)
        {
            for(let columnRunner=0;columnRunner<SIDE_LENGTH;columnRunner++)
            {
                //if the abs value of distance from the thud stone is 9 create a dwarf
                absDistance=Math.abs(rowRunner-this.thudStone.cooridnateX)+Math.abs(columnRunner-this.thudStone.cooridnateY);
                if(absDistance==SIDE_LENGTH-REMOVAL_LENGTH-1)
                {
                    this.board[rowRunner][columnRunner]=new DwarfPieceClass(rowRunner,columnRunner);
                    this.numberofDwarves++;
                }
                //else if the distance is 8 and at the edge of the array
                else if(absDistance==SIDE_LENGTH-REMOVAL_LENGTH-2 && (rowRunner==0 || rowRunner == (SIDE_LENGTH-1) || columnRunner == 0 || columnRunner == (SIDE_LENGTH-1) ))
                {
                    this.board[rowRunner][columnRunner]=new DwarfPieceClass(rowRunner,columnRunner);
                    this.numberofDwarves++
                }
            }
        }
    }

    //bool function, returns false if the location is out of bounds for the board
    isValidLocation(xCoordinate,yCoordinate)
    {
        //if the location is outside the bound of the array
        if(xCoordinate<0 || xCoordinate>=SIDE_LENGTH || yCoordinate<0 || yCoordinate>=SIDE_LENGTH)
        {
            return false;
        }
        //else if the location is outside the board
        else if(Math.abs(xCoordinate-this.thudStone.cooridnateX)+Math.abs(yCoordinate-this.thudStone.cooridnateY)>=SIDE_LENGTH-REMOVAL_LENGTH)
        {
            return false
        }
        //else the location is valid
        else
        {
            return true;
        }

    }

    //boolean functions that checks if the given location has a board piece that can be moved
    hasMovablePiece(xCoordinate,yCoordinate)
    {
        //empty spots can't be moved
        if(this.board[xCoordinate][yCoordinate]=== undefined || this.board[xCoordinate][yCoordinate] === "")
        {
            return false;
        }
        else
        {
            let boardPiece=this.board[xCoordinate][yCoordinate];
            //if the piece is eithe a dwarf or a troll return true else false;
            if(boardPiece.className() === DwarfPieceClass.staticClassName() || boardPiece.className() === TrollPieceClass.staticClassName())
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    //private boolean method that check location given contains a piece that can be moved to the new location 
    #isValidMove(oldLocationX,oldLocationY,newLocationX,newLocationY)
    {
        let boardPiece;
        if(!this.isValidLocation(newLocationX,newLocationY))
        {
            return false;
        }
        //check if new location is already occupied by an item
        else 
        {
            boardPiece=this.board[oldLocationX][oldLocationY];
            //if this is a troll piece
            if(boardPiece.className()===TrollPieceClass.staticClassName())
            {
                return boardPiece.isValidMove(newLocationX,newLocationY,this.board);
            }
            else if(boardPiece.className()===DwarfPieceClass.staticClassName())
            {
                return boardPiece.isValidMove(newLocationX,newLocationY,this.board);
            }
            //else somehow a non movalbe piece was selected?
            else
            {
                return false;
            }
        }
    }

    //private method that moves the piece from the old location to the new one
    #move(oldLocationX,oldLocationY,newLocationX,newLocationY)
    {
        let boardPiece=this.board[oldLocationX][oldLocationY];
        if(boardPiece.className() == TrollPieceClass.staticClassName())
        {
            //move the piece and add the points of the captured item to the score
            this.numberofDwarves-=boardPiece.move(newLocationX,newLocationY,this.board);
        }
        else if(boardPiece.className() == DwarfPieceClass.staticClassName())
        {
            //move the piece and add the points of the captured item to the score
            this.numberOfTrolls-=boardPiece.move(newLocationX,newLocationY,this.board);
        }
    }

    //boolean function that tries moving the piece at the old location to the new one and returns true if sit succedded and false if it failed
    tryMove(oldLocationX,oldLocationY,newLocationX,newLocationY)
    {
        if(!this.#isValidMove(oldLocationX,oldLocationY,newLocationX,newLocationY))
        {
            return false;
        }
        else
        {
            this.#move(oldLocationX,oldLocationY,newLocationX,newLocationY);
            return true;
        }
    }
}

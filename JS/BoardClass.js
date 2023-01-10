"use strict";

import { DwarfPieceClass } from './DwarfPiece.js';
import { TrollPieceClass } from './TrollPiece.js';
import { ThudStonePieceClass } from './ThudStonePiece.js';
import { SIDE_LENGTH,REMOVAL_LENGTH,TROLL_BASE_VALUE,DWARF_BASE_VALUE } from './BoardDefinitionClass.js';

//the board is defined as a square that has a triangle at the length and height of REMOVAL_LENGTH removed from each corner
export class BoardClass
{
    //this class contains the board as a matrix array and the thudstone object as a quick reference to where the thud stone sits
    constructor()
    {
        this.board=this.#createBoardObj();
        this.thudStone=this.#createThudStone();

        this.totalDwarfPoints=0;
        this.totalTrollPoints=0;

        this.#repopulateBoardWithTrolls();
        this.#repopulateBoardWithDwarves();
    }


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
        let numberOfTrolls=0;
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
                    numberOfTrolls++;
                }
            }
        }
    }

    //set all dwarves starting locations at the edge of the cut off triangles
    //plus 8 more to create point parity
    #repopulateBoardWithDwarves()
    {
        let numberofDwarves=0;
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
                    numberofDwarves++;
                }
                //else if the distance is 8 and at the edge of the array
                else if(absDistance==SIDE_LENGTH-REMOVAL_LENGTH-2 && (rowRunner==0 || rowRunner == (SIDE_LENGTH-1) || columnRunner == 0 || columnRunner == (SIDE_LENGTH-1) ))
                {
                    this.board[rowRunner][columnRunner]=new DwarfPieceClass(rowRunner,columnRunner);
                    numberofDwarves++
                }
            }
        }
    }

    //bool function, returns false if the location is out of bounds for the board
    isValidLocation(xCoordinate,yCoordinate)
    {
        //if the location is outside the bound of the array
        if(xCoordinate<0 || xCoordinate>SIDE_LENGTH || yCoordinate<0 || yCoordinate>SIDE_LENGTH)
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

    hasMovablePiece(xCoordinate,yCoordinate)
    {
        if(this.board[xCoordinate][yCoordinate]=== undefined || this.board[xCoordinate][yCoordinate] === "")
        {
            return false;
        }
        else
        {
            let boardPiece=this.board[xCoordinate][yCoordinate];
            //thud stones can't be moved
            if(boardPiece.className() === ThudStonePieceClass.staticClassName())
            {
                return false;
            }
            //else
            return true;
        }
    }

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
            //TODO calculate if move is valid according to piece logic
            else if(!(this.board[newLocationX][newLocationY]=== undefined || this.board[newLocationX][newLocationY] === ""))
            {
                return false;
            }
            else
            {
                return true;
            }
        }
    }

    #move(oldLocationX,oldLocationY,newLocationX,newLocationY)
    {
        /*
        this.board[newLocationX][newLocationY]=this.board[oldLocationX][oldLocationY];
        this.board[newLocationX][newLocationY].cooridnateX=newLocationX;
        this.board[newLocationX][newLocationY].cooridnateY=newLocationY;
        this.board[oldLocationX][oldLocationY]="";
        */

        let boardPiece=this.board[oldLocationX][oldLocationY];
        if(boardPiece.className() == TrollPieceClass.staticClassName())
        {
            //move the piece and add the points of the captured item to the score
            this.totalTrollPoints+=boardPiece.move(newLocationX,newLocationY,this.board)*DWARF_BASE_VALUE;
        }
        else if(boardPiece.className() == DwarfPieceClass.staticClassName())
        {
            this.board[newLocationX][newLocationY]=this.board[oldLocationX][oldLocationY];
            this.board[newLocationX][newLocationY].cooridnateX=newLocationX;
            this.board[newLocationX][newLocationY].cooridnateY=newLocationY;
            this.board[oldLocationX][oldLocationY]="";
        }
    }

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

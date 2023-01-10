"use strict";

import { DwarfPieceClass } from './DwarfPiece.js';
import { TrollPieceClass } from './TrollPiece.js';
import { ThudStonePieceClass } from './ThudStonePiece.js';

export const SIDE_LENGTH = 15;
const REMOVAL_LENGTH=5;

//the board is defined as a square that has a triangle at the length and height of REMOVAL_LENGTH removed from each corner
export class BoardClass
{
    //this class contains the board as a matrix array and the thudstone object as a quick reference to where the thud stone sits
    constructor()
    {
        this.board=this.createBoardObj();
        this.thudStone=this.createThudStone();

        this.repopulateBoardWithTrolls();
        this.repopulateBoardWithDwarves();
    }


    createBoardObj()
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
    createThudStone()
    {
        //the thudstone is in the middle of the board
        let midRow = Math.floor(SIDE_LENGTH/2);
        let midCol = Math.floor(SIDE_LENGTH/2);

        let thudStone = new ThudStonePieceClass(midRow,midCol);
        this.board[midRow][midCol]=thudStone;

        return thudStone;
    }

    //all trolls starting location should be surrounding the Thud stone
    repopulateBoardWithTrolls()
    {
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
                }
            }
        }
        //thudBoard[middleRow-1][middleColumn-1].value = new TrollPieceClass(middleRow-1,middleColumn-1);
    }

    //set all dwarves starting locations at the edge of the cut off triangles
    //plus 8 more to create point parity
    repopulateBoardWithDwarves()
    {
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
                }
                //else if the distance is 8 and at the edge of the array
                else if(absDistance==SIDE_LENGTH-REMOVAL_LENGTH-2 && (rowRunner==0 || rowRunner == (SIDE_LENGTH-1) || columnRunner == 0 || columnRunner == (SIDE_LENGTH-1) ))
                {
                    this.board[rowRunner][columnRunner]=new DwarfPieceClass(rowRunner,columnRunner);
                }
            }

        }
    }

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
}

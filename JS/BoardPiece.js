"use strict";

//the base class for all the board items has two proprties, xCoordinate and yCoordinate

export class BoardPieceClass
{
    constructor (cooridnateX,cooridnateY)
    {
        this.cooridnateX=cooridnateX;
        this.cooridnateY=cooridnateY;
    }

    toString()
    {
        return "";
    }

    isValidMove(newXCord,newYCord,board)
    {
        return false;
    }

    move(newXCord,newYCord,board)
    {
        return 0;
    }

    static staticClassName()
    {
        return "BoardPieceClass";
    }

    className()
    {
        return "BoardPieceClass";
    }
}
"use strict";

import {BoardPieceClass} from './BoardPiece.js';

export class ThudStonePieceClass extends BoardPieceClass
{
    constructor(cooridnateX,cooridnateY)
    {
        super(cooridnateX,cooridnateY)
    }
    
    toString()
    {
        return "S";
    }

    isValidMove(newXCord,newYCord)
    {
        return false;
    }

    static staticClassName()
    {
        return "ThudStonePieceClass";
    }

    className()
    {
        return "ThudStonePieceClass";
    }
}
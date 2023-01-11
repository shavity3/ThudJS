"use strict";

import {BoardPieceClass} from './BoardPiece.js';

//extends the BoardPieceClass class
//thudstone acts as a block that can't move

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

    static staticClassName()
    {
        return "ThudStonePieceClass";
    }

    className()
    {
        return "ThudStonePieceClass";
    }
}
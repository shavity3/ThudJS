"use strict";

import {BoardPieceClass} from './BoardPiece.js';

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

    static staticClassName()
    {
        return "DwarfPieceClass";
    }

    className()
    {
        return "DwarfPieceClass";
    }
}
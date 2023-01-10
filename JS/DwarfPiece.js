"use strict";

import {BoardPieceClass} from './BoardPiece.js';

export class DwarfPieceClass extends BoardPieceClass
{
    constructor(cooridnateX,cooridnateY)
    {
        super(cooridnateX,cooridnateY)
        this.isSelectable=true;
    }
    
    toString()
    {
        return "D";
    }
}
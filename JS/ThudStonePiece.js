"use strict";

import {BoardPieceClass} from './BoardPiece.js';

export class ThudStonePieceClass extends BoardPieceClass
{
    constructor(cooridnateX,cooridnateY)
    {
        super(cooridnateX,cooridnateY)
        this.isSelectable=false;
    }
    
    toString()
    {
        return "S";
    }
}
"use strict";

import {BoardPieceClass} from './BoardPiece.js';

export class TrollPieceClass extends BoardPieceClass
{
    constructor(cooridnateX,cooridnateY)
    {
        super(cooridnateX,cooridnateY)
        this.isSelectable=true;
    }
    
    toString()
    {
        return "T";
    }
}
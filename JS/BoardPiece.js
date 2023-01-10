"use strict";

export class BoardPieceClass
{
    constructor (cooridnateX,cooridnateY)
    {
        this.cooridnateX=cooridnateX;
        this.cooridnateY=cooridnateY;
        this.isSelectable=false;
    }

    toString()
    {
        return "";
    }
}
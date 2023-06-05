

import { ChessGame } from '../chessgame.js';
import { WebChessGame } from '../webchessgame.js';
import { Piece } from "../piece.js";

export class King extends Piece {

    override moveOptions(i: number, j: number, colour: string): void {

        this.kingOptions(i, j, colour);
        
    }

    kingOptions(i: number, j: number, colour: string) {

        this.legalPosition(i - 1, j, colour)
        this.legalPosition(i - 1, j + 1, colour)
        this.legalPosition(i, j + 1, colour)
        this.legalPosition(i + 1, j + 1, colour)
        this.legalPosition(i + 1, j, colour)
        this.legalPosition(i + 1, j - 1, colour)
        this.legalPosition(i, j - 1, colour)
        this.legalPosition(i - 1, j - 1, colour)
    }
}
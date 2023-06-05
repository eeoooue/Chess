

import { ChessGame } from '../chessgame.js';
import { WebChessGame } from '../webchessgame.js';
import { Piece } from "../piece.js";

export class Knight extends Piece {

    override moveOptions(i: number, j: number, colour: string): void {

        this.knightOptions(i, j, colour);
    }
    
    knightOptions(i: number, j: number, colour: string) {

        this.legalPosition(i + 2, j - 1, colour)
        this.legalPosition(i + 1, j - 2, colour)
        this.legalPosition(i - 1, j - 2, colour)
        this.legalPosition(i - 2, j - 1, colour)
        this.legalPosition(i - 2, j + 1, colour)
        this.legalPosition(i - 1, j + 2, colour)
        this.legalPosition(i + 1, j + 2, colour)
        this.legalPosition(i + 2, j + 1, colour)
    }
}
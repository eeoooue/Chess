

import { ChessGame } from '../chessgame.js';
import { WebChessGame } from '../webchessgame.js';
import { Piece } from "../piece.js";

export class Knight extends Piece {

    constructor(webgame: WebChessGame, game: ChessGame, colour: string) {
        super(webgame, game, colour, "knight");
    }

    override moveOptions(i: number, j: number): void {

        this.knightOptions(i, j, this.colour);
    }
    
    knightOptions(i: number, j: number, colour: string) {

        this.legalPosition(i + 2, j - 1)
        this.legalPosition(i + 1, j - 2)
        this.legalPosition(i - 1, j - 2)
        this.legalPosition(i - 2, j - 1)
        this.legalPosition(i - 2, j + 1)
        this.legalPosition(i - 1, j + 2)
        this.legalPosition(i + 1, j + 2)
        this.legalPosition(i + 2, j + 1)
    }
}
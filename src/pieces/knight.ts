

import { ChessGame } from '../chessgame.js';
import { WebChessGame } from '../webchessgame.js';
import { Piece } from "../piece.js";

export class Knight extends Piece {

    constructor(webgame: WebChessGame, game: ChessGame, colour: string, i:number, j:number) {
        super(webgame, game, colour, "knight", i, j);
    }

    override moveOptions(i: number, j: number): void {

        this.knightOptions(i, j, this.colour);
    }
    
    knightOptions(i: number, j: number, colour: string) {

        this.canMove(i + 2, j - 1)
        this.canMove(i + 1, j - 2)
        this.canMove(i - 1, j - 2)
        this.canMove(i - 2, j - 1)
        this.canMove(i - 2, j + 1)
        this.canMove(i - 1, j + 2)
        this.canMove(i + 1, j + 2)
        this.canMove(i + 2, j + 1)
    }
}
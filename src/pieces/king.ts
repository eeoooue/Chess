

import { ChessGame } from '../chessgame.js';
import { WebChessGame } from '../webchessgame.js';
import { Piece } from "../piece.js";

export class King extends Piece {

    public check: boolean;

    constructor(webgame: WebChessGame, game: ChessGame, colour: string, i:number, j:number) {
        super(webgame, game, colour, "king", i, j);
        this.check = true;
        this.game.kings.push(this);
    }

    override moveOptions(i: number, j: number): void {

        this.kingOptions(i, j, this.colour);
    }

    kingOptions(i: number, j: number, colour: string) {

        this.canMove(i - 1, j)
        this.canMove(i - 1, j + 1)
        this.canMove(i, j + 1)
        this.canMove(i + 1, j + 1)
        this.canMove(i + 1, j)
        this.canMove(i + 1, j - 1)
        this.canMove(i, j - 1)
        this.canMove(i - 1, j - 1)
    }
}
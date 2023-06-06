

import { ChessGame } from '../chessgame.js';
import { WebChessGame } from '../webchessgame.js';
import { Piece } from "../piece.js";

export class Rook extends Piece {

    constructor(webgame: WebChessGame, game: ChessGame, colour: string) {
        super(webgame, game, colour, "rook");
    }

    override moveOptions(i: number, j: number, colour: string): void {

        this.rookOptions(i, j, colour);
    }

    rookOptions(i: number, j: number, colour: string) {

        // up
        var x = i - 1
        while (this.legalPosition(x, j, colour) === true) {
            x -= 1
        }
        // down
        var x = i + 1
        while (this.legalPosition(x, j, colour) === true) {
            x += 1
        }
        // left
        var x = j - 1
        while (this.legalPosition(i, x, colour) === true) {
            x -= 1
        }
        // right
        var x = j + 1
        while (this.legalPosition(i, x, colour) === true) {
            x += 1
        }
    }
}
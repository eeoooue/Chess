

import { ChessGame } from '../chessgame.js';
import { WebChessGame } from '../webchessgame.js';
import { Piece } from "../piece.js";

export class Bishop extends Piece {

    constructor(webgame: WebChessGame, game: ChessGame, colour: string) {
        super(webgame, game, colour, "bishop");
    }

    override moveOptions(i: number, j: number, colour: string): void {

        this.bishopOptions(i, j, colour);
    }
    
    bishopOptions(i: number, j: number, colour: string) {

        // NE
        var a = i - 1
        var b = j + 1
        while (this.legalPosition(a, b, colour) === true) {
            a -= 1
            b += 1
        }
        // SE
        var a = i + 1
        var b = j + 1
        while (this.legalPosition(a, b, colour) === true) {
            a += 1
            b += 1
        }
        // SW
        var a = i + 1
        var b = j - 1
        while (this.legalPosition(a, b, colour) === true) {
            a += 1
            b -= 1
        }
        // NW
        var a = i - 1
        var b = j - 1
        while (this.legalPosition(a, b, colour) === true) {
            a -= 1
            b -= 1
        }
    }
}
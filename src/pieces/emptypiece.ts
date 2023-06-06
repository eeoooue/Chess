

import { ChessGame } from '../chessgame.js';
import { WebChessGame } from '../webchessgame.js';
import { Piece } from "../piece.js";

export class EmptyPiece extends Piece {

    constructor(webgame: WebChessGame, game: ChessGame) {
        super(webgame, game, "x", "empty");
    }

    override moveOptions(i: number, j: number): void {

        return;
    }
}


import { ChessGame } from '../chessgame.js';
import { WebChessGame } from '../webchessgame.js';
import { Piece } from "../piece.js";

export class EmptyPiece extends Piece {

    constructor(webgame: WebChessGame, game: ChessGame, i:number, j:number) {
        super(webgame, game, "x", "empty", i, j);
    }

    override moveOptions(i: number, j: number): void {

        return;
    }
}
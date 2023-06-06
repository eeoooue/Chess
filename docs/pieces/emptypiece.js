import { Piece } from "../piece.js";
export class EmptyPiece extends Piece {
    constructor(webgame, game, i, j) {
        super(webgame, game, "x", "empty", i, j);
    }
    moveOptions(i, j) {
        return;
    }
}

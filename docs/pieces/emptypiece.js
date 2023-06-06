import { Piece } from "../piece.js";
export class EmptyPiece extends Piece {
    constructor(webgame, game) {
        super(webgame, game, "x", "empty");
    }
    moveOptions(i, j, colour) {
        return;
    }
}

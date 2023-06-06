import { Piece } from "../piece.js";
export class King extends Piece {
    constructor(game, colour, i, j) {
        super(game, colour, "king", i, j);
    }
    moveOptions(i, j) {
        this.kingOptions(i, j);
    }
    kingOptions(i, j) {
        this.canMove(i - 1, j);
        this.canMove(i - 1, j + 1);
        this.canMove(i, j + 1);
        this.canMove(i + 1, j + 1);
        this.canMove(i + 1, j);
        this.canMove(i + 1, j - 1);
        this.canMove(i, j - 1);
        this.canMove(i - 1, j - 1);
    }
}

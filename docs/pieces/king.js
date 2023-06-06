import { Piece } from "../piece.js";
export class King extends Piece {
    constructor(webgame, game, colour, i, j) {
        super(webgame, game, colour, "king", i, j);
    }
    moveOptions(i, j) {
        this.kingOptions(i, j, this.colour);
    }
    kingOptions(i, j, colour) {
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

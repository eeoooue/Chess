import { Piece } from "../piece.js";
export class Knight extends Piece {
    constructor(webgame, game, colour) {
        super(webgame, game, colour, "knight");
    }
    moveOptions(i, j) {
        this.knightOptions(i, j, this.colour);
    }
    knightOptions(i, j, colour) {
        this.canMove(i + 2, j - 1);
        this.canMove(i + 1, j - 2);
        this.canMove(i - 1, j - 2);
        this.canMove(i - 2, j - 1);
        this.canMove(i - 2, j + 1);
        this.canMove(i - 1, j + 2);
        this.canMove(i + 1, j + 2);
        this.canMove(i + 2, j + 1);
    }
}

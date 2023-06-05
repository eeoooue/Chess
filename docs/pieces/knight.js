import { Piece } from "../piece.js";
export class Knight extends Piece {
    moveOptions(i, j, colour) {
        this.knightOptions(i, j, colour);
    }
    knightOptions(i, j, colour) {
        this.legalPosition(i + 2, j - 1, colour);
        this.legalPosition(i + 1, j - 2, colour);
        this.legalPosition(i - 1, j - 2, colour);
        this.legalPosition(i - 2, j - 1, colour);
        this.legalPosition(i - 2, j + 1, colour);
        this.legalPosition(i - 1, j + 2, colour);
        this.legalPosition(i + 1, j + 2, colour);
        this.legalPosition(i + 2, j + 1, colour);
    }
}

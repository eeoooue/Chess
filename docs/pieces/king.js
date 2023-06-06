import { Piece } from "../piece.js";
export class King extends Piece {
    constructor(webgame, game, colour) {
        super(webgame, game, colour, "king");
    }
    moveOptions(i, j) {
        this.kingOptions(i, j, this.colour);
    }
    kingOptions(i, j, colour) {
        this.legalPosition(i - 1, j, colour);
        this.legalPosition(i - 1, j + 1, colour);
        this.legalPosition(i, j + 1, colour);
        this.legalPosition(i + 1, j + 1, colour);
        this.legalPosition(i + 1, j, colour);
        this.legalPosition(i + 1, j - 1, colour);
        this.legalPosition(i, j - 1, colour);
        this.legalPosition(i - 1, j - 1, colour);
    }
}

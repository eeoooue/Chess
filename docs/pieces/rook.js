import { Piece } from "../piece.js";
export class Rook extends Piece {
    constructor(webgame, game, colour) {
        super(webgame, game, colour, "rook");
    }
    moveOptions(i, j, colour) {
        this.rookOptions(i, j, colour);
    }
    rookOptions(i, j, colour) {
        // up
        var x = i - 1;
        while (this.legalPosition(x, j, colour) === true) {
            x -= 1;
        }
        // down
        var x = i + 1;
        while (this.legalPosition(x, j, colour) === true) {
            x += 1;
        }
        // left
        var x = j - 1;
        while (this.legalPosition(i, x, colour) === true) {
            x -= 1;
        }
        // right
        var x = j + 1;
        while (this.legalPosition(i, x, colour) === true) {
            x += 1;
        }
    }
}

import { Piece } from "../piece.js";
export class Bishop extends Piece {
    constructor(webgame, game, colour) {
        super(webgame, game, colour, "bishop");
    }
    moveOptions(i, j, colour) {
        this.bishopOptions(i, j, colour);
    }
    bishopOptions(i, j, colour) {
        // NE
        var a = i - 1;
        var b = j + 1;
        while (this.legalPosition(a, b, colour) === true) {
            a -= 1;
            b += 1;
        }
        // SE
        var a = i + 1;
        var b = j + 1;
        while (this.legalPosition(a, b, colour) === true) {
            a += 1;
            b += 1;
        }
        // SW
        var a = i + 1;
        var b = j - 1;
        while (this.legalPosition(a, b, colour) === true) {
            a += 1;
            b -= 1;
        }
        // NW
        var a = i - 1;
        var b = j - 1;
        while (this.legalPosition(a, b, colour) === true) {
            a -= 1;
            b -= 1;
        }
    }
}

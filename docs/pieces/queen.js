import { Piece } from "../piece.js";
export class Queen extends Piece {
    moveOptions(i, j, colour) {
        this.bishopOptions(i, j, colour);
        this.rookOptions(i, j, colour);
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

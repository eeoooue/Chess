import { Piece } from "../piece.js";
export class Pawn extends Piece {
    moveOptions(i, j, colour) {
        this.pawnOptions(i, j, colour);
    }
    pawnMove(i, j) {
        if (this.invalidCoordinates(i, j) === true) {
            return false;
        }
        if (this.boardstate[i][j] === ".") {
            this.webgame.addDot(i, j);
            return true;
        }
        return false;
    }
    pawnCapture(i, j, colour) {
        if (this.invalidCoordinates(i, j) === true) {
            return;
        }
        if (this.boardstate[i][j] === "." || this.boardstate[i][j][1] === colour) {
            return;
        }
        this.webgame.addCircle(i, j);
    }
    pawnOptions(i, j, colour) {
        if (colour === "w") {
            if (this.pawnMove(i - 1, j) === true) {
                // starting bonus
                if (i === 6) {
                    this.pawnMove(i - 2, j);
                }
            }
            // capture diagonals
            this.pawnCapture(i - 1, j - 1, colour);
            this.pawnCapture(i - 1, j + 1, colour);
            // en passant
        }
        if (colour === "b") {
            if (this.pawnMove(i + 1, j) === true) {
                // starting bonus
                if (i === 1) {
                    this.pawnMove(i + 2, j);
                }
            }
            // capture diagonals
            this.pawnCapture(i + 1, j - 1, colour);
            this.pawnCapture(i + 1, j + 1, colour);
            // en passant
        }
    }
}

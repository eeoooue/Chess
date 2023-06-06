import { Piece } from "../piece.js";
import { EmptyPiece } from './emptypiece.js';
export class Pawn extends Piece {
    constructor(webgame, game, colour) {
        super(webgame, game, colour, "pawn");
    }
    moveOptions(i, j, colour) {
        this.pawnOptions(i, j, colour);
    }
    pawnMove(i, j) {
        if (this.invalidCoordinates(i, j) === true) {
            return false;
        }
        if (this.boardOfPieces[i][j] instanceof EmptyPiece) {
            this.webgame.addDot(i, j);
            return true;
        }
        return false;
    }
    pawnCapture(i, j, colour) {
        if (this.invalidCoordinates(i, j) === true) {
            return;
        }
        const targetPiece = this.boardOfPieces[i][j];
        if (targetPiece instanceof EmptyPiece || targetPiece.colour === colour) {
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

import { Piece } from "../piece.js";
import { EmptyPiece } from './emptypiece.js';
export class Pawn extends Piece {
    constructor(webgame, game, colour) {
        super(webgame, game, colour, "pawn");
    }
    moveOptions(i, j) {
        switch (this.colour) {
            case "b":
                this.blackPawnOptions(i, j);
                return;
            default:
                this.whitePawnOptions(i, j);
                return;
        }
    }
    pawnMove(i, j) {
        if (this.game.validCoordinates(i, j)) {
            const destination = this.boardState[i][j];
            if (destination instanceof EmptyPiece) {
                this.canMove(i, j);
                return true;
            }
        }
        return false;
    }
    pawnCapture(i, j) {
        if (this.game.validCoordinates(i, j)) {
            const targetPiece = this.boardState[i][j];
            if (targetPiece instanceof EmptyPiece || targetPiece.colour == this.colour) {
                return;
            }
            this.canMove(i, j);
        }
    }
    blackPawnOptions(i, j) {
        if (this.pawnMove(i + 1, j) === true) {
            // starting bonus
            if (i === 1) {
                this.pawnMove(i + 2, j);
            }
        }
        // capture diagonals
        this.pawnCapture(i + 1, j - 1);
        this.pawnCapture(i + 1, j + 1);
        // en passant
    }
    whitePawnOptions(i, j) {
        if (this.colour === "w") {
            if (this.pawnMove(i - 1, j) === true) {
                // starting bonus
                if (i === 6) {
                    this.pawnMove(i - 2, j);
                }
            }
            // capture diagonals
            this.pawnCapture(i - 1, j - 1);
            this.pawnCapture(i - 1, j + 1);
            // en passant
        }
    }
}

import { BoardPosition } from "./board_position.js";
import { EmptyPiece } from "./pieces/empty_piece.js";
export class MoveTracker {
    constructor(game) {
        this.active = false;
        this.game = game;
        this.activePiece = new EmptyPiece(game, 0, 0);
    }
    interpretSelection(move) {
        if (!this.active) {
            this.processStartMove(move);
        }
        else if (this.active) {
            this.processEndCell(move);
            if (this.active) {
                this.active = false;
                this.processStartMove(move);
            }
        }
    }
    processStartMove(move) {
        if (this.validStart(move.i, move.j)) {
            this.startMove = move;
            this.active = true;
            this.activePiece = this.game.boardState[move.i][move.j];
        }
    }
    processEndCell(move) {
        if (this.validEnd(move.i, move.j)) {
            const endMove = new BoardPosition(move.i, move.j);
            this.active = false;
            this.game.makeMove(this.activePiece, endMove);
            return;
        }
        this.game.notify();
    }
    validStart(i, j) {
        const piece = this.game.boardState[i][j];
        return piece.colour == this.game.getTurnPlayer();
    }
    validEnd(i, j) {
        const piece = this.activePiece;
        if (piece) {
            const possibleMoves = piece.possibleMoves;
            const n = possibleMoves.length;
            for (let ind = 0; ind < n; ind++) {
                const move = possibleMoves[ind];
                if (move.i == i && move.j == j) {
                    return true;
                }
            }
        }
        return false;
    }
}

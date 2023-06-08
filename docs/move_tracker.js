import { BoardPosition } from "./board_position.js";
export class MoveTracker {
    constructor(game) {
        this.active = false;
        this.game = game;
    }
    setStartMove(i, j) {
        this.startMove = new BoardPosition(i, j);
    }
    setEndMove(i, j) {
        this.endMove = new BoardPosition(i, j);
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
            this.activateStart(move.i, move.j);
        }
    }
    activateStart(i, j) {
        this.setStartMove(i, j);
        this.active = true;
    }
    processEndCell(move) {
        if (this.validEnd(move.i, move.j)) {
            this.setEndMove(move.i, move.j);
            this.active = false;
            const start = this.startMove;
            const end = this.endMove;
            if (start && end) {
                this.game.makeMove(start, end);
                return;
            }
        }
        this.game.notify();
    }
    validStart(i, j) {
        const piece = this.game.boardState[i][j];
        return piece.colour == this.game.getTurnPlayer();
    }
    validEnd(i, j) {
        const start = this.startMove;
        if (start instanceof BoardPosition) {
            const piece = this.game.boardState[start.i][start.j];
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

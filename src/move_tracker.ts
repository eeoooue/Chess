
import { BoardPosition } from "./board_position.js";
import { ChessGame } from "./chess_game";

export class MoveTracker {

    public startMove: undefined | BoardPosition;
    public endMove: undefined | BoardPosition;
    public game: ChessGame;

    constructor(game: ChessGame){

        this.game = game;
    }

    public setStartMove(i: number, j: number) : void {

        this.startMove = new BoardPosition(i, j);
    }

    public setEndMove(i: number, j: number) : void {

        this.endMove = new BoardPosition(i, j);
    }

    interpretSelection(move: BoardPosition) {

        if (!this.game.active) {
            this.processStartMove(move);
        } else if (this.game.active) {
            this.processEndCell(move)
            if (this.game.active) {
                this.game.active = false;
                this.processStartMove(move);
            }
        }
    }

    processStartMove(move: BoardPosition) {

        if (this.validStart(move.i, move.j)) {
            this.activateStart(move.i, move.j);
        }
    }

    activateStart(i: number, j: number) {

        this.setStartMove(i, j);
        this.game.active = true;
    }

    processEndCell(move: BoardPosition) {

        if (this.validEnd(move.i, move.j)) {
            this.setEndMove(move.i, move.j);
            this.game.active = false;

            const start: BoardPosition | undefined = this.startMove;
            const end: BoardPosition | undefined = this.endMove;

            if (start && end) {
                this.game.makeMove(start, end);
                return;
            }
        }

        this.game.notify();
    }

    validStart(i: number, j: number): boolean {

        const piece = this.game.boardState[i][j];
        return piece.colour == this.game.getTurnPlayer();
    }

    validEnd(i: number, j: number): boolean {

        const start: BoardPosition | undefined = this.startMove;

        if (start instanceof BoardPosition) {

            const piece = this.game.boardState[start.i][start.j];
            const possibleMoves = piece.possibleMoves;

            const n = possibleMoves.length;
            for (let ind = 0; ind < n; ind++) {
                const move: BoardPosition = possibleMoves[ind];
                if (move.i == i && move.j == j) {
                    return true;
                }
            }
        }

        return false;
    }
}

import { BoardPosition } from "./board_position.js";
import { ChessGame } from "./chess_game.js";
import { Piece } from "./piece.js";
import { EmptyPiece } from "./pieces/empty_piece.js";

export class MoveTracker {

    public startMove: undefined | BoardPosition;
    public endMove: undefined | BoardPosition;
    public game: ChessGame;
    public active: boolean = false;
    public activePiece: Piece;

    constructor(game: ChessGame){

        this.game = game;
        this.activePiece = new EmptyPiece(game, 0, 0);
    }

    interpretSelection(move: BoardPosition) {

        if (!this.active) {
            this.processStartMove(move);
        } else if (this.active) {
            this.processEndCell(move)
            if (this.active) {
                this.active = false;
                this.processStartMove(move);
            }
        }
    }

    processStartMove(move: BoardPosition) {

        if (this.validStart(move.i, move.j)) {
            this.startMove = move;
            this.active = true;
            this.activePiece = this.game.boardState[move.i][move.j];
        }
    }

    processEndCell(move: BoardPosition) {

        if (this.validEnd(move.i, move.j)) {
            const endMove = new BoardPosition(move.i, move.j);
            this.active = false;
            this.game.makeMove(this.activePiece, endMove);
            return;
        }

        this.game.notify();
    }

    validStart(i: number, j: number): boolean {

        const piece = this.game.boardState[i][j];
        return piece.colour == this.game.getTurnPlayer();
    }

    validEnd(i: number, j: number): boolean {

        const piece: Piece | undefined = this.activePiece;

        if (piece) {

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
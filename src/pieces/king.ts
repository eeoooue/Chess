
import { ChessGame } from '../chess_game.js';
import { Piece } from "../piece.js";
import { Rook } from './rook.js';
import { BoardPosition } from '../board_position.js';

export class King extends Piece {

    constructor(game: ChessGame, colour: string, i: number, j: number) {
        super(game, colour, "king", i, j);
    }

    override moveOptions(i: number, j: number): void {

        this.kingOptions();
        this.checkCastling();
    }

    override moveTo(position: BoardPosition): void {

        this.game.clearSquare(this.i, this.j);
        this.hasMoved = true;

        this.checkCastlingApplies(position);
        this.i = position.i;
        this.j = position.j;
        this.boardState[this.i][this.j] = this;
    }

    kingOptions() {

        for (let a = -1; a <= 1; a++) {
            for (let b = -1; b <= 1; b++) {
                this.canMove(this.i + a, this.j + b);
            }
        }
    }

    checkCastlingApplies(end: BoardPosition) {

        if (Math.abs(this.j - end.j) == 2) {
            if (this.j > end.j) {
                const rookPiece = this.boardState[this.i][0];
                rookPiece.moveTo(new BoardPosition(this.i, end.j + 1));
            }
            if (this.j < end.j) {
                const rookPiece = this.boardState[this.i][7];
                rookPiece.moveTo(new BoardPosition(this.i, end.j - 1));
            }
        }
    }

    checkCastling() {

        if (this.hasMoved == false) {
            this.checkCastleLeft();
            this.checkCastleRight();
        }
    }

    checkCastleLeft() {

        const rookPiece = this.boardState[this.i][0];
        if (rookPiece instanceof Rook && !rookPiece.hasMoved) {
            if (this.inMoveOptions(this.i, this.j - 1)) {
                this.canMove(this.i, this.j - 2);
            }
        }
    }

    checkCastleRight() {

        const rookPiece = this.boardState[this.i][7];
        if (rookPiece instanceof Rook && !rookPiece.hasMoved) {
            if (this.inMoveOptions(this.i, this.j + 1)) {
                this.canMove(this.i, this.j + 2);
            }
        }
    }
}
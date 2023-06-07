
import { BoardPosition } from '../BoardPosition';
import { ChessGame } from '../chessgame.js';
import { Piece } from "../piece.js";
import { EmptyPiece } from './emptypiece.js';

export class Pawn extends Piece {

    public enPassantTurn: number = -1;

    constructor(game: ChessGame, colour: string, i: number, j: number) {
        super(game, colour, "pawn", i, j);
    }

    override moveOptions(i: number, j: number): void {

        switch (this.colour) {
            case "b":
                this.blackPawnOptions(i, j);
                return;
            default:
                this.whitePawnOptions(i, j);
                return;
        }
    }

    override moveTo(position: BoardPosition): void {

        if (Math.abs(this.i - position.i) == 2){
            this.enPassantTurn = this.game.turncount + 1;
        }

        this.checkCaptureEnPassant(position);

        this.hasMoved = true;
        this.i = position.i;
        this.j = position.j;
        this.boardState[this.i][this.j] = this;
    }

    checkCaptureEnPassant(end: BoardPosition){

        var targetPiece: Piece = this.boardState[end.i][end.j];

        // en passant
        if (this.j != end.j && targetPiece instanceof EmptyPiece){
            const victim = this.boardState[this.i][end.j]

            if (victim instanceof Pawn && victim.enPassantTurn == this.game.turncount){
                this.game.removePiece(this.i, end.j);
            }
        }
    }

    pawnMove(i: number, j: number): boolean {

        if (this.game.validCoordinates(i, j)) {
            const destination: Piece = this.boardState[i][j];
            if (destination instanceof EmptyPiece) {
                this.canMove(i, j);
                return true
            }
        }
        return false
    }

    pawnCapture(i: number, j: number): void {

        if (this.game.validCoordinates(i, j)) {
            const targetPiece = this.boardState[i][j];
            if (targetPiece instanceof EmptyPiece || targetPiece.colour == this.colour) {
                return
            }
            this.canMove(i, j);
        }
    }

    checkEnPassant(i: number, j: number) {

        if (!this.game.validCoordinates){
            return;
        }

        const targetPiece = this.boardState[i][j];
        if (targetPiece instanceof Pawn){
            if (targetPiece.enPassantTurn == this.game.turncount){

                if (this.colour == "b" && this.game.legalPosition(i+1, j, this.colour)){
                    this.canMove(i+1, j);
                }

                if (this.colour == "w" && this.game.legalPosition(i-1, j, this.colour)){
                    this.canMove(i-1, j);
                }
            }
        }
    }

    blackPawnOptions(i: number, j: number) {

        if (this.pawnMove(i + 1, j) === true) {
            // starting bonus
            if (i === 1) {
                this.pawnMove(i + 2, j)
            }
        }
        // capture diagonals
        this.pawnCapture(i + 1, j - 1)
        this.pawnCapture(i + 1, j + 1)
        // en passant
        this.checkEnPassant(i, j + 1);
        this.checkEnPassant(i, j - 1);
    }

    whitePawnOptions(i: number, j: number) {

        if (this.pawnMove(i - 1, j) === true) {
            // starting bonus
            if (i === 6) {
                this.pawnMove(i - 2, j)
            }
        }
        // capture diagonals
        this.pawnCapture(i - 1, j - 1)
        this.pawnCapture(i - 1, j + 1)
        // en passant
        this.checkEnPassant(i, j + 1);
        this.checkEnPassant(i, j - 1);
    }
}
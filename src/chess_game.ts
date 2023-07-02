
import { BoardPosition } from "./board_position.js";
import { MoveTracker } from "./move_tracker.js";
import { Piece } from "./piece.js";
import { King } from "./pieces/king.js";
import { Pawn } from "./pieces/pawn.js";
import { EmptyPiece } from "./pieces/empty_piece.js";
import { BoardBuilder } from "./board_builder.js";

export class ChessGame {

    public boardState: Piece[][] = new Array<Array<Piece>>(8);
    public moveTracker;
    public turncount: number = 0;
    public possibleMoves: number = 0;
    public state: string;
    public boardBuilder: BoardBuilder;

    constructor() {

        this.moveTracker = new MoveTracker(this);
        this.boardBuilder = new BoardBuilder(this);
        this.state = "ongoing";
        this.updateState();
    }

    submitPromotionChoice(choice: string) : void {

        const pawn: Pawn = this.getPromotingPawn();
        pawn.promoteTo(choice);

        this.state = "ongoing";
        this.updateState();
    }

    getPromotingPawn(): Pawn {

        const i = (this.getTurnPlayer() == "b") ? 0 : 7;

        for (let j = 0; j < 8; j++) {
            const piece: Piece = this.boardState[i][j];
            if (piece instanceof Pawn) {
                return piece;
            }
        }

        return new Pawn(this, "w", 0, 0);
    }

    getPieces() : Piece[] {

        const pieces: Piece[] = []
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.boardState[i][j];
                pieces.push(piece);
            }
        }

        return pieces;
    }

    getKingOfColour(colour: string): Piece {

        const pieces = this.getPieces();

        for(let i=0; i<pieces.length; i++){
            if (pieces[i] instanceof King){
                if (pieces[i].colour == colour) {
                    return pieces[i];
                }
            }
        }

        return new EmptyPiece(this, 0, 0);
    }

    resetThreats() : void {

        const pieces = this.getPieces();
        pieces.forEach((piece) => {
            piece.threatened = false;
        })
    }

    updatePieces(): void {

        const pieces = this.getPieces();
        pieces.forEach((piece) => {
            piece.update(this);
        })
    }

    submitSelection(move: BoardPosition) : Piece {

        this.moveTracker.interpretSelection(move);
        return this.boardState[move.i][move.j];
    }

    getTurnPlayer(): string {

        return (this.turncount % 2 == 0) ? "w" : "b";
    }

    concludeTurn(): void {

        this.turncount += 1;
        this.updateState();
    }

    updateState(): void {

        this.resetThreats();
        this.updatePieces();
        this.checkGameOver();
    }

    checkGameOver(): void {

        if (this.possibleMoves == 0) {
            const loser = this.getTurnPlayer();
            const king = this.getKingOfColour(loser);
            this.state = (king.threatened) ? "checkmate" : "stalemate";
        }
    }

    makeMove(movingPiece: Piece, end: BoardPosition) {

        this.removePiece(end.i, end.j);
        movingPiece.moveTo(end);
        this.concludeTurn();

        if (movingPiece instanceof Pawn){
            if (end.i == 0 || end.i == 7){
                this.state = "promotion";
            }
        }
    }

    clearSquare(i: number, j: number){

        this.boardState[i][j] = new EmptyPiece(this, i, j);
    }

    removePiece(i: number, j: number) {

        const piece: Piece = this.boardState[i][j];
        this.clearSquare(i, j);
    }

    legalPosition(i: number, j: number, colour: string): boolean {

        if (this.validCoordinates(i, j)) {
            const piece: Piece = this.boardState[i][j];
            if (piece instanceof EmptyPiece || piece.colour != colour) {
                return true;
            }
        }

        return false;
    }

    validCoordinates(i: number, j: number) {

        return (0 <= i && i < 8 && 0 <= j && j < 8);
    }
}

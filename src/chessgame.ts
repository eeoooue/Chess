
import { BoardPosition } from "./BoardPosition.js";
import { MoveTracker } from "./movetracker.js";
import { Piece } from "./piece.js";

import { Bishop } from "./pieces/bishop.js";
import { Rook } from "./pieces/rook.js";
import { Knight } from "./pieces/knight.js";
import { King } from "./pieces/king.js";
import { Pawn } from "./pieces/pawn.js";
import { Queen } from "./pieces/queen.js";
import { EmptyPiece } from "./pieces/emptypiece.js";
import { Observer } from "./observer.js";
import { Subject } from "./subject.js";

export class ChessGame implements Subject {

    public boardState: Piece[][] = new Array<Array<Piece>>(8);
    public moveTracker = new MoveTracker();
    public active: boolean = false;
    public turncount: number = 0;
    private observers: Observer[] = [];

    constructor() {

        this.initializeboardState();
        // this.resetThreats();
        this.notify();
    }

    getKingOfColour(colour: string): Piece {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.boardState[i][j];
                if (piece instanceof King){
                    if (piece.colour == colour){
                        return piece;
                    }
                }
            }
        }

        return new EmptyPiece(this, 0, 0);
    }

    resetThreats() {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.boardState[i][j];
                piece.threatened = false;
            }
        }
    }

    //#region observer pattern

    attach(observer: Observer): void {

        this.observers.push(observer);
    }

    // Detach an observer from the subject.
    detach(observer: Observer): void {

        const n = this.observers.length;

        for (let i = 0; i < n; i++) {
            if (this.observers[i] == observer) {
                this.observers.splice(i, 1);
                return;
            }
        }
    }

    // Notify all observers about an event.
    notify(): void {

        const n = this.observers.length;
        for (let i = 0; i < n; i++) {
            const observer = this.observers[i];
            observer.update(this);
        }
    }

    //#endregion observer pattern

    initializeboardState() {

        for (let i = 0; i < 8; i++) {
            this.boardState[i] = new Array<Piece>(8);
            for (let j = 0; j < 8; j++) {
                this.boardState[i][j] = new EmptyPiece(this, i, j);
            }
        }

        this.placeBlackPieces();
        this.placeWhitePieces();
    }

    placeBlackPieces() {

        for (let j = 0; j < 8; j++) {
            this.boardState[1][j] = new Pawn(this, "b", 1, j)
        }

        this.boardState[0][0] = new Rook(this, "b", 0, 0)
        this.boardState[0][1] = new Knight(this, "b", 0, 1)
        this.boardState[0][2] = new Bishop(this, "b", 0, 2)
        this.boardState[0][3] = new Queen(this, "b", 0, 3)

        this.boardState[0][4] = new King(this, "b", 0, 4)
        this.boardState[0][5] = new Bishop(this, "b", 0, 5)
        this.boardState[0][6] = new Knight(this, "b", 0, 6)
        this.boardState[0][7] = new Rook(this, "b", 0, 7)
    }

    placeWhitePieces() {

        for (let j = 0; j < 8; j++) {
            this.boardState[6][j] = new Pawn(this, "w", 6, j)
        }

        this.boardState[7][0] = new Rook(this, "w", 7, 0)
        this.boardState[7][1] = new Knight(this, "w", 7, 1)
        this.boardState[7][2] = new Bishop(this, "w", 7, 2)
        this.boardState[7][3] = new Queen(this, "w", 7, 3)

        this.boardState[7][4] = new King(this, "w", 7, 4)
        this.boardState[7][5] = new Bishop(this, "w", 7, 5)
        this.boardState[7][6] = new Knight(this, "w", 7, 6)
        this.boardState[7][7] = new Rook(this, "w", 7, 7)
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

    getTurnPlayer(): string {

        return (this.turncount % 2 == 0) ? "w" : "b";
    }

    validStart(i: number, j: number): boolean {

        const piece = this.boardState[i][j];
        return piece.colour == this.getTurnPlayer();
    }

    validEnd(i: number, j: number): boolean {

        const start: BoardPosition | undefined = this.moveTracker.getStartMove();

        if (start instanceof BoardPosition) {

            const piece = this.boardState[start.i][start.j];
            const possibleMoves = piece.getMoveOptions();
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

    processStartMove(move: BoardPosition) {

        if (this.validStart(move.i, move.j)) {
            this.activateStart(move.i, move.j);
        }
    }

    activateStart(i: number, j: number) {

        this.moveTracker.setStartMove(i, j);
        this.active = true;
    }

    processEndCell(move: BoardPosition) {

        if (this.validEnd(move.i, move.j)) {
            this.moveTracker.setEndMove(move.i, move.j);
            this.active = false;

            const start: BoardPosition | undefined = this.moveTracker.getStartMove();
            const end: BoardPosition | undefined = this.moveTracker.getEndMove();

            if (start && end) {
                this.submitMove(start, end);                
                return;
            }
        }
        
        this.notify();
    }


    concludeTurn(){

        this.turncount += 1;
        this.resetThreats();
        this.notify();
    }

    submitMove(start: BoardPosition, end: BoardPosition) {

        const movingPiece: Piece = this.boardState[start.i][start.j];
        var targetPiece: Piece = this.boardState[end.i][end.j];

        if (targetPiece.colour != movingPiece.colour) {
            this.removePiece(end.i, end.j);
        }

        // castling
        this.checkCastling(start, end)
        
        targetPiece.moveTo(start);
        movingPiece.moveTo(end);
        this.concludeTurn();
    }


    removePiece(i: number, j: number){

        const piece: Piece = this.boardState[i][j];
        this.detach(piece);
        this.boardState[i][j] = new EmptyPiece(this, i, j);
    }

    checkCastling(start: BoardPosition, end: BoardPosition){

        // could move this into King class?

        const movingPiece: Piece = this.boardState[start.i][start.j]

        if (movingPiece instanceof King && Math.abs(start.j - end.j) == 2){

            if (start.j > end.j){
                const rookPiece = this.boardState[start.i][0];
                rookPiece.moveTo(new BoardPosition(start.i, end.j + 1));
                this.boardState[start.i][0] = new EmptyPiece(this, start.i, 0);
            }

            if (start.j < end.j){
                const rookPiece = this.boardState[start.i][7];
                rookPiece.moveTo(new BoardPosition(start.i, end.j - 1));
                this.boardState[start.i][7] = new EmptyPiece(this, start.i, 7);
            }
        }
    }

    checkEnPassantCapture(start: BoardPosition, end: BoardPosition){

        // could move this into Pawn class?

        const movingPiece: Piece = this.boardState[start.i][start.j];
        var targetPiece: Piece = this.boardState[end.i][end.j];

        // en passant
        if (movingPiece instanceof Pawn){
            if (start.j != end.j && targetPiece instanceof EmptyPiece){
                const victim = this.boardState[start.i][end.j]

                if (victim instanceof Pawn && victim.enPassantTurn == this.turncount){
                    this.removePiece(start.i, end.j);
                }
            }
        }
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

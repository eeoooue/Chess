import { BoardPosition } from "./BoardPosition.js";
import { MoveTracker } from "./movetracker.js";
import { Bishop } from "./pieces/bishop.js";
import { Rook } from "./pieces/rook.js";
import { Knight } from "./pieces/knight.js";
import { King } from "./pieces/king.js";
import { Pawn } from "./pieces/pawn.js";
import { Queen } from "./pieces/queen.js";
import { EmptyPiece } from "./pieces/emptypiece.js";
export class ChessGame {
    constructor() {
        this.boardState = new Array(8);
        this.moveTracker = new MoveTracker();
        this.active = false;
        this.turncount = 0;
        this.observers = [];
        this.initializeboardState();
        // this.resetThreats();
        this.notify();
    }
    getKingOfColour(colour) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.boardState[i][j];
                if (piece instanceof King) {
                    if (piece.colour == colour) {
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
    attach(observer) {
        this.observers.push(observer);
    }
    // Detach an observer from the subject.
    detach(observer) {
        const n = this.observers.length;
        for (let i = 0; i < n; i++) {
            if (this.observers[i] == observer) {
                this.observers.splice(i, 1);
                return;
            }
        }
    }
    // Notify all observers about an event.
    notify() {
        const n = this.observers.length;
        for (let i = 0; i < n; i++) {
            const observer = this.observers[i];
            observer.update(this);
        }
    }
    //#endregion observer pattern
    initializeboardState() {
        for (let i = 0; i < 8; i++) {
            this.boardState[i] = new Array(8);
            for (let j = 0; j < 8; j++) {
                this.boardState[i][j] = new EmptyPiece(this, i, j);
            }
        }
        this.placeBlackPieces();
        this.placeWhitePieces();
    }
    placeBlackPieces() {
        for (let j = 0; j < 8; j++) {
            this.boardState[1][j] = new Pawn(this, "b", 1, j);
        }
        this.boardState[0][0] = new Rook(this, "b", 0, 0);
        this.boardState[0][1] = new Knight(this, "b", 0, 1);
        this.boardState[0][2] = new Bishop(this, "b", 0, 2);
        this.boardState[0][3] = new Queen(this, "b", 0, 3);
        this.boardState[0][4] = new King(this, "b", 0, 4);
        this.boardState[0][5] = new Bishop(this, "b", 0, 5);
        this.boardState[0][6] = new Knight(this, "b", 0, 6);
        this.boardState[0][7] = new Rook(this, "b", 0, 7);
    }
    placeWhitePieces() {
        for (let j = 0; j < 8; j++) {
            this.boardState[6][j] = new Pawn(this, "w", 6, j);
        }
        this.boardState[7][0] = new Rook(this, "w", 7, 0);
        this.boardState[7][1] = new Knight(this, "w", 7, 1);
        this.boardState[7][2] = new Bishop(this, "w", 7, 2);
        this.boardState[7][3] = new Queen(this, "w", 7, 3);
        this.boardState[7][4] = new King(this, "w", 7, 4);
        this.boardState[7][5] = new Bishop(this, "w", 7, 5);
        this.boardState[7][6] = new Knight(this, "w", 7, 6);
        this.boardState[7][7] = new Rook(this, "w", 7, 7);
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
    getTurnPlayer() {
        return (this.turncount % 2 == 0) ? "w" : "b";
    }
    validStart(i, j) {
        const piece = this.boardState[i][j];
        return piece.colour == this.getTurnPlayer();
    }
    validEnd(i, j) {
        const start = this.moveTracker.getStartMove();
        if (start instanceof BoardPosition) {
            const piece = this.boardState[start.i][start.j];
            const possibleMoves = piece.getMoveOptions();
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
    processStartMove(move) {
        if (this.validStart(move.i, move.j)) {
            this.activateStart(move.i, move.j);
        }
    }
    activateStart(i, j) {
        this.moveTracker.setStartMove(i, j);
        this.active = true;
    }
    processEndCell(move) {
        if (this.validEnd(move.i, move.j)) {
            this.moveTracker.setEndMove(move.i, move.j);
            this.active = false;
            const start = this.moveTracker.getStartMove();
            const end = this.moveTracker.getEndMove();
            if (start && end) {
                this.submitMove(start, end);
                return;
            }
        }
        this.notify();
    }
    concludeTurn() {
        this.turncount += 1;
        this.resetThreats();
        this.notify();
    }
    submitMove(start, end) {
        const movingPiece = this.boardState[start.i][start.j];
        var targetPiece = this.boardState[end.i][end.j];
        if (targetPiece.colour != movingPiece.colour) {
            targetPiece.destroy();
            targetPiece = new EmptyPiece(this, end.i, end.j);
        }
        if (movingPiece instanceof Pawn && Math.abs(start.i - end.i) == 2) {
            const pawn = movingPiece;
            pawn.enPassantTurn = this.turncount + 1;
        }
        // en passant
        if (movingPiece instanceof Pawn) {
            if (start.j != end.j && targetPiece instanceof EmptyPiece) {
                const victim = this.boardState[start.i][end.j];
                if (victim instanceof Pawn && victim.enPassantTurn == this.turncount) {
                    victim.destroy();
                    this.boardState[start.i][end.j] = new EmptyPiece(this, start.i, end.j);
                }
            }
        }
        // castling
        if (movingPiece instanceof King && Math.abs(start.j - end.j) == 2) {
            if (start.j > end.j) {
                const rookPiece = this.boardState[start.i][0];
                rookPiece.moveTo(new BoardPosition(start.i, end.j + 1));
                this.boardState[start.i][0] = new EmptyPiece(this, start.i, 0);
            }
            if (start.j < end.j) {
                const rookPiece = this.boardState[start.i][7];
                rookPiece.moveTo(new BoardPosition(start.i, end.j - 1));
                this.boardState[start.i][7] = new EmptyPiece(this, start.i, 7);
            }
        }
        targetPiece.moveTo(start);
        movingPiece.moveTo(end);
        this.concludeTurn();
    }
    legalPosition(i, j, colour) {
        if (this.validCoordinates(i, j)) {
            const piece = this.boardState[i][j];
            if (piece instanceof EmptyPiece || piece.colour != colour) {
                return true;
            }
        }
        return false;
    }
    validCoordinates(i, j) {
        return (0 <= i && i < 8 && 0 <= j && j < 8);
    }
}

import { MoveTracker } from "./move_tracker.js";
import { King } from "./pieces/king.js";
import { Pawn } from "./pieces/pawn.js";
import { EmptyPiece } from "./pieces/empty_piece.js";
import { BoardBuilder } from "./board_builder.js";
export class ChessGame {
    constructor() {
        this.boardState = new Array(8);
        this.turncount = 0;
        this.observers = [];
        this.possibleMoves = 0;
        this.moveTracker = new MoveTracker(this);
        this.boardBuilder = new BoardBuilder(this);
        this.state = "ongoing";
        this.updateState();
    }
    submitPromotionChoice(choice) {
        const pawn = this.getPromotingPawn();
        pawn.promoteTo(choice);
        this.state = "ongoing";
        this.updateState();
    }
    getPromotingPawn() {
        const i = (this.getTurnPlayer() == "b") ? 0 : 7;
        for (let j = 0; j < 8; j++) {
            const piece = this.boardState[i][j];
            if (piece instanceof Pawn) {
                return piece;
            }
        }
        return new Pawn(this, "w", 0, 0);
    }
    getPieces() {
        const pieces = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.boardState[i][j];
                pieces.push(piece);
            }
        }
        return pieces;
    }
    getKingOfColour(colour) {
        const pieces = this.getPieces();
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i] instanceof King) {
                if (pieces[i].colour == colour) {
                    return pieces[i];
                }
            }
        }
        return new EmptyPiece(this, 0, 0);
    }
    resetThreats() {
        const pieces = this.getPieces();
        pieces.forEach((piece) => {
            piece.threatened = false;
        });
    }
    attach(observer) {
        this.observers.push(observer);
    }
    detach(observer) {
        const n = this.observers.length;
        for (let i = 0; i < n; i++) {
            if (this.observers[i] == observer) {
                this.observers.splice(i, 1);
                return;
            }
        }
    }
    notify() {
        this.possibleMoves = 0;
        this.observers.forEach((observer) => {
            observer.update(this);
        });
    }
    submitSelection(move) {
        this.moveTracker.interpretSelection(move);
        return this.boardState[move.i][move.j];
    }
    getTurnPlayer() {
        return (this.turncount % 2 == 0) ? "w" : "b";
    }
    concludeTurn() {
        this.turncount += 1;
        this.updateState();
    }
    updateState() {
        this.resetThreats();
        this.notify();
        this.checkGameOver();
    }
    checkGameOver() {
        if (this.possibleMoves == 0) {
            const loser = this.getTurnPlayer();
            const king = this.getKingOfColour(loser);
            this.state = (king.threatened) ? "checkmate" : "stalemate";
        }
    }
    makeMove(movingPiece, end) {
        this.removePiece(end.i, end.j);
        movingPiece.moveTo(end);
        this.concludeTurn();
        if (movingPiece instanceof Pawn) {
            if (end.i == 0 || end.i == 7) {
                this.state = "promotion";
            }
        }
    }
    clearSquare(i, j) {
        this.boardState[i][j] = new EmptyPiece(this, i, j);
    }
    removePiece(i, j) {
        const piece = this.boardState[i][j];
        this.detach(piece);
        this.clearSquare(i, j);
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

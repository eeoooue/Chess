import { BoardPosition } from "./board_position.js";
import { MoveTracker } from "./move_tracker.js";
import { Bishop } from "./pieces/bishop.js";
import { Rook } from "./pieces/rook.js";
import { Knight } from "./pieces/knight.js";
import { King } from "./pieces/king.js";
import { Pawn } from "./pieces/pawn.js";
import { Queen } from "./pieces/queen.js";
import { EmptyPiece } from "./pieces/empty_piece.js";
export class ChessGame {
    constructor() {
        this.boardState = new Array(8);
        this.moveTracker = new MoveTracker();
        this.active = false;
        this.turncount = 0;
        this.observers = [];
        this.possibleMoves = 0;
        this.initializeboardState();
        this.state = "ongoing";
        this.notify();
    }
    submitPromotionChoice(choice) {
        if (this.state != "promotion") {
            return;
        }
        const position = this.getPromotingPawnPosition();
        this.removePiece(position.i, position.j);
        const colour = (this.getTurnPlayer() == "b") ? "w" : "b";
        var newPiece;
        switch (choice) {
            case "Bishop":
                newPiece = new Bishop(this, colour, position.i, position.j);
                break;
            case "Knight":
                newPiece = new Knight(this, colour, position.i, position.j);
                break;
            case "Rook":
                newPiece = new Rook(this, colour, position.i, position.j);
                break;
            case "Queen":
                newPiece = new Queen(this, colour, position.i, position.j);
                break;
        }
        if (newPiece) {
            this.boardState[position.i][position.j] = newPiece;
        }
        this.state = "ongoing";
        this.notify();
    }
    getPromotingPawnPosition() {
        const i = (this.getTurnPlayer() == "b") ? 0 : 7;
        for (let j = 0; j < 8; j++) {
            const piece = this.boardState[i][j];
            if (piece instanceof Pawn) {
                return new BoardPosition(i, j);
            }
        }
        return new BoardPosition(-1, -1);
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
        this.possibleMoves = 0;
        this.observers.forEach((observer) => {
            observer.update(this);
        });
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
        const start = this.moveTracker.startMove;
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
            const start = this.moveTracker.startMove;
            const end = this.moveTracker.endMove;
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
        this.checkGameOver();
    }
    checkGameOver() {
        if (this.possibleMoves == 0) {
            const loser = this.getTurnPlayer();
            const king = this.getKingOfColour(loser);
            if (king.threatened) {
                this.state = "checkmate";
            }
            else {
                this.state = "stalemate";
            }
        }
    }
    submitMove(start, end) {
        const movingPiece = this.boardState[start.i][start.j];
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
        if (this.validCoordinates(i, j)) {
            const piece = this.boardState[i][j];
            this.detach(piece);
            this.clearSquare(i, j);
        }
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

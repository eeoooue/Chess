import { MoveTracker } from "./movetracker.js";
import { Bishop } from "./pieces/bishop.js";
import { Rook } from "./pieces/rook.js";
import { Knight } from "./pieces/knight.js";
import { King } from "./pieces/king.js";
import { Pawn } from "./pieces/pawn.js";
import { Queen } from "./pieces/queen.js";
import { EmptyPiece } from "./pieces/emptypiece.js";
export class ChessGame {
    constructor(webgame) {
        this.boardState = new Array(8);
        this.moveTracker = new MoveTracker();
        this.active = false;
        this.turncount = 0;
        this.observers = [];
        this.webgame = webgame;
        this.initializeboardState();
        this.resetThreats();
        this.notify();
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
                this.boardState[i][j] = new EmptyPiece(this.webgame, this, i, j);
            }
        }
        this.placeBlackPieces();
        this.placeWhitePieces();
    }
    placeBlackPieces() {
        for (let j = 0; j < 8; j++) {
            this.boardState[1][j] = new Pawn(this.webgame, this, "b", 1, j);
        }
        this.boardState[0][0] = new Rook(this.webgame, this, "b", 0, 0);
        this.boardState[0][1] = new Knight(this.webgame, this, "b", 0, 1);
        this.boardState[0][2] = new Bishop(this.webgame, this, "b", 0, 2);
        this.boardState[0][3] = new Queen(this.webgame, this, "b", 0, 3);
        this.boardState[0][4] = new King(this.webgame, this, "b", 0, 4);
        this.boardState[0][5] = new Bishop(this.webgame, this, "b", 0, 5);
        this.boardState[0][6] = new Knight(this.webgame, this, "b", 0, 6);
        this.boardState[0][7] = new Rook(this.webgame, this, "b", 0, 7);
    }
    placeWhitePieces() {
        for (let j = 0; j < 8; j++) {
            this.boardState[6][j] = new Pawn(this.webgame, this, "w", 6, j);
        }
        this.boardState[7][0] = new Rook(this.webgame, this, "w", 7, 0);
        this.boardState[7][1] = new Knight(this.webgame, this, "w", 7, 1);
        this.boardState[7][2] = new Bishop(this.webgame, this, "w", 7, 2);
        this.boardState[7][3] = new Queen(this.webgame, this, "w", 7, 3);
        this.boardState[7][4] = new King(this.webgame, this, "w", 7, 4);
        this.boardState[7][5] = new Bishop(this.webgame, this, "w", 7, 5);
        this.boardState[7][6] = new Knight(this.webgame, this, "w", 7, 6);
        this.boardState[7][7] = new Rook(this.webgame, this, "w", 7, 7);
    }
    interpretSelection(move) {
        if (!this.active) {
            this.processStartMove(move);
        }
        else if (this.active) {
            this.processEndCell(move);
            if (this.active) {
                this.webgame.clearHighlights();
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
        const tile = this.webgame.grid[i][j];
        return (tile.classList.contains("validmove"));
    }
    processStartMove(move) {
        if (this.validStart(move.i, move.j)) {
            this.activateStart(move.i, move.j);
        }
    }
    activateStart(i, j) {
        const tile = this.webgame.grid[i][j];
        this.moveTracker.setStartMove(i, j);
        tile.classList.add("highlighted");
        this.active = true;
        this.populateOptions(i, j);
    }
    processEndCell(move) {
        if (this.validEnd(move.i, move.j)) {
            this.moveTracker.setEndMove(move.i, move.j);
            this.active = false;
            this.submitMove();
            this.turncount += 1;
        }
    }
    submitMove() {
        const start = this.moveTracker.getStartMove();
        const end = this.moveTracker.getEndMove();
        if (!start || !end) {
            return;
        }
        const movingPiece = this.boardState[start.i][start.j];
        var targetPiece = this.boardState[end.i][end.j];
        this.boardState[start.i][start.j] = new EmptyPiece(this.webgame, this, start.i, start.j);
        this.boardState[end.i][end.j] = new EmptyPiece(this.webgame, this, end.i, end.j);
        if (targetPiece.colour != movingPiece.colour) {
            targetPiece = new EmptyPiece(this.webgame, this, end.i, end.j);
        }
        targetPiece.i = start.i;
        targetPiece.j = start.j;
        this.boardState[start.i][start.j] = targetPiece;
        movingPiece.i = end.i;
        movingPiece.j = end.j;
        this.boardState[end.i][end.j] = movingPiece;
        this.resetThreats();
        this.notify();
        this.webgame.paintPieces(this.boardState);
        this.webgame.clearHighlights();
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
    populateOptions(i, j) {
        const piece = this.boardState[i][j];
        const options = piece.getMoveOptions(i, j);
        this.webgame.paintMoveOptions(options);
    }
}

import { MoveTracker } from "./movetracker.js";
import { Bishop } from "./pieces/bishop.js";
import { Rook } from "./pieces/rook.js";
import { Knight } from "./pieces/knight.js";
import { King } from "./pieces/king.js";
import { Pawn } from "./pieces/pawn.js";
import { Queen } from "./pieces/queen.js";
export class ChessGame {
    constructor(webgame) {
        this.boardstate = [];
        this.boardOfPieces = new Array(8);
        this.moveTracker = new MoveTracker();
        this.active = false;
        this.turncount = 0;
        this.webgame = webgame;
        this.initializeBoardOfPieces();
        this.initializeBoardstate();
    }
    initializeBoardOfPieces() {
        for (let i = 0; i < 8; i++) {
            this.boardOfPieces[i] = new Array(8);
        }
        this.placeBlackPieces();
        this.placeWhitePieces();
    }
    placeBlackPieces() {
        for (let j = 0; j < 8; j++) {
            this.boardOfPieces[1][j] = new Pawn(this.webgame, this);
        }
        this.boardOfPieces[0][0] = new Rook(this.webgame, this);
        this.boardOfPieces[0][1] = new Knight(this.webgame, this);
        this.boardOfPieces[0][2] = new Bishop(this.webgame, this);
        this.boardOfPieces[0][3] = new Queen(this.webgame, this);
        this.boardOfPieces[0][4] = new King(this.webgame, this);
        this.boardOfPieces[0][5] = new Bishop(this.webgame, this);
        this.boardOfPieces[0][6] = new Knight(this.webgame, this);
        this.boardOfPieces[0][7] = new Rook(this.webgame, this);
    }
    placeWhitePieces() {
        for (let j = 0; j < 8; j++) {
            this.boardOfPieces[6][j] = new Pawn(this.webgame, this);
        }
        this.boardOfPieces[7][0] = new Rook(this.webgame, this);
        this.boardOfPieces[7][1] = new Knight(this.webgame, this);
        this.boardOfPieces[7][2] = new Bishop(this.webgame, this);
        this.boardOfPieces[7][3] = new Queen(this.webgame, this);
        this.boardOfPieces[7][4] = new King(this.webgame, this);
        this.boardOfPieces[7][5] = new Bishop(this.webgame, this);
        this.boardOfPieces[7][6] = new Knight(this.webgame, this);
        this.boardOfPieces[7][7] = new Rook(this.webgame, this);
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
    instantiatePiece(pieceName) {
        switch (pieceName) {
            case "P":
                return new Pawn(this.webgame, this);
            case "R":
                return new Rook(this.webgame, this);
            case "N":
                return new Knight(this.webgame, this);
            case "B":
                return new Bishop(this.webgame, this);
            case "Q":
                return new Queen(this.webgame, this);
            default:
                return new King(this.webgame, this);
        }
    }
    activateStart(i, j) {
        const tile = this.webgame.grid[i][j];
        this.moveTracker.setStartMove(i, j);
        tile.classList.add("highlighted");
        this.active = true;
        this.populateOptions(i, j);
    }
    initializeBoardstate() {
        this.boardstate.push(["Rb", "Nb", "Bb", "Qb", "Kb", "Bb", "Nb", "Rb"]);
        this.boardstate.push(["Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb"]);
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."]);
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."]);
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."]);
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."]);
        this.boardstate.push(["Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw"]);
        this.boardstate.push(["Rw", "Nw", "Bw", "Qw", "Kw", "Bw", "Nw", "Rw"]);
    }
    getTurnPlayer() {
        if (this.turncount % 2 == 0) {
            return "w";
        }
        return "b";
    }
    validStart(i, j) {
        if (this.boardstate[i][j] === "." || this.boardstate[i][j][1] != this.getTurnPlayer()) {
            return false;
        }
        return true;
    }
    validEnd(i, j) {
        const tile = this.webgame.grid[i][j];
        if (tile.classList.contains("validmove")) {
            return true;
        }
        return false;
    }
    processStartMove(move) {
        if (this.validStart(move.i, move.j)) {
            this.activateStart(move.i, move.j);
        }
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
        const piece = this.boardstate[start.i][start.j];
        this.boardstate[end.i][end.j] = piece;
        this.boardstate[start.i][start.j] = ".";
        this.webgame.fullboardPiecePaint(this.boardstate);
        this.webgame.clearHighlights();
    }
    legalPosition(i, j, colour) {
        if (this.validCoordinates(i, j)) {
            if (this.boardstate[i][j] === ".") {
                this.webgame.addDot(i, j);
                return true;
            }
            if (this.boardstate[i][j][1] != colour) {
                this.webgame.addCircle(i, j);
            }
        }
        return false;
    }
    validCoordinates(i, j) {
        return (0 <= i && i < 8 && 0 <= j && j < 8);
    }
    populateOptions(i, j) {
        const pieceChar = this.boardstate[i][j][0];
        const colour = this.boardstate[i][j][1];
        const piece = this.instantiatePiece(pieceChar);
        piece.moveOptions(i, j, colour);
    }
}

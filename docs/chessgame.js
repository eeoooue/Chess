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
        this.moveTracker = new MoveTracker();
        this.active = false;
        this.turncount = 0;
        this.webgame = webgame;
    }
    canStepHere(piece, i, j) {
        if (!this.validCoordinates(i, j)) {
            return false;
        }
        return true;
    }
    instantiatePiece(pieceName) {
        switch (pieceName) {
            case "pawn":
                return new Pawn(this.webgame, this);
            case "rook":
                return new Rook(this.webgame, this);
            case "knight":
                return new Knight(this.webgame, this);
            case "bishop":
                return new Bishop(this.webgame, this);
            case "queen":
                return new Queen(this.webgame, this);
            default:
                return new King(this.webgame, this);
        }
    }
    lookupPiece(piece) {
        switch (piece) {
            case "P":
                return "pawn";
            case "R":
                return "rook";
            case "N":
                return "knight";
            case "B":
                return "bishop";
            case "Q":
                return "queen";
            case "K":
                return "king";
        }
        return "";
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
            this.webgame.submitMove();
        }
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
        const pieceName = this.lookupPiece(pieceChar);
        const colour = this.boardstate[i][j][1];
        const piece = this.instantiatePiece(pieceName);
        piece.moveOptions(i, j, colour);
    }
}

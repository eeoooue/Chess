
import { ChessMove } from "./chessmove.js";
import { MoveTracker } from "./movetracker.js";
import { Piece } from "./piece.js";
import { WebChessGame } from "./webchessgame.js";

import { Bishop } from "./pieces/bishop.js";
import { Rook } from "./pieces/rook.js";
import { Knight } from "./pieces/knight.js";
import { King } from "./pieces/king.js";
import { Pawn } from "./pieces/pawn.js";
import { Queen } from "./pieces/queen.js";

export class ChessGame {

    public boardstate: string[][] = [];
    public moveTracker = new MoveTracker();
    public active: boolean = false;
    public webgame: WebChessGame;
    public turncount: number = 0;

    constructor(webgame: WebChessGame) {

        this.webgame = webgame
    }

    interpretSelection(move: ChessMove){

        if (!this.active) {
            this.processStartMove(move);
        } else if (this.active) {
            this.processEndCell(move)
            if (this.active) {
                this.webgame.clearHighlights();
                this.active = false;
                this.processStartMove(move);
            }
        }
    }

    canStepHere(piece: Piece, i: number, j: number) {

        if (!this.validCoordinates(i, j)) {
            return false;
        }
        return true;
    }

    instantiatePiece(pieceName: string): Piece {

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

    lookupPiece(piece: string): string {

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

    activateStart(i: number, j: number) {

        const tile = this.webgame.grid[i][j]
        this.moveTracker.setStartMove(i, j);
        tile.classList.add("highlighted")
        this.active = true;
        this.populateOptions(i, j);
    }

    initializeBoardstate() {

        this.boardstate.push(["Rb", "Nb", "Bb", "Qb", "Kb", "Bb", "Nb", "Rb"])
        this.boardstate.push(["Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb"])
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])
        this.boardstate.push(["Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw"])
        this.boardstate.push(["Rw", "Nw", "Bw", "Qw", "Kw", "Bw", "Nw", "Rw"])
    }

    getTurnPlayer(): string {

        if (this.turncount % 2 == 0) {
            return "w";
        }
        return "b";
    }

    validStart(i: number, j: number): boolean {

        if (this.boardstate[i][j] === "." || this.boardstate[i][j][1] != this.getTurnPlayer()) {
            return false
        }
        return true
    }

    validEnd(i: number, j: number): boolean {

        const tile = this.webgame.grid[i][j]
        if (tile.classList.contains("validmove")) {
            return true
        }
        return false
    }

    processStartMove(move: ChessMove) {

        if (this.validStart(move.i, move.j)) {
            this.activateStart(move.i, move.j);
        }
    }

    processEndCell(move: ChessMove) {

        if (this.validEnd(move.i, move.j)) {
            this.moveTracker.setEndMove(move.i, move.j);
            this.active = false;
            this.submitMove();
            this.turncount += 1;
        }
    }

    submitMove() {

        const startMove: number[] | undefined = this.moveTracker.getStartMove();
        const endMove: number[] | undefined = this.moveTracker.getEndMove();

        if (!startMove || !endMove) {
            return;
        }

        let a = startMove[0];
        let b = startMove[1];
        let x = endMove[0];
        let y = endMove[1];

        this.boardstate[x][y] = this.boardstate[a][b]
        this.boardstate[a][b] = "."
        this.webgame.paintPosition(x, y)
        this.webgame.paintPosition(a, b)
        this.webgame.clearHighlights()
    }

    legalPosition(i: number, j: number, colour: string): boolean {

        if (this.validCoordinates(i, j)) {
            if (this.boardstate[i][j] === ".") {
                this.webgame.addDot(i, j)
                return true
            }
            if (this.boardstate[i][j][1] != colour) {
                this.webgame.addCircle(i, j)
            }
        }
        return false
    }

    validCoordinates(i: number, j: number) {

        return (0 <= i && i < 8 && 0 <= j && j < 8);
    }

    populateOptions(i: number, j: number) {

        const pieceChar: string = this.boardstate[i][j][0];
        const pieceName = this.lookupPiece(pieceChar);
        const colour = this.boardstate[i][j][1];
        const piece: Piece = this.instantiatePiece(pieceName);

        piece.moveOptions(i, j, colour);
    }
}



import { ChessGame } from './chessgame.js';


export class Piece {

    public game: ChessGame;
    public boardstate: string[][] = [];

    constructor(game: ChessGame){

        this.game = game;
        this.boardstate = game.boardstate;
    }

    invalidCoordinates(i: number, j: number){

        return !this.game.validCoordinates(i, j);
    }

    legalPosition(i: number, j: number, colour: string){

        return this.game.legalPosition(i, j, colour);
    }

    pawnMove(i: number, j: number) {

        if (this.invalidCoordinates(i, j) === true) {
            return false
        }
        if (this.boardstate[i][j] === ".") {
            this.game.addDot(i, j)
            return true
        }
        return false
    }

    pawnCapture(i: number, j: number, colour: string) {

        if (this.invalidCoordinates(i, j) === true) {
            return
        }
        if (this.boardstate[i][j] === "." || this.boardstate[i][j][1] === colour) {
            return
        }
        this.game.addCircle(i, j)
    }

    pawnOptions(i: number, j: number, colour: string) {

        if (colour === "w") {
            if (this.pawnMove(i - 1, j) === true) {
                // starting bonus
                if (i === 6) {
                    this.pawnMove(i - 2, j)
                }
            }
            // capture diagonals
            this.pawnCapture(i - 1, j - 1, colour)
            this.pawnCapture(i - 1, j + 1, colour)
            // en passant
        }

        if (colour === "b") {
            if (this.pawnMove(i + 1, j) === true) {
                // starting bonus
                if (i === 1) {
                    this.pawnMove(i + 2, j)
                }
            }
            // capture diagonals
            this.pawnCapture(i + 1, j - 1, colour)
            this.pawnCapture(i + 1, j + 1, colour)
            // en passant
        }
    }

    rookOptions(i: number, j: number, colour: string) {

        // up
        var x = i - 1
        while (this.legalPosition(x, j, colour) === true) {
            x -= 1
        }
        // down
        var x = i + 1
        while (this.legalPosition(x, j, colour) === true) {
            x += 1
        }
        // left
        var x = j - 1
        while (this.legalPosition(i, x, colour) === true) {
            x -= 1
        }
        // right
        var x = j + 1
        while (this.legalPosition(i, x, colour) === true) {
            x += 1
        }
    }

    knightOptions(i: number, j: number, colour: string) {

        this.legalPosition(i + 2, j - 1, colour)
        this.legalPosition(i + 1, j - 2, colour)
        this.legalPosition(i - 1, j - 2, colour)
        this.legalPosition(i - 2, j - 1, colour)
        this.legalPosition(i - 2, j + 1, colour)
        this.legalPosition(i - 1, j + 2, colour)
        this.legalPosition(i + 1, j + 2, colour)
        this.legalPosition(i + 2, j + 1, colour)
    }

    bishopOptions(i: number, j: number, colour: string) {

        // NE
        var a = i - 1
        var b = j + 1
        while (this.legalPosition(a, b, colour) === true) {
            a -= 1
            b += 1
        }
        // SE
        var a = i + 1
        var b = j + 1
        while (this.legalPosition(a, b, colour) === true) {
            a += 1
            b += 1
        }
        // SW
        var a = i + 1
        var b = j - 1
        while (this.legalPosition(a, b, colour) === true) {
            a += 1
            b -= 1
        }
        // NW
        var a = i - 1
        var b = j - 1
        while (this.legalPosition(a, b, colour) === true) {
            a -= 1
            b -= 1
        }
    }

    kingOptions(i: number, j: number, colour: string) {

        this.legalPosition(i - 1, j, colour)
        this.legalPosition(i - 1, j + 1, colour)
        this.legalPosition(i, j + 1, colour)
        this.legalPosition(i + 1, j + 1, colour)
        this.legalPosition(i + 1, j, colour)
        this.legalPosition(i + 1, j - 1, colour)
        this.legalPosition(i, j - 1, colour)
        this.legalPosition(i - 1, j - 1, colour)
    }
}
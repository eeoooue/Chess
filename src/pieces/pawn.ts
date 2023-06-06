

import { ChessGame } from '../chessgame.js';
import { WebChessGame } from '../webchessgame.js';
import { Piece } from "../piece.js";
import { EmptyPiece } from './emptypiece.js';

export class Pawn extends Piece {

    constructor(webgame: WebChessGame, game: ChessGame, colour: string) {
        super(webgame, game, colour, "pawn");
    }

    override moveOptions(i: number, j: number): void {

        switch (this.colour){
            case "b":
                this.blackPawnOptions(i, j);
                return;
            default:
                this.whitePawnOptions(i, j);
                return;
        }
    }

    pawnMove(i: number, j: number) : boolean {

        if (this.game.validCoordinates(i, j)){
            const destination: Piece = this.boardState[i][j];
            if (destination instanceof EmptyPiece) {
                this.canMove(i, j);
                return true
            }
        }
        return false
    }

    pawnCapture(i: number, j: number) : void {

        if (this.game.validCoordinates(i, j)){
            const targetPiece = this.boardState[i][j];
            if (targetPiece instanceof EmptyPiece || targetPiece.colour == this.colour) {
                return
            }
            this.canMove(i, j);
        }        
    }


    blackPawnOptions(i: number, j: number) {

        if (this.pawnMove(i + 1, j) === true) {
            // starting bonus
            if (i === 1) {
                this.pawnMove(i + 2, j)
            }
        }
        // capture diagonals
        this.pawnCapture(i + 1, j - 1)
        this.pawnCapture(i + 1, j + 1)
        // en passant
    }


    whitePawnOptions(i: number, j: number) {

        if (this.colour === "w") {
            if (this.pawnMove(i - 1, j) === true) {
                // starting bonus
                if (i === 6) {
                    this.pawnMove(i - 2, j)
                }
            }
            // capture diagonals
            this.pawnCapture(i - 1, j - 1)
            this.pawnCapture(i - 1, j + 1)
            // en passant
        }
    }
}
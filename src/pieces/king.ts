

import { ChessGame } from '../chessgame.js';
import { WebChessGame } from '../webchessgame.js';
import { Piece } from "../piece.js";

export class King extends Piece {

    constructor(webgame: WebChessGame, game: ChessGame, colour: string, i:number, j:number) {
        super(webgame, game, colour, "king", i, j);
    }

    override moveOptions(i: number, j: number): void {

        this.kingOptions(i, j);
    }

    kingOptions(i: number, j: number) {

        this.canMove(i - 1, j)
        this.canMove(i - 1, j + 1)
        this.canMove(i, j + 1)
        this.canMove(i + 1, j + 1)
        this.canMove(i + 1, j)
        this.canMove(i + 1, j - 1)
        this.canMove(i, j - 1)
        this.canMove(i - 1, j - 1)
    }

    isInCheck() : boolean {

        // pawn
        if (this.threatenedByPawn()){
            return true;
        }

        // king
        if (this.threatenedByKing()){
            return true;
        }

        // bishop, queen
        if (this.threatenedByDiagonals()){
            return true;
        }

        // knight
        if (this.threatenedByKnight()){
            return true;
        }

        // rook, queen
        if (this.threatenedByStraights()){
            return true
        }

        return false;
    }

    threatenedByDiagonals() : boolean {

        return false;
    }

    threatenedByKing() : boolean {
        
        return false;
    }

    threatenedByKnight(): boolean {

        return false;
    }

    threatenedByStraights(): boolean {

        return false;
    }

    threatenedByPawn() : boolean {

        return false;
    }
}
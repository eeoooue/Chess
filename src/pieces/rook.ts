
import { ChessGame } from '../chessgame.js';
import { Piece } from "../piece.js";
import { BoardPosition } from '../BoardPosition.js';

export class Rook extends Piece {

    constructor(game: ChessGame, colour: string, i:number, j:number) {
        super(game, colour, "rook", i, j);
    }

    override moveOptions(i: number, j: number): void {

        this.rookOptions(i, j);
    }

    rookOptions(i: number, j: number) {

        const position = new BoardPosition(i, j);

        this.checkAlongImpulse(position, -1, 0);
        this.checkAlongImpulse(position, 1, 0);
        this.checkAlongImpulse(position, 0, -1);
        this.checkAlongImpulse(position, 0, 1);
    }
}
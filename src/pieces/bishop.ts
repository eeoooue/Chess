

import { ChessGame } from '../chessgame.js';
import { WebChessGame } from '../webchessgame.js';
import { Piece } from "../piece.js";
import { BoardPosition } from '../BoardPosition.js';


export class Bishop extends Piece {

    constructor(webgame: WebChessGame, game: ChessGame, colour: string) {
        super(webgame, game, colour, "bishop");
    }

    override moveOptions(i: number, j: number): void {

        this.bishopOptions(i, j);
    }
    
    bishopOptions(i: number, j: number) {
        
        const position = new BoardPosition(i, j);

        this.checkAlongImpulse(position, -1, 1);
        this.checkAlongImpulse(position, 1, 1);
        this.checkAlongImpulse(position, 1, -1);
        this.checkAlongImpulse(position, -1, -1);
    }

    checkAlongImpulse(position: BoardPosition, di: number, dj: number){

        var i = position.i + di;
        var j = position.j + dj;

        while (this.legalPosition(i, j, this.colour) === true) {
            i += di;
            j += dj;
        }
    }
}
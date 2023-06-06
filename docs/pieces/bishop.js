import { Piece } from "../piece.js";
import { BoardPosition } from '../BoardPosition.js';
export class Bishop extends Piece {
    constructor(webgame, game, colour) {
        super(webgame, game, colour, "bishop");
    }
    moveOptions(i, j) {
        this.bishopOptions(i, j);
    }
    bishopOptions(i, j) {
        const position = new BoardPosition(i, j);
        this.checkAlongImpulse(position, -1, 1);
        this.checkAlongImpulse(position, 1, 1);
        this.checkAlongImpulse(position, 1, -1);
        this.checkAlongImpulse(position, -1, -1);
    }
}

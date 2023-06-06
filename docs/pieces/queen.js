import { Piece } from "../piece.js";
import { BoardPosition } from '../BoardPosition.js';
export class Queen extends Piece {
    constructor(webgame, game, colour, i, j) {
        super(webgame, game, colour, "queen", i, j);
    }
    moveOptions(i, j) {
        this.queenOptions(i, j);
    }
    queenOptions(i, j) {
        const position = new BoardPosition(i, j);
        this.checkAlongImpulse(position, -1, 0);
        this.checkAlongImpulse(position, 1, 0);
        this.checkAlongImpulse(position, 0, -1);
        this.checkAlongImpulse(position, 0, 1);
        this.checkAlongImpulse(position, -1, 1);
        this.checkAlongImpulse(position, 1, 1);
        this.checkAlongImpulse(position, 1, -1);
        this.checkAlongImpulse(position, -1, -1);
    }
}

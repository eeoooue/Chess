import { Piece } from "../piece.js";
import { BoardPosition } from '../BoardPosition.js';
export class Queen extends Piece {
    constructor(webgame, game, colour) {
        super(webgame, game, colour, "queen");
    }
    moveOptions(i, j) {
        this.queenOptions(i, j, this.colour);
    }
    queenOptions(i, j, colour) {
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
    checkAlongImpulse(position, di, dj) {
        var i = position.i + di;
        var j = position.j + dj;
        while (this.legalPosition(i, j, this.colour) === true) {
            i += di;
            j += dj;
        }
    }
}

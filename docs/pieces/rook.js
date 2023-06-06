import { Piece } from "../piece.js";
import { BoardPosition } from '../BoardPosition.js';
export class Rook extends Piece {
    constructor(webgame, game, colour) {
        super(webgame, game, colour, "rook");
    }
    moveOptions(i, j) {
        this.rookOptions(i, j);
    }
    rookOptions(i, j) {
        const position = new BoardPosition(i, j);
        this.checkAlongImpulse(position, -1, 0);
        this.checkAlongImpulse(position, 1, 0);
        this.checkAlongImpulse(position, 0, -1);
        this.checkAlongImpulse(position, 0, 1);
    }
    checkAlongImpulse(position, di, dj) {
        var i = position.i + di;
        var j = position.j + dj;
        while (this.legalPosition(i, j) == true) {
            i += di;
            j += dj;
        }
    }
}

export class Piece {
    constructor(webgame, game, colour) {
        this.boardstate = [];
        this.webgame = webgame;
        this.boardstate = game.boardstate;
        this.game = game;
        this.colour = colour;
    }
    moveOptions(i, j, colour) { }
    invalidCoordinates(i, j) {
        return !this.game.validCoordinates(i, j);
    }
    legalPosition(i, j, colour) {
        return this.game.legalPosition(i, j, colour);
    }
}

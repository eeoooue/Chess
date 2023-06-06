export class Piece {
    constructor(webgame, game, colour, name) {
        this.webgame = webgame;
        this.boardOfPieces = game.boardOfPieces;
        this.game = game;
        this.colour = colour;
        this.name = name;
    }
    moveOptions(i, j) { }
    invalidCoordinates(i, j) {
        return !this.game.validCoordinates(i, j);
    }
    legalPosition(i, j, colour) {
        return this.game.legalPosition(i, j, colour);
    }
}

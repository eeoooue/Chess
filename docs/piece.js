import { BoardPosition } from './BoardPosition.js';
export class Piece {
    constructor(webgame, game, colour, name, i, j) {
        this.possibleMoves = [];
        this.webgame = webgame;
        this.boardState = game.boardState;
        this.game = game;
        this.colour = colour;
        this.name = name;
        this.i = i;
        this.j = j;
        this.threatened = false;
        game.attach(this);
    }
    //#region observer pattern
    // Receive update from subject.
    update(subject) {
        this.possibleMoves = [];
        this.moveOptions(this.i, this.j);
    }
    //#endregion observer pattern
    getMoveOptions(i, j) {
        return this.possibleMoves;
    }
    moveOptions(i, j) { }
    invalidCoordinates(i, j) {
        return !this.game.validCoordinates(i, j);
    }
    canMove(i, j) {
        if (this.game.legalPosition(i, j, this.colour)) {
            const targetPiece = this.boardState[i][j];
            targetPiece.threatened = true;
            const move = new BoardPosition(i, j);
            this.possibleMoves.push(move);
            return true;
        }
        return false;
    }
    checkAlongImpulse(position, di, dj) {
        var i = position.i + di;
        var j = position.j + dj;
        while (this.canMove(i, j) == true) {
            const piece = this.boardState[i][j];
            if (piece.colour == "b" || piece.colour == "w") {
                break;
            }
            i += di;
            j += dj;
        }
    }
}

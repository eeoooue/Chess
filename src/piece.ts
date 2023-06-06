
import { ChessGame } from './chessgame.js';
import { WebChessGame } from './webchessgame.js';

export class Piece {

    public webgame: WebChessGame;
    public boardOfPieces: Piece[][];
    public game: ChessGame;
    public colour: string;
    public name: string;

    constructor(webgame: WebChessGame, game: ChessGame, colour: string, name: string) {

        this.webgame = webgame;
        this.boardOfPieces = game.boardOfPieces;
        this.game = game;
        this.colour = colour;
        this.name = name;
    }

    moveOptions(i: number, j: number): void { }

    invalidCoordinates(i: number, j: number) {

        return !this.game.validCoordinates(i, j);
    }

    legalPosition(i: number, j: number) {

        return this.game.legalPosition(i, j, this.colour);
    }
}

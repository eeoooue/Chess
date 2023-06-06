
import { ChessGame } from './chessgame.js';
import { WebChessGame } from './webchessgame.js';

export class Piece {

    public webgame: WebChessGame;
    public boardstate: string[][] = [];
    public game: ChessGame;
    public colour: string;

    constructor(webgame: WebChessGame, game: ChessGame, colour: string) {

        this.webgame = webgame;
        this.boardstate = game.boardstate;
        this.game = game;
        this.colour = colour;
    }

    moveOptions(i: number, j: number, colour: string): void { }

    invalidCoordinates(i: number, j: number) {

        return !this.game.validCoordinates(i, j);
    }

    legalPosition(i: number, j: number, colour: string) {

        return this.game.legalPosition(i, j, colour);
    }
}

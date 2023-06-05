
import { ChessGame } from './chessgame.js';
import { WebChessGame } from './webchessgame.js';

export class Piece {

    public webgame: WebChessGame;
    public boardstate: string[][] = [];
    public game: ChessGame;

    constructor(webgame: WebChessGame, game: ChessGame) {

        this.webgame = webgame;
        this.boardstate = game.boardstate;
        this.game = game;
    }

    moveOptions(i: number, j: number, colour: string): void { }

    invalidCoordinates(i: number, j: number) {

        return !this.game.validCoordinates(i, j);
    }

    legalPosition(i: number, j: number, colour: string) {

        return this.game.legalPosition(i, j, colour);
    }
}

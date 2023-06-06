
import { ChessGame } from './chessgame.js';
import { WebChessGame } from './webchessgame.js';
import { BoardPosition } from './BoardPosition.js';

export class Piece {

    public webgame: WebChessGame;
    public boardOfPieces: Piece[][];
    public game: ChessGame;
    public colour: string;
    public name: string;
    public possibleMoves: BoardPosition[] = [];

    constructor(webgame: WebChessGame, game: ChessGame, colour: string, name: string) {

        this.webgame = webgame;
        this.boardOfPieces = game.boardState;
        this.game = game;
        this.colour = colour;
        this.name = name;
    }

    getMoveOptions(i: number, j: number): BoardPosition[] {

        this.possibleMoves = [];
        this.moveOptions(i, j);
        return this.possibleMoves;
    }

    protected moveOptions(i: number, j: number): void { }

    invalidCoordinates(i: number, j: number) {

        return !this.game.validCoordinates(i, j);
    }

    canMove(i: number, j: number) : boolean {

        if (this.game.legalPosition(i, j, this.colour)){
            const move: BoardPosition = new BoardPosition(i, j);
            this.possibleMoves.push(move);
            return true;
        }

        return false;
    }

    checkAlongImpulse(position: BoardPosition, di: number, dj: number){

        var i = position.i + di;
        var j = position.j + dj;

        while (this.canMove(i, j) == true) {
            i += di;
            j += dj;
        }
    }
}

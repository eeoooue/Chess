
import { ChessGame } from './chessgame.js';
import { WebChessGame } from './webchessgame.js';
import { BoardPosition } from './BoardPosition.js';
import { Observer } from './observer.js';
import { Subject } from "./subject.js";

export class Piece implements Observer {

    public webgame: WebChessGame;
    public boardState: Piece[][];
    public game: ChessGame;
    public colour: string;
    public name: string;
    public possibleMoves: BoardPosition[] = [];
    public i: number;
    public j: number;

    constructor(webgame: WebChessGame, game: ChessGame, colour: string, name: string, i: number, j: number) {

        this.webgame = webgame;
        this.boardState = game.boardState;
        this.game = game;
        this.colour = colour;
        this.name = name;
        this.i = i;
        this.j = j;
        game.attach(this);
    }

    //#region observer pattern


    // Receive update from subject.
    update(subject: Subject): void {

        this.possibleMoves = [];
        this.moveOptions(this.i, this.j);
    }

    //#endregion observer pattern

    getMoveOptions(i: number, j: number): BoardPosition[] {

        return this.possibleMoves;
    }

    protected moveOptions(i: number, j: number): void { }

    invalidCoordinates(i: number, j: number) {

        return !this.game.validCoordinates(i, j);
    }

    canMove(i: number, j: number): boolean {

        if (this.game.legalPosition(i, j, this.colour)) {
            const move: BoardPosition = new BoardPosition(i, j);
            this.possibleMoves.push(move);
            return true;
        }

        return false;
    }

    checkAlongImpulse(position: BoardPosition, di: number, dj: number) {

        var i = position.i + di;
        var j = position.j + dj;

        while (this.canMove(i, j) == true) {
            const piece: Piece = this.boardState[i][j];
            if (piece.colour == "b" || piece.colour == "w") {
                break;
            }
            i += di;
            j += dj;
        }
    }
}


import { ChessGame } from './chessgame.js';
import { WebChessGame } from './webchessgame.js';
import { BoardPosition } from './BoardPosition.js';
import { Observer } from './observer.js';
import { Subject } from "./subject.js";
import { King } from './pieces/king.js';
import { AnalysisBoard } from './AnalysisBoard.js';

export class Piece implements Observer {

    public boardState: Piece[][];
    public game: ChessGame;
    public colour: string;
    public name: string;
    public possibleMoves: BoardPosition[] = [];
    public i: number;
    public j: number;
    public threatened: boolean;
    public hasMoved: boolean = false;

    constructor(game: ChessGame, colour: string, name: string, i: number, j: number) {

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
    update(subject: Subject): void {

        this.possibleMoves = [];
        this.moveOptions(this.i, this.j);
    }

    //#endregion observer pattern

    getMoveOptions(): BoardPosition[] {

        return this.possibleMoves;
    }

    destroy() {
        this.game.detach(this);
    }

    protected moveOptions(i: number, j: number): void { }

    invalidCoordinates(i: number, j: number) {

        return !this.game.validCoordinates(i, j);
    }

    isSafeMove(destination: BoardPosition): boolean {

        const start = new BoardPosition(this.i, this.j);
        const analysisBoard = new AnalysisBoard(this.boardState, this.colour);
        analysisBoard.submitMove(start, destination);
        return analysisBoard.isSafe();
    }

    canMove(i: number, j: number): boolean {

        if (this.game.legalPosition(i, j, this.colour)) {

            const move: BoardPosition = new BoardPosition(i, j);

            if (this.isSafeMove(move)) {
                const targetPiece = this.boardState[i][j];
                targetPiece.threatened = true;
                this.possibleMoves.push(move);
            }

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

    moveTo(position: BoardPosition) {

        this.hasMoved = true;
        this.i = position.i;
        this.j = position.j;
        this.boardState[this.i][this.j] = this;
    }

    inMoveOptions(i: number, j: number){

        const n: number = this.possibleMoves.length;

        for(let index=0; index<n; index++){
            const position = this.possibleMoves[index];
            if (position.i == i && position.j == j){
                return true
            }
        }
        return false;
    }
}

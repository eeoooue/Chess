
import { BoardPosition } from "./board_position.js";

export class MoveTracker {

    public startMove: undefined | BoardPosition;
    public endMove: undefined | BoardPosition;

    public setStartMove(i: number, j: number) : void {

        this.startMove = new BoardPosition(i, j);
    }

    public setEndMove(i: number, j: number) : void {

        this.endMove = new BoardPosition(i, j);
    }
}
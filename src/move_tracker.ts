
import { BoardPosition } from "./board_position.js";

export class MoveTracker {

    private startMove: undefined | BoardPosition;
    private endMove: undefined | BoardPosition;

    public setStartMove(i: number, j: number) : void {

        this.startMove = new BoardPosition(i, j);
    }

    public setEndMove(i: number, j: number) : void {

        this.endMove = new BoardPosition(i, j);
    }

    public getStartMove(): BoardPosition | undefined {

        return this.startMove;
    }

    public getEndMove(): BoardPosition | undefined {

        return this.endMove;
    }
}
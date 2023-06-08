import { BoardPosition } from "./board_position.js";
export class MoveTracker {
    setStartMove(i, j) {
        this.startMove = new BoardPosition(i, j);
    }
    setEndMove(i, j) {
        this.endMove = new BoardPosition(i, j);
    }
}

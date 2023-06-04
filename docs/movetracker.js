export class MoveTracker {
    setStartMove(i, j) {
        this.startMove = [i, j];
    }
    setEndMove(i, j) {
        this.endMove = [i, j];
    }
    getStartMove() {
        return this.startMove;
    }
    getEndMove() {
        return this.endMove;
    }
}

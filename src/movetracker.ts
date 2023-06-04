

export class MoveTracker {

    private startMove: undefined | number[];
    private endMove: undefined | number[];

    public setStartMove(i: number, j: number) : void {

        this.startMove = [i, j];
    }

    public setEndMove(i: number, j: number) : void {

        this.endMove = [i, j];
    }

    public getStartMove(){

        return this.startMove;
    }

    public getEndMove(){

        return this.endMove;
    }
}
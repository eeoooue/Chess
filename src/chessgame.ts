
import { ChessMove } from "./chessmove.js";
import { MoveTracker } from "./movetracker.js";
import { Piece } from "./piece.js";

export class ChessGame {

    public boardContainer: HTMLElement;
    public turncount: number = 0;
    public active: boolean = false;

    public boardstate: string[][] = [];
    public grid: HTMLElement[][] = [];
    public moveTracker = new MoveTracker();

    constructor(boardContainer: HTMLElement) {

        this.boardContainer = boardContainer;
        this.paintTiles()
        this.initializeBoardstate()
        this.fullboardPiecePaint()
    }

    public checkClickEvent(): void {

        const move: ChessMove | null = this.findClickedCell();

        if (!move) {
            return;
        }

        if (!this.active) {
            this.processStartMove(move);
        } else if (this.active) {
            this.processEndCell(move)
            if (this.active) {
                this.clearHighlights();
                this.active = false;
                this.processStartMove(move);
            }
        }
    }

    setValidMove(i: number, j: number): void {

        const tile = this.grid[i][j];
        if (!tile.classList.contains("validmove")) {
            this.grid[i][j].classList.add("validmove")
        }
    }

    findClickedCell(): ChessMove | null {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const tile = this.grid[i][j]
                if (tile instanceof HTMLElement) {
                    if (tile.classList.contains("clicked")) {
                        tile.classList.remove("clicked")
                        return new ChessMove(i, j);
                    }
                }
            }
        }

        return null;
    }

    

    getTurnPlayer(): string {

        if (this.turncount % 2 == 0) {
            return "w";
        }
        return "b";
    }

    validStart(i: number, j: number): boolean {

        if (this.boardstate[i][j] === "." || this.boardstate[i][j][1] != this.getTurnPlayer()) {
            return false
        }
        return true
    }

    validEnd(i: number, j: number): boolean {

        const tile = this.grid[i][j]
        if (tile.classList.contains("validmove")) {
            return true
        }
        return false
    }

    processStartMove(move: ChessMove) {

        if (this.validStart(move.i, move.j)) {
            this.activateStart(move.i, move.j);
        }
    }

    processEndCell(move: ChessMove) {

        if (this.validEnd(move.i, move.j)) {
            this.moveTracker.setEndMove(move.i, move.j);
            this.active = false;
            this.submitMove();
        }
    }

    activateStart(i: number, j: number) {

        const tile = this.grid[i][j]
        this.moveTracker.setStartMove(i, j);
        tile.classList.add("highlighted")
        this.active = true;
        this.populateOptions(i, j);
    }

    populateOptions(i: number, j: number) {

        const pieceChar: string = this.boardstate[i][j][0];
        const pieceName = this.lookupPiece(pieceChar);
        const colour = this.boardstate[i][j][1];
        const piece = this.instantiatePiece(pieceName);

        if (pieceName === "pawn") {
            piece.pawnOptions(i, j, colour)
        }
        if (pieceName === "knight") {
            piece.knightOptions(i, j, colour)
        }
        if (pieceName === "rook" || pieceName === "queen") {
            piece.rookOptions(i, j, colour)
        }
        if (pieceName === "bishop" || pieceName === "queen") {
            piece.bishopOptions(i, j, colour)
        }
        if (pieceName === "king") {
            piece.kingOptions(i, j, colour)
        }
    }

    instantiatePiece(pieceName: string): Piece {

        return new Piece(this);
    }

    submitMove() {

        const startMove: number[] | undefined = this.moveTracker.getStartMove();
        const endMove: number[] | undefined = this.moveTracker.getEndMove();

        if (!startMove || !endMove) {
            return;
        }

        let a = startMove[0];
        let b = startMove[1];
        let x = endMove[0];
        let y = endMove[1];

        this.boardstate[x][y] = this.boardstate[a][b]
        this.boardstate[a][b] = "."
        this.paintPosition(x, y)
        this.paintPosition(a, b)
        this.clearHighlights()
        this.turncount += 1
    }

    clearHighlights() {

        document.querySelectorAll(".highlighted").forEach(el => el.classList.remove("highlighted"))
        document.querySelectorAll(".validmove").forEach(el => el.classList.remove("validmove"))
        document.querySelectorAll(".markerdot").forEach(el => el.remove())
        document.querySelectorAll(".markercircle").forEach(el => el.remove())
    }

    legalPosition(i: number, j: number, colour: string): boolean {

        if (this.validCoordinates(i, j)) {
            if (this.boardstate[i][j] === ".") {
                this.addDot(i, j)
                return true
            }
            if (this.boardstate[i][j][1] != colour) {
                this.addCircle(i, j)
            }
        }
        return false
    }

    validCoordinates(i: number, j: number) {

        return (0 <= i && i < 8 && 0 <= j && j < 8);
    }

    initializeBoardstate() {

        this.boardstate.push(["Rb", "Nb", "Bb", "Qb", "Kb", "Bb", "Nb", "Rb"])
        this.boardstate.push(["Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb"])
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])
        this.boardstate.push(["Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw"])
        this.boardstate.push(["Rw", "Nw", "Bw", "Qw", "Kw", "Bw", "Nw", "Rw"])
    }

    fullboardPiecePaint() {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.paintPosition(i, j)
            }
        }
    }

    addDot(i: number, j: number) {

        const dot = document.createElement("div")
        dot.classList.add("markerdot")
        this.setValidMove(i, j)
        this.grid[i][j].appendChild(dot)
    }

    addCircle(i: number, j: number) {

        const circle = document.createElement("div")
        circle.classList.add("markercircle")
        this.setValidMove(i, j)
        this.grid[i][j].appendChild(circle)
    }

    lookupPiece(piece: string): string {

        switch (piece) {
            case "P":
                return "pawn";
            case "R":
                return "rook";
            case "N":
                return "knight";
            case "B":
                return "bishop";
            case "Q":
                return "queen";
            case "K":
                return "king";
        }

        return "";
    }

    paintPosition(i: number, j: number) {

        const tile = this.grid[i][j]
        tile.innerHTML = ""

        if (this.boardstate[i][j] == ".") {
            return;
        }

        const piece = this.boardstate[i][j][0];
        const pieceName = this.lookupPiece(piece);
        const colour = this.boardstate[i][j][1];
        const imgpath = `assets\\${pieceName}_${colour}.png`;

        const img = document.createElement("img")
        img.src = imgpath
        img.style.margin = "5px 5px"

        tile.appendChild(img)
    }

    paintTiles(): void {

        const painting = ["whitebg", "blackbg"]

        var paint: number = 0;
        for (let i = 0; i < 8; i++) {
            this.grid.push([])
            for (let j = 0; j < 8; j++) {
                const tile = document.createElement("div")
                tile.classList.add("boardtile")
                tile.classList.add(painting[paint])
                tile.addEventListener("click", () => {
                    tile.classList.toggle("clicked")
                    this.checkClickEvent()
                })
                this.grid[i].push(tile)
                this.boardContainer.appendChild(tile)
                paint = (paint + 1) % 2
            }
            paint = (paint + 1) % 2
        }
    }
}
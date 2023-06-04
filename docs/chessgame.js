import { MoveTracker } from "./movetracker.js";
import { Piece } from "./piece.js";
export class ChessGame {
    constructor() {
        this.boardContainer = document.querySelector(".board-container");
        this.turncount = 0;
        this.active = 0;
        this.boardstate = [];
        this.grid = [];
        this.moveTracker = new MoveTracker();
        this.paintTiles();
        this.initializeBoardstate();
        this.fullboardPiecePaint();
    }
    checkClickEvent() {
        const [i, j] = this.findClickedCell();
        if (this.active === 0) {
            this.processStartCell(i, j);
        }
        if (this.active === 1) {
            this.processEndCell(i, j);
            if (this.active === 1) {
                this.clearHighlights();
                this.active = 0;
                this.processStartCell(i, j);
            }
        }
    }
    setValidMove(i, j) {
        const tile = this.grid[i][j];
        if (!tile.classList.contains("validmove")) {
            this.grid[i][j].classList.add("validmove");
        }
    }
    findClickedCell() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const tile = this.grid[i][j];
                if (tile instanceof HTMLElement) {
                    if (tile.classList.contains("clicked")) {
                        tile.classList.remove("clicked");
                        return [i, j];
                    }
                }
            }
        }
        return [-1, -1];
    }
    processStartCell(i, j) {
        const tile = this.grid[i][j];
        if (this.validStart(i, j) === false) {
            return;
        }
        this.moveTracker.setStartMove(i, j);
        this.activateStart(i, j);
        tile.classList.add("highlighted");
        this.active += 1;
    }
    processEndCell(i, j) {
        if (this.validEnd(i, j) === false) {
            return;
        }
        this.moveTracker.setEndMove(i, j);
        this.active = 0;
        this.submitMove();
    }
    getTurnPlayer() {
        if (this.turncount % 2 == 0) {
            return "w";
        }
        return "b";
    }
    validStart(i, j) {
        if (this.boardstate[i][j] === "." || this.boardstate[i][j][1] != this.getTurnPlayer()) {
            return false;
        }
        return true;
    }
    validEnd(i, j) {
        const tile = this.grid[i][j];
        if (tile.classList.contains("validmove")) {
            return true;
        }
        return false;
    }
    activateStart(i, j) {
        const pieceChar = this.boardstate[i][j][0];
        const pieceName = this.lookupPiece(pieceChar);
        const colour = this.boardstate[i][j][1];
        const piece = this.instantiatePiece(pieceName);
        if (pieceName === "pawn") {
            piece.pawnOptions(i, j, colour);
        }
        if (pieceName === "knight") {
            piece.knightOptions(i, j, colour);
        }
        if (pieceName === "rook" || pieceName === "queen") {
            piece.rookOptions(i, j, colour);
        }
        if (pieceName === "bishop" || pieceName === "queen") {
            piece.bishopOptions(i, j, colour);
        }
        if (pieceName === "king") {
            piece.kingOptions(i, j, colour);
        }
    }
    instantiatePiece(pieceName) {
        return new Piece(this);
    }
    submitMove() {
        const startMove = this.moveTracker.getStartMove();
        const endMove = this.moveTracker.getEndMove();
        if (!startMove || !endMove) {
            return;
        }
        let a = startMove[0];
        let b = startMove[1];
        let x = endMove[0];
        let y = endMove[1];
        this.boardstate[x][y] = this.boardstate[a][b];
        this.boardstate[a][b] = ".";
        this.paintPosition(x, y);
        this.paintPosition(a, b);
        this.clearHighlights();
        this.turncount += 1;
    }
    clearHighlights() {
        document.querySelectorAll(".highlighted").forEach(el => el.classList.remove("highlighted"));
        document.querySelectorAll(".validmove").forEach(el => el.classList.remove("validmove"));
        document.querySelectorAll(".markerdot").forEach(el => el.remove());
        document.querySelectorAll(".markercircle").forEach(el => el.remove());
    }
    legalPosition(i, j, colour) {
        if (this.invalidCoordinates(i, j)) {
            return false;
        }
        if (this.boardstate[i][j] === ".") {
            this.addDot(i, j);
            return true;
        }
        if (this.boardstate[i][j][1] != colour) {
            this.addCircle(i, j);
        }
        return false;
    }
    invalidCoordinates(i, j) {
        if (0 <= i && i < 8 && 0 <= j && j < 8) {
            return false;
        }
        return true;
    }
    initializeBoardstate() {
        this.boardstate.push(["Rb", "Nb", "Bb", "Qb", "Kb", "Bb", "Nb", "Rb"]);
        this.boardstate.push(["Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb"]);
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."]);
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."]);
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."]);
        this.boardstate.push([".", ".", ".", ".", ".", ".", ".", "."]);
        this.boardstate.push(["Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw"]);
        this.boardstate.push(["Rw", "Nw", "Bw", "Qw", "Kw", "Bw", "Nw", "Rw"]);
    }
    fullboardPiecePaint() {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.paintPosition(i, j);
            }
        }
    }
    addDot(i, j) {
        const dot = document.createElement("div");
        dot.classList.add("markerdot");
        this.setValidMove(i, j);
        this.grid[i][j].appendChild(dot);
    }
    addCircle(i, j) {
        const circle = document.createElement("div");
        circle.classList.add("markercircle");
        this.setValidMove(i, j);
        this.grid[i][j].appendChild(circle);
    }
    lookupPiece(piece) {
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
    paintPosition(i, j) {
        const tile = this.grid[i][j];
        tile.innerHTML = "";
        if (this.boardstate[i][j] == ".") {
            return;
        }
        const piece = this.boardstate[i][j][0];
        const colour = this.boardstate[i][j][1];
        const imgpath = `assets\\${this.lookupPiece(piece)}_${colour}.png`;
        const img = document.createElement("img");
        img.src = imgpath;
        img.style.margin = "5px 5px";
        tile.appendChild(img);
    }
    paintTiles() {
        const painting = ["whitebg", "blackbg"];
        if (this.boardContainer == null) {
            return;
        }
        var paint = 0;
        for (let i = 0; i < 8; i++) {
            this.grid.push([]);
            for (let j = 0; j < 8; j++) {
                const tile = document.createElement("div");
                tile.classList.add("boardtile");
                tile.classList.add(painting[paint]);
                tile.addEventListener("click", () => {
                    tile.classList.toggle("clicked");
                    this.checkClickEvent();
                });
                this.grid[i].push(tile);
                this.boardContainer.appendChild(tile);
                paint = (paint + 1) % 2;
            }
            paint = (paint + 1) % 2;
        }
    }
}

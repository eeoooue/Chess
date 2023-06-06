import { ChessGame } from "./chessgame.js";
import { BoardPosition } from "./BoardPosition.js";
import { MoveTracker } from "./movetracker.js";
import { EmptyPiece } from "./pieces/emptypiece.js";
export class WebChessGame {
    constructor(boardContainer) {
        this.grid = [];
        this.moveTracker = new MoveTracker();
        this.boardContainer = boardContainer;
        this.game = new ChessGame(this);
        this.paintTiles();
        this.paintPieces(this.game.boardOfPieces);
    }
    checkClickEvent() {
        const move = this.findClickedCell();
        if (move) {
            this.game.interpretSelection(move);
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
                        return new BoardPosition(i, j);
                    }
                }
            }
        }
        return null;
    }
    clearHighlights() {
        document.querySelectorAll(".highlighted").forEach(el => el.classList.remove("highlighted"));
        document.querySelectorAll(".validmove").forEach(el => el.classList.remove("validmove"));
        document.querySelectorAll(".markerdot").forEach(el => el.remove());
        document.querySelectorAll(".markercircle").forEach(el => el.remove());
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
    paintPieces(boardstate) {
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.paintPosition(new BoardPosition(i, j), boardstate[i][j]);
            }
        }
    }
    paintPosition(position, piece) {
        const tile = this.grid[position.i][position.j];
        tile.innerHTML = "";
        if (piece instanceof EmptyPiece) {
            return;
        }
        const imgpath = `assets\\${piece.name}_${piece.colour}.png`;
        const img = document.createElement("img");
        img.src = imgpath;
        img.style.margin = "5px 5px";
        tile.appendChild(img);
    }
    paintTiles() {
        const painting = ["whitebg", "blackbg"];
        var paint = 0;
        for (let i = 0; i < 8; i++) {
            this.grid.push([]);
            for (let j = 0; j < 8; j++) {
                const tile = this.createTile(painting[paint]);
                this.grid[i].push(tile);
                this.boardContainer.appendChild(tile);
                paint = (paint + 1) % 2;
            }
            paint = (paint + 1) % 2;
        }
    }
    createTile(paint) {
        const tile = document.createElement("div");
        tile.classList.add("boardtile");
        tile.classList.add(paint);
        tile.addEventListener("click", () => {
            tile.classList.toggle("clicked");
            this.checkClickEvent();
        });
        return tile;
    }
}

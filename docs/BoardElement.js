import { BoardPosition } from "./BoardPosition.js";
import { EmptyPiece } from "./pieces/emptypiece.js";
import { King } from "./pieces/king.js";
export class BoardElement {
    constructor(parent, boardContainer, game) {
        this.grid = [];
        this.parent = parent;
        this.boardContainer = boardContainer;
        this.game = game;
        this.game.attach(this);
        this.paintTiles();
        this.paintPieces();
    }
    //#region observer pattern
    update(subject) {
        this.paintPieces();
        this.clearHighlights();
    }
    //#endregion
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
        document.querySelectorAll(".markerdot").forEach(el => el.remove());
        document.querySelectorAll(".markercircle").forEach(el => el.remove());
    }
    addDot(i, j) {
        const dot = document.createElement("div");
        dot.classList.add("markerdot");
        this.grid[i][j].appendChild(dot);
    }
    addCircle(i, j) {
        const circle = document.createElement("div");
        circle.classList.add("markercircle");
        this.grid[i][j].appendChild(circle);
    }
    paintPieces() {
        const boardstate = this.game.boardState;
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
        var img_name = `${piece.name}_${piece.colour}`;
        if (piece instanceof King) {
            const kingPiece = piece;
            if (kingPiece.threatened) {
                img_name += `_check`;
            }
        }
        const img = document.createElement("img");
        img.src = `assets\\${img_name}.png`;
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
            this.parent.checkClickEvent();
        });
        return tile;
    }
    paintMoveOptions(options) {
        const n = options.length;
        for (let i = 0; i < n; i++) {
            const move = options[i];
            const piece = this.game.boardState[move.i][move.j];
            if (piece instanceof EmptyPiece) {
                this.addDot(move.i, move.j);
            }
            else {
                this.addCircle(move.i, move.j);
            }
        }
    }
}

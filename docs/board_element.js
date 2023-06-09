import { BoardPosition } from "./board_position.js";
import { EmptyPiece } from "./pieces/empty_piece.js";
import { King } from "./pieces/king.js";
export class BoardElement {
    constructor(parent, boardContainer, game) {
        this.grid = [];
        this.parent = parent;
        this.boardContainer = boardContainer;
        this.game = game;
        this.paintTiles();
        this.repaint();
    }
    repaint() {
        this.clearPreviousBoard();
        this.paintPieces(this.game.getPieces());
    }
    clearPreviousBoard() {
        document.querySelectorAll(".chess-piece").forEach(el => el.remove());
        document.querySelectorAll(".highlighted").forEach(el => el.classList.remove("highlighted"));
        document.querySelectorAll(".markerdot").forEach(el => el.remove());
        document.querySelectorAll(".markercircle").forEach(el => el.remove());
    }
    paintPieces(pieces) {
        pieces.forEach((piece) => {
            this.paintPiece(piece);
        });
    }
    paintPiece(piece) {
        if (piece instanceof EmptyPiece) {
            return;
        }
        const tile = this.grid[piece.i][piece.j];
        const img = this.createImageElement(piece);
        tile.appendChild(img);
    }
    createImageElement(piece) {
        const img_name = this.getImageFilename(piece);
        const img = document.createElement("img");
        img.classList.add("chess-piece");
        img.src = `assets\\${img_name}.png`;
        return img;
    }
    getImageFilename(piece) {
        var img_name = `${piece.name}_${piece.colour}`;
        if (piece instanceof King) {
            const kingPiece = piece;
            if (kingPiece.threatened) {
                img_name += `_check`;
            }
        }
        return img_name;
    }
    paintTiles() {
        const paints = ["whitebg", "blackbg"];
        for (let i = 0; i < 8; i++) {
            const line = [];
            for (let j = 0; j < 8; j++) {
                this.paintTile(line, i, j, paints[(i + j) % 2]);
            }
            this.grid.push(line);
        }
    }
    paintTile(list, i, j, paint) {
        const tile = this.createTile(paint);
        tile.addEventListener("click", () => {
            const position = new BoardPosition(i, j);
            this.parent.processSelection(position);
        });
        list.push(tile);
        this.boardContainer.appendChild(tile);
    }
    createTile(paint) {
        const tile = document.createElement("div");
        tile.classList.add("boardtile");
        tile.classList.add(paint);
        return tile;
    }
    highlightActivePiece(piece) {
        const tile = this.grid[piece.i][piece.j];
        tile.classList.add("highlighted");
        this.paintMoveOptions(piece.possibleMoves);
    }
    paintMoveOptions(options) {
        options.forEach((position) => {
            this.illustrateMoveOption(position);
        });
    }
    illustrateMoveOption(position) {
        const piece = this.game.boardState[position.i][position.j];
        if (piece instanceof EmptyPiece) {
            this.addDot(position.i, position.j);
        }
        else {
            this.addCircle(position.i, position.j);
        }
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
}

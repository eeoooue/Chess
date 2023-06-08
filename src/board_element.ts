
import { WebChessGame } from "./web_chess_game.js";
import { ChessGame } from "./chess_game.js";
import { BoardPosition } from "./board_position.js";
import { Piece } from "./piece.js";
import { EmptyPiece } from "./pieces/empty_piece.js";
import { King } from "./pieces/king.js";
import { Observer } from "./observer.js";
import { Subject } from "./subject.js";

export class BoardElement implements Observer {

    public boardContainer: HTMLElement;
    public grid: HTMLElement[][] = [];
    public game: ChessGame;
    public parent: WebChessGame;

    constructor(parent: WebChessGame, boardContainer: HTMLElement, game: ChessGame) {

        this.parent = parent;
        this.boardContainer = boardContainer;
        this.game = game;
        this.game.attach(this);

        this.paintTiles()
        this.paintPieces(this.game.getPieces())
    }

    update(subject: Subject): void {

        this.clearPreviousBoard()
        this.paintPieces(this.game.getPieces())
    }

    clearPreviousBoard() {

        document.querySelectorAll(".chess-piece").forEach(el => el.remove())
        document.querySelectorAll(".highlighted").forEach(el => el.classList.remove("highlighted"))
        document.querySelectorAll(".markerdot").forEach(el => el.remove())
        document.querySelectorAll(".markercircle").forEach(el => el.remove())
    }

    addDot(i: number, j: number) {

        const dot = document.createElement("div")
        dot.classList.add("markerdot")
        this.grid[i][j].appendChild(dot)
    }

    addCircle(i: number, j: number) {

        const circle = document.createElement("div")
        circle.classList.add("markercircle")
        this.grid[i][j].appendChild(circle)
    }

    paintPieces(pieces: Piece[]) {

        pieces.forEach((piece) => {
            this.paintPiece(piece);
        })
    }

    paintPiece(piece: Piece) {

        if (piece instanceof EmptyPiece) {
            return;
        }

        const tile = this.grid[piece.i][piece.j]
        const img = this.createImageElement(piece);
        tile.appendChild(img)
    }

    createImageElement(piece: Piece): HTMLImageElement {

        const img_name = this.getImageFilename(piece);

        const img = document.createElement("img")
        img.classList.add("chess-piece")
        img.src = `assets\\${img_name}.png`
        img.style.margin = "5px 5px"

        return img;
    }

    getImageFilename(piece: Piece) {

        var img_name = `${piece.name}_${piece.colour}`;

        if (piece instanceof King) {
            const kingPiece = piece as King;
            if (kingPiece.threatened) {
                img_name += `_check`
            }
        }

        return img_name;
    }

    paintTiles(): void {

        const paints = ["whitebg", "blackbg"]

        for (let i = 0; i < 8; i++) {
            const line: HTMLElement[] = [];
            for (let j = 0; j < 8; j++) {
                this.paintTile(line, i, j, paints[(i + j) % 2]);
            }
            this.grid.push(line);
        }
    }

    paintTile(list: HTMLElement[], i: number, j: number, paint: string){

        const tile = this.createTile(paint);
        tile.addEventListener("click", () => {
            this.parent.processMove(i, j);
        })

        list.push(tile)
        this.boardContainer.appendChild(tile)
    }

    createTile(paint: string): HTMLElement {

        const tile: HTMLElement = document.createElement("div")
        tile.classList.add("boardtile")
        tile.classList.add(paint)

        return tile;
    }

    paintMoveOptions(options: BoardPosition[]) {

        options.forEach((position) => {
            this.illustrateMoveOption(position);
        })
    }

    illustrateMoveOption(position: BoardPosition){

        const piece: Piece = this.game.boardState[position.i][position.j]
        if (piece instanceof EmptyPiece) {
            this.addDot(position.i, position.j)
        } else {
            this.addCircle(position.i, position.j)
        }
    }
}
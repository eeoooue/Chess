
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

    constructor(parent: WebChessGame, boardContainer: HTMLElement, game: ChessGame){

        this.parent = parent;
        this.boardContainer = boardContainer;
        this.game = game;
        this.game.attach(this);

        this.paintTiles()
        this.paintPieces()
    }

    //#region observer pattern

    update(subject: Subject): void {

        this.paintPieces()
        this.clearHighlights()
    }

    //#endregion

    findClickedCell(): BoardPosition | null {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const tile = this.grid[i][j]
                if (tile instanceof HTMLElement) {
                    if (tile.classList.contains("clicked")) {
                        tile.classList.remove("clicked")
                        return new BoardPosition(i, j);
                    }
                }
            }
        }

        return null;
    }

    clearHighlights() {

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

    paintPieces() {

        const boardstate = this.game.boardState;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.paintPiece(boardstate[i][j])
            }
        }
    }

    paintPiece(piece: Piece) {        

        const tile = this.grid[piece.i][piece.j]
        tile.innerHTML = ""

        if (piece instanceof EmptyPiece) {
            return;
        }

        var img_name = `${piece.name}_${piece.colour}`;

        if (piece instanceof King){
            const kingPiece = piece as King;
            if (kingPiece.threatened){
                img_name += `_check`
            }
        }

        const img = document.createElement("img")
        img.classList.add("chess-piece")
        img.src = `assets\\${img_name}.png`
        img.style.margin = "5px 5px"

        tile.appendChild(img)
    }

    paintTiles(): void {

        const painting = ["whitebg", "blackbg"]

        var paint: number = 0;
        for (let i = 0; i < 8; i++) {
            this.grid.push([])
            for (let j = 0; j < 8; j++) {
                const tile = this.createTile(painting[paint]);
                this.grid[i].push(tile)
                this.boardContainer.appendChild(tile)
                paint = (paint + 1) % 2
            }
            paint = (paint + 1) % 2
        }
    }

    createTile(paint: string): HTMLElement {

        const tile: HTMLElement = document.createElement("div")
        tile.classList.add("boardtile")
        tile.classList.add(paint)

        tile.addEventListener("click", () => {
            tile.classList.toggle("clicked")
            this.parent.checkClickEvent()
        })

        return tile;
    }

    paintMoveOptions(options: BoardPosition[]){

        const n: number = options.length;

        for(let i=0; i<n; i++){
            const move = options[i];
            const piece: Piece = this.game.boardState[move.i][move.j]

            if (piece instanceof EmptyPiece){
                this.addDot(move.i, move.j)
            } else {
                this.addCircle(move.i, move.j)
            }
        }
    }
}
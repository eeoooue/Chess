
import { ChessGame } from "./chessgame.js";
import { BoardPosition } from "./BoardPosition.js";
import { MoveTracker } from "./movetracker.js";
import { Piece } from "./piece.js";
import { EmptyPiece } from "./pieces/emptypiece.js";
import { King } from "./pieces/king.js";
import { Observer } from "./observer.js";
import { Subject } from "./subject.js";

export class WebChessGame implements Observer {

    public boardContainer: HTMLElement;
    public grid: HTMLElement[][] = [];
    public moveTracker = new MoveTracker();
    public game: ChessGame;

    constructor(boardContainer: HTMLElement) {

        this.boardContainer = boardContainer;
        this.game = new ChessGame();
        this.paintTiles()
        this.paintPieces()
        this.game.attach(this)
    }

    newGame() {

        this.boardContainer.innerHTML = "";
        new WebChessGame(this.boardContainer);
        // this.game = new ChessGame();
        // this.paintTiles()
        // this.paintPieces()
        // this.game.attach(this)
    }

    //#region observer pattern

    

    update(subject: Subject): void {

        this.paintPieces()
        this.clearHighlights()
    }

    //#endregion

    public checkClickEvent(): void {

        const move: BoardPosition | null = this.findClickedCell();

        if (move) {
            this.game.interpretSelection(move);
            if (this.game.active){
                const piece : Piece = this.game.boardState[move.i][move.j]

                const tile = this.grid[move.i][move.j]
                tile.classList.add("highlighted")

                const options: BoardPosition[] = piece.getMoveOptions();
                this.paintMoveOptions(options);                
            }

            if (this.game.state != "ongoing"){
                this.showEndCard(this.game);
            }
        }
    }

    showEndCard(game: ChessGame){

        const container = document.querySelector(".main-container");

        if (!container){
            return;
        }

        const endCard = this.deriveEndCard(game);
        this.boardContainer.appendChild(endCard);

        console.log("end card added to DOM")
    }


    deriveEndCard(game: ChessGame): HTMLDivElement {

        var cardText = "The game is ongoing."

        if (game.state == "checkmate"){
            const loser = game.getTurnPlayer();
            const winner = (loser == "w") ? "Black" : "White";
            cardText = `That's checkmate, ${winner} wins!`
        }

        if (game.state == "stalemate"){
            cardText = `It's a stalemate.`
        }

        if (game.state == "repetition-draw"){
            cardText = `It's a draw by repetition (threefold).`
        }

        const playAgainText = "Would you like to play again?"

        return this.createEndCard(cardText, playAgainText);
    }

    createEndCard(cardText: string, playAgainText: string): HTMLDivElement {

        const card = document.createElement("div");
        card.classList.add("end-card");

        const header1 = document.createElement("h2");
        header1.innerText = cardText;
        card.appendChild(header1);

        const header2 = document.createElement("h3");
        header2.innerText = playAgainText;
        card.appendChild(header2);

        const playAgainBtn = document.createElement("button");
        playAgainBtn.innerText = "New Game";

        playAgainBtn.addEventListener("click", () => {
            this.newGame();
        })

        card.appendChild(playAgainBtn);

        return card;
    }

    setValidMove(i: number, j: number): void {

        const tile = this.grid[i][j];
        if (!tile.classList.contains("validmove")) {
            this.grid[i][j].classList.add("validmove")
        }
    }

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
        document.querySelectorAll(".validmove").forEach(el => el.classList.remove("validmove"))
        document.querySelectorAll(".markerdot").forEach(el => el.remove())
        document.querySelectorAll(".markercircle").forEach(el => el.remove())
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

    paintPieces() {

        const boardstate = this.game.boardState;

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.paintPosition(new BoardPosition(i, j), boardstate[i][j])
            }
        }
    }

    paintPosition(position: BoardPosition, piece: Piece) {

        const tile = this.grid[position.i][position.j]
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
            this.checkClickEvent()
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
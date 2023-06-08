
import { ChessGame } from "./chess_game.js";
import { BoardPosition } from "./board_position.js";
import { Piece } from "./piece.js";
import { BoardElement } from "./board_element.js";
import { EndCard } from "./end_card.js";
import { PromotionCard } from "./promotion_card.js";

export class WebChessGame {

    public mainContainer: HTMLElement;
    public boardContainer: HTMLElement;
    public game: ChessGame;
    public boardElement: BoardElement;

    constructor(mainContainer: HTMLElement, boardContainer: HTMLElement) {

        this.mainContainer = mainContainer;
        this.boardContainer = boardContainer;
        this.game = new ChessGame();

        this.boardElement = new BoardElement(this, this.boardContainer, this.game);
    }

    newGame() {

        this.boardContainer.innerHTML = "";
        this.game = new ChessGame();
        this.boardElement = new BoardElement(this, this.boardContainer, this.game);
    }

    public processMove(i: number, j: number) : void {

        const move: BoardPosition = new BoardPosition(i, j);

        if (move) {
            this.game.submitSelection(move);
            if (this.game.moveTracker.active){
                const piece : Piece = this.game.boardState[move.i][move.j]
                const tile = this.boardElement.grid[move.i][move.j]
                tile.classList.add("highlighted")
                const options: BoardPosition[] = piece.possibleMoves;
                this.boardElement.paintMoveOptions(options);                
            }

            if (this.game.state == "checkmate" || this.game.state == "stalemate"){
                this.showEndCard();
            }
    
            if (this.game.state == "promotion"){
                this.askPromotionOption();
            }
        }
    }

    askPromotionOption(): void {

        const promotionCard = new PromotionCard(this, this.game);
        this.boardContainer.appendChild(promotionCard.element);
    }

    showEndCard(){
        const endCard = new EndCard(this, this.game);
        this.boardContainer.appendChild(endCard.element);
    }
}
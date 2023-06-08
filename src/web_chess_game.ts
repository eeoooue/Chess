
import { ChessGame } from "./chess_game.js";
import { BoardPosition } from "./board_position.js";
import { Piece } from "./piece.js";
import { BoardElement } from "./board_element.js";
import { EndCard } from "./end_card.js";
import { PromotionCard } from "./promotion_card.js";

export class WebChessGame {

    public boardContainer: HTMLElement;
    public game: ChessGame;
    public boardElement: BoardElement;

    constructor(boardContainer: HTMLElement) {

        this.boardContainer = boardContainer;
        this.game = new ChessGame();
        this.boardElement = new BoardElement(this, this.boardContainer, this.game);
    }

    newGame() {

        this.boardContainer.innerHTML = "";
        this.game = new ChessGame();
        this.boardElement = new BoardElement(this, this.boardContainer, this.game);
    }

    public processSelection(position: BoardPosition) : void {

        const piece: Piece = this.game.submitSelection(position);
        this.refresh();

        if (this.game.moveTracker.active){
            this.boardElement.highlightActivePiece(piece);
        }
    }

    refresh(): void {

        this.boardElement.repaint();

        if (this.game.state == "checkmate" || this.game.state == "stalemate"){
            this.showEndCard();
        }

        if (this.game.state == "promotion"){
            this.askPromotionOption();
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
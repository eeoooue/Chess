import { ChessGame } from "./chess_game.js";
import { BoardPosition } from "./board_position.js";
import { BoardElement } from "./board_element.js";
import { EndCard } from "./end_card.js";
import { PromotionCard } from "./promotion_card.js";
export class WebChessGame {
    constructor(mainContainer, boardContainer) {
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
    processSelection(i, j) {
        const move = new BoardPosition(i, j);
        const piece = this.game.submitSelection(move);
        this.refresh();
        if (this.game.moveTracker.active) {
            this.boardElement.highlightActivePiece(piece);
        }
    }
    refresh() {
        this.boardElement.repaint();
        if (this.game.state == "checkmate" || this.game.state == "stalemate") {
            this.showEndCard();
        }
        if (this.game.state == "promotion") {
            this.askPromotionOption();
        }
    }
    askPromotionOption() {
        const promotionCard = new PromotionCard(this, this.game);
        this.boardContainer.appendChild(promotionCard.element);
    }
    showEndCard() {
        const endCard = new EndCard(this, this.game);
        this.boardContainer.appendChild(endCard.element);
    }
}

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
        this.game.attach(this);
        this.boardElement = new BoardElement(this, this.boardContainer, this.game);
    }
    newGame() {
        this.boardContainer.innerHTML = "";
        this.game = new ChessGame();
        this.boardElement = new BoardElement(this, this.boardContainer, this.game);
    }
    //#region observer pattern
    update(subject) { }
    //#endregion
    processMove(i, j) {
        const move = new BoardPosition(i, j);
        if (move) {
            this.game.submitSelection(move);
            if (this.game.active) {
                const piece = this.game.boardState[move.i][move.j];
                const tile = this.boardElement.grid[move.i][move.j];
                tile.classList.add("highlighted");
                const options = piece.possibleMoves;
                this.boardElement.paintMoveOptions(options);
            }
            if (this.game.state == "checkmate" || this.game.state == "stalemate") {
                this.showEndCard();
            }
            if (this.game.state == "promotion") {
                this.askPromotionOption();
            }
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

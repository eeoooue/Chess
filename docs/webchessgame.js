import { ChessGame } from "./chessgame.js";
import { BoardElement } from "./BoardElement.js";
import { EndCard } from "./EndCard.js";
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
    update(subject) {
    }
    //#endregion
    checkClickEvent() {
        const move = this.boardElement.findClickedCell();
        if (move) {
            this.game.interpretSelection(move);
            if (this.game.active) {
                const piece = this.game.boardState[move.i][move.j];
                const tile = this.boardElement.grid[move.i][move.j];
                tile.classList.add("highlighted");
                const options = piece.getMoveOptions();
                this.boardElement.paintMoveOptions(options);
            }
            if (this.game.state != "ongoing") {
                this.showEndCard();
            }
        }
    }
    showEndCard() {
        const endCard = new EndCard(this, this.game);
        this.boardContainer.appendChild(endCard.element);
    }
}

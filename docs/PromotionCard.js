import { BoardPosition } from "./BoardPosition.js";
import { Pawn } from "./pieces/pawn.js";
export class PromotionCard {
    constructor(parent, game) {
        this.game = game;
        this.parent = parent;
        this.element = this.deriveEndCard(this.game);
    }
    getPromotingPawn(i) {
        for (let j = 0; j < 8; j++) {
            const piece = this.game.boardState[i][j];
            if (piece instanceof Pawn) {
                return new BoardPosition(i, j);
            }
        }
        return new BoardPosition(-1, -1);
    }
    deriveEndCard(game) {
        // const position: BoardPosition = this.getPromotingPawn(0);
        const bigText = "Promoting white pawn.";
        const subText = "Which piece should your pawn become?";
        return this.createEndCard(bigText, subText);
    }
    createEndCard(bigText, subText) {
        const card = document.createElement("div");
        card.classList.add("end-card");
        const header1 = document.createElement("h2");
        header1.innerText = bigText;
        card.appendChild(header1);
        const header2 = document.createElement("h3");
        header2.innerText = subText;
        card.appendChild(header2);
        const options = [];
        options.push("Bishop");
        options.push("Knight");
        options.push("Rook");
        options.push("Queen");
        for (let i = 0; i < 4; i++) {
            const optionText = options[i];
            const optionBtn = document.createElement("button");
            optionBtn.innerText = optionText;
            optionBtn.addEventListener("click", () => {
                this.submitChoice(optionText);
            });
            card.appendChild(optionBtn);
        }
        return card;
    }
    submitChoice(text) {
        console.log(`you chose ${text}`);
        return;
    }
}

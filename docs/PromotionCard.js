export class PromotionCard {
    constructor(parent, game) {
        this.game = game;
        this.parent = parent;
        this.element = this.deriveEndCard(this.game);
    }
    deriveEndCard(game) {
        const position = this.game.getPromotingPawnPosition();
        const piece = this.game.boardState[position.i][position.j];
        const colour = (piece.colour == "b") ? "black" : "white";
        const bigText = `Promoting ${colour} pawn.`;
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
        this.game.submitPromotionChoice(text);
        this.element.remove();
    }
}

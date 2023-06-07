
import { WebChessGame } from "./webchessgame.js";
import { ChessGame } from "./chessgame.js";
import { BoardPosition } from "./BoardPosition.js";
import { Piece } from "./piece.js";
import { Pawn } from "./pieces/pawn.js";


export class PromotionCard {

    public parent: WebChessGame;
    public game: ChessGame;
    public element: HTMLDivElement;

    constructor(parent: WebChessGame, game: ChessGame) {

        this.game = game;
        this.parent = parent;
        this.element = this.deriveEndCard(this.game);
    }

    getPromotingPawn(i: number) {

        for (let j = 0; j < 8; j++) {
            const piece: Piece = this.game.boardState[i][j];
            if (piece instanceof Pawn){
                return new BoardPosition(i, j);
            }
        }

        return new BoardPosition(-1, -1);
    }

    deriveEndCard(game: ChessGame): HTMLDivElement {

        // const position: BoardPosition = this.getPromotingPawn(0);

        const bigText = "Promoting white pawn."
        const subText = "Which piece should your pawn become?"

        return this.createEndCard(bigText, subText);
    }

    createEndCard(bigText: string, subText: string): HTMLDivElement {

        const card = document.createElement("div");
        card.classList.add("end-card");

        const header1 = document.createElement("h2");
        header1.innerText = bigText;
        card.appendChild(header1);

        const header2 = document.createElement("h3");
        header2.innerText = subText;
        card.appendChild(header2);

        const options: string[] = [];
        options.push("Bishop");
        options.push("Knight");
        options.push("Rook");
        options.push("Queen");

        for(let i = 0; i<4; i++){

            const optionText = options[i];
            const optionBtn = document.createElement("button");
            optionBtn.innerText = optionText;

            optionBtn.addEventListener("click", () => {
                this.submitChoice(optionText);
            })

            card.appendChild(optionBtn);
        }

        return card;
    }

    submitChoice(text: string){

        console.log(`you chose ${text}`)

        return;
    }
}
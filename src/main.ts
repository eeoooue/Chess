

import { ChessGame } from './chessgame.js';



const boardContainer: HTMLElement | null = document.querySelector(".board-container")

if (boardContainer){
    new ChessGame(boardContainer);
}


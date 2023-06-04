import { ChessGame } from './chessgame.js';
const boardContainer = document.querySelector(".board-container");
if (boardContainer) {
    new ChessGame(boardContainer);
}

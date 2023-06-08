import { WebChessGame } from './web_chess_game.js';
const boardContainer = document.querySelector(".board-container");
if (boardContainer) {
    new WebChessGame(boardContainer);
}

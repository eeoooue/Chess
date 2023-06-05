import { WebChessGame } from './webchessgame.js';
const boardContainer = document.querySelector(".board-container");
if (boardContainer) {
    new WebChessGame(boardContainer);
}

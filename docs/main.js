import { WebChessGame } from './webchessgame.js';
const boardContainer = document.querySelector(".board-container");
const mainContainer = document.querySelector(".main-container");
if (mainContainer && boardContainer) {
    new WebChessGame(mainContainer, boardContainer);
}


import { WebChessGame } from './webchessgame.js';

const boardContainer: HTMLElement | null = document.querySelector(".board-container")

if (boardContainer){
    new WebChessGame(boardContainer);
}

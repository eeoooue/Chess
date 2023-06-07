
import { WebChessGame } from './webchessgame.js';

const boardContainer: HTMLElement | null = document.querySelector(".board-container")
const mainContainer: HTMLElement | null = document.querySelector(".main-container")

if (mainContainer && boardContainer){
    new WebChessGame(mainContainer, boardContainer);
}

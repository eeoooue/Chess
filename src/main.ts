
import { WebChessGame } from './web_chess_game.js';

const boardContainer: HTMLElement | null = document.querySelector(".board-container")

if (boardContainer){
    new WebChessGame(boardContainer);
}

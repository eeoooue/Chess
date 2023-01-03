
import { grid, boardstate, piecelook } from './chessboard/main.js';

export function fullboardPiecePaint(){

    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            paintPosition(i, j)
        }
    }
}

export function addDot(i, j){
    
    const dot = document.createElement("div")
    dot.classList.add("markerdot")
    grid[i][j].classList.add("validmove")
    grid[i][j].appendChild(dot)
}

export function addCircle(i, j){

    const circle = document.createElement("div")
    circle.classList.add("markercircle")
    grid[i][j].classList.add("validmove")
    grid[i][j].appendChild(circle)
}


export function paintPosition(i, j){

    const tile = grid[i][j]
    tile.innerHTML = ""

    if(boardstate[i][j]=="."){
        return;
    }

    const piece = boardstate[i][j][0]
    const colour = boardstate[i][j][1]
    const imgpath = `assets\\${piecelook[piece]}_${colour}.png`

    const img = document.createElement("img")
    img.src = imgpath
    img.style.margin = "5px 5px"

    tile.appendChild(img)
}




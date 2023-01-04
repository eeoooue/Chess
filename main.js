
import { fullboardPiecePaint, addDot, addCircle, paintPosition, paintTiles } from './painter.js';
import { pawnOptions, rookOptions, knightOptions, bishopOptions, kingOptions } from './pieces.js';
import { initializeBoardstate } from './boardbuilder.js';

export const chessboard = document.querySelector(".board-container")

var turncount = 0
var active = 0
export var enpassant = {"available": false, "j": 0}

export const piecelook = {
    "P": "pawn",
    "R": "rook",
    "N": "knight",
    "B": "bishop",
    "Q": "queen",
    "K": "king"
}

export var boardstate = []
export var grid = []

const currentmove = {"start": null, "end": null}
const turnplayer = ["w", "b"]


paintTiles()
initializeBoardstate()
fullboardPiecePaint()

export function checkClickEvent(){

    // prefer we just find the clicked coordinates & check for .validmove

    const [i, j] = findClickedCell();

    if(active===0){
        processStartCell(i, j);
    }
    if(active===1){
        processEndCell(i, j)
        if(active===1){
            clearHighlights();
            active = 0;
            processStartCell(i, j);
        }
    }
}

export function setValidMove(i, j){

    const tile = grid[i][j];
    if(!tile.classList.contains("validmove")){
        grid[i][j].classList.add("validmove")
    }
}


function findClickedCell(){

    for(let i=0; i<8; i++){
        for(let j=0; j<8; j++){
            const tile = grid[i][j]
            if(tile.classList.contains("clicked")){
                tile.classList.remove("clicked")
                return [i, j];
            }
        }
    }
}

function processStartCell(i, j){

    const tile = grid[i][j]
    if(validStart(i, j)===false){
        return;
    }
    currentmove["start"] = [i, j]
    activateStart(i, j)
    tile.classList.add("highlighted")
    active += 1
}

function processEndCell(i, j){

    const tile = grid[i][j]
    if(validEnd(i, j)===false){
        return;
    }
    currentmove["end"] = [i, j]
    active = 0
    submitMove()
}

function validStart(i, j){

    if(boardstate[i][j]==="." || boardstate[i][j][1] != turnplayer[turncount%2]){
        return false
    }
    return true
}

function validEnd(i, j){

    const tile = grid[i][j]
    if(tile.classList.contains("validmove")){
        return true
    }
    return false
}



function activateStart(i, j){

    const piece = piecelook[boardstate[i][j][0]]
    const colour = boardstate[i][j][1]

    if(piece==="pawn"){
        pawnOptions(i, j, colour)
    }
    if(piece==="knight"){
        knightOptions(i, j, colour)
    }
    if(piece==="rook" || piece==="queen"){
        rookOptions(i, j, colour)
    }
    if(piece==="bishop" || piece==="queen"){
        bishopOptions(i, j, colour)
    }
    if(piece==="king"){
        kingOptions(i, j, colour)
    }
}





function submitMove(){

    let a = currentmove["start"][0]
    let b = currentmove["start"][1]
    console.log(`move starts @ (${a}, ${b})`)

    let x = currentmove["end"][0]
    let y = currentmove["end"][1]
    console.log(`move ends @ (${x}, ${y})`)

    boardstate[x][y] = boardstate[a][b]
    boardstate[a][b] = "."

    paintPosition(x, y)
    paintPosition(a, b)
    clearHighlights()
    turncount += 1
}

function clearHighlights(){

    document.querySelectorAll(".highlighted").forEach(el => el.classList.remove("highlighted"))
    document.querySelectorAll(".validmove").forEach(el => el.classList.remove("validmove"))
    document.querySelectorAll(".markerdot").forEach(el => el.remove())
    document.querySelectorAll(".markercircle").forEach(el => el.remove())
}



// generating options for moving pieces

export function pawnMove(i, j){

    if(invalidCoordinates(i, j)===true){
        return false
    }
    if(boardstate[i][j]==="."){
        addDot(i, j)
        return true
    }
    return false
}

export function pawnCapture(i, j, colour){

    if(invalidCoordinates(i, j)===true){
        return
    }
    if(boardstate[i][j]==="." || boardstate[i][j][1]===colour){
        return
    }
    addCircle(i, j)
}

export function legalPosition(i, j, colour){

    if(invalidCoordinates(i, j)===true){
        return false;
    }
    if(boardstate[i][j]==="."){
        addDot(i, j)
        return true
    }
    if(boardstate[i][j][1] != colour){
        addCircle(i, j)
    }
    return false
}

function invalidCoordinates(i, j){

    if(0 <= i && i < 8 && 0 <= j && j < 8){
        return false
    }
    return true
}
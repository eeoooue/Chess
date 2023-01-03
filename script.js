
import { SayHello } from '..//module.js'



const chessboard = document.querySelector(".board-container")

var turncount = 0
var active = 0
var enpassant = {"available": false, "j": 0}

SayHello();

// make two 8x8 threat grids to determine check

const piecelook = {
    "P": "pawn",
    "R": "rook",
    "N": "knight",
    "B": "bishop",
    "Q": "queen",
    "K": "king"
}

var boardstate = []
var grid = []
const threat = {"w": [], "b": []}

const currentmove = {"start": null, "end": null}
const turnplayer = ["w", "b"]
const in_check = {"w": false, "b": false}
const king_pos = {"w": [7, 4], "b": [0, 4]}


paintTiles()
initializeBoardstate()
fullboardPiecePaint()

function checkClickEvent(){

    // prefer we just find the clicked coordinates & check for .validmove

    if(active===0){
        findStartCell()
    }
    if(active===1){
        findEndCell()
    }
    
}

function findStartCell(){

    for(i=0; i<8; i++){
        for(j=0; j<8; j++){
            const tile = grid[i][j]
            if(tile.classList.contains("clicked")){
                tile.classList.remove("clicked")
                if(validStart(i, j)===false){
                    return;
                }
                currentmove["start"] = [i, j]
                activateStart(i, j)
                tile.classList.add("highlighted")
                active = 1
            }
        }
    }
}

function findEndCell(){

    for(i=0; i<8; i++){
        for(j=0; j<8; j++){
            const tile = grid[i][j]
            if(tile.classList.contains("clicked")){
                tile.classList.remove("clicked")
                if(validEnd(i, j)===false){
                    return;
                }
                currentmove["end"] = [i, j]
                active = 0
                submitMove()
            }
        }
    }
}



function validStart(i, j){

    if(boardstate[i][j]==="." || boardstate[i][j][1] != turnplayer[turncount%2]){
        return false
    }
    return true
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

function addDot(i, j){
    
    const dot = document.createElement("div")
    dot.classList.add("markerdot")
    grid[i][j].classList.add("validmove")
    grid[i][j].appendChild(dot)
}

function addCircle(i, j){

    const circle = document.createElement("div")
    circle.classList.add("markercircle")
    grid[i][j].classList.add("validmove")
    grid[i][j].appendChild(circle)
}

function legalPosition(i, j, colour){

    if(invalidCoordinates(i, j)===false){
        if(boardstate[i][j]==="."){
            addDot(i, j)
            return true
        }
        if(boardstate[i][j][1] != colour){
            addCircle(i, j)
        }
    }
    return false
}

function submitMove(){

    a = currentmove["start"][0]
    b = currentmove["start"][1]
    console.log(`move starts @ (${a}, ${b})`)

    x = currentmove["end"][0]
    y = currentmove["end"][1]
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

    // removing threat markings
    document.querySelectorAll(".b").forEach(el => el.classList.remove("b"))
    document.querySelectorAll(".w").forEach(el => el.classList.remove("w"))

    updateThreatGrids()
}



function validEnd(i, j){

    const tile = grid[i][j]
    if(tile.classList.contains("validmove")){
        return true
    }
    return false
}

function initializeBoardstate(){

    boardstate.push(["Rb", "Nb", "Bb", "Qb", "Kb", "Bb", "Nb", "Rb"])
    boardstate.push(["Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb"])

    boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])
    boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])

    boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])
    boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])

    boardstate.push(["Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw"])
    boardstate.push(["Rw", "Nw", "Bw", "Qw", "Kw", "Bw", "Nw", "Rw"])

    initializeThreatGrids()

}




function paintPosition(i, j){

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

function fullboardPiecePaint(){

    for(i=0; i<8; i++){
        for(j=0; j<8; j++){
            paintPosition(i, j)
        }
    }
}


function paintTiles(){

    const painting = ["whitebg", "blackbg"]

    var paint = 0
    for(i=0; i<8; i++){
        grid.push([])
        for(j=0; j<8; j++){
            const tile = document.createElement("div")
            tile.classList.add("boardtile")
            tile.classList.add(painting[paint])
            tile.addEventListener("click", () => {
                tile.classList.toggle("clicked")
                checkClickEvent()
            })
            grid[i].push(tile)
            chessboard.appendChild(tile)
            paint = (paint + 1) % 2
        }
        paint = (paint + 1) % 2
    }

    console.log(grid)

}

function invalidCoordinates(i, j){

    if(0 <= i && i < 8 && 0 <= j && j < 8){
        return false
    }
    return true

}

// generating options for moving pieces

function pawnMove(i, j){

    if(invalidCoordinates(i, j)===true){
        return false
    }
    if(boardstate[i][j]==="."){
        addDot(i, j)
        return true
    }
    return false
}

function pawnCapture(i, j, colour){

    if(invalidCoordinates(i, j)===true){
        return
    }
    if(boardstate[i][j]==="." || boardstate[i][j][1]===colour){
        return
    }
    addCircle(i, j)
    
}

function pawnOptions(i, j, colour){

    if(colour==="w"){
        if(pawnMove(i-1, j)===true){
            // starting bonus
            if(i===6){
                pawnMove(i-2, j)
            }
        }
        // capture diagonals
        pawnCapture(i-1, j-1)
        pawnCapture(i-1, j+1)
        // en passant
        if(enpassant["available"]===true){
            console.log("Google en passant")
        }
    }

    if(colour==="b"){
        if(pawnMove(i+1, j)===true){
            // starting bonus
            if(i===1){
                pawnMove(i+2, j)
            }
        }
        // capture diagonals
        pawnCapture(i+1, j-1)
        pawnCapture(i+1, j+1)
        // en passant
        if(enpassant["available"]===true){
            console.log("Google en passant")
        }
    }
}

function rookOptions(i, j, colour){

    // up
    var x = i-1
    while(legalPosition(x, j, colour)===true){
        x -= 1
    }
    // down
    var x = i+1
    while(legalPosition(x, j, colour)===true){
        x += 1
    }
    // left
    var x = j-1
    while(legalPosition(i, x, colour)===true){
        x -= 1
    }
    // right
    var x = j+1
    while(legalPosition(i, x, colour)===true){
        x += 1
    }
}


function knightOptions(i, j, colour){
    
    legalPosition(i+2, j-1, colour)
    legalPosition(i+1, j-2, colour)
    legalPosition(i-1, j-2, colour)
    legalPosition(i-2, j-1, colour)
    legalPosition(i-2, j+1, colour)
    legalPosition(i-1, j+2, colour)
    legalPosition(i+1, j+2, colour)
    legalPosition(i+2, j+1, colour)
}

function bishopOptions(i, j, colour){

    // NE
    var a = i-1
    var b = j+1
    while(legalPosition(a, b, colour)===true){
        a -= 1
        b += 1
    }
    // SE
    var a = i+1
    var b = j+1
    while(legalPosition(a, b, colour)===true){
        a += 1
        b += 1
    }
    // SW
    var a = i+1
    var b = j-1
    while(legalPosition(a, b, colour)===true){
        a += 1
        b -= 1
    }
    // NW
    var a = i-1
    var b = j-1
    while(legalPosition(a, b, colour)===true){
        a -= 1
        b -= 1
    }
}

function kingOptions(i, j, colour){
    
    legalPosition(i-1, j, colour)
    legalPosition(i-1, j+1, colour)
    legalPosition(i, j+1, colour)
    legalPosition(i+1, j+1, colour)
    legalPosition(i+1, j, colour)
    legalPosition(i+1, j-1, colour)
    legalPosition(i, j-1, colour)
    legalPosition(i-1, j-1, colour)
}

// threat check (8x8 boolean grids[i][j]===true)

function initializeThreatGrids(){

    for(i=0; i<8; i++){
        threat["b"].push([])
        threat["w"].push([])
        for(j=0; j<8; j++){
            threat["b"][i].push(false)
            threat["w"][i].push(false)
        }
    }
    updateThreatGrids()
}

function updateThreatGrids(){

    for(i=0; i<8; i++){
        for(j=0; j<8; j++){
            threat["b"][i][j] = false
            threat["w"][i][j] = false
        }
    }
    for(i=0; i<8; i++){
        for(j=0; j<8; j++){
            evaluateThreatFrom(i, j)
        }
    }
}

function evaluateThreatFrom(i, j){

    if(boardstate[i][j]=="."){
        return
    }
    const piece = piecelook[boardstate[i][j][0]]
    const colour = boardstate[i][j][1]

    if(piece==="pawn"){
        pawnThreaten(i, j, colour)
    }
    if(piece==="knight"){
        knightThreaten(i, j, colour)
    }
    if(piece==="rook" || piece==="queen"){
        rookThreaten(i, j, colour)
    }
    if(piece==="bishop" || piece==="queen"){
        bishopThreaten(i, j, colour)
    }
    if(piece==="king"){
        kingThreaten(i, j, colour)
    }
}

function tryThreaten(i, j, colour){

    if(invalidCoordinates(i, j)===false){
        if(boardstate[i][j]==="." || boardstate[i][j][1] != colour){
            threat[colour][i][j] = true
            //grid[i][j].classList.add(colour)
        }
    }
}



function pawnThreaten(i, j, colour){

    if(colour==="w"){
        // capture diagonals
        tryThreaten(i-1, j-1, colour)
        tryThreaten(i-1, j+1, colour)
        // en passant
        if(enpassant["available"]===true){
            console.log("Google en passant")
        }
    }

    if(colour==="b"){
        // capture diagonals
        tryThreaten(i+1, j-1, colour)
        tryThreaten(i+1, j+1, colour)
        // en passant
        if(enpassant["available"]===true){
            console.log("Google en passant")
        }
    }
}

function rookThreaten(i, j, colour){

    // up
    var x = i-1
    while(tryThreaten(x, j, colour)===true){
        x -= 1
    }
    // down
    var x = i+1
    while(tryThreaten(x, j, colour)===true){
        x += 1
    }
    // left
    var x = j-1
    while(tryThreaten(i, x, colour)===true){
        x -= 1
    }
    // right
    var x = j+1
    while(tryThreaten(i, x, colour)===true){
        x += 1
    }
}


function knightThreaten(i, j, colour){
    
    tryThreaten(i+2, j-1, colour)
    tryThreaten(i+1, j-2, colour)
    tryThreaten(i-1, j-2, colour)
    tryThreaten(i-2, j-1, colour)
    tryThreaten(i-2, j+1, colour)
    tryThreaten(i-1, j+2, colour)
    tryThreaten(i+1, j+2, colour)
    tryThreaten(i+2, j+1, colour)
}

function bishopThreaten(i, j, colour){

    // NE
    var a = i-1
    var b = j+1
    while(tryThreaten(a, b, colour)===true){
        a -= 1
        b += 1
    }
    // SE
    var a = i+1
    var b = j+1
    while(tryThreaten(a, b, colour)===true){
        a += 1
        b += 1
    }
    // SW
    var a = i+1
    var b = j-1
    while(tryThreaten(a, b, colour)===true){
        a += 1
        b -= 1
    }
    // NW
    var a = i-1
    var b = j-1
    while(tryThreaten(a, b, colour)===true){
        a -= 1
        b -= 1
    }
}

function kingThreaten(i, j, colour){
    
    tryThreaten(i-1, j, colour)
    tryThreaten(i-1, j+1, colour)
    tryThreaten(i, j+1, colour)
    tryThreaten(i+1, j+1, colour)
    tryThreaten(i+1, j, colour)
    tryThreaten(i+1, j-1, colour)
    tryThreaten(i, j-1, colour)
    tryThreaten(i-1, j-1, colour)
}
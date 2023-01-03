
import { enpassant, pawnMove, pawnCapture, legalPosition, tryThreaten } from './main.js';

// movement options

export function pawnOptions(i, j, colour){

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

export function rookOptions(i, j, colour){

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


export function knightOptions(i, j, colour){
    
    legalPosition(i+2, j-1, colour)
    legalPosition(i+1, j-2, colour)
    legalPosition(i-1, j-2, colour)
    legalPosition(i-2, j-1, colour)
    legalPosition(i-2, j+1, colour)
    legalPosition(i-1, j+2, colour)
    legalPosition(i+1, j+2, colour)
    legalPosition(i+2, j+1, colour)
}

export function bishopOptions(i, j, colour){

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

export function kingOptions(i, j, colour){
    
    legalPosition(i-1, j, colour)
    legalPosition(i-1, j+1, colour)
    legalPosition(i, j+1, colour)
    legalPosition(i+1, j+1, colour)
    legalPosition(i+1, j, colour)
    legalPosition(i+1, j-1, colour)
    legalPosition(i, j-1, colour)
    legalPosition(i-1, j-1, colour)
}



// threaten

export function pawnThreaten(i, j, colour){

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

export function rookThreaten(i, j, colour){

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


export function knightThreaten(i, j, colour){
    
    tryThreaten(i+2, j-1, colour)
    tryThreaten(i+1, j-2, colour)
    tryThreaten(i-1, j-2, colour)
    tryThreaten(i-2, j-1, colour)
    tryThreaten(i-2, j+1, colour)
    tryThreaten(i-1, j+2, colour)
    tryThreaten(i+1, j+2, colour)
    tryThreaten(i+2, j+1, colour)
}

export function bishopThreaten(i, j, colour){

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

export function kingThreaten(i, j, colour){
    
    tryThreaten(i-1, j, colour)
    tryThreaten(i-1, j+1, colour)
    tryThreaten(i, j+1, colour)
    tryThreaten(i+1, j+1, colour)
    tryThreaten(i+1, j, colour)
    tryThreaten(i+1, j-1, colour)
    tryThreaten(i, j-1, colour)
    tryThreaten(i-1, j-1, colour)
}
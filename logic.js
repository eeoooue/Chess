


import { boardstate } from './main.js';


export function legalPosition(i, j, colour){

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


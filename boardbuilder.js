
import { boardstate } from './main.js';

export function initializeBoardstate(){

    boardstate.push(["Rb", "Nb", "Bb", "Qb", "Kb", "Bb", "Nb", "Rb"])
    boardstate.push(["Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb", "Pb"])

    boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])
    boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])

    boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])
    boardstate.push([".", ".", ".", ".", ".", ".", ".", "."])

    boardstate.push(["Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw", "Pw"])
    boardstate.push(["Rw", "Nw", "Bw", "Qw", "Kw", "Bw", "Nw", "Rw"])
}

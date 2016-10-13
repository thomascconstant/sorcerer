var difficulty = 0;

/* variables à récupérer : 
 * winState
 * mise
 * tours
 * difficulty (gameSpeed dans tomcruise.js)
 */

// conserver le nombre de tours gagnants d'affilé
var lastWinFail = [];
var cumulWin = [];
var cumulFail = [];
var win = "true";
var fail = "false";
var compteurTroisTours = 0; //compteur qui augmente après chaque tour
var toursGagnantsDaffile = 0; //à incrémenter, dés que c'est égal à 3, modifier courbe

function cumulTours() {
    if (winState === true) {
        lastWinFail.push("true");
        compteurTroisTours++;
        clearArray();
    } else if (winState === false) {
        lastWinFail.push("fail");
        compteurTroisTours++;
        clearArray();
    }
}

function clearArray() {
    if (compteurTroisTours === 3) {
        lastWinFail = [];
    }
}

function checkWinFail() {
    var idx = lastWinFail.indexOf(win);
    while (idx != -1) {
        cumulWin.push(idx);
        idx = lastWinFail.indexOf(win, idx + 1);
    }
    console.log(cumulWin);
    // que se passe t-il s'il n'y a pas de win ? le while continue ?
}

var indices = [];
var tableau = ['a', 'b', 'a', 'c', 'a', 'd'];
var élément = 'a';
var idx = tableau.indexOf(élément);
while (idx != -1) {
    indices.push(idx);
    idx = tableau.indexOf(élément, idx + 1);
}
console.log(indices);
// [0, 2, 4]
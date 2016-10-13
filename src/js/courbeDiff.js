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
var bondDiff = [0.1, 0.3, 0.7];
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
    var i = 0;
    while (idx != -1 && i >= 3) {
        cumulWin.push(idx);
        idx = lastWinFail.indexOf(win, idx + 1);
        i++;
    }
    console.log(cumulWin);
}

var compareArrayWin = function (lastWinFail, cumulWin) {
    if (lastWinFail === cumulWin)
        return true;
    if (lastWinFail.length !== cumulWin.length)
        return false;
    for (var i = 0; i < lastWinFail.length; i++) {
        if (!equal(lastWinFail[i], cumulWin[i])) return false;
    };
    return true;
};

var compareArrayFail = function (lastWinFail, cumulFail) {
    if (lastWinFail === cumulFail)
        return true;
    if (lastWinFail.length !== cumulFail.length)
        return false;
    for (var i = 0; i < lastWinFail.length; i++) {
        if (!equal(lastWinFail[i], cumulFail[i])) return false;
    };
    return true;
};

function changeDifficulty() {
    if (compareArrayWin === true) {
        newDiff = Math.random(bondDiff);
        difficulty = newDiff;
    } else if (compareArrayFail === false) {
        newDiff = Math.random(bondDiff);
        difficulty = (- newDiff);
    } else {

    }
}

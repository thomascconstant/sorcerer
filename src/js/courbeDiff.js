var difficulty = 0;
var mode = 0; //à intégrer dans chaque jeu, 0 pour adaptation de la difficulté en fonction win/fail, 1 pour courbe bonds

/* variables à récupérer : 
 * winState
 * mise
 * tours
 * difficulty (gameSpeed dans tomcruise.js)
 */

// à intégrer dans chaque jeu
function changeMetaDiff() {
    if (mode === 0) {
        // reprendre code actuel fonctionnement diff
    } else if (mode === 1) {
        // envoyer vers contenu de ce script js
        cumulTours();
        checkWinFail();
        changeDifficulty();
    }
}

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

    var idx2 = lastWinFail.indexOf(win);
    var j = 0;
    while (idx2 != -1 && j >= 3) {
        cumulFail.push(idx2);
        idx2 = lastWinFail.indexOf(win, idx2 + 1);
        j++;
    }
    console.log(cumulFail);
}



function changeDifficulty() {
    //comparer les tableaux pour vérifier la présence de trois win
    var compareArrayWin = function (lastWinFail, cumulWin) {
        if (lastWinFail === cumulWin) {
            return true;
        }
        if (lastWinFail.length !== cumulWin.length) {
            return false;
        }
        for (var i = 0; i < lastWinFail.length; i++) {
            if (!equal(lastWinFail[i], cumulWin[i])) return false;
        }
        return true;
    };

    //comparer les tableaux pour vérifier la présence de trois fail
    var compareArrayFail = function (lastWinFail, cumulFail) {
        if (lastWinFail === cumulFail) {
            return true;
        }
        if (lastWinFail.length !== cumulFail.length) {
            return false;
        }
        for (var i = 0; i < lastWinFail.length; i++) {
            if (!equal(lastWinFail[i], cumulFail[i])) return false;
        }
        return true;
    };

    //modifier la difficulté en fonction
    if (compareArrayWin === true) {
        newDiff = Math.random(bondDiff);
        difficulty = difficulty + newDiff;
    } else if (compareArrayFail === true) {
        newDiff = Math.random(bondDiff);
        difficulty = difficulty - newDiff;
    } else {


    }
}


//var mode = 0; //à intégrer dans chaque jeu, 0 pour adaptation de la difficulté en fonction win/fail, 1 pour courbe bonds, 2 pour aléatoire total

/* variables à récupérer des jeux : 
 * winState
 * mise
 * tours
 * difficulty (gameSpeed dans tomcruise.js)
 */

/* à intégrer dans chaque jeu
function changeMetaDiff() {
    if (mode === 0) {
        // reprendre code actuel fonctionnement diff
    } else if (mode === 1) {
        // envoyer vers contenu de courbeDiff.js
        cumulTours();
        checkWinFail();
        changeDifficulty();
    }
}
*/

// conserver le nombre de tours gagnants d'affilé
var lastWinFail = [];
var cumulWin = [];
var cumulFail = [];
var bondDiff = [0.1, 0.3, 0.7];

var newDiff = 0;

var compareArrayWin = 0;
var compareArrayFail = 0;

var compteurTours = 0; //compteur qui augmente après chaque tour
var toursBeforeChange = 3; //nbre de tours avant changement de comportement de la courbe de difficulté
var toursGagnantsDaffile = 0; //à incrémenter, dés que c'est égal à toursBeforeChange, modifier courbe /!\ PAS UTILISé

function cumulTours() {
    if (winState === true) {
        lastWinFail.push("true");
        compteurTours++;

        console.log("dernier win:" + lastWinFail)

    } else if (winState === false) {
        lastWinFail.push("fail");
        compteurTours++;

        console.log("dernier fail:" + lastWinFail)

    }

    checkWinFail();
}

function clearArray() {
    if (compteurTours === toursBeforeChange) {
        lastWinFail = [];
        compteurTours = 0;
    }
}

function checkWinFail() {
    var idx = lastWinFail.indexOf("true");
    while (idx != -1) {
        cumulWin.push("true");
        idx = lastWinFail.indexOf("true", idx + 1);
    }
    console.log("cumul des win:" + cumulWin);

    var idx2 = lastWinFail.indexOf("fail");
    while (idx2 != -1) {
        cumulFail.push("fail");
        idx2 = lastWinFail.indexOf("fail", idx2 + 1);
    }
    console.log("cumul des fail:" + cumulFail);

    behaviorDiff();
}

//comparer les tableaux pour vérifier la présence de trois win
compareArrayWin = function (lastWinFail, cumulWin) {
    if (lastWinFail.length !== cumulWin.length) {
        return false;
        console.log("coucou2");
    } else if (lastWinFail.length === cumulWin.length) {
        for (var i = 0; i < lastWinFail.length; i++) {
            if (lastWinFail[i] !== cumulWin[i]) {
                return false;
                console.log("coucou3");
            }
        }
    console.log("coucou1");
    return true;
    }
};

//comparer les tableaux pour vérifier la présence de trois fail
compareArrayFail = function (lastWinFail, cumulFail) {
    if (lastWinFail.length !== cumulFail.length) {
        return false;
    } else  if (lastWinFail === cumulFail) {
        for (var i = 0; i < lastWinFail.length; i++) {
            if (lastWinFail[i] !== cumulFail[i]) {
                return true;
            }
        }
    return true;
    }
};

function behaviorDiff() {
    if (compareArrayWin(lastWinFail, cumulWin) === true && compteurTours === toursBeforeChange) {
        var tailleBondDiff = bondDiff[Math.floor(bondDiff.length * Math.random())];
        console.log("bond de difficulté win" + tailleBondDiff);
        newDiff = difficulty + tailleBondDiff;
        console.log("newDiff = " + newDiff);

        if (newDiff >= 1) {
            newDiff = 1;
            //difficulty = newDiff;
        }

    } else if (compareArrayFail(lastWinFail, cumulFail) === true && compteurTours === toursBeforeChange) {
        var tailleBondDiff = bondDiff[Math.floor(bondDiff.length * Math.random())];
        console.log("bond de difficulté fail" + tailleBondDiff);
        newDiff = difficulty - tailleBondDiff;
        console.log("newDiff = " + newDiff);

        if (newDiff < 0) {
            newDiff = 0;
            //difficulty = newDiff;
        }

    } else {

    }

    cumulWin = [];
    cumulFail = [];
    clearArray();
}


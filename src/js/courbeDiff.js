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

var compareArrayWin = 0;
var compareArrayFail = 0;

var compteurTroisTours = 0; //compteur qui augmente après chaque tour
var toursGagnantsDaffile = 0; //à incrémenter, dés que c'est égal à 3, modifier courbe

function cumulTours() {
    if (winState === true) {
        lastWinFail.push("true");
        compteurTroisTours++;

        console.log("dernier win:" + lastWinFail)

    } else if (winState === false) {
        lastWinFail.push("fail");
        compteurTroisTours++;

        console.log("dernier fail:" + lastWinFail)

    }

    checkWinFail();
}

function clearArray() {
    if (compteurTroisTours === 3) {
        lastWinFail = [];
        compteurTroisTours = 0;
    }
}

function checkWinFail() {
    var idx = lastWinFail.indexOf("true");
    while (idx != -1) {
        cumulWin.push(idx);
        idx = lastWinFail.indexOf("true", idx + 1);
    }
    console.log("cumul des win:" + cumulWin);

    var idx2 = lastWinFail.indexOf("fail");
    while (idx2 != -1) {
        cumulFail.push(idx2);
        idx2 = lastWinFail.indexOf("fail", idx2 + 1);
    }
    console.log("cumul des fail:" + cumulFail);

    changeDifficulty();
}

function changeDifficulty() {
    console.log("coucou0");

    if (lastWinFail.length === cumulWin.length) {
        compareArrayWin = true;
        console.log("coucou0.5");
        behaviorDiff();
    }

    //comparer les tableaux pour vérifier la présence de trois win
    compareArrayWin = function (lastWinFail, cumulWin) {
        if (lastWinFail.length === cumulWin.length) {
            return true;
            console.log("coucou1");
        }
        if (lastWinFail.length !== cumulWin.length) {
            return false;
            console.log("coucou2");
        }
        for (var i = 0; i < lastWinFail.length; i++) {
            if (!equal(lastWinFail[i], cumulWin[i])) return false;
            console.log("coucou3");
        }
        return true;

    };

    //comparer les tableaux pour vérifier la présence de trois fail
    compareArrayFail = function (lastWinFail, cumulFail) {
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

    behaviorDiff();
    
}

function behaviorDiff() {
    if (compareArrayWin === true) {
        var tailleBondDiff = bondDiff[Math.floor(bondDiff.length * Math.random())];
        console.log("bond de difficulté win" + tailleBondDiff);
        var newDiff = difficulty + tailleBondDiff;

        if (newDiff >= 1) {
            newDiff = 1;
            //difficulty = newDiff;
        }

    } else if (compareArrayFail === true) {
        var tailleBondDiff = bondDiff[Math.floor(bondDiff.length * Math.random())];
        console.log("bond de difficulté fail" + tailleBondDiff);
        var newDiff = difficulty - tailleBondDiff;

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


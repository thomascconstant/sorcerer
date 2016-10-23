
/* à intégrer dans chaque jeu
var modeDifficulty = 1; //0 pour adaptation de la difficulté en fonction win/fail, 1 pour courbe bonds

function changeMetaDiff() {
    if (modeDifficulty === 0) {
        // reprendre code actuel fonctionnement diff

    } else if (modeDifficulty === 1 && modeTest === true) {
        // reprendre code actuel fonctionnement diff

    } else if (modeDifficulty === 1 && modeTest === false) {
        // envoyer vers contenu de courbeDiff.js
        selectbondDiff();
        difficulty = newDiff;
    }
    console.log("difficulté du jeu:" + difficulty);
}
*/

// conserver le nombre de tours gagnants d'affilé
var lastWinFail = [];
var cumulWin = [];
var cumulFail = [];

var firstBondDiff = false; //false : premier bond de difficulté non sélectionné ; true, premier bond sélectionné

var bondDiffLittle = 0.1;
var bondDiffMedium = 0.3;
var bondDiffHigh = 0.6;
var bondDiffActual = 0;

var bondDiffNoLittle = [0.3, 0.6];
var bondDiffNoMedium = [0.1, 0.6];
var bondDiffNoHigh = [0.3, 0.6];
var bondDiffAll = [0.1, 0.3, 0.6];
 
var newDiff = 0;
var bondDiff = 0;

var compareArrayWin = 0;
var compareArrayFail = 0;

var compteurTours = 0; //compteur qui augmente après chaque tour
var toursBeforeChange = 2; //nbre de tours avant changement de comportement de la courbe de difficulté

//générer aléatoirement premier bond de difficulté après la fin des tours de chauffe
function selectFirstBondDiff() {
    if (modeTest === false && firstBondDiff === false) {
        bondDiffActual = bondDiffAll[Math.floor(bondDiffAll.length * Math.random())];

        bondDiff = bondDiffActual;
        newDiff = bondDiff;

        firstBondDiff = true;
        console.log("premier bond de difficulté: " + bondDiff);
    }
}

function selectbondDiff() {
    if (modeTest === false && firstBondDiff === true) {
        if (bondDiffActual === bondDiffLittle) {
            bondDiff = bondDiffNoLittle[Math.floor(bondDiffNoLittle.length * Math.random())];
        } else if (bondDiffActual === bondDiffMedium) {
            bondDiff = bondDiffNoMedium[Math.floor(bondDiffNoMedium.length * Math.random())];
        } else if (bondDiffActual === bondDiffHigh) {
            bondDiff = bondDiffNoHigh[Math.floor(bondDiffNoHigh.length * Math.random())];
        }
        console.log("nouveau bond de difficulté: " + bondDiff);

        changeDifficulty();
    }
    selectFirstBondDiff();

}

function changeDifficulty() {
    var array = [0, 1];
    var addOrSub = array[Math.floor(array.length * Math.random())];
    console.log("progression de la difficulté: " + addOrSub);

    if (addOrSub === 0) { //changement de difficulté par soustraction
        newDiff = difficulty - bondDiff;
        console.log("newDiff = " + newDiff);

        if (newDiff < 0) {
            newDiff = 0;
            console.log("newDiff corrected = " + newDiff);
        }
    } else if (addOrSub === 1) { //changement de difficulté par addition
        newDiff = difficulty + bondDiff;
        console.log("newDiff = " + newDiff);

        if (newDiff >= 1) {
            newDiff = 1;
            console.log("newDiff corrected = " + newDiff);
        }
    }
    
}

/*function cumulTours() {
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
    } else if (lastWinFail.length === cumulWin.length) {
        for (var i = 0; i < lastWinFail.length; i++) {
            if (lastWinFail[i] !== cumulWin[i]) {
                return false;
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
    } else if (lastWinFail.length === cumulFail.length) {
        for (var i = 0; i < lastWinFail.length; i++) {
            if (lastWinFail[i] !== cumulFail[i]) {
                return true;
            }
        }
    console.log("coucou2");
    return true;
    }
};

function behaviorDiff() {
    if (compareArrayWin(lastWinFail, cumulWin) === true && compteurTours === toursBeforeChange) {
        var tailleBondDiff = bondDiff[Math.floor(bondDiff.length * Math.random())];
        console.log("taille du bond de difficulté win" + tailleBondDiff);
        newDiff = difficulty + tailleBondDiff;
        console.log("newDiff = " + newDiff);

        if (newDiff >= 1) {
            newDiff = 1;
            //difficulty = newDiff;
        }

    } else if (compareArrayFail(lastWinFail, cumulFail) === true && compteurTours === toursBeforeChange) {
        var tailleBondDiff = bondDiff[Math.floor(bondDiff.length * Math.random())];
        console.log("taille du bond de difficulté fail" + tailleBondDiff);
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
}*/


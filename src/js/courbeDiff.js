
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
        if (bondDiff === bondDiffLittle) {
            bondDiff = bondDiffNoLittle[Math.floor(bondDiffNoLittle.length * Math.random())];
        } else if (bondDiff === bondDiffMedium) {
            bondDiff = bondDiffNoMedium[Math.floor(bondDiffNoMedium.length * Math.random())];
        } else if (bondDiff === bondDiffHigh) {
            bondDiff = bondDiffNoHigh[Math.floor(bondDiffNoHigh.length * Math.random())];
        }
        bondDiff = parseFloat(bondDiff);
        console.log("nouveau bond de difficulté: " + bondDiff);

        changeDifficulty();

    } else {
        selectFirstBondDiff();

    }
    
}

function changeDifficulty() {
    var array = [0, 1];
    var addOrSub = array[Math.floor(array.length * Math.random())];

    // annoncer le sens de la progression de la difficulté
    if (addOrSub === 1) {
        console.log("progression de la difficulté vers le haut");
    } else {
        console.log("progression de la difficulté vers le bas");
    }
    
    // calculer la nouvelle valeur de la difficulté
    if (addOrSub === 0) { //changement de difficulté par soustraction
        console.log("var difficulty = " + difficulty);

        var computeDiff = parseFloat(difficulty) - parseFloat(bondDiff);
        console.log("computeDiff =" + computeDiff);

        newDiff = (Math.round(computeDiff * 100) / 100).toFixed(1);
        console.log("newDiff = " + newDiff);

        if (newDiff < 0) {
            newDiff = 0;
            console.log("newDiff corrected = " + newDiff);
        }

    } else if (addOrSub === 1) { //changement de difficulté par addition
        console.log("var difficulty = " + difficulty);
        
        var computeDiff = parseFloat(difficulty) + parseFloat(bondDiff);
        console.log("computeDiff =" + computeDiff);

        newDiff = (Math.round(computeDiff * 100) / 100).toFixed(1);
        console.log("newDiff = " + newDiff);

        if (newDiff >= 1) {
            newDiff = 1;
            console.log("newDiff corrected = " + newDiff);
        }

    }
    
}

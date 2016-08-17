var scoreGlobal=localStorage.scoreJoueurChristopher + localStorage.scoreJoueurTom + localStorage.scoreJoueurHugh;
console.log(scoreGlobal + " moutons sauvés");

document.getElementById("resultTom").innerHTML = localStorage.scoreJoueurTom;
document.getElementById("resultChristopher").innerHTML = localStorage.scoreJoueurChristopher;
document.getElementById("resultHugh").innerHTML = localStorage.scoreJoueurHugh;

var scoreGlobal=localStorage.scoreJoueurChristopher + localStorage.scoreJoueurTom + localStorage.scoreJoueurHugh;
console.log(scoreGlobal + " moutons sauvés");

document.getElementById("resultTom").innerHTML = localStorage.scoreJoueurTom;
document.getElementById("resultChristopher").innerHTML = localStorage.scoreJoueurChristopher;
document.getElementById("resultHugh").innerHTML = localStorage.scoreJoueurHugh;

function feedbackScore () {
    if (scoreGlobal >= 10 && scoreGlobal < 50) {
        document.getElementById("??").innerHTML = "Vous avez sauvé " + scoreGlobal + "moutons. Vous faites un bon berger, mais la Reine attendait mieux.";
    } else if (scoreGlobal > 0 && scoreGlobal < 10) {
        document.getElementById("??").innerHTML = "Vous avez sauvé " + scoreGlobal + "moutons. La Reine s'en contentera.";
    } else if (scoreGlobal === 1) {
        document.getElementById("??").innerHTML = "Vous avez sauvé " + scoreGlobal + "mouton. C'est mieux que rien, mais le Royaume n'en survivra pas.";
    } else if (scoreGlobal >= 50) {
        document.getElementById("??").innerHTML = "Vous avez sauvé " + scoreGlobal + "moutons. Votre CV n'a pas menti, vous êtes un excellent berger.<br/> La Reine vous tient en haute estime et vous fournira une lettre de recommandation";
    } else if (scoreGlobal < 0) {
        document.getElementById("??").innerHTML = "Vous avez condamné " + scoreGlobal + "moutons. Le Sorcier vous félicite : à la fin du méchoui, il n'y aura plus âme qui vive dans le Royaume.<br/> A l'exception de la Reine, bien sûr. Mais vous devriez éviter de la croiser.";
    }
}
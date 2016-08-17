var scoreGlobal=localStorage.scoreJoueurChristopher + localStorage.scoreJoueurTom + localStorage.scoreJoueurHugh;
console.log(scoreGlobal + " moutons sauvés");

function feedbackScore () {
    document.getElementById("resultTom").innerHTML = localStorage.scoreJoueurTom;
    document.getElementById("resultChristopher").innerHTML = localStorage.scoreJoueurChristopher;
    document.getElementById("resultHugh").innerHTML = localStorage.scoreJoueurHugh;
}


function feedbackScoreGeneral () {
    if (scoreGlobal >= 10 && scoreGlobal < 50) {
        scoreGlobal = Math.abs(scoreGlobal);
        document.getElementById("feedbacks").innerHTML = "« Vous avez sauvé " + scoreGlobal + " de mes sujets.<br/>Vous faites un bon berger mais j'attendais mieux de votre part.<br/> Vous m'aviez pourtant été chaudement recommandé par le Prince Gustave... »";
    } else if (scoreGlobal === 1) {
        scoreGlobal = Math.abs(scoreGlobal);
        document.getElementById("feedbacks").innerHTML = "« Il semblerait que vous n'ayez sauvé qu' " + scoreGlobal + " seul de mes sujets.<br/>Vous savez vraiment à quoi ressemble un mouton ? »";
    } else if (scoreGlobal > 0 && scoreGlobal < 10 && scoreGlobal !== 1) {
        scoreGlobal = Math.abs(scoreGlobal);
        document.getElementById("feedbacks").innerHTML = "« Vous avez sauvé " + scoreGlobal + " de mes sujet.<br/>J'imagine que cela vaut mieux que rien, mais le Royaume n'en survivra pas ! »";
    } else if (scoreGlobal >= 50) {
        scoreGlobal = Math.abs(scoreGlobal);
        document.getElementById("feedbacks").innerHTML = "« Vous avez sauvé " + scoreGlobal + " de mes sujets.<br/>Votre curriculum vitae n'a pas menti, vous êtes un excellent berger. »<br/><br/>Avant de vous laisser partir, la Reine vous tend une lettre de recommandation.";
    } else if (scoreGlobal < 0) {
        scoreGlobal = Math.abs(scoreGlobal);
        document.getElementById("feedbacks").innerHTML = "« Vous avez condamné " + scoreGlobal + " de mes sujets !<br/>Sur ce parchemin, le Sorcier lui-même vous félicite :<br/>il n'y aura plus âme qui vive dans le Royaume ! »<br/><br/>Avant de vous laisser partir, la Reine vous transmet un dernier message :<br/>une offre d'emploi dans l'antre du Sorcier.";
    }
}
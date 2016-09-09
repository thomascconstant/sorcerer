var scoreJeuChristopher = parseInt(localStorage.scoreJoueurChristopher);
var scoreJeuTom = parseInt(localStorage.scoreJoueurTom);
var scoreJeuBenedict = parseInt(localStorage.scoreJoueurBenedict);

var scoreGlobal = scoreJeuChristopher + scoreJeuTom + scoreJeuBenedict;

function feedbackScore () {
    document.getElementById("resultTom").innerHTML = localStorage.scoreJoueurTom;
    document.getElementById("resultChristopher").innerHTML = localStorage.scoreJoueurChristopher;
    document.getElementById("resultBenedict").innerHTML = localStorage.scoreJoueurBenedict;
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
    } else if (scoreGlobal >= 50 && scoreGlobal < 100) {
        scoreGlobal = Math.abs(scoreGlobal);
        document.getElementById("feedbacks").innerHTML = "« Vous avez sauvé " + scoreGlobal + " de mes sujets.<br/>Votre curriculum vitae n'a pas menti, vous êtes bien Super Berger ! »<br/><br/>Avant de vous laisser partir, la Reine vous tend une lettre de recommandation.";
    } else if (scoreGlobal >= 100 && scoreGlobal < 200) {
        scoreGlobal = Math.abs(scoreGlobal);
        document.getElementById("feedbacks").innerHTML = "« Vous avez sauvé " + scoreGlobal + " de mes sujets.<br/>Maître Berger, vous avez offert un futur à mon Royaume.<br/>A partir d'aujourd'hui, nous célèbrerons chaque année votre réussite ! »";
    } else if (scoreGlobal >= 200) {
        scoreGlobal = Math.abs(scoreGlobal);
        document.getElementById("feedbacks").innerHTML = "« Vous avez sauvé " + scoreGlobal + " de mes sujets.<br/>Votre réussite est sans égale, si ce n'est votre humilité. Partez en paix, Super Berger. »<br/><br/>Avant de vous laisser partir, la Reine insiste pour que l'on vous tire le portrait.<br/>Qui sait ce sur quoi vous croiserez votre figure...";
    } else if (scoreGlobal < 0) {
        scoreGlobal = Math.abs(scoreGlobal);
        document.getElementById("feedbacks").innerHTML = "« Vous avez condamné " + scoreGlobal + " de mes sujets !<br/>Sur ce parchemin, le Sorcier lui-même vous félicite :<br/>il n'y aura plus âme qui vive dans le Royaume ! »<br/><br/>Avant de vous laisser partir, la Reine vous transmet un dernier message :<br/>une offre d'emploi dans l'antre du Sorcier.";
    }
}
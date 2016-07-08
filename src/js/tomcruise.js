//Variables du jeu
var nomDuJeu = "Motrice";

var barSpeed = 1; //Vitesse de la barre : pixels par frame
var direction = 1; //direction actuelle du deplacement de la barre
var anim = 0; //Handle du timer d'anim de la barre
var running = false; //Si la barre est en cours d'anim
var miseValide = false; //Si la mise n'est pas validée par le joueur

var score = 0; //Score actuel
var gameSpeed = 1; //Vitesse du jeu (notre param de challenge)
var mise = 0; //Combien le joueur a misé
var tours = 2; //Nombre de tours restants
var resultatJoueur = [];

var hideTarget = true; //Si on doit cacher la target a chaque tour

var chatonContent = '../src/img/happyKitten.jpg';
var chatonTriste = '../src/img/sadKitten.jpg';


function init(){
    diffModel.setStepInCurve(0);
    diffModel.setParams(3,-0.4);
    diffModel.setMode(1);

    var diff = diffModel.currentDiff;
    gameSpeed = diffModel.getChallengeFromDiff(diff);

    //tours = 20;
    //mise = 0;
    document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;
    if(hideTarget) {
        document.getElementById("target").style.visibility = "hidden";
    }
    document.getElementById("tableMise").style.visibility = "hidden";
    
    //testFile(document.getElementById("res"));
}

//récupérer mise
function recupMise () {
    if(document.getElementById('mise1').checked) {
        //boutton de mise 1 est validé
        mise = 1;
        document.getElementById("boutonMiser").disabled = true;
        document.getElementById("mise").innerHTML = mise;
    }else if(document.getElementById('mise2').checked) {
        mise = 2;
        document.getElementById("boutonMiser").disabled = true;
        document.getElementById("mise").innerHTML = mise;
    }else if(document.getElementById('mise3').checked) {
        mise = 3;
        document.getElementById("boutonMiser").disabled = true;
        document.getElementById("mise").innerHTML = mise;
    }else if(document.getElementById('mise4').checked) {
        mise = 4;
        document.getElementById("boutonMiser").disabled = true;
        document.getElementById("mise").innerHTML = mise;
    }else if(document.getElementById('mise5').checked) {
        mise = 5;
        document.getElementById("boutonMiser").disabled = true;
        document.getElementById("mise").innerHTML = mise;
    }else if(document.getElementById('mise6').checked) {
        mise = 6;
        document.getElementById("boutonMiser").disabled = true;
        document.getElementById("mise").innerHTML = mise;
    }else if(document.getElementById('mise7').checked) {
        mise = 7;
        document.getElementById("boutonMiser").disabled = true;
        document.getElementById("mise").innerHTML = mise;
    }
    //afficher mise
    showMise();
    
    //afficher le target
    if(hideTarget) {
        document.getElementById("target").style.visibility = "visible";
    }
    document.getElementById("res").innerHTML = "Appuyez sur ESPACE pour arrêter le curseur.";
    //document.getElementById("boutonMiser").addEventListener("keydown", keypressed, false);

    //acter la mise du joueur pour déverouiller jeu
    miseValide = true;
    hideTarget = false;

}

function showMise(){
    document.getElementById("tableMise").style.visibility = "visible";
    
}

/**
 Deplace la barre a chaque step d'anim
 */
function moveBar(object, direction) {
    var left = parseInt(readStyle(object,'left').slice(0,-2));
    slider.style.left = (left + direction*barSpeed) + "px";
}

/**
 Appellé par le timer d'anim toutes les n millisecondes
 */
function animBar() {
    var slider = document.getElementById("slider");
    var leftSlider = parseInt(readStyle(slider,"left").slice(0,-2));
    var widthSlider = parseInt(readStyle(slider,"width").slice(0,-2));
    var bar = document.getElementById("bar");
    var widthBar = parseInt(readStyle(bar,"width").slice(0,-2));

    if(leftSlider + widthSlider >=  widthBar)
        direction = -1;

    if(leftSlider <= 0)
        direction = 1;

    moveBar(slider,direction);
}

/**
 Appelle si le joueur demande de stopper la barre
 entraine le calcul du score, update difficulte, etc...
 */
function stop() {
    if(!running){
        return;
    }
    //On kill l'animation de la barre, on la stoppe
    if(anim != 0){
        clearInterval(anim);
    }

    running = false;

    //On calcule si la barre touche la target
    var slider = document.getElementById("slider");
    var leftSlider = parseInt(readStyle(slider,"left").slice(0,-2));
    var widthSlider = parseInt(readStyle(slider,"width").slice(0,-2));
    var positionSlider = leftSlider + widthSlider/2;

    var target = document.getElementById("target");
    var leftTarget = parseInt(readStyle(target,"left").slice(0,-2));
    var widthTarget = parseInt(readStyle(target,"width").slice(0,-2));
    var positionTarget = leftTarget + widthTarget/2;

    var res = (leftTarget + widthTarget >= leftSlider && leftTarget <= (leftSlider + widthSlider)) ? 1 : 0;

    //On sauve le resultat pour cet essai dans une variable, ne sera transféré dans csv que lorsque le jeu est terminé (fin de partie)
    resultatJoueur += mise + ";" + tours + ";" + gameSpeed + ";" + score + ";" + res;
    console.log(resultatJoueur);
    //enregistrerDonnees(1, mise + ";" + tours + ";" + gameSpeed + ";" + score + ";" + res );

    //On met a jour le score, etc...
    if(res == 1) {
        score += mise;
        document.getElementById("res").innerHTML = "Vous avez sauvé " + mise + " " + "chaton(s). Appuyez sur ESPACE pour relancer le curseur.";
        //feedbackPositif();
    }
    else {
        score -= mise;
        document.getElementById("res").innerHTML = "Vous avez tué " + mise + " " + "chaton(s). Appuyez sur ESPACE pour relancer le curseur.";
        //feedbackNegatif;
    }



    //mise a jour de la difficulte selon le modele
    var nextDiff = diffModel.nextDifficulty(res);
    gameSpeed = diffModel.getChallengeFromDiff(nextDiff);

    console.log("nextdiff : " + nextDiff + "-> speed :" + gameSpeed);


    //Un tour de moins, reset de la mise
    tours--;
    mise = "?";
    document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;

    //bloquer le jeu pour et déverouiller bouton de mise sauf si plus de tours
    if (tours > 0) {
    miseValide = false;
    hideTarget = true;
    document.getElementById("boutonMiser").disabled = false;
    } else {
        finDePartie();
    }

}

/**
 Si le joueur lance le jeu, start la barre
 */
function run() {
    if(running) {
        return;
    }
    
    if(tours > 0){
        running = true;

        document.getElementById("res").innerHTML = "Choisissez votre mise.";
        document.getElementById("slider").style.left = "0px";
    }
    
    if(hideTarget){
        document.getElementById("target").style.visibility = "hidden";
    //document.getElementById("target").style.left = (Math.random()*30+35)+'%';
    }
    //On calcule la frequence d'update de l'anim et le nombre de pixel de deplacement par frame
    //pour avoir l'anim la plus fluide possible tout en atteignant des hautes vitesses
    //sinon le max c'est un pixel par milliseconde, c'est pas tant que ca
    console.log("new speed :" + gameSpeed);
    if(tours > 0) {

        var pixelsPerSec = 40 * (gameSpeed + 0.5) + 0.001;
        var framelength = Math.floor(1000.0 / pixelsPerSec);

        console.log("new framelength :" + framelength);
        barSpeed = 1;
        while (framelength <= 2) {
            barSpeed *= 2;
            framelength *= 2;
        }
        console.log('Speed: '+gameSpeed.toFixed(1)+' Diff: '+diffModel.getDiffFromChallenge(gameSpeed).toFixed(2)+' Frame Length: '+framelength+ ' Bar Speed: '+barSpeed);
    }
    //On lance l'anim
    if(tours > 0) {
        anim = setInterval(animBar, framelength);
    }
}

/**
 N'importe quelle touche pressée sur le body du site
 */
function keypressed(event) {
    var key = event.keyCode;

    if(key >= 49 && key <= 55) {
        mise = key - 49 + 1;
        //console.log("Mise de " + mise);
        document.getElementById("mise").innerHTML = mise;
        document.getElementById("target").style.visibility = "visible";
    }

    if(key == 32){
        if(running && miseValide)
            stop();
        else 
            run();
    
}
}

function feedbackPositif() {
    var imageFeedback = document.createElement("img");
    imageFeedback.src = chatonContent;
    document.body.appendChild(imageFeedback);
}

function feedbackNegatif() {
    var imageFeedback = document.createElement("img");
    imageFeedback.src = chatonTriste;
    document.body.appendChild(imageFeedback);
}

function finDePartie() {
    if (tours == 0){
        //créer le bouton
        var boutton = document.createElement("input");
        boutton.type = "button";
        boutton.value = "Fin de partie.";
        boutton.name = "FIN";
        var results = function resultat(){
            var messageFinPartie = confirm("Votre partie est terminée. Votre score est de " + score +" Cliquez pour passer au jeu suivant.");
            if (messageFinPartie==true) {
                x = "Prototype en cours de développement, veuillez patienter.";
                enregistrerDonnees(1,nomDuJeu + ";" + resultatJoueur + ";");
            } else {
                x = "Ah, d'accord.";
            }
            document.getElementById("retourProto").innerHTML = x;
        }
        boutton.onclick = results;
        document.body.appendChild(boutton);
    } else{

    }
}


// enregistrer données du joueur dans fichier csv
function enregistrerDonnees (type, data) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //console.log(xhttp.response);
        }
    };

    if (type == 0) {
        xhttp.open("POST", "http://localhost/sorcerer/src/php/toto.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("joueur=" + data);
    } else if (type == 1) {
        xhttp.open("POST", "http://localhost/sorcerer/src/php/toto.php", true );
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("data=" + data);
    }


    //xhttp.open("POST", "http://localhost:63342/Bandit2/src/php/toto.php", true);
    //xhttp.setRequestHeader("Content-type", "text/plain");
    //xhttp.send("data=\"" + donneesJoueur + "\"");
    //xhttp.send("data=15");

    console.log("Sent data " + data);
}
//Variables du jeu
var nomDuJeu = "Motrice";
var IDjoueur = localStorage.getItem("joueur");
var nomJoueur = localStorage.getItem("name");
var scoreJoueurTom = 0; //Score du joueur à renseigner en fin de session de jeu
var moutonsSauvesJoueurTom = 0; //Nbre de moutons sauvés par le joueur à renseigner en fin de session de jeu
var moutonsPerdusJoueurTom = 0; //Nbre de moutons embrochés par le joueur à renseigner en fin de session de jeu

var barSpeed = 1; //Vitesse de la barre : pixels par frame
var direction = 1; //direction actuelle du deplacement de la barre
var anim = 0; //Handle du timer d'anim de la barre
var running = false; //Si la barre est en cours d'anim
var miseValide = false; //Si la mise n'est pas validée par le joueur

var score = 0; //Score actuel
var gameSpeed = 1; //Vitesse du jeu (notre param de challenge)
var mise = 0; //Combien le joueur a misé
var tours = 30; //Nombre de tours restants
var resultatJoueur = [];

var winState = false; //statut du joueur, false pour perdant
var actionDeJeu = 0; //Suivi du nombre d'action de jeu que réalise le joueur

var moutonsGagnes = 0;
var moutonsPerdus = 0;
var compteurMoutonsGagnes = 0;
var compteurMoutonsPerdus = 0;

var moutonAffiche = false; //vérifier affichage du mouton vivant
var moutonRipAffiche = false; //vérifier affichage du mouton mort

var hideTarget = true; //Si on doit cacher la target a chaque tour

var modeFinDePartie = false; //Permet de bloquer le jeu pour voir les résultats du dernier tour

var phpFile = "php/toto.php"; // version locale, à commenter pour la version en ligne
//var phpFile = "../sorcerer/php/toto.php"; // à décommenter pour la version en ligne

function init(){
    diffModel.setStepInCurve(0);
    diffModel.setParams(3,-0.4);
    diffModel.setMode(1);

    var diff = diffModel.currentDiff;
    gameSpeed = diffModel.getChallengeFromDiff(diff);

    document.getElementById("tours").innerHTML = tours;
    //document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;
    if(hideTarget) {
        document.getElementById("target").style.visibility = "hidden";
    }
    document.getElementById("tableMise").style.visibility = "hidden";
    
    //afficher mise
    showMise();
    
    //testFile(document.getElementById("res"));
}

function accessMise() {
    if (modeFinDePartie === false) {

    //afficher boutons mise
    setTimeout(function eraseZoneMise() {
        document.getElementById("boutonsMise").style.display = "block";
    }, 10);
    launchFadeInMise();

    //déverrouiller boutons de sélection de mise
    document.getElementById("mise1").disabled = false;
    document.getElementById("mise2").disabled = false;
    document.getElementById("mise3").disabled = false;
    document.getElementById("mise4").disabled = false;
    document.getElementById("mise5").disabled = false;
    document.getElementById("mise6").disabled = false;
    document.getElementById("mise7").disabled = false;
    
    //reset affichage mise
    document.getElementById("mise").innerHTML = mise;

    run();
    }
}

//récupérer mise
function recupMise(numeroMise) {
    mise = numeroMise;
    console.log(mise + " de mise");
    /*if(document.getElementById('mise1').checked) {
        //boutton de mise 1 est validé
        mise = 1;
        document.getElementById("mise").innerHTML = mise;
    } else if(document.getElementById('mise2').checked) {
        mise = 2;
        document.getElementById("mise").innerHTML = mise;
    } else if(document.getElementById('mise3').checked) {
        mise = 3;
        document.getElementById("mise").innerHTML = mise;
    } else if(document.getElementById('mise4').checked) {
        mise = 4;
        document.getElementById("mise").innerHTML = mise;
    } else if(document.getElementById('mise5').checked) {
        mise = 5;
        document.getElementById("mise").innerHTML = mise;
    } else if(document.getElementById('mise6').checked) {
        mise = 6;
        document.getElementById("mise").innerHTML = mise;
    } else if(document.getElementById('mise7').checked) {
        mise = 7;
        document.getElementById("mise").innerHTML = mise;
    }*/

    //afficher boutton
    showButton();
    
    //verrouiller boutons de mise
    /*document.getElementById("mise1").disabled = true;
    document.getElementById("mise2").disabled = true;
    document.getElementById("mise3").disabled = true;
    document.getElementById("mise4").disabled = true;
    document.getElementById("mise5").disabled = true;
    document.getElementById("mise6").disabled = true;
    document.getElementById("mise7").disabled = true;*/
    
    //afficher le target
    if(hideTarget) {
        document.getElementById("target").style.visibility = "visible";
    }
    //document.getElementById("res").innerHTML = "Appuyez sur ESPACE ou sur le bouton pour arrêter la barre.";
    
    //message de feedback
    document.getElementById("affichageFeedback").innerHTML = "Cliquez sur le bouton pour arrêter la barre sur la cible.";

    //acter la mise du joueur pour déverouiller jeu
    miseValide = true;
    hideTarget = false;

    changeTexteBouton();

    //cacher les boutons de mise
    restartFadeInOutMise();
    setTimeout(launchFadeOutMise(), 100);
    setTimeout(function eraseZoneMise() {
        document.getElementById("boutonsMise").style.display = "none";
    }, 490);
}

function showMise() {
    document.getElementById("tableMise").style.visibility = "visible";
}

function cleanMise() {
    document.getElementById("mise1").checked = false;
    document.getElementById("mise2").checked = false;
    document.getElementById("mise3").checked = false;
    document.getElementById("mise4").checked = false;
    document.getElementById("mise5").checked = false;
    document.getElementById("mise6").checked = false;
    document.getElementById("mise7").checked = false;
}

function showButton() {
    document.getElementById("boutonLancerBarre").style.visibility = "visible";
}

function hideButton() {
    document.getElementById("boutonLancerBarre").style.visibility = "hidden";
}

function changeTexteBouton() {
    var elem = document.getElementById("boutonLancerBarre");
    
    if (miseValide && elem.innerHTML==="Lancer la barre") {
        elem.innerHTML = "Arrêter la barre";
        document.getElementById("boutonLancerBarre").disabled = false;
        elem.onclick = stop;
    } else {
        elem.innerHTML = "Lancer la barre";
        elem.onclick = accessMise;
    }
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

    //On met a jour le score, etc...
    if(res === 1) {
        winState = true;

        moutonsGagnes += mise;
        compteurMoutonsGagnes += moutonsGagnes;

        actionDeJeu++;
        score += mise;

        addSheep(); //faire apparaître un mouton sur la page

        moutonsGagnes = 0;
        
        //message de feedback
        if (mise === 1) {
            document.getElementById("affichageFeedback").innerHTML = "Vous avez sauvé " +mise+" mouton. Cliquez sur le bouton pour relancer la barre.";
        } else {
            document.getElementById("affichageFeedback").innerHTML = "Vous avez sauvé " +mise+" moutons. Cliquez sur le bouton pour relancer la barre.";   
        }
        document.getElementById("affichageFeedback").style.backgroundColor = "#00E676";    
        //document.getElementById("res").innerHTML = "Vous avez sauvé " + mise + " " + "mouton(s). Appuyez sur ESPACE ou sur le bouton pour relancer la barre.";
        //feedbackPositif();
    }
    else {
        winState = false;

        moutonsPerdus += mise;
        compteurMoutonsPerdus += moutonsPerdus;

        actionDeJeu++;
        score -= mise;

        addSheep(); //faire apparaître un mouton sur la page

        moutonsPerdus = 0;
        
        //message de feedback 
        if (mise === 1) {
            document.getElementById("affichageFeedback").innerHTML = "Vous avez tué " +mise+" mouton. Cliquez sur le bouton pour relancer la barre.";
        } else {
            document.getElementById("affichageFeedback").innerHTML = "Vous avez tué " +mise+" moutons. Cliquez sur le bouton pour relancer la barre.";   
        }
        document.getElementById("affichageFeedback").style.backgroundColor = "#F44336";
        //document.getElementById("res").innerHTML = "Vous avez tué " + mise + " " + "mouton(s). Appuyez sur ESPACE ou sur le bouton pour relancer la barre.";
        //feedbackNegatif;
    }

    //Un tour de moins
    tours--;
    
    //On sauve le resultat pour cet essai dans une variable, ne sera transféré dans csv que lorsque le jeu est terminé (fin de partie)
    resultatJoueur += nomJoueur + ";" + IDjoueur + ";" + nomDuJeu + ";" + actionDeJeu + ";" + mise + ";" + gameSpeed + ";" + compteurMoutonsGagnes + ";" + compteurMoutonsPerdus + ";" + score + ";" + winState + ";" + "\n";
    console.log(resultatJoueur + "résultats");
    console.log(winState);
    //enregistrerDonnees(1, mise + ";" + tours + ";" + gameSpeed + ";" + score + ";" + res );
    
    //mise a jour de la difficulte selon le modele
    var nextDiff = diffModel.nextDifficulty(res);
    gameSpeed = diffModel.getChallengeFromDiff(nextDiff);

    console.log("nextdiff : " + nextDiff + "-> speed :" + gameSpeed);

    //Reset de la mise
    mise = "?";
    document.getElementById("tours").innerHTML = tours;
    //document.getElementById("score").innerHTML = score;
    //document.getElementById("mise").innerHTML = mise;
    
    //nettoyer historique des boutons mises
    cleanMise();

    //bloquer le jeu pour et déverouiller bouton de mise sauf si plus de tours
    if (tours > 0) {
    miseValide = false;
    hideTarget = true;
    document.getElementById("boutonLancerBarre").disabled = false;
    } else {
        modeFinDePartie = true;
        finDePartie();
    }
    changeTexteBouton();
}

/**
 Si le joueur lance le jeu, start la barre
 */
function run() {
    if(running) {
        return;
    }
    
    if(tours > 0) {
        running = true;
        document.getElementById("boutonLancerBarre").disabled = true;
        hideButton();
        
        //messages de feedback
        document.getElementById("affichageFeedback").innerHTML = "Choisissez le nombre de moutons que vous voulez miser sur vos chances de gagner :";
        document.getElementById("affichageFeedback").style.backgroundColor = "#03A9F4"; 
        //document.getElementById("res").innerHTML = "Choisissez votre mise.";
        
        document.getElementById("slider").style.left = "0px";
    }
    
    if(hideTarget) {
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
    changeTexteBouton();
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

    if(key === 32){
        if(running && miseValide) {
            stop();
        } else { 
            accessMise();
        }
    }
}

function addSheep() {
    if (winState === true) {
        launchFadeInLeftBox(); //lance animation box pour décompte de moutons
        document.getElementById("boxMoutonsGagnes").style.display = "block";  //faire apparaître box pour décompte de moutons
        document.getElementById("addMoutonsGagnes").style.display = "block";

        document.getElementById("compteurMoutonsGagnes").innerHTML = compteurMoutonsGagnes;
        document.getElementById("addMoutonsGagnes").innerHTML = "+" + moutonsGagnes;
        console.log(compteurMoutonsGagnes + "moutons gagnes final");

        if (moutonAffiche === false) {
            //afficher mouton
            var elem = document.createElement("img");
            elem.setAttribute("src", "img/unrip_mouton.png");
            elem.setAttribute("height", "120");
            elem.setAttribute("width", "180");
            document.getElementById("imageMoutonGagne").appendChild(elem);

            moutonAffiche = true; //ne plus afficher d'image de moutons
        }

        //feedback visuel
        launchAnimateScoreMoutonsGagnes(); //le rechargement de l'animation se fait plus tard, lorsque la mise est récupérée pour laisser le temps à l'anim de se terminer
        launchFadeOutUpLeftBox();
        restartFadeInOutMise();
        setTimeout(function eraseText() {
            document.getElementById("addMoutonsGagnes").style.display = "none";
        }, 2800);

        //feedback sonore
        var soundsWin = [
            "../src/sounds/baaaa1.mp3",
            "../src/sounds/baaaa2.mp3",
            "../src/sounds/baaaa3.mp3",
            "../src/sounds/baaaa4.mp3"
        ];

        var tirageSon = soundsWin[Math.floor(Math.random() * soundsWin.length)];
        document.getElementById("winSound").innerHTML = '<source src="' + tirageSon + '" type="audio/mpeg">';

        var x = document.getElementById("winSound");
        x.play();

    } else if (winState === false) {
        launchFadeInRightBox(); //lance animation box pour décompte de moutons
        document.getElementById("boxMoutonsPerdus").style.display = "block"; //faire apparaître box pour décompte de moutons
        document.getElementById("addMoutonsPerdus").style.display = "block";

        document.getElementById("compteurMoutonsPerdus").innerHTML = compteurMoutonsPerdus;
        document.getElementById("addMoutonsPerdus").innerHTML = "+" + moutonsPerdus;
        console.log(compteurMoutonsPerdus + "moutons perdus final");

        if (moutonRipAffiche === false) {
            //afficher mouton
            var elem = document.createElement("img");
            elem.setAttribute("src", "img/rip_mouton.png");
            elem.setAttribute("height", "120");
            elem.setAttribute("width", "180");
            document.getElementById("imageMoutonPerdu").appendChild(elem);

            moutonRipAffiche = true; //ne plus afficher d'image de moutons
        }

        //feedback visuel
        launchAnimateScoreMoutonsPerdus(); //le rechargement de l'animation se fait plus tard, pour un goNew()
        launchFadeOutUpRightBox();
        restartFadeInOutMise();
        setTimeout(function eraseText() {
            document.getElementById("addMoutonsPerdus").style.display = "none";
        }, 2800);

        //feedback sonore
        var soundsFail = [
            "../src/sounds/fail.mp3"
        ];
        var tirageSon = soundsFail[Math.floor(Math.random() * soundsFail.length)];
        document.getElementById("failSound").innerHTML = '<source src="' + tirageSon + '" type="audio/mpeg">';

        var x = document.getElementById("failSound");
        x.play();
    }
}

function afficherRegles() {
    if (document.getElementById("affichageRegles").style.display === "none") {
        restartFadeInOutTexte();
        launchFadeInTexte();

        document.getElementById("boutonAfficherRegles").innerHTML = "Masquer les règles";
        document.getElementById("affichageRegles").style.display = "block";


    } else if (document.getElementById("affichageRegles").style.display === "block") {
        restartFadeInOutTexte();
        launchFadeOutTexte();

        setTimeout(function effacerRegles() {
            document.getElementById("boutonAfficherRegles").innerHTML = "Relire les règles";
            document.getElementById("affichageRegles").style.display = "none";
        }, 490);

    }
}

// ----------------------------feedback visuels et sonores--------------------
function launchAnimateScoreMoutonsGagnes() {
    var animMoutonsWin = document.querySelector('.compteurMoutonsGagnes');
    animMoutonsWin.classList.add('tada');
    animMoutonsWin.classList.remove('reset');
}

function launchAnimateScoreMoutonsPerdus() {
    var animMoutonsWin = document.querySelector('.compteurMoutonsPerdus');
    animMoutonsWin.classList.add('flash');
    animMoutonsWin.classList.remove('reset');
}

function restartAnimateScoreMoutons() {
    var animMoutonsWin = document.querySelector('.compteurMoutonsGagnes');
    animMoutonsWin.classList.remove('tada');
    animMoutonsWin.classList.add('reset');

    var animMoutonsFail = document.querySelector('.compteurMoutonsPerdus');
    animMoutonsFail.classList.remove('flash');
    animMoutonsFail.classList.add('reset');
}

function feedbackSonore() {
    if (winState === true) {
        var soundsWin = [
            "../src/sounds/baaaa1.mp3",
            "../src/sounds/baaaa2.mp3",
            "../src/sounds/baaaa3.mp3",
            "../src/sounds/baaaa4.mp3"
        ];

        var tirageSon = soundsWin[Math.floor(Math.random() * soundsWin.length)];
        document.getElementById("winSound").innerHTML = '<source src="' + tirageSon + '" type="audio/mpeg">';

        var x = document.getElementById("winSound");
        x.play();
    } else {
        var soundsFail = [
            "../src/sounds/fail.mp3"
        ];
        var tirageSon = soundsFail[Math.floor(Math.random() * soundsFail.length)];
        document.getElementById("failSound").innerHTML = '<source src="' + tirageSon + '" type="audio/mpeg">';

        var x = document.getElementById("failSound");
        x.play();
    }

    if (tours === 0) {
        var x = document.getElementById("sheepSound");
        x.play();
    }
}

function colorButton() {
    document.getElementById('boutonLancerBarre').style.backgroundColor = "373b3d";
}

function uncolorButton() {
    document.getElementById('boutonLancerBarre').style.backgroundColor = "757575";
}

function colorButtonRules() {
    document.getElementById('boutonAfficherRegles').style.backgroundColor = "757575";
}

function uncolorButtonRules() {
    document.getElementById('boutonAfficherRegles').style.backgroundColor = "373b3d";
}

function colorButtonMise(numeroBouton) {
    var x = numeroBouton;
    var name = 'mise' + x;

    document.getElementById(name).style.backgroundColor = "373b3d";
}

function uncolorButtonMise(numeroBouton) {
    var x = numeroBouton;
    var name = 'mise' + x;

    document.getElementById(name).style.backgroundColor = "757575";
}

function launchFadeOutTexte() {
    var animTexte = document.querySelector('.texte');
    animTexte.classList.add('fadeOut');
    animTexte.classList.remove('reset');
}

function launchFadeInTexte() {
    var animTexte = document.querySelector('.texte');
    animTexte.classList.add('fadeIn');
    animTexte.classList.remove('reset');
}

function restartFadeInOutTexte() {
    var animTexteIn = document.querySelector('.texte');
    animTexteIn.classList.remove('fadeIn');
    animTexteIn.classList.add('reset');

    var animTexteOut = document.querySelector('.texte');
    animTexteOut.classList.remove('fadeOut');
    animTexteOut.classList.add('reset');
}

function launchFadeInLeftBox() {
    var animTexte = document.querySelector('.leftsite');
    animTexte.classList.add('fadeInLeft');
}

function launchFadeInRightBox() {
    var animTexte = document.querySelector('.rightsite');
    animTexte.classList.add('fadeInRight');
}

function launchFadeOutUpLeftBox() {
    var animFadeOutWin = document.querySelector('.addMoutonsGagnes');
    animFadeOutWin.classList.add('fadeOutUp');
    animFadeOutWin.classList.remove('reset');
}

function launchFadeOutUpRightBox() {
    var animFadeOutFail = document.querySelector('.addMoutonsPerdus');
    animFadeOutFail.classList.add('fadeOutUp');
    animFadeOutFail.classList.remove('reset');
}

function restartFadeOutUpBoxes() {
    var animFadeOutFail = document.querySelector('.addMoutonsPerdus');
    animFadeOutFail.classList.remove('fadeOutUp');
    animFadeOutFail.classList.add('reset');

    var animFadeOutWin = document.querySelector('.addMoutonsGagnes');
    animFadeOutWin.classList.remove('fadeOutUp');
    animFadeOutWin.classList.add('reset');
}

function launchFadeOutMise() {
    var animMise = document.querySelector('.zonemise');
    animMise.classList.add('fadeOut');
    animMise.classList.remove('reset');
}

function launchFadeInMise() {
    var animMise = document.querySelector('.zonemise');
    animMise.classList.add('fadeIn');
    animMise.classList.remove('reset');
}

function restartFadeInOutMise() {
    var animMiseIn = document.querySelector('.zonemise');
    animMiseIn.classList.remove('fadeIn');
    animMiseIn.classList.add('reset');

    var animMiseOut = document.querySelector('.zonemise');
    animMiseOut.classList.remove('fadeOut');
    animMiseOut.classList.add('reset');
}

// ----------------------------fin de partie et enregistrement des données--------------------
function finDePartie() {
    if (tours === 0) {
        //récupérer score final du joueur
        scoreJoueurTom = score;
        localStorage.scoreJoueurTom = scoreJoueurTom;
        console.log(scoreJoueurTom + " score général");

        moutonsSauvesJoueurTom = compteurMoutonsGagnes;
        localStorage.moutonsSauvesJoueurTom = moutonsSauvesJoueurTom;
        console.log(moutonsSauvesJoueurTom + " moutons sauvés total");

        moutonsPerdusJoueurTom = compteurMoutonsPerdus;
        localStorage.moutonsPerdusJoueurTom = moutonsPerdusJoueurTom;
        console.log(moutonsPerdusJoueurTom + " moutons perdus total");

        // enregistrer les données du joueur
        enregistrerDonnees(1, resultatJoueur);
        var jeuMotriceTermine = true;
        localStorage.setItem("tomcruise", jeuMotriceTermine);

        //renvoyer le joueur vers le hub avec popup
        setTimeout(function launchPopup() {
            var messageFinPartie = confirm("Votre partie est terminée. Vous avez sauvé " + compteurMoutonsGagnes + " moutons !\n" + "Vous avez envoyé à la broche " + compteurMoutonsPerdus + " moutons !\n" + "Votre score total pour ce jeu est de " + score + "\n" + "Cliquez pour passer au jeu suivant.");
            //var messageFinPartie = confirm("Votre partie est terminée. Vous avez sauvé " + compteurMoutonsGagnes + " moutons !\n" + "Vous avez envoyé à la broche " + compteurMoutonsPerdus + " moutons !\n" + "Votre score total pour ce jeu est de " + score + "\n" + "Cliquez pour passer au jeu suivant.");
            if (messageFinPartie === true) {
                // open it in a new window / tab (depends on browser setting)
                window.open("hub.html", '_self', false);
            } else {
                // open it in a new window / tab (depends on browser setting)
                window.open("hub.html", '_self', false);
            }
        }, 2000);
        
        //créer le bouton
        /*var boutton = document.createElement("input");
        boutton.type = "button";
        boutton.value = "Fin de partie.";
        boutton.name = "FIN";
        var results = function resultat(){
            var messageFinPartie = confirm("Votre partie est terminée. Votre score est de " + score +" Cliquez pour passer au jeu suivant.");
            if (messageFinPartie === true) {
                x = "Prototype en cours de développement, veuillez patienter.";
                enregistrerDonnees(1,nomDuJeu + ";" + resultatJoueur);
                var jeuMotriceTermine = true;
                localStorage.getItem("tomcruise", jeuMotriceTermine);
                // open it in a new window / tab (depends on browser setting)
                window.open("hub.html",'_self',false);
            } else {
                x = "Ah, d'accord.";
            }
            document.getElementById("retourProto").innerHTML = x;
        }
        boutton.onclick = results;
        document.body.appendChild(boutton);*/
    } else {

    }
}

// enregistrer données du joueur dans fichier csv pour la version local (à commenter pour la version en ligne)
function enregistrerDonnees (type, data) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.responseText);
        }
    };

    if (type == 0) {
        xhttp.open("POST", phpFile, true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("joueur=" + data);
    } else if (type == 1) {
        xhttp.open("POST", phpFile, true );
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("data=" + data);
    }


    //xhttp.open("POST", "http://localhost:63342/Bandit2/src/php/toto.php", true);
    //xhttp.setRequestHeader("Content-type", "text/plain");
    //xhttp.send("data=\"" + donneesJoueur + "\"");
    //xhttp.send("data=15");

    console.log("Sent data " + data);
}

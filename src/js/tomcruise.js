//Variables du jeu
var nomDuJeu = "Motrice";
var IDjoueur = localStorage.getItem("joueur");
var nomJoueur = localStorage.getItem("name");
var connexionJoueur = localStorage.getItem("time");
var scoreJoueurTom = 0; //Score du joueur à renseigner en fin de session de jeu
var moutonsSauvesJoueurTom = 0; //Nbre de moutons sauvés par le joueur à renseigner en fin de session de jeu
var moutonsPerdusJoueurTom = 0; //Nbre de moutons embrochés par le joueur à renseigner en fin de session de jeu

var barSpeed = 1; //Vitesse de la barre : pixels par frame
var direction = 1; //direction actuelle du deplacement de la barre
var anim = 0; //Handle du timer d'anim de la barre
var running = false; //Si la barre est en cours d'anim
var miseValide = false; //Si la mise n'est pas validée par le joueur
var confianceValide = false; //Si la confiance n'est pas validée par le joueur

var modeDifficulty = 0; //0 pour adaptation de la difficulté en fonction win/fail, 1 pour courbe bonds
var gameSpeed = 1; //Vitesse du jeu (notre param de la difficulté)
var difficulty = 0; //Utilisée pour la mise en place de la courbe de difficulté
var nextDiff = 0;

var modeTest = true;
var activateModeTest = false; 
var overideTestMode = false; //Outrepasser le mode test si var = true, pour ne pas avoir les tours de chauffe
var modeFinDePartie = false; //Permet de bloquer le jeu pour voir les résultats du dernier tour

var score = 0; //Score actuel
var mise = 0; //Combien le joueur a misé
var confiance = 0; //Indice de confiance renseigné par le joueur

var toursTest = 3; //Nbre de tours d'entraînement pour le joueur
var toursDeJeu = 10; //Nombre de tours restants, variable à modifier pour augmenter ou réduire le temps de jeu si overideTestMode = false
var tours = 30; //Nombre de tours restants, variable à modifier pour augmenter ou réduire le temps de jeu si overideTestMode = true
var resultatJoueur = [];

var winState = false; //statut du joueur, false pour perdant
var actionDeJeu = 0; //Suivi du nombre d'action de jeu que réalise le joueur

var miseFirst = localStorage.getItem("miseOuConfiance"); //si 1, mise en premier ; sinon, confiance en premier
console.log("Si 1 c'est la mise d'abord, t'as combien là ? " + miseFirst);

var moutonsGagnes = 0;
var moutonsPerdus = 0;
var compteurMoutonsGagnes = 0;
var compteurMoutonsPerdus = 0;

var moutonAffiche = false; //Vérifier si mode test est activé, à passer en true pour ne pas avoir les tours de chauffe
var moutonRipAffiche = false; //vérifier affichage du mouton mort

var hideTarget = true; //Si on doit cacher la target a chaque tour

var differencePlayTime = 0.0;

var phpFile = "php/toto.php"; // version locale, à commenter pour la version en ligne
//var phpFile = "../sorcerer/php/toto.php"; // à décommenter pour la version en ligne

function init(){
    diffModel.setStepInCurve(0);
    diffModel.setMode(diffModel.MODE_DDA_SAUT); //le changement du mode de difficulté se fait aussi dans le code associé au mode test
    diffModel.setDiffStep(0.1);
    diffModel.setCurrentDiff(0.2);
    diffModel.setChallengeMinMax(2, 10);
    diffModel.setDdaJump(20, 0.3);
    diffModel.resetDdaJump();

    var diff = diffModel.currentDiff;
    gameSpeed = diffModel.getChallengeFromDiffLinear(diff);

    document.getElementById("tours").innerHTML = tours;
    //document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;
    if(hideTarget) {
        document.getElementById("target").style.visibility = "hidden";
    }
    document.getElementById("tableMise").style.visibility = "visible";
    
    //afficher mise ou confiance
    miseOuConfiance();
    
    //lancer tours de test
    launchModeTest();

    //Show FPS
    setInterval(showPerf, 10000);
}

//lancement choix mise ou confiance en premier
function miseOuConfiance() {
    //lancer barre
    run();

    //reset affichage mise
    document.getElementById("mise").innerHTML = mise;

    if (miseFirst === "1") {
        //activer les boutons de mise
        activateMise();
        unblockMise();
    } else {
        //activer les boutons de confiance
        activateConfiance();
        unblockConfiance();
    }
}

//récupérer mise
function recupMise(numeroMise) {
    mise = numeroMise;
    console.log(mise + " de mise");

    //recharger l'animation
    restartAnimateScoreMoutons();
    
    //afficher le target
    if(hideTarget) {
        document.getElementById("target").style.visibility = "visible";
    }
    //document.getElementById("res").innerHTML = "Appuyez sur ESPACE ou sur le bouton pour arrêter la barre.";
    
    //message de feedback
    document.getElementById("affichageFeedback").innerHTML = "Cliquez sur le bouton pour arrêter la barre sur la cible.";

    //acter la mise du joueur pour déverouiller jeu
    miseValide = true;
    blockMise();
    hideTarget = false;

    document.getElementById("mise").innerHTML = mise;

    //cacher les boutons de mise
    restartFadeInOutMise();
    setTimeout(launchFadeOutMise(), 100);
    setTimeout(function eraseZoneMise() {
        document.getElementById("boutonsMise").style.display = "none";
        //lancer récupération de confiance si non fait
        if (miseValide && confianceValide) {
            launchGame();
        } else if (miseValide) {
            activateConfiance();
            unblockConfiance();
        }
    }, 490);
}

//afficher confiance
function afficherConfiance() {
    var x = document.getElementById("echelleConfiance").value;
    document.getElementById("affichageConfiance").innerHTML = "Vous estimez vos chances de gagner à :<br />" + x + "% (cliquez pour valider)";
    confiance = x;
}

//récupérer confiance
function recupConfiance(indiceConfiance) {
    //confiance = indiceConfiance;

    if (isNaN(confiance)) {
        document.getElementById("affichageFeedback").innerHTML = "Précisez à quel point vous êtes confiant dans votre capacité à gagner.";
        document.getElementById("affichageFeedback").style.backgroundColor = "#F44336";
    } else {
        var x = document.getElementById("echelleConfiance").value;
        confiance = x;

        console.log("le joueur est confiant à " + confiance + "%");

        //acter la confiance du joueur pour déverouiller jeu
        confianceValide = true;
        blockConfiance();


        //cacher les boutons de confiance
        restartFadeInOutConfiance();
        setTimeout(launchFadeOutConfiance(), 100);
        setTimeout(function eraseZoneConfiance() {
            document.getElementById("boutonsConfiance").style.display = "none";
            //lancer récupération de mise si non fait
            if (miseValide && confianceValide) {
                launchGame();
            } else if (confianceValide) {
                activateMise();
                unblockMise();
            }
        }, 490);
    } 
}

//lancer jeu après mise et confiance
function launchGame() {
    if (miseValide && confianceValide) {
        //afficher boutton
        showButton();

        changeTexteBouton();

        //recharger l'animation des boites de moutons
        restartFadeOutUpBoxes();
    }
}

function blockMise() {
    //verrouiller boutons de mise
    document.getElementById("mise1").onclick = "";
    document.getElementById("mise2").onclick = "";
    document.getElementById("mise3").onclick = "";
    document.getElementById("mise4").onclick = "";
    document.getElementById("mise5").onclick = "";
    document.getElementById("mise6").onclick = "";
    document.getElementById("mise7").onclick = "";
}

function unblockMise() {
    //déverrouiller boutons de sélection de mise
    document.getElementById("mise1").onclick = function () { recupMise(1); };
    document.getElementById("mise2").onclick = function () { recupMise(2); };
    document.getElementById("mise3").onclick = function () { recupMise(3); };
    document.getElementById("mise4").onclick = function () { recupMise(4); };
    document.getElementById("mise5").onclick = function () { recupMise(5); };
    document.getElementById("mise6").onclick = function () { recupMise(6); };
    document.getElementById("mise7").onclick = function () { recupMise(7); };
}

function blockConfiance() {
    //verrouiller boutons de confiance
    document.getElementById("affichageConfiance").onclick = "";

    /*document.getElementById("confiance1").onclick = "";
    document.getElementById("confiance2").onclick = "";
    document.getElementById("confiance3").onclick = "";
    document.getElementById("confiance4").onclick = "";
    document.getElementById("confiance5").onclick = "";*/
}

function unblockConfiance() {
    //déverrouiller boutons de sélection de confiance
    document.getElementById("affichageConfiance").onclick = function () { recupConfiance(); };

    /*document.getElementById("confiance1").onclick = function () { recupConfiance(1); };
    document.getElementById("confiance2").onclick = function () { recupConfiance(2); };
    document.getElementById("confiance3").onclick = function () { recupConfiance(3); };
    document.getElementById("confiance4").onclick = function () { recupConfiance(4); };
    document.getElementById("confiance5").onclick = function () { recupConfiance(5); };*/
}

function activateMise() {
    //afficher message de choix de mise
    document.getElementById("affichageFeedback").style.display = "block";
    document.getElementById("affichageFeedback").innerHTML = "Combien misez-vous de moutons sur vos chances de gagner ?";
    document.getElementById("affichageFeedback").style.backgroundColor = "#03A9F4";

    //afficher boutons de mise
    document.getElementById("boutonsMise").style.display = "block";
    launchFadeInMise();
}

function activateConfiance() {
    //afficher message de choix de confiance
    document.getElementById("affichageFeedback").style.display = "block";
    document.getElementById("affichageFeedback").innerHTML = "A quel point êtes-vous confiant dans votre capacité à gagner ?";
    document.getElementById("affichageFeedback").style.backgroundColor = "#03A9F4";
    
    //remettre valeur du slider à 50
    document.getElementById("echelleConfiance").value = 50;
    var x = document.getElementById("echelleConfiance").value;
    document.getElementById("affichageConfiance").innerHTML = "Vous estimez vos chances de gagner à :<br />" + x + "% (cliquez pour valider)";

    //afficher boutons de confiance
    document.getElementById("boutonsConfiance").style.display = "block";
    launchFadeInConfiance();
}

function showMise() {
    document.getElementById("tableMise").style.visibility = "visible";
    document.getElementById("tours").innerHTML = tours;
    //document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;
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
    
    if (miseValide && confianceValide && elem.innerHTML==="Lancer la barre") {
        elem.innerHTML = "Arrêter la barre";
        document.getElementById("boutonLancerBarre").disabled = false;
        elem.onclick = stop;
    } else {
        elem.innerHTML = "Lancer la barre";
        elem.onclick = miseOuConfiance;
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
var nbCall = 0;
var timeCall = 0;
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

    if (nbCall === 0) {
        timeCall = window.performance.now();
    }
    nbCall++;
    
    moveBar(slider,direction);
}

function showPerf() {
    var fps = (1000*(nbCall / (window.performance.now() - timeCall))).toFixed(2);
    console.log("FPS: " + fps);
    nbCall = 0;
    timeCall = 0;
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

    var nearMiss = positionTarget - positionSlider; //si positif, slider dans la zone gauche ; si négatif, slider dans la zone droite 

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
    } else {
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

    //enregistrer temps fin tour
    getPlayTimeAfter();

    //Un tour de moins
    tours--;
    
    //On sauve le resultat pour cet essai dans une variable, ne sera transféré dans csv que lorsque le jeu est terminé (fin de partie)
    resultatJoueur += nomJoueur + ";" + IDjoueur + ";" + connexionJoueur + ";" + nomDuJeu + ";" + modeTest + ";" + miseFirst + ";" + actionDeJeu + ";" + differencePlayTime + ";" + mise + ";" + confiance + ";" + diffModel.currentDiff.toFixed(2) + ";" + gameSpeed + ";" + nearMiss + ";" + compteurMoutonsGagnes + ";" + compteurMoutonsPerdus + ";" + score + ";" + winState + ";" + "\n";
    console.log("saved current diff : " + diffModel.currentDiff.toFixed(2));
    
    //modification de la difficulté (à décommenter pour nvelle courbe de diff)
    changeMetaDiff();

    //mise a jour de la difficulte selon le modele
    /*var nextDiff = diffModel.nextDifficulty(res);
    gameSpeed = diffModel.getChallengeFromDiff(nextDiff);
    console.log("nextdiff : " + nextDiff + "-> speed :" + gameSpeed);*/

    //Reset de la mise
    mise = "?";
    document.getElementById("tours").innerHTML = tours;
    //document.getElementById("score").innerHTML = score;
    //document.getElementById("mise").innerHTML = mise;

    miseValide = false;
    confianceValide = false;
    hideTarget = true;

    //bloquer le jeu pour et déverouiller bouton de mise sauf si plus de tours
    if (tours > 0) {
        document.getElementById("boutonLancerBarre").disabled = false;

    } else if (tours === 0 && modeTest === true) {
        hideButton()
        launchModeTest();

    } else if (tours === 0 && modeTest === false) {
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

        //enregistrer temps début tour
        getPlayTimeBefore();

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
    //console.log("new speed :" + gameSpeed);

    if(tours > 0) {

        var pixelsPerSec = 40 * (gameSpeed + 0.5) + 0.001;
        var framelength = 1000.0 / pixelsPerSec;

        
        barSpeed = 1.0;
        while (framelength <= 1000.0/200.0) {
            console.log("Games at :" + (1000.0 / framelength).toFixed(2) + "fps, pellet speed wanted is " + pixelsPerSec.toFixed(2) + "pps actual is " + ((1000.0 * barSpeed) / framelength).toFixed(2) + "pps");
            barSpeed += 1;
            framelength *= 1.0+1.0/(barSpeed-1);
        }

        barSpeed = Math.floor(barSpeed);

        console.log("Games at :" + (1000.0 / framelength).toFixed(2) + "fps, pellet speed wanted is " + pixelsPerSec.toFixed(2) + "pps actual is " + ((1000.0 * barSpeed) / framelength).toFixed(2) + "pps, " + barSpeed+" pix per frame");
    }
    //On lance l'anim
    if(tours > 0) {
        anim = setInterval(animBar, framelength);
    }
    changeTexteBouton();
}

function changeMetaDiff() {

    nextDiff = diffModel.nextDifficulty(winState);
    gameSpeed = diffModel.getChallengeFromDiffLinear(nextDiff);

    /*if (modeDifficulty === 0) {
        //mise a jour de la difficulte selon le modele
        nextDiff = diffModel.nextDifficulty(winState);
        gameSpeed = diffModel.getChallengeFromDiffLinear(nextDiff);
        //console.log("nextdiff : " + nextDiff + "-> speed :" + gameSpeed);

    } else if (modeDifficulty === 1 && modeTest === true) {
        // reprendre code actuel fonctionnement diff
        nextDiff = diffModel.nextDifficulty(winState);
        gameSpeed = diffModel.getChallengeFromDiffLinear(nextDiff);
        //console.log("nextdiff : " + nextDiff + "-> speed :" + gameSpeed);

    } else if (modeDifficulty === 1 && modeTest === false) {
        // envoyer vers contenu de courbeDiff.js  
        selectbondDiff();
        difficulty = newDiff;

        //modifier la valeur de la difficulté si elle est égale à 1 ; pour ce jeu, la diff max ne peut être que je 0.99
        if (newDiff >= 1) {
            newDiff = 0.99;
            //console.log("newDiff corrected for tomcruise = " + newDiff);
        }
        nextDiff = newDiff;

        gameSpeed = diffModel.getChallengeFromDiffLinear(nextDiff);
    }
    console.log("difficulté du jeu:" + gameSpeed.toFixed(2));*/
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
        if(running && miseValide && confianceValide) {
            stop();
        } else { 
            miseOuConfiance();
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

//----------------------------récupérer date et heure de connexion au jeu------------
function getPlayTimeBefore() {
    var playNow = new Date();
    var playNowMs = playNow.getTime();

    playTimeBefore = playNowMs;
    console.log(playTimeBefore + " début tour");
}

function getPlayTimeAfter() {
    var playNow = new Date();
    var playNowMs = playNow.getTime();

    playTimeAfter = playNowMs;
    console.log(playTimeAfter + " fin tour");

    getDifferencePlayTime();
}

function getDifferencePlayTime() {
    differencePlayTime = playTimeAfter - playTimeBefore;
    console.log(differencePlayTime + " ms entre tour");
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

    document.getElementById(name).style.backgroundColor = "757575";
}

function uncolorButtonMise(numeroBouton) {
    var x = numeroBouton;
    var name = 'mise' + x;

    document.getElementById(name).style.backgroundColor = "373b3d";
}

function colorButtonConfiance(numeroBouton) {
    var x = numeroBouton;
    var name = 'confiance' + x;

    document.getElementById(name).style.backgroundColor = "757575";
}

function uncolorButtonConfiance(numeroBouton) {
    var x = numeroBouton;
    var name = 'confiance' + x;

    document.getElementById(name).style.backgroundColor = "373b3d";
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

function launchFadeOutConfiance() {
    var animMise = document.querySelector('.zoneconfiance');
    animMise.classList.add('fadeOut');
    animMise.classList.remove('reset');
    fadeOutOver = true;
}

function launchFadeInConfiance() {
    var animMise = document.querySelector('.zoneconfiance');
    animMise.classList.add('fadeIn');
    animMise.classList.remove('reset');
}

function restartFadeInOutConfiance() {
    var animMiseIn = document.querySelector('.zoneconfiance');
    animMiseIn.classList.remove('fadeIn');
    animMiseIn.classList.add('reset');

    var animMiseOut = document.querySelector('.zoneconfiance');
    animMiseOut.classList.remove('fadeOut');
    animMiseOut.classList.add('reset');
}

// ----------------------------mode test en début de partie--------------------
function launchModeTest() {
    if (overideTestMode === true) {
        console.log("test mode bypass");
        modeTest = false;
    } else {
        if (activateModeTest === false) {
            console.log("test mode activated");

            //modifier affichage contenu popup
            document.getElementById("popupTitre3").innerHTML = "Tours de chauffe";
            document.getElementById("popup3").innerHTML = "Le Sorcier vous laisse trois tours de jeu pour vous entraîner. Profitez-en !";

            //modifier affichage variables de jeu
            tours = toursTest;
            document.getElementById("tours").innerHTML = tours;

            window.open("#popup2", '_self', false); //ouvre la popup

            activateModeTest = true;
        }

        if (tours === 0) {
            //Fin du mode DDA, on passe en random
            diffModel.setMode(diffModel.MODE_RANDOM);

            //modifier affichage contenu popup
            document.getElementById("popupTitre3").innerHTML = "Lancement du jeu";
            document.getElementById("popup3").innerHTML = "L'entraînement est terminé. A partir de maintenant, les moutons risquent de passer à la broche ! Prenez garde !";

            setTimeout(function launchPopup() {
                //restart game
                score = 0;
                gameSpeed = 1;
                tours = toursDeJeu;
                actionDeJeu = 0;
                moutonsGagnes = 0;
                moutonsPerdus = 0;
                compteurMoutonsGagnes = 0;
                compteurMoutonsPerdus = 0;

                difficulty = 0;
                diffModel.setCurrentDiff(0.2);

                barSpeed = 1; //Vitesse de la barre : pixels par frame
                direction = 1; //direction actuelle du deplacement de la barre
                anim = 0; //Handle du timer d'anim de la barre
                running = false; //Si la barre est en cours d'anim

                //mise à zéro interface
                document.getElementById("compteurMoutonsGagnes").innerHTML = compteurMoutonsGagnes;
                document.getElementById("compteurMoutonsPerdus").innerHTML = compteurMoutonsPerdus;
                document.getElementById("tours").innerHTML = tours;
                document.getElementById("mise").innerHTML = mise;

                //faire apparaitre bouton pour générer la grille
                document.getElementById("boutonLancerBarre").style.visibility = "visible";

                window.open("#popup2", '_self', false); //ouvre la popup

            }, 1500);

            modeTest = false;
            console.log("test mode desactivated");

        }
    }
    
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

        //renvoyer le joueur vers le hub via la popup
        setTimeout(function launchPopup() {
            window.open("#popup1", '_self', false); //ouvre la popup
            document.getElementById("popupTitre").innerHTML = "Votre partie est terminée.";
            document.getElementById("popup").innerHTML = "Vous avez sauvé " + compteurMoutonsGagnes + " moutons !<br />" + "Vous avez envoyé à la broche " + compteurMoutonsPerdus + " moutons !<br />" + "Votre score total pour ce jeu est de " + score + ".";
        }, 2000);

        /*setTimeout(function launchPopup() {
            var messageFinPartie = confirm("Votre partie est terminée. Vous avez sauvé " + compteurMoutonsGagnes + " moutons !\n" + "Vous avez envoyé à la broche " + compteurMoutonsPerdus + " moutons !\n" + "Votre score total pour ce jeu est de " + score + "\n" + "Cliquez pour passer au jeu suivant.");
            //var messageFinPartie = confirm("Votre partie est terminée. Vous avez sauvé " + compteurMoutonsGagnes + " moutons !\n" + "Vous avez envoyé à la broche " + compteurMoutonsPerdus + " moutons !\n" + "Votre score total pour ce jeu est de " + score + "\n" + "Cliquez pour passer au jeu suivant.");
            if (messageFinPartie === true) {
                // open it in a new window / tab (depends on browser setting)
                window.open("hub.html", '_self', false);
            } else {
                // open it in a new window / tab (depends on browser setting)
                window.open("hub.html", '_self', false);
            }
        }, 2000);*/

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
        xhttp.send("id="+IDjoueur+"&joueur=" + data);
    } else if (type == 1) {
        xhttp.open("POST", phpFile, true );
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("id="+IDjoueur+"&data=" + data);
    }


    //xhttp.open("POST", "http://localhost:63342/Bandit2/src/php/toto.php", true);
    //xhttp.setRequestHeader("Content-type", "text/plain");
    //xhttp.send("data=\"" + donneesJoueur + "\"");
    //xhttp.send("data=15");

    console.log("Sent data " + data);
}

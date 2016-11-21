var nomDuJeu = "Logique2";
var IDjoueur = localStorage.getItem("joueur");
var nomJoueur = localStorage.getItem("name");
var connexionJoueur = localStorage.getItem("time");
var scoreJoueurBenedict = 0; //Score du joueur à renseigner en fin de session de jeu
var moutonsSauvesJoueurBenedict = 0; //Nbre de moutons sauvés par le joueur à renseigner en fin de session de jeu
var moutonsPerdusJoueurBenedict = 0; //Nbre de moutons embrochés par le joueur à renseigner en fin de session de jeu

var nbCells = 4;
var width = 300;

var modeDifficulty = 0; //0 pour adaptation de la difficulté en fonction win/fail, 1 pour courbe bonds
var difficulty = 0.1;
var colorTransitionSpeed = 0.1;
var modePoussin = true;
var modeNormal = false;
var modeViolent = false; //decalage entre les cases de 1 meme diagonales

var modeTest = true;
var activateModeTest = false;
var overideTestMode = false; //Outrepasser le mode test si var = true, pour ne pas avoir les tours de chauffe
var toursTest = 3; //Nbre de tours d'entraînement pour le joueur
var toursDeJeu = 30; //Nbre de tours de jeu total, variable à modifier pour augmenter ou réduire le temps de jeu si overideTestMode = false
var tours = 30; //Nombre de tours restants, variable à modifier pour augmenter ou réduire le temps de jeu si overideTestMode = true
var modeFinDePartie = false; //Permet de bloquer le jeu pour voir les résultats du dernier tour

var score = 0;
var anim = 0;
var colorTarget =  0;
var colorCurrent = 0;
var colorBase =  0;
var nbCasesToFind = 0;
var casesFound = []; //tableau des cases trouvées
var miseValide = false; //Si la mise n'est pas validée par le joueur
var confianceValide = false; //Si la confiance n'est pas validée par le joueur

var winState = false; //statut du joueur, false pour perdant
var actionDeJeu = 0; //Suivi du nombre d'action de jeu que réalise le joueur

var moutonsGagnes = 0;
var moutonsPerdus = 0;
var compteurMoutonsGagnes = 0;
var compteurMoutonsPerdus = 0;

var moutonAffiche = false; //vérifier affichage du mouton vivant
var moutonRipAffiche = false; //vérifier affichage du mouton mort

var countDownToZero = false; //statut du compte à rebours

var miseFirst = localStorage.getItem("miseOuConfiance"); //si 1, mise en premier ; sinon, confiance en premier
console.log("Si 1 c'est la mise d'abord, t'as combien là ? " + miseFirst);

var score = 0; //Score actuel
var mise = 0; //Combien le joueur a misé
var confiance = 0; //Indice de confiance renseigné par le joueur
var resultatJoueur = [];

var running = false;
var animationReset = false; //état de l'animation
var fadeOutOver = false; //état animation fadeOut

var playTimeBefore = 0; //temps au début du tour
var playTimeAfter = 0; //temps au moment de la validation de la mise
var differencePlayTime = 0; //différence entre playTimeBefore et playTimeAfter en mn:ss

var phpFile = "php/toto.php"; // version locale, à commenter pour la version en ligne
//var phpFile = "../sorcerer/php/toto.php"; // à décommenter pour la version en ligne

function animate(){
    var decreaseFactor = (30*(1-colorTransitionSpeed))+1;
    var step = Math.floor((colorTarget - colorBase) / decreaseFactor);
    step = Math.max(1,step);

    var cells = document.getElementsByName("cellWin");
    //console.log(colorTarget+'/'+colorBase);
    if(colorCurrent - colorBase > step)
        colorCurrent -= step;
    else {
        colorCurrent = colorBase;
    }

    for(var i=0;i<cells.length;i++){
        //console.log(cells[i].id);
        //console.log(casesFound.indexOf(parseInt(cells[i].id)));
        if (casesFound.indexOf(parseInt(cells[i].id)) >= 0) {
            cells[i].style.backgroundColor = "#81C784";
        } else {
            cells[i].style.backgroundColor = toHexColor(colorCurrent,colorCurrent,colorCurrent);
        }
    }
}

function init() {
    diffModel.setStepInCurve(0);
    diffModel.setMode(diffModel.MODE_DDA_SAUT); //le changement du mode de difficulté se fait aussi dans le code associé au mode test
    diffModel.setDiffStep(0.1);
    diffModel.setCurrentDiff(0.0);
    diffModel.setChallengeMinMax(1, 11);
    diffModel.setDdaJump(20, 0.3);
    diffModel.resetDdaJump();
    
    g_nbPerm = Math.floor(diffModel.getChallengeFromDiffLinear(diffModel.currentDiff));

    document.getElementById("tours").innerHTML = tours;
    //document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;

    //verrouiller boutons de mise
    document.getElementById("mise1").disabled = true;
    document.getElementById("mise2").disabled = true;
    document.getElementById("mise3").disabled = true;
    document.getElementById("mise4").disabled = true;
    document.getElementById("mise5").disabled = true;
    document.getElementById("mise6").disabled = true;
    document.getElementById("mise7").disabled = true;

    //lancer tours de test
    launchModeTest();
}

function go() {
    casesFound = [];
    makeGame(width, nbCells, g_nbPerm);
    anim = setInterval(animate,20);
    document.getElementById("affichageFeedback").style.backgroundColor = "#FF5722";
    /*document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;*/
    /*if(hideTarget) {
        document.getElementById("target").style.visibility = "hidden";
    }
    document.getElementById("tableMise").style.visibility = "hidden";*/
}

function goNew() {
    if (modeFinDePartie === false) {
        casesFound = [];
        document.getElementById("affichageFeedback").style.backgroundColor = "#FF5722";
        document.getElementById("affichageFeedback").innerHTML = "Le plateau de jeu va apparaître dans...";

        //changer affichage mise
        mise = '?';
        document.getElementById("mise").innerHTML = mise;
        //document.getElementById("affichageFeedback").style.display = "none";

        makeGame(width, nbCells, 0); //afficher la grille sans cases à trouver

        startTimer();

        //cacher les boutons de mise
        /*launchFadeOutMise();
        setTimeout(function eraseZoneMise() {
            document.getElementById("boutonsMise").style.display = "none";
        }, 490);*/

        //activer les boutons de mise
        //unblockMise();

        //enregistrer temps début tour
        getPlayTimeBefore();
    }
}

//lancement choix mise ou confiance en premier
function miseOuConfiance() {
    if (miseFirst === 1) {
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

    //afficher mise
    showMise();

    //enregistrer mise dans csv
    //enregistrerDonnees(0, mise);

    //acter la mise du joueur pour déverouiller jeu
    miseValide = true;
    blockMise();

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
        //faire apparaître le compte à rebours et le lancer
        document.getElementById("affichageFeedback").innerHTML = "Déplacez le carré bleu pour ranger le plateau dans l'ordre.";
        document.getElementById("affichageFeedback").style.backgroundColor = "#03A9F4";
        //startTimer();

        //On reset le temps
        g_temps_coups = g_duree_coup;
        document.getElementById("temps").innerHTML = g_temps_coups;
        clearInterval(g_timer_coup_id);
        g_timer_coup_id = setInterval(timerCoups, 1000);
        showGrid(true);

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

function changeMetaDiff() {
    difficulty = diffModel.nextDifficulty(winState);
    g_nbPerm = Math.floor(diffModel.getChallengeFromDiffLinear(difficulty));

    /*if (modeDifficulty === 0) {
        console.log("winstate =" + winState);
        // reprendre code actuel fonctionnement diff
        if (winState === true) {
            difficulty = Math.min(1, difficulty + 0.1);
        } else {
            difficulty = Math.max(0, difficulty - 0.1);
        }

    } else if (modeDifficulty === 1 && modeTest === true) {
        if (winState === true) {
            difficulty = Math.min(1, difficulty + 0.1);
        } else {
            difficulty = Math.max(0, difficulty - 0.1);
        }

    } else if (modeDifficulty === 1 && modeTest === false) {
        // envoyer vers contenu de courbeDiff.js
        selectbondDiff();
        difficulty = newDiff;
    }

    console.log("difficulté du jeu:" + difficulty);*/
}

function win(ijFind){
    if (miseValide === true && confianceValide === true && countDownToZero === true && casesFound.indexOf(ijFind) < 0) {
      nbCasesToFind--;
      casesFound.push(ijFind);
        if(nbCasesToFind <= 0) {
            winState = true;

            moutonsGagnes += mise;
            compteurMoutonsGagnes += moutonsGagnes;

            score += mise;
            actionDeJeu++;

            //enregistrer temps fin tour
            getPlayTimeAfter();

            addSheep(); //faire apparaître un mouton sur la page

            //message de feedback
             if (mise === 1) {
                 document.getElementById("affichageFeedback").innerHTML = "Vous avez sauvé " + mise + " mouton. Cliquez sur le bouton pour générer un plateau de jeu.";
            } else {
                 document.getElementById("affichageFeedback").innerHTML = "Vous avez sauvé " + mise + " moutons. Cliquez sur le bouton pour générer un plateau de jeu.";
            }
            document.getElementById("affichageFeedback").style.backgroundColor = "#00E676";
            //document.getElementById("res").innerHTML = "Vous avez sauvé "+mise+" mouton(s). Choisissez votre mise pour relancer le jeu.";

            //console.log(nbCasesToFind + "to go");

            //On sauve le resultat pour cet essai dans une variable, ne sera transféré dans csv que lorsque le jeu est terminé (fin de partie)
            resultatJoueur += nomJoueur + ";" + IDjoueur + ";" + connexionJoueur + ";" + nomDuJeu + ";" + miseFirst + ";" + actionDeJeu + ";" + differencePlayTime + ";" + mise + ";" + confiance + ";" + diffModel.currentDiff.toFixed(2) + ";" + g_nb_coups + ";" + compteurMoutonsGagnes + ";" + compteurMoutonsPerdus + ";" + score + ";" + winState + ";" + "\n";
            console.log("saved current diff : " + diffModel.currentDiff.toFixed(2));
            console.log(resultatJoueur);

            //Un tour de moins, reset de la mise, et du nbre de moutons gagnés
            moutonsGagnes = 0;
            tours--;
            mise = "?";
            document.getElementById("tours").innerHTML = tours;
            //document.getElementById("score").innerHTML = score;
            //document.getElementById("mise").innerHTML = mise;

            changeMetaDiff();
            //difficulty = Math.min(1,difficulty+0.1);

            //bloquer jeu
            miseValide = false;
            confianceValide = false;
            countDownToZero = false;

            //lancer nouveau jeu sauf si plus de tours
            if (tours > 0) {
                //faire apparaitre bouton pour générer la grille
                document.getElementById("boutonGenererGrille").style.visibility = "visible";
            } else if (tours === 0 && miseValide === false && modeTest === false) {
                modeFinDePartie = true;
                finDePartie();
            } else if (tours === 0 && modeTest === true) {
                launchModeTest();
            }

        }

        //console.log("difficulté du prochain tour suite à win :" + difficulty);
    }

}

function fail(){
    if (miseValide === true && confianceValide === true && countDownToZero === true) {
        winState = false;

        moutonsPerdus += mise;
        compteurMoutonsPerdus += moutonsPerdus;
        
        score -= mise;
        actionDeJeu++;

        //enregistrer temps fin tour
        getPlayTimeAfter();

        addSheep(); //faire apparaître un mouton sur la page

        //message de feedback
        if (mise === 1) {
            document.getElementById("affichageFeedback").innerHTML = "Vous avez tué " + mise + " mouton. Cliquez sur le bouton pour générer un plateau de jeu.";
        } else {
            document.getElementById("affichageFeedback").innerHTML = "Vous avez tué " + mise + " moutons. Cliquez sur le bouton pour générer un plateau de jeu.";
        }
        document.getElementById("affichageFeedback").style.backgroundColor = "#F44336";
        //document.getElementById("res").innerHTML = "Vous avez tué " +mise+" mouton(s). Choisissez votre mise pour relancer le jeu.";

        //On sauve le resultat pour cet essai dans une variable, ne sera transféré dans csv que lorsque le jeu est terminé (fin de partie)
        resultatJoueur += nomJoueur + ";" + IDjoueur + ";" + connexionJoueur + ";" + nomDuJeu + ";" + miseFirst + ";" + actionDeJeu + ";" + differencePlayTime + ";" + mise + ";" + confiance + ";" + diffModel.currentDiff.toFixed(2) + ";" + g_nb_coups + ";" + compteurMoutonsGagnes + ";" + compteurMoutonsPerdus + ";" + score + ";" + winState + ";" + "\n";
        console.log("saved current diff : " + diffModel.currentDiff.toFixed(2));
        console.log(resultatJoueur);

        //Un tour de moins, reset de la mise, et du nbre de moutons perdus
        moutonsPerdus = 0;
        tours--;
        mise = "?";
        document.getElementById("tours").innerHTML = tours;
        //document.getElementById("score").innerHTML = score;
        //document.getElementById("mise").innerHTML = mise;

        changeMetaDiff();
        //difficulty = Math.max(0,difficulty-0.1);

        miseValide = false;
        confianceValide = false;
        countDownToZero = false;

        //bloquer le jeu pour et déverouiller bouton de mise sauf si plus de tours
        if (tours > 0) {
            //faire apparaitre bouton pour générer la grille
            document.getElementById("boutonGenererGrille").style.visibility = "visible";

        } else if (tours === 0 && modeTest === true) {                       
            launchModeTest();

        } else if (tours === 0 && modeTest === false) {
            modeFinDePartie = true;
            finDePartie();
        }

        //console.log("difficulté du prochain tour suite à fail :" + difficulty);
    }

}

function toHex(d) {
    return ("0"+(Number(d).toString(16))).slice(-2).toUpperCase();
}

function toHexColor(R,V,B){
    return "#"+toHex(R)+toHex(V)+toHex(B);
}

var g_casesNum = [];
var g_width = 0;
var g_nbCellX = 0;
var g_lastCoup = 5;
var g_nb_coups = 0;
var g_timer_coup_id = 0;
var g_temps_coups = 0;
var g_nbPerm = 0;
const g_duree_coup = 20;

function makeGame(width,nbCellX,nbPerm) {

    g_nbCellX = nbCellX = 3;
    g_width = width;

    //Creation du tableau
    g_casesNum = [];
    for(var i=0;i<g_nbCellX*g_nbCellX;i++){
      g_casesNum.push(i+1);
    }

    //On enleve la case du milieu
    var i = Math.floor(g_nbCellX/2);
    g_casesNum[Math.floor(i*g_nbCellX+i)] = -g_casesNum[Math.floor(i*g_nbCellX+i)];

    /*
    var i = Math.floor(g_nbCellX*g_nbCellX-1);
    g_casesNum[Math.floor(i)] = -1;*/

    //On permiet
    g_nb_coups = nbPerm;
    document.getElementById("nbCoups").innerHTML = g_nb_coups;
    console.log("Making grid with "+nbPerm+ " permutations");
    g_lastCoup = 5;
    for(var i=0;i<nbPerm;i++){
      //on cherche la case vide
      var iCaseVide = -1;
      for(var is=0;is<g_nbCellX*g_nbCellX;is++)
        if(g_casesNum[is] < 0)
          iCaseVide = is;

      //On permute avec une case au hasard
      var moveValid = false;

      while(!moveValid){

        var yTest = Math.floor(iCaseVide/g_nbCellX);
        var xTest = iCaseVide%g_nbCellX;

        var coup = Math.floor(Math.random()*4);
        switch (coup){
          case 0: xTest = xTest-1; break;
          case 1: xTest = xTest+1; break;
          case 2: yTest = yTest-1; break;
          case 3: yTest = yTest+1; break;
        }

        var coupOk = true;
        switch (coup){
          case 0: if(g_lastCoup == 1) coupOk = false; break;
          case 1: if(g_lastCoup == 0) coupOk = false; break;
          case 2: if(g_lastCoup == 3) coupOk = false; break;
          case 3: if(g_lastCoup == 2) coupOk = false; break;
        }

        if(xTest >= 0 && xTest < g_nbCellX && yTest >= 0 && yTest < g_nbCellX && coupOk ){
          switch (coup){
            case 0: console.log("permutation",i,"left"); break;
            case 1: console.log("permutation",i,"right"); break;
            case 2: console.log("permutation",i,"up"); break;
            case 3: console.log("permutation",i,"down"); break;
          }
          permute(xTest,yTest);
          g_lastCoup = coup;
          moveValid = true;
        }else{
          switch (coup){
            case 0: console.log("> oups no left"); break;
            case 1: console.log("> oups no right"); break;
            case 2: console.log("> oups no up"); break;
            case 3: console.log("> oups no down"); break;
          }
        }



      }
    }


    drawGrid();

    g_temps_coups = g_duree_coup;
    document.getElementById("temps").innerHTML = g_temps_coups;
    if(g_nb_coups > 0){     
        clearInterval(g_timer_coup_id); 
        g_timer_coup_id = setInterval(timerCoups,1000);
    }

}

function showGrid(show){
    if(!show)
        document.getElementById("board").innerHTML = "";
    else
        drawGrid();
}

function drawGrid(){
  //Affichage
  var widthCell = g_width / g_nbCellX;
  var strHtml = '';
  strHtml += '<table>';
  for(var i=0;i<g_nbCellX;i++) {
      strHtml += '<tr>';
      for(var j=0;j<g_nbCellX;j++) {
          var color = "#AAAAAA";
          var clickFun = "clickCase("+j+","+i+")";
          var txtColor = "#000000";

          var stepColor = Math.floor(150/(g_nbCellX*g_nbCellX));
          color = toHexColor(100,100 + g_casesNum[i*g_nbCellX+j]*stepColor,100)

          var border = '';
          if(g_casesNum[i*g_nbCellX+j] < 0)
              color = "#64B5F6";



          /*if(g_casesNum[(i+1)*g_nbCellX+j] < 0 ||
            g_casesNum[(i-1)*g_nbCellX+j] < 0 ||
            g_casesNum[i*g_nbCellX+(j+1)] < 0 ||
            g_casesNum[i*g_nbCellX+(j-1)] < 0  )
              txtColor = "#0000FF";*/
          //  if(Math.abs(g_casesNum[i*g_nbCellX+j]) != i*g_nbCellX+j +1 )
            //      txtColor = "#FFA500";

          var cursor = '';
          if(g_casesNum[(i-1)*g_nbCellX+j] < 0)
              cursor = 'cursor:url(img/keyboard_arrow_down.svg),auto;';
          if(g_casesNum[(i+1)*g_nbCellX+j] < 0)
              cursor = 'cursor:url(img/keyboard_arrow_up.svg),auto;';
          if(g_casesNum[(i)*g_nbCellX+(j-1)] < 0)
              cursor = 'cursor:url(img/keyboard_arrow_right.svg),auto;';
            if(g_casesNum[(i)*g_nbCellX+(j+1)] < 0)
                cursor = 'cursor:url(img/keyboard_arrow_left.svg),auto;';

          strHtml += '<td style="'+cursor+' text-align:center; color:'+txtColor+'; background-color:'+color+'; width:'+widthCell+'px; height:'+widthCell+'px" onclick="' + clickFun + '">&nbsp;';
          if(g_casesNum[i*g_nbCellX+j] >= 0)
            strHtml += g_casesNum[i*g_nbCellX+j];
          else
            strHtml += "<b>"+(-g_casesNum[i*g_nbCellX+j])+"</b>";

          strHtml += '</td>';
      }
      strHtml += '</tr>';
  }
  strHtml += '</table>';

  document.getElementById("board").innerHTML = strHtml;
}

function permute(i,j){

  var numCase = j*g_nbCellX+i;
  var coup = false;

  //console.log("permute on "+i,j)

  //gauche
  if(i > 0 && g_casesNum[numCase-1] < 0)
  {
    var tmp = g_casesNum[numCase-1];
    g_casesNum[numCase-1] = g_casesNum[numCase];
     g_casesNum[numCase] = tmp;
     coup = true;
  }

  if(i < g_nbCellX-1 && g_casesNum[numCase+1] < 0)
  {
    var tmp = g_casesNum[numCase+1];
    g_casesNum[numCase+1] = g_casesNum[numCase];
     g_casesNum[numCase] = tmp;
     coup = true;
  }

  if(j > 0 && g_casesNum[numCase-g_nbCellX] < 0)
  {
    var tmp = g_casesNum[numCase-g_nbCellX];
    g_casesNum[numCase-g_nbCellX] = g_casesNum[numCase];
     g_casesNum[numCase] = tmp;
     coup = true;
  }

  //console.log(i,j,g_casesNum[numCase+g_nbCellX]);
  if(j < g_nbCellX-1 && g_casesNum[numCase+g_nbCellX] < 0)
  {
    var tmp = g_casesNum[numCase+g_nbCellX];
    g_casesNum[numCase+g_nbCellX] = g_casesNum[numCase];
     g_casesNum[numCase] = tmp;
     coup = true;
  }


  drawGrid();

  return coup;
}

function clickCase(x,y){

    /*if(!miseValide)
        return;*/

    //vérifier état de mise pour animation instruction de jeu
    if (miseValide === false && confianceValide === false) {
        document.getElementById("affichageFeedback").style.backgroundColor = "#F44336";

        setTimeout(function changerCouleur() {
            document.getElementById("affichageFeedback").style.backgroundColor = "#03A9F4";
        }, 200);

        setTimeout(function changerCouleur() {
            document.getElementById("affichageFeedback").style.backgroundColor = "#F44336";
        }, 400);

        setTimeout(function changerCouleur() {
            document.getElementById("affichageFeedback").style.backgroundColor = "#03A9F4";
        }, 600);

        return;
    }

  if(g_nb_coups > 0)
    if(permute(x,y))
        g_nb_coups--;

  document.getElementById("nbCoups").innerHTML = g_nb_coups;

  //on teste si gagne
  var youWin = true;
  for(var i=0;i<g_nbCellX*g_nbCellX;i++){
    //console.log(g_casesNum[i],i);
    if(Math.abs(g_casesNum[i]) != i+1)
      youWin = false;
  }

  //console.log(youWin);
  if(youWin){
    nbCasesToFind = 0;
    win(0);
  }

  if(g_nb_coups == 0 || youWin)
    clearInterval(g_timer_coup_id);

  if(g_nb_coups == 0 && !youWin)
    fail();
}

function timerCoups(){
    g_temps_coups--;
    document.getElementById("temps").innerHTML = g_temps_coups;
    if(g_temps_coups <= 0){
        clearInterval(g_timer_coup_id);
        
        if(!miseValide || !confianceValide) {

            if (!miseValide) {
                document.getElementById("affichageFeedback").innerHTML = "Le plateau de jeu a disparu. Choisissez votre mise pour continuer.";
            }

            if (!confianceValide) {
                document.getElementById("affichageFeedback").innerHTML = "Le plateau de jeu a disparu. Renseignez votre confiance pour continuer.";
            }
                
            document.getElementById("affichageFeedback").style.backgroundColor = "#FF5722";
            showGrid(false);

        } else {
            fail();
         
        }
            
    }

}

 function startTimer() {
    //faire apparaître le compte à rebours et le lancer
    document.getElementById("affichageCompteur").style.display = "block";

    //faire disparaître bouton pour générer la grille
    document.getElementById("boutonGenererGrille").style.visibility = "hidden";

    var seconds = 0;
    var temp = 0;
    temp = document.getElementById('timer');
    temp.innerHTML = "5";
    //document.getElementById("affichageCompteur").innerHTML = "Nouvelle grille dans <span id="'+timer+'">5</span> secondes !";

    function countdown() {
        seconds = document.getElementById('timer').innerHTML;
        seconds = parseInt(seconds, 10);

        if (seconds === 1) {
            makeGame(width,nbCells,g_nbPerm);
            anim = setInterval(animate,20);
            //console.log(anim + "anim");
            //activateMise();
            miseOuConfiance();
        }

        if (seconds === 1) {
            temp = document.getElementById('timer');
            temp.innerHTML = "0";
            document.getElementById("affichageCompteur").style.display = "none";
            countDownToZero = true;
            return;
        }

        seconds--;
        temp = document.getElementById('timer');
        temp.innerHTML = seconds;
        timeoutMyOswego = setTimeout(countdown, 1000);
    }

    countdown();
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
    console.log(playTimeBefore + " fin tour");

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
    document.getElementById('boutonGenererGrille').style.backgroundColor = "373b3d";
}

function uncolorButton() {
    document.getElementById('boutonGenererGrille').style.backgroundColor = "757575";
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
    fadeOutOver = true;
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
        } else if (activateModeTest === true) {
            console.log("test mode bypass");
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
                tours = toursDeJeu;
                actionDeJeu = 0;
                moutonsGagnes = 0;
                moutonsPerdus = 0;
                compteurMoutonsGagnes = 0;
                compteurMoutonsPerdus = 0;
               
                difficulty = 0;
                diffModel.setCurrentDiff(difficulty);
                g_nbPerm = Math.floor(diffModel.getChallengeFromDiffLinear(diffModel.currentDiff));

                nbCells = 4;
                width = 300;

                colorTransitionSpeed = 0.1;
                modePoussin = true;
                modeNormal = false;
                modeViolent = false;

                //mise à zéro interface
                document.getElementById("compteurMoutonsGagnes").innerHTML = compteurMoutonsGagnes;
                document.getElementById("compteurMoutonsPerdus").innerHTML = compteurMoutonsPerdus;
                document.getElementById("tours").innerHTML = tours;
                document.getElementById("mise").innerHTML = mise;

                //faire apparaitre bouton pour générer la grille
                document.getElementById("boutonGenererGrille").style.visibility = "visible";

                window.open("#popup2", '_self', false); //ouvre la popup

            }, 1500);

            modeTest = false;
            console.log("test mode desactivated");

        }
    }
    
}

// ----------------------------fin de partie et enregistrement des données--------------------
function finDePartie() {
    if (tours === 0){
        //récupérer score final du joueur
        scoreJoueurBenedict = score;
        localStorage.scoreJoueurBenedict = scoreJoueurBenedict;
        console.log(scoreJoueurBenedict + " score général");

        moutonsSauvesJoueurBenedict = compteurMoutonsGagnes;
        localStorage.moutonsSauvesJoueurBenedict = moutonsSauvesJoueurBenedict;
        console.log(moutonsSauvesJoueurBenedict + " moutons sauvés total");

        moutonsPerdusJoueurBenedict = compteurMoutonsPerdus;
        localStorage.moutonsPerdusJoueurBenedict = moutonsPerdusJoueurBenedict;
        console.log(moutonsPerdusJoueurBenedict + " moutons perdus total");

        // enregistrer les données du joueur
        enregistrerDonnees(1,resultatJoueur);
        var jeuLogicTermine = true;
        localStorage.setItem("benedictcumberbatch", jeuLogicTermine);

        //renvoyer le joueur vers le hub avec popup
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

    } else{

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
        xhttp.send("id="+IDjoueur+"joueur=" + data);
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

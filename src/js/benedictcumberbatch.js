var nomDuJeu = "Logique2";
var IDjoueur = localStorage.getItem("joueur");
var nomJoueur = localStorage.getItem("name");
var scoreJoueurBenedict = 0; //Score du joueur à renseigner en fin de session de jeu

var nbCells = 4;
var width = 300;

var difficulty = 0.1;
var colorTransitionSpeed = 0.1;
var modePoussin = true;
var modeNormal = false;
var modeViolent = false; //decalage entre les cases de 1 meme diagonales

var score = 0;
var anim = 0;
var colorTarget =  0;
var colorCurrent = 0;
var colorBase =  0;
var nbCasesToFind = 0;
var casesFound = []; //tableau des cases trouvées
var miseValide = false; //Si la mise n'est pas validée par le joueur

var winState = false; //statut du joueur, false pour perdant
var actionDeJeu = 0; //Suivi du nombre d'action de jeu que réalise le joueur

var moutonsGagnes = 0;
var moutonsPerdus = 0;
var compteurMoutonsGagnes = 0;
var compteurMoutonsPerdus = 0;

var moutonAffiche = false; //vérifier affichage du mouton vivant
var moutonRipAffiche = false; //vérifier affichage du mouton mort

var countDownToZero = false; //statut du compte à rebours

var score = 0; //Score actuel
var mise = 0; //Combien le joueur a misé
var tours = 30; //Nombre de tours restants
var resultatJoueur = [];

var running = false;
var animationReset = false; //état de l'animation

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

    //makeGame(width,nbCells, difficulty);
    //anim = setInterval(animate,20);
}

function go() {
    casesFound = [];
    makeGame(width,nbCells,1-difficulty);
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
    document.getElementById("boutonsMise").style.display = "none";

    //recharger l'animation
    restartAnimateScoreMoutons();
}

//récupérer mise
function recupMise() {
    if(document.getElementById('mise1').checked) {
        //boutton de mise 1 est validé
        mise = 1;
    } else if(document.getElementById('mise2').checked) {
        mise = 2;
    } else if(document.getElementById('mise3').checked) {
        mise = 3;
    } else if(document.getElementById('mise4').checked) {
        mise = 4;
    } else if(document.getElementById('mise5').checked) {
        mise = 5;
    } else if(document.getElementById('mise6').checked) {
        mise = 6;
    } else if(document.getElementById('mise7').checked) {
        mise = 7;
    }
    //afficher mise
    showMise();

    //verrouiller boutons de mise
    document.getElementById("mise1").disabled = true;
    document.getElementById("mise2").disabled = true;
    document.getElementById("mise3").disabled = true;
    document.getElementById("mise4").disabled = true;
    document.getElementById("mise5").disabled = true;
    document.getElementById("mise6").disabled = true;
    document.getElementById("mise7").disabled = true;

    //enregistrer mise dans csv
    //enregistrerDonnees(0, mise);

    //acter la mise du joueur pour déverouiller jeu
    miseValide = true;

    //faire apparaître le compte à rebours et le lancer
    document.getElementById("affichageFeedback").innerHTML = "Déplacez le carré bleu pour ranger le plateau dans l'ordre.";
    document.getElementById("affichageFeedback").style.backgroundColor = "#03A9F4";
    //startTimer();

    //On reset le temps
    g_temps_coups = g_duree_coup;
    document.getElementById("temps").innerHTML = g_temps_coups;
    clearInterval(g_timer_coup_id);
    g_timer_coup_id = setInterval(timerCoups,1000);
    showGrid(true);
}

function activateMise() {
   //déverrouiller boutons de sélection de mise
    document.getElementById("mise1").disabled = false;
    document.getElementById("mise2").disabled = false;
    document.getElementById("mise3").disabled = false;
    document.getElementById("mise4").disabled = false;
    document.getElementById("mise5").disabled = false;
    document.getElementById("mise6").disabled = false;
    document.getElementById("mise7").disabled = false;

    //afficher message de choix de mise
    document.getElementById("affichageFeedback").style.display = "block";
    document.getElementById("affichageFeedback").innerHTML = "Choisissez votre mise.";
    document.getElementById("affichageFeedback").style.backgroundColor = "#03A9F4";

    //afficher boutons de mise
    document.getElementById("boutonsMise").style.display = "block";
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

function win(ijFind){
    if (miseValide === true && countDownToZero === true && casesFound.indexOf(ijFind) < 0) {
      nbCasesToFind--;
      casesFound.push(ijFind);
        if(nbCasesToFind <= 0) {
            winState = true;
            moutonsGagnes += mise;
            console.log(moutonsGagnes + "moutons gagnes")
            compteurMoutonsGagnes += moutonsGagnes;
            moutonsGagnes = 0;
            console.log(compteurMoutonsGagnes + "moutons gagnes winState");
            score += mise;
            actionDeJeu++;

            addSheep(); //faire apparaître un mouton sur la page

            //feedbackSonore(); //à décommenter pour lancer les feedbacks sonores

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
            resultatJoueur += nomJoueur + ";" + IDjoueur + ";" + nomDuJeu + ";" + actionDeJeu + ";" + mise + ";" + difficulty + ";" + score + ";" + winState + ";" + "\n";
            //enregistrerDonnees(1, mise + ";" + tours + ";" + difficulty + ";" + score + ";" + winState );

            //Un tour de moins, reset de la mise
            tours--;
            mise = "?";
            document.getElementById("tours").innerHTML = tours;
            //document.getElementById("score").innerHTML = score;
            //document.getElementById("mise").innerHTML = mise;

            // a reprendre
            /*if(difficulty > 0.35) {
                modePoussin = false;
                modeNormal = true;
                difficulty = difficulty + 0.01;
            } else if (difficulty > 0.7) {
                modeNormal = false;
                modeViolent = true;
                difficulty = difficulty + 0.01;
            } else {
                modePoussin = false;
                difficulty = difficulty + 0.01;
            }*/

            difficulty = Math.min(1,difficulty+0.1);
            /*if(Math.random() < 0.7) {
                if(difficulty >= 0.95) {
                    difficulty = Math.min(0.99,difficulty + 0.02);
                    modeViolent = true;
                    modeNormal = false;
                    console.log("mode violent: "+ modeViolent);
                } else {
                    difficulty = Math.min(0.95,difficulty + 0.05);
                    modeNormal = true;
                    modeViolent = false;
                    modePoussin = false;
                }
            } else {
                nbCells = Math.min(8, nbCells+1);
            }*/

            //bloquer jeu
            miseValide = false;
            countDownToZero = false;

            //nettoyer historique des boutons mises
            cleanMise();

            //faire apparaitre bouton pour générer la grille
            document.getElementById("boutonGenererGrille").style.visibility = "visible";

            /*
            //déverrouiller boutons de sélection de mise
            document.getElementById("mise1").disabled = false;
            document.getElementById("mise2").disabled = false;
            document.getElementById("mise3").disabled = false;
            document.getElementById("mise4").disabled = false;
            document.getElementById("mise5").disabled = false;
            document.getElementById("mise6").disabled = false;
            document.getElementById("mise7").disabled = false;

            //afficher message de choix de mise
            document.getElementById("affichageFeedback").style.display = "block";*/

            //casesFound = [];

            //lancer nouveau jeu sauf si plus de tours
            if (tours === 0 && miseValide === false) {
                finDePartie();
            } else {
                //makeGame(width,nbCells,1-difficulty);
            }

        }

        console.log("Nouvelle difficulte:",difficulty);
    }

}

function fail(){
    if (miseValide === true && countDownToZero === true){
        winState = false;
        moutonsPerdus += mise;
        console.log(moutonsPerdus + "moutons perdus")
        compteurMoutonsPerdus += moutonsPerdus;
        moutonsPerdus = 0;
        console.log(compteurMoutonsPerdus + "moutons perdus winState");
        score -= mise;
        actionDeJeu++;

        addSheep(); //faire apparaître un mouton sur la page

        //feedbackSonore();//à décommenter pour lancer les feedbacks sonores

        //message de feedback
        if (mise === 1) {
            document.getElementById("affichageFeedback").innerHTML = "Vous avez tué " +mise+" mouton. Choisissez votre mise pour relancer le jeu.";
        } else {
            document.getElementById("affichageFeedback").innerHTML = "Vous avez tué " +mise+" moutons. Choisissez votre mise pour relancer le jeu.";
        }
        document.getElementById("affichageFeedback").style.backgroundColor = "#F44336";
        //document.getElementById("res").innerHTML = "Vous avez tué " +mise+" mouton(s). Choisissez votre mise pour relancer le jeu.";

        //On sauve le resultat pour cet essai dans une variable, ne sera transféré dans csv que lorsque le jeu est terminé (fin de partie)
        resultatJoueur += nomJoueur + ";" + IDjoueur + ";" + nomDuJeu + ";" + actionDeJeu + ";" + mise + ";" + difficulty + ";" + score + ";" + winState + ";" + "\n";
        //enregistrerDonnees(1, mise + ";" + tours + ";" + difficulty + ";" + score + ";" + winState );

        //Un tour de moins, reset de la mise
        tours--;
        mise = "?";
        document.getElementById("tours").innerHTML = tours;
        //document.getElementById("score").innerHTML = score;
        //document.getElementById("mise").innerHTML = mise;

        //a reprendre
        /*if(difficulty > 0.35) {
            modePoussin = false;
            modeNormal = true;

            if(difficulty>0.01) {
                difficulty = difficulty - 0.1;
            } else {

            }

        } else if (difficulty > 0.7) {
            modeNormal = false;
            modeViolent = true;

            if(difficulty>0.01) {
                difficulty = difficulty - 0.1;
            } else {

            }

        } else {
            modePoussin = false;
            modeNormal = true;
            modeViolent = false;

            if(difficulty>0.01) {
                difficulty = difficulty - 0.1;
            } else {

            }
        }*/

        /*if(Math.random() < 0.7) {
            if(difficulty > 0.95) {
                difficulty = difficulty - 0.01;
            } else {
                difficulty = Math.max(0,difficulty - 0.05);
            }
        } else {
            nbCells = Math.max(5, nbCells-1);
            modeViolent = false;
            console.log("mode violent: "+ modeViolent);
        }*/
        difficulty = Math.max(0,difficulty-0.1);

        //casesFound = [];

        //bloquer le jeu pour et déverouiller bouton de mise sauf si plus de tours
        if (tours > 0) {
            miseValide = false;
            countDownToZero = false;

            //nettoyer historique des boutons mises
            cleanMise();

            //faire apparaitre bouton pour générer la grille
            document.getElementById("boutonGenererGrille").style.visibility = "visible";

            /*
            //déverrouiller boutons de sélection de mise
            document.getElementById("mise1").disabled = false;
            document.getElementById("mise2").disabled = false;
            document.getElementById("mise3").disabled = false;
            document.getElementById("mise4").disabled = false;
            document.getElementById("mise5").disabled = false;
            document.getElementById("mise6").disabled = false;
            document.getElementById("mise7").disabled = false;

            //afficher message de choix de mise
            document.getElementById("affichageFeedback").style.display = "block";

            makeGame(width,nbCells,1-difficulty);*/

        } else {
            finDePartie();
        }

        console.log("Nouvelle difficulte:",difficulty);
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
const g_duree_coup = 20;

function makeGame(width,nbCellX,diff) {

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
    var nbPermMax = 10;
    var nbPerm = Math.floor(nbPermMax * diff);
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
            color = "#AAAAFF";



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

  if(!miseValide)
    return;

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
        
        if(!miseValide) {
            document.getElementById("affichageFeedback").innerHTML = "Le plateau de jeu a disparu. Choisissez votre mise pour continuer.";
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
            makeGame(width,nbCells,difficulty);
            anim = setInterval(animate,20);
            //console.log(anim + "anim");
            activateMise();
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

        document.getElementById("compteurMoutonsGagnes").innerHTML = "x " + compteurMoutonsGagnes;
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
        launchAnimateScoreMoutonsGagnes(); //le rechargement de l'animation se fait plus tard, pour un goNew()

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

        document.getElementById("compteurMoutonsPerdus").innerHTML = "x " + compteurMoutonsPerdus;
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
        }, 500);

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
    var animTexte = document.querySelector('.texte');
    animTexte.classList.remove('fadeIn');
    animTexte.classList.add('reset');

    var animTexte = document.querySelector('.texte');
    animTexte.classList.remove('fadeOut');
    animTexte.classList.add('reset');
}

function launchFadeInLeftBox() {
    var animTexte = document.querySelector('.leftsite');
    animTexte.classList.add('fadeInLeft');
}

function launchFadeInRightBox() {
    var animTexte = document.querySelector('.rightsite');
    animTexte.classList.add('fadeInRight');
}

// ----------------------------fin de partie et enregistrement des données--------------------
function finDePartie() {
    if (tours === 0){
        //récupérer score final du joueur
        scoreJoueurBenedict = score;
        localStorage.scoreJoueurBenedict = scoreJoueurBenedict;
        console.log(scoreJoueurBenedict);

        // enregistrer les données du joueur
        enregistrerDonnees(1,resultatJoueur);
        var jeuLogicTermine = true;
        localStorage.setItem("benedictcumberbatch", jeuLogicTermine);

        //renvoyer le joueur vers le hub
        var messageFinPartie = confirm("Votre partie est terminée. Votre score est de " + score + "\n" + "Cliquez pour passer au jeu suivant.");
            if (messageFinPartie === true) {
                // open it in a new window / tab (depends on browser setting)
                window.open("hub.html",'_self',false);
            } else {
                // open it in a new window / tab (depends on browser setting)
                window.open("hub.html",'_self',false);
            }

        //créer le bouton
        /*var boutton = document.createElement("input");
        boutton.type = "button";
        boutton.value = "Fin de partie.";
        boutton.name = "FIN";
        var results = function resultat(){
            var messageFinPartie = confirm("Votre partie est terminée. Votre score est de " + score +" Cliquez pour passer au jeu suivant.");
            if (messageFinPartie===true) {
                x = "Prototype en cours de développement, veuillez patienter.";
                enregistrerDonnees(1,nomDuJeu + ";" + resultatJoueur);
                var jeuSensoTermine = true;
                localStorage.getItem("christopherreeve", jeuSensoTermine);

            } else {
                x = "Ah, d'accord.";
            }
            document.getElementById("retourProto").innerHTML = x;
        }
        boutton.onclick = results;
        document.body.appendChild(boutton);*/
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

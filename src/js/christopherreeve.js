var nomDuJeu = "Sensoriel";
var IDjoueur = localStorage.getItem("joueur");
var nomJoueur = localStorage.getItem("name");
var scoreJoueurChristopher = 0; //Score du joueur à renseigner en fin de session de jeu

var nbCells = 4;
var width = 300;

var difficulty = 0;
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
var nbDeClics = 5; //nombre de clics que le joueur fait en cliquant sur le tableau
var cases = []; //tableau des cases à trouver
var casesFake = []; //tableau des cases perdantes
var casesFound = []; //tableau des cases trouvées
var casesClicked = []; //tableau des cases cliquees
var casesNotFound = []; //tableau des cases trouvées mais sans correspondance
var miseValide = false; //Si la mise n'est pas validée par le joueur


var winState = false; //statut du joueur, false pour perdant
var actionDeJeu = 0; //Suivi du nombre d'action de jeu que réalise le joueur

var countDownToZero = false; //statut du compte à rebours

var score = 0; //Score actuel
var mise = 0; //Combien le joueur a misé
var tours = 30; //Nombre de tours restants
var resultatJoueur = [];

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
        clearInterval(anim);
    }
    
    for(var i=0;i<cells.length;i++){
        //console.log(cells[i].id);
        //console.log(casesFound.indexOf(parseInt(cells[i].id)));
        /*if (casesFound.indexOf(parseInt(cells[i].id)) >= 0) {
            cells[i].style.backgroundColor = "#0288d1";
        } else {
            cells[i].style.backgroundColor = toHexColor(colorCurrent,colorCurrent,colorCurrent);
        }*/
        cells[i].style.backgroundColor = toHexColor(colorCurrent,colorCurrent,colorCurrent);
    }
    
  
}

function init() {
    document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
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
    casesClicked = [];
    makeGame(width,nbCells,1-difficulty);
    anim = setInterval(animate,20);
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
    casesNotFound = [];
    casesClicked = [];
    document.getElementById("affichageFeedback").style.backgroundColor = "#03A9F4";
    document.getElementById("affichageFeedback").innerHTML = "Les cases vont clignoter dans...";
    //document.getElementById("affichageFeedback").style.display = "none"; 
    makeGameNoColors(width,nbCells,1-difficulty); //afficher la grille sans cases à trouver
    startTimer();
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
    document.getElementById("affichageFeedback").innerHTML = "Les cases gagnantes vont s'afficher.";
    
    results();
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
    document.getElementById("affichageFeedback").innerHTML = "Choisissez votre mise pour valider votre sélection.";
    document.getElementById("affichageFeedback").style.backgroundColor = "#03A9F4";
}

function showMise() {
    document.getElementById("tableMise").style.visibility = "visible";
    document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
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

function selectWin(ijFind) {
    
    if(casesClicked.indexOf(ijFind) < 0){
        if(nbDeClics > 0){
            casesClicked.push(ijFind);
            document.getElementById(ijFind).style.backgroundColor = "#0288d1";
            nbDeClics--;
            
            if (countDownToZero === true && casesFound.indexOf(ijFind) < 0) {
                nbCasesToFind--;
                casesFound.push(ijFind);
            }
             
        }
    } else {
        casesClicked.splice(casesClicked.indexOf(ijFind),1);
        
        if(casesFound.indexOf(ijFind) >= 0){
            casesFound.splice(casesFound.indexOf(ijFind),1);
            nbCasesToFind++;
        }
        
        document.getElementById(ijFind).style.backgroundColor = toHexColor(colorBase,colorBase,colorBase);
        nbDeClics++;
    }

    console.log("nombre de cases à trouver" + nbCasesToFind);

    if (nbDeClics <= 0 && nbCasesToFind <= 0) {
        winState = true;
        activateMise();
        console.log("nombre de clics restant : " + nbDeClics);
    } else if (nbDeClics <= 0) {
        winState = false;
        activateMise();
        console.log("nombre de clics restant : " + nbDeClics);
    }
        
    console.log("nombre de clics restant : " + nbDeClics);
}

function selectFail(ijFind) {
    if(casesClicked.indexOf(ijFind) < 0){
        if(nbDeClics > 0){
            casesClicked.push(ijFind);
            document.getElementById(ijFind).style.backgroundColor = "#0288d1";
            nbDeClics--;
        }
        
    } else {
        casesClicked.splice(casesClicked.indexOf(ijFind),1);
        document.getElementById(ijFind).style.backgroundColor = toHexColor(colorBase,colorBase,colorBase);
        nbDeClics++;
    }
    console.log(casesClicked);
        
    if (countDownToZero === true && casesFound.indexOf(ijFind) < 0 && nbDeClics >= 0) {

        casesNotFound.push(ijFind);
        
        console.log("nombre de cases à trouver" + nbCasesToFind);

        
        console.log("nombre de clics restant : " + nbDeClics);
    }
    
    if (nbDeClics <= 0) {
        winState = false;
        activateMise();  
    }
}

function results() {
    if (winState && miseValide) {
        win();
    }
    
    if (winState === false && miseValide) {
        fail();
    }
}

function afficherCasesGagnantes() {
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
            cells[i].style.border = "5px solid #00e676";
        } else {
            cells[i].style.border = "5px solid #00e676";
        }
    }
}

function difficultyGame() {
    if (difficulty < 0.3) {
        modeNormal = false;
        modeViolent = false;
        modePoussin = true;
        
        nbCells = Math.max(5, nbCells-1);
        
        console.log("mode poussin: "+ modePoussin);
        
    } else if (difficulty >= 0.3 && difficulty < 0.6) {
        modeNormal = true;
        modeViolent = false;
        modePoussin = false;
        
        nbCells = Math.max(5, nbCells+1);
        
        console.log("mode normal: "+ modeNormal);
        
    } else if (difficulty  >= 0.6) {
        modeNormal = false;
        modeViolent = true;
        modePoussin = false;
        
        nbCells = Math.max(5, nbCells+1);
        
        console.log("mode violent: "+ modeViolent);
    }
}

function win() {
    if(miseValide) {
      //nbCasesToFind--;
      //casesFound.push(ijFind);
        if(nbCasesToFind <= 0) {
            winState = true;
            score += mise;
            actionDeJeu++;
            
            //feedbackSonore(); //à décommenter pour lancer les feedbacks sonores
            
            afficherCasesGagnantes();
            
            //message de feedback
             if (mise === 1) {
                document.getElementById("affichageFeedback").innerHTML = "Vous avez sauvé " +mise+" mouton. Cliquez sur le bouton pour générer une nouvelle grille.";
            } else {
                document.getElementById("affichageFeedback").innerHTML = "Vous avez sauvé " +mise+" moutons. Cliquez sur le bouton pour générer une nouvelle grille.";   
            }
            document.getElementById("affichageFeedback").style.backgroundColor = "#00E676";
            //document.getElementById("res").innerHTML = "Vous avez sauvé "+mise+" mouton(s). Choisissez votre mise pour relancer le jeu.";
            
            console.log(nbCasesToFind + "to go");
            
            //On sauve le resultat pour cet essai dans une variable, ne sera transféré dans csv que lorsque le jeu est terminé (fin de partie)
            resultatJoueur += nomJoueur + ";" + IDjoueur + ";" + nomDuJeu + ";" + actionDeJeu + ";" + mise + ";" + difficulty + ";" + score + ";" + winState + ";" + "\n";
            //enregistrerDonnees(1, mise + ";" + tours + ";" + difficulty + ";" + score + ";" + winState );
            
            //Un tour de moins, reset de la mise
            tours--;
            mise = "?";
            document.getElementById("tours").innerHTML = tours;
            document.getElementById("score").innerHTML = score;
            document.getElementById("mise").innerHTML = mise;
            
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
            difficultyGame();
            
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
        
        console.log(difficulty + "difficulté win");  
    }
    
}

function fail(){
    if (miseValide) {
        winState = false;
        score -= mise;
        actionDeJeu++;
        
        afficherCasesGagnantes();
                
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
        resultatJoueur += IDjoueur + ";" + nomDuJeu + ";" + actionDeJeu + ";" + "" + ";" + mise + ";" + difficulty + ";" + score + ";" + winState + ";" + "\n";
        //enregistrerDonnees(1, mise + ";" + tours + ";" + difficulty + ";" + score + ";" + winState );
        
        //Un tour de moins, reset de la mise
        tours--;
        mise = "?";
        document.getElementById("tours").innerHTML = tours;
        document.getElementById("score").innerHTML = score;
        document.getElementById("mise").innerHTML = mise;
        
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
        
        difficulty = Math.max(0,difficulty-0.1);
        difficultyGame();
        
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

        console.log(difficulty + "difficulté fail");
    }
}

function toHex(d) {
    return ("0"+(Number(d).toString(16))).slice(-2).toUpperCase();
}

function toHexColor(R,V,B){
    return "#"+toHex(R)+toHex(V)+toHex(B);
}

function makeGame(width,nbCellsX,diffColor) {
    //nbCellsX = 5;

    //Calc des props
    var widthCell = width / nbCellsX;
    var colorBaseR = Math.floor(Math.random() * 128 + 64);
    var colorBaseV = Math.floor(Math.random() * 128 + 64);
    var colorBaseB = Math.floor(Math.random() * 128 + 64);

    colorBaseR = 100;
    colorBaseV = colorBaseR;
    colorBaseB = colorBaseR;


    colorBase = colorBaseR;

    var colorFindR = Math.floor(colorBaseR + 100 * diffColor);
    var colorFindV = Math.floor(colorBaseV + 100 * diffColor);
    var colorFindB = Math.floor(colorBaseB + 100 * diffColor);

    colorTarget = colorFindB;
    colorCurrent = colorTarget;

    var colorBaseHex = toHexColor(colorBaseR,colorBaseV,colorBaseB);
    var colorFindHex = toHexColor(colorFindR,colorFindV,colorFindB);

    //console.log(colorBaseHex);
    //console.log(colorFindHex);

    cases = [];
    casesFake = [];
    var casesInterdites = [];

    //changer le nombre de cases qui clignotent, le nbre de case à trouver et le nombre de clics possibles
    var nbCells = 5;
    nbCasesToFind = 5;
    nbDeClics = nbCasesToFind;

    //On compte les voisins directs comme cases gagnantes
    /*if(modePoussin) {

            var ijFind = Math.floor(Math.random() * (nbCellsX * nbCellsX));
            cases.push(ijFind);
            console.log(cases + " 1ere case");

                var posx = ijFind % nbCellsX;
                var posy = Math.floor(ijFind / nbCellsX);

        caseHautDroite = (posy-1)*nbCellsX + (posx-1);
        caseHautGauche = (posy-1)*nbCellsX + (posx+1);
        caseBasDroite =  (posy+1)*nbCellsX + (posx-1);
        caseBasGauche = (posy+1)*nbCellsX + (posx+1);
        if (caseHautDroite > 0){      
        cases.push((posy-1)*nbCellsX + (posx-1));
        console.log(cases + " 2eme case");
         } else {

         }

                cases.push((posy-1)*nbCellsX + (posx+1));
                console.log(cases + " 3eme case");

                cases.push((posy+1)*nbCellsX + (posx-1));
                console.log(cases + " 4eme case");

                cases.push((posy+1)*nbCellsX + (posx+1));
                console.log(cases + " 5eme case");

    }*/

    if (modePoussin || modeNormal || modeViolent) {
        console.log("mode poussin: "+ modePoussin);
        
        for(var i=0;i<nbCells;i++) {
            var ijFind = 0;
            do {
                ijFind = Math.floor(Math.random() * (nbCellsX * nbCellsX));
            } while(casesInterdites.indexOf(ijFind) >= 0)
            cases.push(ijFind);
        
        console.log("cases gagnantes :"+cases);
 
            var posx = ijFind % nbCellsX;
            var posy = Math.floor(ijFind / nbCellsX);

            //On interdit la case actuelle comme nouvelle case win
            casesInterdites.push(ijFind);
            
            if(modeNormal || modeViolent) {
                console.log("mode normal: "+ modeNormal);
                //On interdit les voisins directs comme cases gagnantes
                if(posx > 0){
                    casesInterdites.push(ijFind-1);
                }
                if(posx < nbCellsX-1){
                    casesInterdites.push(ijFind+1);
                }
                if(posy > 0){
                    casesInterdites.push(ijFind-nbCellsX);
                }
                if(posy < nbCellsX-1){
                    casesInterdites.push(ijFind+nbCellsX);
                }
            }

            //On interdit aussi en diagonales
            if(modeViolent) {
                console.log("mode violent");

                if(posx > 0 && posy > 0){
                    casesInterdites.push((posy-1)*nbCellsX + (posx-1));
                }
                if(posx < nbCellsX-1 && posy > 0){
                    casesInterdites.push((posy-1)*nbCellsX + (posx+1));
                }
                if(posy < nbCellsX-1 && posx > 0){
                    casesInterdites.push((posy+1)*nbCellsX + (posx-1));
                }
                if(posy < nbCellsX-1 && posx < nbCellsX-1){
                    casesInterdites.push((posy+1)*nbCellsX + (posx+1));
                }
            }
        }
    }
    
    var z = (nbCellsX * nbCellsX) - (cases.length);

    for(var i=0;i<z;i++) {
        var ijFake = 0;
            do {
                ijFake = Math.floor(Math.random() * (nbCellsX * nbCellsX));
            } while(cases.indexOf(ijFake) >= 0)
                casesFake.push(ijFake);
    }

    var iFind = Math.floor(Math.random() * nbCellsX);
    var jFind = Math.floor(Math.random() * nbCellsX);
    
    var iFake = Math.floor(Math.random() * nbCellsX);
    var jFake = Math.floor(Math.random() * nbCellsX);

    var strHtml = '';
    strHtml += '<table>';
    for(var i=0;i<nbCellsX;i++) {
        strHtml += '<tr>';
        for(var j=0;j<nbCellsX;j++) {
            var color = colorBaseHex;
            var clickFun = 0;
            var name = 0;
            
            var ijFind = i + j * nbCellsX;
            
            if(casesFake.indexOf(ijFake) >= 0) {
                color = colorBaseHex;
                //var clickFun = "fail()";
                clickFun = "selectFail(" + ijFind + ")";
                name = "cellFail";
            }
            
            var ijFind = i + j * nbCellsX;

            if(cases.indexOf(ijFind) >= 0) {
                color = colorFindHex;
                //clickFun = "win(" + ijFind + ")";
                clickFun = "selectWin(" + ijFind + ")";
                name = "cellWin";
            }
            
            strHtml += '<td id="' + ijFind + '" name="'+name+'" style="background-color:'+color+'; width:'+widthCell+'px; height:'+widthCell+'px" onclick="' + clickFun + '">&nbsp;';
            strHtml += '</td>';
        }
        strHtml += '</tr>';
    }
    strHtml += '</table>';

    document.getElementById("board").innerHTML = strHtml;

}

function makeGameNoColors(width,nbCellsX,diffColor) {
    //nbCellsX = 5;

    //Calc des props
    var widthCell = width / nbCellsX;
    var colorBaseR = Math.floor(Math.random() * 128 + 64);
    var colorBaseV = Math.floor(Math.random() * 128 + 64);
    var colorBaseB = Math.floor(Math.random() * 128 + 64);

    colorBaseR = 100;
    colorBaseV = colorBaseR;
    colorBaseB = colorBaseR;


    colorBase = colorBaseR;

    var colorFindR = Math.floor(colorBaseR + 100 * diffColor);
    var colorFindV = Math.floor(colorBaseV + 100 * diffColor);
    var colorFindB = Math.floor(colorBaseB + 100 * diffColor);

    colorTarget = colorFindB;
    colorCurrent = colorTarget;

    var colorBaseHex = toHexColor(colorBaseR,colorBaseV,colorBaseB);
    var colorFindHex = toHexColor(colorFindR,colorFindV,colorFindB);

    //console.log(colorBaseHex);
    //console.log(colorFindHex);

    var cases = [];

    //changer le nombre de cases qui clignote et le nbre de case à trouver
    var nbCells = 0;
    nbCasesToFind = 0;

    for(var i=0;i<nbCells;i++)	{
        var ijFind = 0;
        do {
            ijFind = Math.floor(Math.random() * (nbCellsX * nbCellsX));
        } while(cases.indexOf(ijFind) >= 0)
        cases.push(ijFind);
    }

    var iFind = Math.floor(Math.random() * nbCellsX);
    var jFind = Math.floor(Math.random() * nbCellsX);

    var iDecoy = Math.floor(Math.random() * nbCellsX);
    var jDecoy = Math.floor(Math.random() * nbCellsX);

    var strHtml = '';
    strHtml += '<table>';
    for(var i=0;i<nbCellsX;i++) {
        strHtml += '<tr>';
        for(var j=0;j<nbCellsX;j++) {
            var color = colorBaseHex;
            var clickFun = "fail()";
            var name = "cellFail";

            var ijFind = i + j * nbCellsX;

            if(cases.indexOf(ijFind) >= 0) {
                color = colorFindHex;
                clickFun = "win(" + ijFind + ")";
                name = "cellWin";
            }
            
            strHtml += '<td id="' + ijFind + '" name="'+name+'" style="background-color:'+color+'; width:'+widthCell+'px; height:'+widthCell+'px" onclick="' + clickFun + '">&nbsp;';
            strHtml += '</td>';
        }
        strHtml += '</tr>';
    }
    strHtml += '</table>';

    document.getElementById("board").innerHTML = strHtml;

}

function feedbackSonore() {
    if(winState === true) {
        var soundsWin = [
            "../src/sounds/baaaa1.mp3",
            "../src/sounds/baaaa2.mp3",
            "../src/sounds/baaaa3.mp3",
            "../src/sounds/baaaa4.mp3"
        ];
        
        var tirageSon = soundsWin[Math.floor(Math.random()*soundsWin.length)];
        document.getElementById("winSound").innerHTML = '<source src="' +tirageSon+ '" type="audio/mpeg">';
        
        var x = document.getElementById("winSound");
        x.play();
    } else {
        var soundsFail = [
            "../src/sounds/fail.mp3" 
        ];
        var tirageSon = soundsFail[Math.floor(Math.random()*soundsFail.length)];
        document.getElementById("failSound").innerHTML = '<source src="' +tirageSon+ '" type="audio/mpeg">';
        
        var x = document.getElementById("failSound");
        x.play();
    }
    
    if (tours === 0){
        var x = document.getElementById("sheepSound");
        x.play();
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
            makeGame(width,nbCells,1-difficulty);
            anim = setInterval(animate,20);
            console.log(anim + "anim");
        }

        if (seconds === 1) {
            temp = document.getElementById('timer');
            temp.innerHTML = "0";
            document.getElementById("affichageCompteur").style.display = "none";
            document.getElementById("affichageFeedback").innerHTML = "Cliquez sur les cases que vous pensez être gagnantes.";
            document.getElementById("affichageFeedback").style.backgroundColor = "#ff5722";
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

function colorButton() {
    document.getElementById('boutonGenererGrille').style.backgroundColor="373b3d";
}

function uncolorButton() {
    document.getElementById('boutonGenererGrille').style.backgroundColor="757575";
}

function finDePartie() {
    if (tours === 0){
        //récupérer score final du joueur
        scoreJoueurChristopher = score;
        localStorage.scoreJoueurChristopher = scoreJoueurChristopher;
        console.log(scoreJoueurChristopher);
        
        // enregistrer les données du joueur
        enregistrerDonnees(1,resultatJoueur);
        var jeuSensoTermine = true;
        localStorage.setItem("christopherreeve", jeuSensoTermine);
        
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
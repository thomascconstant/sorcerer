var nomDuJeu = "Logique";
var IDjoueur = localStorage.getItem("joueur");
var scoreJoueurHugh = 0; //Score du joueur à renseigner en fin de session de jeu

//à commenter pour la version en ligne
var figures = [
    "img/cloud.svg",
    "img/extension.svg",
    "img/face.svg",
    "img/favorite.svg",
    "img/grade.svg",
    "img/home.svg",
    "img/moon.svg"];
//old version
/*var figures = [
    "img/cool.svg",
    "img/deg.svg",
    "img/triste.svg",
    "img/haha.svg",
    "img/meh.svg",
    "img/cheveux.svg",
    "img/smile.svg"];*/
var order = [0,1,2,3,4,5,6];
var predicats = []; //Tableau dans lequel seront injectées les figures prédicats
var bruits = []; //Tableau dans lequel le reste des figures seront injectées (hors prédicats)
var bruitsTirage = []; //Tableau dans lequel sont rangés les résultats des tirages relatifs aux bruits (indépendant des prédicats)
var premierTirage = []; //Tableau dans lequel sont rangés les résultats du premier tirage des prédicats
var deuxiemeTirage = []; //Tableau dans lequel sont rangés les résultats du deuxième tirage des prédicats
var conclusionTirage = []; //Tableau dans lequel sont rangés les résultats du tirage de conclusion

var conclusionTirage2 = [];

var tirageUn = false;
var tirageDeux = false;
var tirageFinal = false;
var tirageBruits = false;

var me;
var him;

var playerWin = false;

var score = 0; //Score actuel
var mise = 0; //Combien le joueur a misé
var tours = 10; //Nombre de tours restants
var sequence = 10; //Numéro de séquences restantes
var miseValide = false; //Si la mise n'est pas validée par le joueur
var difficulte = 0; //de 0 à order.length - 2
console.log(difficulte +"diff de base");
var nbreToursBruits = 0; //Nombre de tours que doit faire la fonction genererBruits();
var resultatJoueur = [];

// générer le tableau de figures qui s'intercaleront entre le deuxième tirage et la conclusion à partir des prédicats
function genererBruits () {
    var i=0;
    while (i<=3) {
        var tirageAleatoire = order[Math.floor(Math.random()*order.length)];
        if (bruits.includes(tirageAleatoire) === false && predicats.includes(tirageAleatoire) === false) {
            bruits.push(tirageAleatoire);
            i++;
        }
    }

    console.log(bruits + "bruits");
}

function init() {
    //document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;
    document.getElementById("sequence").innerHTML = sequence;
    //document.getElementById("res").innerHTML = "Choisissez votre mise.";
    document.getElementById("affichageSequence").style.backgroundColor = "#FFC107";
}

function go(){
    shuffleOrder();
    console.log(order);
    genererTirageAvecZero();
    
}

// récupérer mise
function recupMise () {
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
    
    //afficher message de consigne
    document.getElementById("affichageFeedback").innerHTML = "Cliquez sur la figure que vous pensez gagnante.";
    document.getElementById("affichageFeedback").style.backgroundColor = "#03A9F4";
    //document.getElementById("res").innerHTML = "Cliquez sur la figure que vous pensez gagnante.";
    
    //effacer message concernant la séquence
    document.getElementById("affichageSequence").style.display = "none";

    //acter la mise du joueur pour déverouiller jeu
    miseValide = true;
}

function showMise() {
    document.getElementById("tableMise").style.visibility = "visible";
    //document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;
    document.getElementById("sequence").innerHTML = sequence;
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

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

  return array;
}

function shuffleOrder(){
    order = shuffle(order);
}

// générer un tirage avec la figure la plus faible du tableau
function genererTirageAvecZero() {
    var tirageB = order[0];
    premierTirage.push(tirageB);
    predicats.push(tirageB);
    console.log(predicats + "prédicats");
    
    var i = 0;
    while (i<1) {
        var tirageA = order[Math.floor(Math.random()*order.length)];
        if (premierTirage.includes(tirageA) === false && premierTirage.includes(tirageB) && tirageA !== tirageB) {
            premierTirage.push(tirageA);
            predicats.push(tirageA);
            i++;
        }
    }
    
    console.log(predicats + "prédicats");
    afficherPremierTirage();
}

// générer un tirage sans la figure la plus faible du tableau
function genererTirageSansZero() {
    var tirageZero = order[0];
    var i = 0;
    while (i<1) {
        var tirageA = order[Math.floor(Math.random()*order.length)];
        if (deuxiemeTirage.includes(tirageA) === false && premierTirage.includes(tirageA) && tirageA !== tirageZero) {
            deuxiemeTirage.push(tirageA);
            i++;
        }
    }
    
    var j = 0;
    while (j<1) {
        var tirageB = order[Math.floor(Math.random()*order.length)];
        if (deuxiemeTirage.includes(tirageB) === false && premierTirage.includes(tirageB) === false && tirageB !== tirageZero) {
            deuxiemeTirage.push(tirageB);
            predicats.push(tirageB);
            j++;
        }
    }
    
    console.log(predicats + "prédicats");
    
    genererBruits();
    afficherDeuxiemeTirage();
}

// générer un tirage à partir des prédicats générés précédemment
function genererTirageConclusion() {
    console.log(predicats + "prédicats");
    
    var tirageA = order[0];
    conclusionTirage.push(tirageA);
        
    var i = 0;
    while (i<1) {
        var tirageB = predicats[Math.floor(Math.random()*predicats.length)];
        if (conclusionTirage.includes(tirageB) === false && premierTirage.includes(tirageB) === false && deuxiemeTirage.includes(tirageB) && tirageB !== tirageA) {
            conclusionTirage.push(tirageB);
            i++;
        }
    }
    
    afficherTirageConclusion();
}

function afficherPremierTirage() {
    me = premierTirage[Math.floor(Math.random()*premierTirage.length)];
    var i = 0;
    while (i<1) {
        him = premierTirage[Math.floor(Math.random()*premierTirage.length)];
        if (me !== him) {
            i++;
        }
    }
     
    console.log(me + "moi");
    console.log(him + "lui");
    console.log(premierTirage + "premier tirage");
    
    document.getElementById("me").innerHTML = '<img src="'+figures[me]+'">'; 
    document.getElementById("him").innerHTML = '<img src="'+figures[him]+'">';
    
    tirageUn = true;
}

function afficherDeuxiemeTirage() {
    me = deuxiemeTirage[Math.floor(Math.random()*deuxiemeTirage.length)];
    var i = 0;
    while (i<1) {
        him = deuxiemeTirage[Math.floor(Math.random()*deuxiemeTirage.length)];
        if (me !== him) {
            i++;
        }
    }
    
     
    console.log(me + "moi");
    console.log(him + "lui");
    console.log(deuxiemeTirage + "deuxieme tirage");
    
    document.getElementById("me").innerHTML = '<img src="'+figures[me]+'">'; 
    document.getElementById("him").innerHTML = '<img src="'+figures[him]+'">';
    
    tirageDeux = true;
    tirageUn = false;
}

function afficherTirageConclusion() {
    me = conclusionTirage[Math.floor(Math.random()*conclusionTirage.length)];
    var i = 0;
    while (i<1) {
        him = conclusionTirage[Math.floor(Math.random()*conclusionTirage.length)];
        if (me !== him) {
            i++;
        }
    }
    
     
    console.log(me + "moi");
    console.log(him + "lui");
    console.log(conclusionTirage + "conclusion tirage");
    
    document.getElementById("me").innerHTML = '<img src="'+figures[me]+'">'; 
    document.getElementById("him").innerHTML = '<img src="'+figures[him]+'">';
    
    tirageFinal = true;
    tirageDeux = false;
} 

// génère et affiche un tirage de figures qui s'insèreront entre le deuxième tirage et la conclusion
function genererTirageBruits () {
    var i = 0;
    while (i<1) {
        me = order[Math.floor(Math.random()*order.length)];
        if (bruitsTirage.includes(me) === false) {
            bruitsTirage.push(me);
            i++;
        }
    }
    
    var j = 0;
    while (j<1) {
        him = bruits[Math.floor(Math.random()*bruits.length)]; //chercher dans bruits au lieu de order pour éviter de tomber sur une combinaison équivalente à la conclusion
        if (bruitsTirage.includes(him) === false) {
            bruitsTirage.push(him);
            j++;
        }
    }
    
    console.log(me + "moi");
    console.log(him + "lui");
    console.log(bruitsTirage + "bruits");
    
    document.getElementById("me").innerHTML = '<img src="'+figures[me]+'">'; 
    document.getElementById("him").innerHTML = '<img src="'+figures[him]+'">';
    
    tirageBruits = true;
    
    nbreToursBruits --;
    
    bruitsTirage.length = 0; //vide le tableau pour ne pas limiter les tirages de bruits
}

function doIBeatHim(me, him) {
    for(var i=0;i<order.length;i++){
            if(order[i] === me)
                    return false;
            if (order[i] === him)
                    return true;
	}
}

function newRound(){
    if (tirageUn && miseValide && sequence > 0) {
        //tirageFinal = false;
        genererTirageSansZero();
    } else if (tirageDeux && miseValide && sequence > 0 && nbreToursBruits <=1) {
        genererTirageConclusion();
    } else if (tirageDeux && miseValide && sequence > 0 && nbreToursBruits > 1) {
        genererTirageBruits();
    } else if (tirageFinal && miseValide) {
        tirageUn = false;
        tirageDeux = false;
        diffChange();
        clearArray();
        tirageFinal = false;
        
        if (sequence > 0) {
        //afficher message de nouvelle séquence
        document.getElementById("affichageSequence").innerHTML = "Vous commencez une nouvelle séquence. Le rapport des forces entre les figures a été modifié.";
        document.getElementById("affichageSequence").style.backgroundColor = "#FFC107";
        document.getElementById("affichageSequence").style.display = "block";
        //genererPremierTirage();
        
        //mise à jour de la séquence
        //sequence--;
        //document.getElementById("sequence").innerHTML = sequence;
        } //else if (sequence === 0) {
            //finDePartie();
        //}
    } 
    
    playerWin = false;
}

function clearArray() {
    predicats.length = 0;
    bruits.length = 0;
    bruitsTirage.length = 0;
    premierTirage.length = 0;
    deuxiemeTirage.length = 0; 
    conclusionTirage.length = 0;
    go();
}

function diff(sens){
    difficulte += sens;
    difficulte = Math.max(2,difficulte);
    difficulte = Math.min(order.length-2,difficulte);
    newRound();	
}

function diffChange(win) {
    if (tirageFinal && playerWin) {
        difficulte ++;
        nbreToursBruits = difficulte;
        console.log(difficulte + "difficulté augmentée");
    } else if (tirageFinal && difficulte >=1) {
        difficulte --;
        nbreToursBruits = difficulte;
        console.log(difficulte + "difficulté baissée");
    } else {
        console.log(difficulte + "difficulté inchangée");
    }
}

function res(win) {
    console.log(win);
    if(miseValide && doIBeatHim(me,him) === win){
        console.log("gagne le match");
        score+=mise;
        tours--;
        playerWin = true;
        
        //message de feedback
            if (mise === 1) {
                document.getElementById("affichageFeedback").innerHTML = "Vous avez sauvé " +mise+" mouton. Choisissez votre mise.";
            } else {
                document.getElementById("affichageFeedback").innerHTML = "Vous avez sauvé " +mise+" moutons. Choisissez votre mise.";   
            }
            document.getElementById("affichageFeedback").style.backgroundColor = "#00E676";
        //document.getElementById("res").innerHTML = "Vous avez trouvé la figure gagnante. <br>"+ mise + " mouton(s) de sauvé(s) !<br> Choisissez votre mise pour relancer le jeu.";
            
    } else if (miseValide) {
        console.log("pas gagne le match");
        score-=mise;
        tours--;
        
        //message de feedback 
        if (mise === 1) {
            document.getElementById("affichageFeedback").innerHTML = "Vous avez tué " +mise+" mouton. Choisissez votre mise.";
        } else {
            document.getElementById("affichageFeedback").innerHTML = "Vous avez tué " +mise+" moutons. Choisissez votre mise.";   
        }
        document.getElementById("affichageFeedback").style.backgroundColor = "#F44336";
        //document.getElementById("res").innerHTML = "Vous n'avez pas trouvé la figure gagnante. <br>"+ mise + " mouton(s) de perdu(s) !<br> Choisissez votre mise pour relancer le jeu.";
    }

    //score = Math.max(0,score);
    
    //On sauve le resultat pour cet essai dans une variable, ne sera transféré dans csv que lorsque le jeu est terminé (fin de partie)
    resultatJoueur += IDjoueur + ";" + nomDuJeu + ";" + mise + ";" + sequence + ";" + difficulte + ";" + score + ";" + playerWin + "\n";
    //enregistrerDonnees(1, mise + ";" + tours + ";" + difficulte + ";" + score + ";" + playerWin );

    //document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;
    document.getElementById("sequence").innerHTML = sequence;
    
    //nettoyer historique boutons mises
    cleanMise();
    
    //verrouiller boutons figures
    document.getElementById("me").disabled = true;
    document.getElementById("him").disabled = true;
    
    if (miseValide && tirageFinal === false && sequence > 0) {
        newRound();
    } else if (miseValide && tirageFinal && sequence > 1) {
        sequence--;
        console.log(sequence + "sequence");
        document.getElementById("sequence").innerHTML = sequence;
        newRound();
    } else if (miseValide && sequence >= 1 && tirageFinal) {
        sequence--;
        console.log(sequence + "sequence");
        document.getElementById("sequence").innerHTML = sequence;
        
        if(doIBeatHim(me,him) === win){
            score+=mise;
            if (mise === 1) {
                document.getElementById("affichageFeedback").innerHTML = "Vous avez sauvé " +mise+" mouton.";
            } else {
                document.getElementById("affichageFeedback").innerHTML = "Vous avez sauvé " +mise+" moutons.";   
            }
            document.getElementById("affichageFeedback").style.backgroundColor = "#00E676";
        } else if (doIBeatHim(me,him) !== win) {
            score-=mise;
            if (mise === 1) {
                document.getElementById("affichageFeedback").innerHTML = "Vous avez tué " +mise+" mouton.";
            } else {
                document.getElementById("affichageFeedback").innerHTML = "Vous avez tué " +mise+" moutons.";   
            }
            document.getElementById("affichageFeedback").style.backgroundColor = "#F44336";
        }
        setInterval(finDePartie,1500);
    }
    
    //reset de la mise et affichage résultat
    mise = "?";
    
    //déverrouiller boutons de mise
    document.getElementById("mise1").disabled = false;
    document.getElementById("mise2").disabled = false;
    document.getElementById("mise3").disabled = false;
    document.getElementById("mise4").disabled = false;
    document.getElementById("mise5").disabled = false;
    document.getElementById("mise6").disabled = false;
    document.getElementById("mise7").disabled = false;
    
    miseValide=false;
}

function colorMe() {
    document.getElementById('me').style.backgroundColor="E0E0E0";
}

function uncolorMe() {
    document.getElementById('me').style.backgroundColor="F5F5F5";
}

function colorHim() {
    document.getElementById('him').style.backgroundColor="E0E0E0";
    //document.getElementById('me').style.width="150%";
    //document.getElementById('me').style.position='absolute';
}

function uncolorHim() {
    document.getElementById('him').style.backgroundColor="F5F5F5";
}

function finDePartie() {
    if (sequence === 0){
        //récupérer score final du joueur
        scoreJoueurHugh = score;
        localStorage.scoreJoueurHugh = scoreJoueurHugh;
        console.log(scoreJoueurHugh);
        
        //renvoyer le joueur vers le hub
        var messageFinPartie = confirm("Votre partie est terminée. Votre score est de " + score + "\n" + "Cliquez pour passer au jeu suivant.");
            if (messageFinPartie===true) {
                enregistrerDonnees(1,resultatJoueur);
                var jeuLogicTermine = true;
                localStorage.setItem("hughlaurie", jeuLogicTermine);
                // open it in a new window / tab (depends on browser setting)
                window.open("hub.html",'_self',false);
            } else {
                enregistrerDonnees(1,resultatJoueur);
                var jeuLogicTermine = true;
                localStorage.setItem("hughlaurie", jeuLogicTermine);
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
                var jeuLogicTermine = true;
                localStorage.getItem("hughlaurie", jeuLogicTermine);
           
            } else {
                x = "Ah, d'accord.";
            }
            document.getElementById("retourProto").innerHTML = x;
        };
        boutton.onclick = results;
        document.body.appendChild(boutton);*/
    } else{

    }
}


// enregistrer données du joueur dans fichier csv pour la version local (à commenter pour la version en ligne)
function enregistrerDonnees (type, data) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            //console.log(xhttp.response);
        }
    };

    if (type === 0) {
        xhttp.open("POST", "php/toto.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("joueur=" + data);
    } else if (type === 1) {
        xhttp.open("POST", "php/toto.php", true );
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("data=" + data);
    }


    //xhttp.open("POST", "http://localhost:63342/Bandit2/src/php/toto.php", true);
    //xhttp.setRequestHeader("Content-type", "text/plain");
    //xhttp.send("data=\"" + donneesJoueur + "\"");
    //xhttp.send("data=15");

    console.log("Sent data " + data);
}

// enregistrer données du joueur dans fichier csv pour la version en ligne (à décommenter pour la version en ligne)
/*function enregistrerDonnees (type, data) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //console.log(xhttp.response);
        }
    };

    if (type == 0) {
        xhttp.open("POST", "../sorcerer/php/toto.php", true);
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("joueur=" + data);
    } else if (type == 1) {
        xhttp.open("POST", "../sorcerer/php/toto.php", true );
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send("data=" + data);
    }


    //xhttp.open("POST", "http://localhost:63342/Bandit2/src/php/toto.php", true);
    //xhttp.setRequestHeader("Content-type", "text/plain");
    //xhttp.send("data=\"" + donneesJoueur + "\"");
    //xhttp.send("data=15");

    console.log("Sent data " + data);
}*/
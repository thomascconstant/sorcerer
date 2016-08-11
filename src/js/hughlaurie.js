var nomDuJeu = "Logique";
var IDjoueur = localStorage.getItem("joueur");
var scoreJoueurHugh = 0; //Score du joueur à renseigner en fin de session de jeu

//à commenter pour la version en ligne
var figures = [
    "../src/img/cool.svg",
    "../src/img/deg.svg",
    "../src/img/triste.svg",
    "../src/img/haha.svg",
    "../src/img/meh.svg",
    "../src/img/cheveux.svg",
    "../src/img/smile.svg"];
//à décommenter pour la version en ligne
/*var figures = [
    "../sorcerer/img/cool.svg",
    "../sorcerer/img/deg.svg",
    "../sorcerer/img/triste.svg",
    "../sorcerer/img/haha.svg",
    "../sorcerer/img/meh.svg",
    "../sorcerer/img/cheveux.svg",
    "../sorcerer/img/smile.svg"];*/
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
var tours = 20; //Nombre de tours restants
var miseValide = false; //Si la mise n'est pas validée par le joueur
var difficulte = 0; //de 0 à order.length - 2
console.log(difficulte +"diff de base");
var nbreToursBruits = 0; //Nombre de tours que doit faire la fonction genererBruits();
var resultatJoueur = [];

function genererPredicatsBruits () {
    var i=0;
    var j=0;
    
    var figureFaible = order[0];
    console.log(figureFaible + "figure faible");
    
    while (i<=2) {
        var tirageAleatoire = order[Math.floor(Math.random()*order.length)];
        if (predicats.includes(tirageAleatoire) === false) {
            predicats.push(tirageAleatoire);
            i++;
        }
    }
    
    while (j<=3) {
        var tirageAleatoire = order[Math.floor(Math.random()*order.length)];
        if (bruits.includes(tirageAleatoire) === false && predicats.includes(tirageAleatoire) === false) {
            bruits.push(tirageAleatoire);
            j++;
        }
    }
    
    console.log(predicats + "prédicats");
    console.log(bruits + "bruits");
    
    /*for (var i=0; i<=2; i++) {
        var tirageAleatoire = order[Math.floor(Math.random()*order.length)];
        if (predicats.includes(tirageAleatoire) === false) {
            predicats.push(tirageAleatoire);
        }else {
            i--;
        }
    }
    console.log(predicats);
    
    for (var j=0; j<=3; j++){
        var tirageAleatoireBruits = order[Math.floor(Math.random()*order.length)];
        if (predicats.includes(tirageAleatoireBruits) === false && bruits.includes(tirageAleatoireBruits) === false){
            bruits.push(tirageAleatoireBruits);
        }else {
            j--;
        }
    }
    console.log(bruits);*/
}

function init() {
    document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;
    document.getElementById("res").innerHTML = "Choisissez votre mise.";
}

function go(){
    shuffleOrder();
    console.log(order);
    genererTirageAvecZero();
    
}

//récupérer mise
function recupMise () {
    if(document.getElementById('mise1').checked) {
        //boutton de mise 1 est validé
        mise = 1;
        
    }else if(document.getElementById('mise2').checked) {
        mise = 2;
    }else if(document.getElementById('mise3').checked) {
        mise = 3;
    }else if(document.getElementById('mise4').checked) {
        mise = 4;
    }else if(document.getElementById('mise5').checked) {
        mise = 5;
    }else if(document.getElementById('mise6').checked) {
        mise = 6;
    }else if(document.getElementById('mise7').checked) {
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
    document.getElementById("res").innerHTML = "Cliquez sur la figure que vous pensez gagnante.";

    //acter la mise du joueur pour déverouiller jeu
    miseValide = true;
}

function showMise() {
    document.getElementById("tableMise").style.visibility = "visible";
    document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;
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
    //genererPredicatsBruits ();
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
        if (conclusionTirage.includes(tirageB) === false && tirageB !== tirageA) {
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

/*function genererPremierTirage() {
    var i = 0;
    while (i<1) {
        me = predicats[Math.floor(Math.random()*predicats.length)];
        if (premierTirage.includes(me) === false) {
            premierTirage.push(me);
            i++;
        }
    }
    
    var j = 0;
    while (j<1) {
        him = predicats[Math.floor(Math.random()*predicats.length)];
        if (premierTirage.includes(him) === false) {
            premierTirage.push(him);
            j++;
        }
    }
    
    // récupérer tirage le plus fort pour la conclusion
    if (order[me] > order[him]) {
        conclusionTirage2.push(me);
    } else if (order[him] > order[me]) {
        conclusionTirage2.push(him);
    }
    console.log(conclusionTirage2 + " envoyé dans conclusion");
    
    console.log(me + "moi");
    console.log(him + "lui");
    console.log(premierTirage + "premier tirage");
    
    document.getElementById("me").innerHTML = '<img src="'+figures[me]+'">'; 
    document.getElementById("him").innerHTML = '<img src="'+figures[him]+'">';
    
    tirageUn = true;
}*/

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

/*function genererDeuxiemeTirage () {
    var j = 0;
    while (j<1) {
        var tirageB = predicats[Math.floor(Math.random()*predicats.length)];
        if (deuxiemeTirage.includes(tirageB) === false && premierTirage.indexOf(tirageB) === 1) {
            deuxiemeTirage.push(tirageB);
            j++;
        }
    }
    
    var i = 0;
    while (i<1) {
        var tirageA = predicats[Math.floor(Math.random()*predicats.length)];
        if (deuxiemeTirage.includes(tirageA) === false && premierTirage.includes(tirageA) === false) {
            deuxiemeTirage.push(tirageA);
            i++;
        }
    }
    
    me = deuxiemeTirage[Math.floor(Math.random()*deuxiemeTirage.length)];
    var k = 0;
    while (k<1) {
        him = deuxiemeTirage[Math.floor(Math.random()*deuxiemeTirage.length)];
        if (me !== him) {
            k++;
        }
    }
    
    // récupérer tirage le plus faible pour la conclusion
    if (order[me] < order[him]) {
        conclusionTirage2.push(me);
    } else if (order[him] < order[me]) {
        conclusionTirage2.push(him);
    }
    console.log(conclusionTirage2 + " envoyé dans conclusion");
    
    console.log(me + "moi");
    console.log(him + "lui");
    console.log(deuxiemeTirage + "deuxième tirage");
    
    document.getElementById("me").innerHTML = '<img src="'+figures[me]+'">';
    document.getElementById("him").innerHTML = '<img src="'+figures[him]+'">';
    
    tirageDeux = true;
    tirageUn = false;
}*/

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

/*function genererTirageConclusion () {
    var i = 0;
    while (i<1) {
        var tirageA = predicats[Math.floor(Math.random()*predicats.length)];
        if (premierTirage.includes(tirageA) === true && deuxiemeTirage.includes(tirageA) === false) {
            conclusionTirage.push(tirageA);
            i++;
        }
    }
    
    var j = 0;
    while (j<1) {
        var tirageB = predicats[Math.floor(Math.random()*predicats.length)];
        if (premierTirage.includes(tirageB) === false && deuxiemeTirage.includes(tirageB) === true) {
            conclusionTirage.push(tirageB);
            j++;
        }
    }
    
    me = conclusionTirage[Math.floor(Math.random()*conclusionTirage.length)];
    var k = 0;
    while (k<1) {
        him = conclusionTirage[Math.floor(Math.random()*conclusionTirage.length)];
        if (me !== him) {
            k++;
        }
    }
    
    console.log(me + "moi");
    console.log(him + "lui");
    console.log(conclusionTirage + "conclusion");
    
    document.getElementById("me").innerHTML = '<img src="'+figures[me]+'">';
    document.getElementById("him").innerHTML = '<img src="'+figures[him]+'">';
    
    tirageFinal = true;
    tirageDeux = false;
}*/

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
    /*var nbElts = 2 + difficulte;
    console.log("NbElts="+nbElts);
    console.log(difficulte);*/
    
    if (tirageUn && miseValide) {
        tirageFinal = false;
        genererTirageSansZero();
    } else if (tirageDeux && miseValide && nbreToursBruits <=1) {
        genererTirageConclusion();
    } else if (tirageDeux && miseValide && nbreToursBruits > 1) {
        genererTirageBruits();
    } else if (tirageFinal && miseValide) {
        tirageUn = false;
        tirageDeux = false;
        diffChange();
        clearArray();
        //genererPremierTirage();
    }
    
    playerWin = false;
    
    /*var meBefore = me;
    me = Math.floor(Math.random() * nbElts);
    while (me === meBefore) 
            me = Math.floor(Math.random() * nbElts);
    him = Math.floor(Math.random() * nbElts);
    while (him === me) 
            him = Math.floor(Math.random() * nbElts);

    document.getElementById("me").innerHTML = '<img src="'+figures[me]+'">'; 
    document.getElementById("him").innerHTML = '<img src="'+figures[him]+'">';*/

    /*if(miseValide) {
        //déverrouiller boutons figures
        document.getElementById("me").disabled = false;
        document.getElementById("him").disabled = false;
    }*/
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

    
    
    /*var i = 0;
    while (i <= difficulte && miseValide === true) {
        genererTirageBruits ();
        i ++;
    }*/
}

function res(win) {
    console.log(win);
    if(miseValide && doIBeatHim(me,him) === win){
        console.log("gagne le match");
        score+=mise;
        tours--;
        playerWin = true;
        document.getElementById("res").innerHTML = "Vous avez trouvé la figure gagnante. <br>"+ mise + " chaton(s) de sauvé(s) !<br> Choisissez votre mise pour relancer le jeu.";
            
    } else if (miseValide) {
        console.log("pas gagne le match");
        score-=mise;
        tours--;
        document.getElementById("res").innerHTML = "Vous n'avez pas trouvé la figure gagnante. <br>"+ mise + " chaton(s) de perdu(s) !<br> Choisissez votre mise pour relancer le jeu.";
    }

    //score = Math.max(0,score);
    
    //On sauve le resultat pour cet essai dans une variable, ne sera transféré dans csv que lorsque le jeu est terminé (fin de partie)
    resultatJoueur += IDjoueur + ";" + mise + ";" + tours + ";" + difficulte + ";" + score + ";" + playerWin + "\n";
    //enregistrerDonnees(1, mise + ";" + tours + ";" + difficulte + ";" + score + ";" + playerWin );

    //reset de la mise et affichage résultat
    mise = "?";
    document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;
    
    //déverrouiller boutons de mise
    document.getElementById("mise1").disabled = false;
    document.getElementById("mise2").disabled = false;
    document.getElementById("mise3").disabled = false;
    document.getElementById("mise4").disabled = false;
    document.getElementById("mise5").disabled = false;
    document.getElementById("mise6").disabled = false;
    document.getElementById("mise7").disabled = false;
    
    if (miseValide && tours > 0) {
        newRound();
    } else {
        finDePartie();
    }
    
    miseValide=false;
    
    //verrouiller boutons figures
    document.getElementById("me").disabled = true;
    document.getElementById("him").disabled = true;
}

function finDePartie() {
    if (tours === 0){
        //récupérer score final du joueur
        scoreJoueurHugh = score;
        localStorage.scoreJoueurHugh = scoreJoueurHugh;
        console.log(scoreJoueurHugh);
        
        //renvoyer le joueur vers le hub
        var messageFinPartie = confirm("Votre partie est terminée. Votre score est de " + score +" Cliquez pour passer au jeu suivant.");
            if (messageFinPartie===true) {
                enregistrerDonnees(1,nomDuJeu + ";" + resultatJoueur);
                var jeuLogicTermine = true;
                localStorage.setItem("hughlaurie", jeuLogicTermine);
                // open it in a new window / tab (depends on browser setting)
                window.open("hub.html",'_self',false);
            } else {
                enregistrerDonnees(1,nomDuJeu + ";" + resultatJoueur);
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
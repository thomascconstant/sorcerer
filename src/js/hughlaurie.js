var nomDuJeu = "Logique";
var IDjoueur = localStorage.getItem("joueur");
var scoreJoueurHugh = 0; //Score du joueur à renseigner en fin de session de jeu

var figures = [
    "../src/img/cool.svg",
    "../src/img/deg.svg",
    "../src/img/triste.svg",
    "../src/img/haha.svg",
    "../src/img/meh.svg",
    "../src/img/cheveux.svg",
    "../src/img/smile.svg"]
var order = [0,1,2,3,4,5,6];
var predicats = []; //Tableau dans lequel seront injectées les figures prédicats
var bruits = []; //Tableau dans lequel le reste des figures seront injectées (hors prédicats)
var premierTirage = []; //Tableau dans lequel sont rangés les résultats du premier tirage des prédicats
var deuxiemeTirage = []; //Tableau dans lequel sont rangés les résultats du deuxième tirage des prédicats
var conclusionTirage = []; //Tableau dans lequel sont rangés les résultats du tirage de conclusion
var me;
var him;

var score = 0; //Score actuel
var mise = 0; //Combien le joueur a misé
var tours = 5; //Nombre de tours restants
var miseValide = false; //Si la mise n'est pas validée par le joueur

var difficulte = 0; //de 0 à order.length - 2

function genererPredicatsBruits () {
    var i=0;
    var j=0;
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
    genererPredicatsBruits ();
}

function genererPremierTirage() {
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
    
    console.log(me + "moi");
    console.log(him + "lui");
    console.log(premierTirage + "premier tirage");
    
    document.getElementById("me").innerHTML = '<img src="'+figures[me]+'">'; 
    document.getElementById("him").innerHTML = '<img src="'+figures[him]+'">';
}

function genererDeuxiemeTirage () {
    var i = 0;
    while (i<1) {
        var tirageA = premierTirage[Math.floor(Math.random()*premierTirage.length)];
        if (deuxiemeTirage.includes(tirageA) === false) {
            deuxiemeTirage.push(tirageA);
            i++;
        }
    }
    
    var j = 0;
    while (j<1) {
        var tirageB = predicats[Math.floor(Math.random()*predicats.length)];
        if (deuxiemeTirage.includes(tirageB) === false && premierTirage.includes(tirageB) === false) {
            deuxiemeTirage.push(tirageB);
            j++;
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
    
    console.log(me + "moi");
    console.log(him + "lui");
    console.log(deuxiemeTirage + "deuxième tirage");
    
    document.getElementById("me").innerHTML = '<img src="'+figures[me]+'">';
    document.getElementById("him").innerHTML = '<img src="'+figures[him]+'">';
}

function genererTirageConclusion () {
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
    var nbElts = 2 + difficulte;
    console.log("NbElts="+nbElts);
    var meBefore = me;
    me = Math.floor(Math.random() * nbElts);
    while (me === meBefore) 
            me = Math.floor(Math.random() * nbElts);
    him = Math.floor(Math.random() * nbElts);
    while (him === me) 
            him = Math.floor(Math.random() * nbElts);

    document.getElementById("me").innerHTML = '<img src="'+figures[me]+'">'; 
    document.getElementById("him").innerHTML = '<img src="'+figures[him]+'">';

    /*if(miseValide) {
        //déverrouiller boutons figures
        document.getElementById("me").disabled = false;
        document.getElementById("him").disabled = false;
    }*/
}

function go(){
    shuffleOrder();
    //newRound();
    genererPremierTirage();
}

function diff(sens){
    difficulte += sens;
    difficulte = Math.max(2,difficulte);
    difficulte = Math.min(order.length-2,difficulte);
    newRound();	
    console.log(difficulte);
}

function res(win) {
    var msg;
    if(miseValide && doIBeatHim(me,him) === win){
        score+=mise;
        tours--;
        document.getElementById("res").innerHTML = "Vous avez trouvé la figure gagnante. \n"+ score + " chaton(s) de sauvé(s) !";
            
    } else if (miseValide) {
        score+=mise;
        tours--;
        document.getElementById("res").innerHTML = "Vous avez trouvé la figure gagnante. \n"+ score + " chaton(s) de perdu(s) !";
    }

    //score = Math.max(0,score);

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
        localStorage.scoreJoueurTom = scoreJoueurHugh;
        console.log(scoreJoueurHugh);
        //créer le bouton
        var boutton = document.createElement("input");
        boutton.type = "button";
        boutton.value = "Fin de partie.";
        boutton.name = "FIN";
        var results = function resultat(){
            var messageFinPartie = confirm("Votre partie est terminée. Votre score est de " + score +" Cliquez pour passer au jeu suivant.");
            if (messageFinPartie===true) {
                x = "Prototype en cours de développement, veuillez patienter.";
                enregistrerDonnees(1,nomDuJeu + ";" + resultatJoueur);
                var jeuMotriceTermine = true;
                localStorage.getItem("hughlaurie", jeuLogicTermine);
           
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
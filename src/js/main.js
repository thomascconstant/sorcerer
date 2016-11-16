var IDjoueur = ""; //donner une ID au joueur
var nomJoueur = ""; //nom entré par le joueur
var phpFile = "php/toto.php"; // version locale, à commenter pour la version en ligne
//var phpFile = "../sorcerer/php/toto.php"; // à décommenter pour la version en ligne

//----------------------------récupérer date et heure de connexion au jeu-----------------
var today = new Date();
var hh = today.getHours();
var mn = today.getMinutes();
var ss = today.getSeconds();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd;
}

if (mm < 10) {
    mm = '0' + mm;
}

if (mn < 10) {
    mn = '0' + mn;
}

if (ss < 10) {
    ss = '0' + ss;
}

today = mm + '_' + dd + '_' + yyyy + '_' + hh + 'h' + mn + 'm' + ss + 's';
var connexionJoueur = today;

//----------------------------récupérer identité joueur-----------------
function recupererNom(event) {
    if (event.keyCode === 13) {
        nomJoueur = document.getElementById("nomJoueur").value;
        verifierNom();
    }
}

function verifierNom() {
    if (isNaN(nomJoueur)) {
        localStorage.setItem("name", nomJoueur);
        console.log("nom du joueur : " + nomJoueur);
        
        //récupérer date de lancement du jeu
        localStorage.setItem("time", connexionJoueur);
        console.log("heure de connexion au jeu : " + connexionJoueur);

        //document.getElementById("commencerJeu").style.display = "block";
        //document.getElementById("commencerJeu").disabled = false;
        
        donnerID();

    } else if (nomJoueur === "") {
        alert("Veuillez entre votre nom, s'il vous plaît.");
    } else if (nomJoueur.indexOf('1' || '2' || '3' || '4' || '5' || '6' || '7' || '8' || '9' || '0' || '&' || '#' || '{' || '}' || '[' || ']') >= 0) {
        alert("Veuillez entre votre nom, s'il vous plaît.");
    } else {
        alert("Veuillez entre votre nom, s'il vous plaît.");
    }
}

function donnerID () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    var IDjoueur = Math.random().toString(36).substr(2, 9);
    localStorage.setItem("joueur",IDjoueur);
    console.log("ID du joueur : " + IDjoueur);

    //tirage aléatoire de présentation de mise ou confiance en premier dans les jeux
    var myArray = [0, 1];
    var choixMiseOuConfiance = myArray[Math.floor(Math.random() * myArray.length)];
    localStorage.setItem("miseOuConfiance", choixMiseOuConfiance);
    console.log("Si 1 c'est la mise d'abord, t'as combien là ? " + choixMiseOuConfiance);

    //enregistrerDonnees(0, "nomJoueur" + ";" + IDjoueur" + ";" + "nom_du_jeu" + ";" + "action_de_jeu" + ";" + "sequence" + ";" + "mise" + ";" + "difficulty" + ";" + "score" + ";" + "gagnant" + ";" + "\n");
    enregistrerDonnees(1,"\n");

    window.open("intro.html",'_self',false); 
    
}

function afficherLien() {
    document.getElementById("affichageLienJeu").style.display = "block";
    document.getElementById("affichageLienQuestionnaire").style.display = "none";
}

//----------------------------lancer de manière aléatoire ou selon progression le prochain jeu dans une nouvelle fenêtre----------------------------
function lancerJeu () {
    //récupérer boleen des jeux déjà terminés
    var jeuMotriceTermine = localStorage.getItem("tomcruise");
    var jeuSensoTermine = localStorage.getItem("christopherreeve");
    var jeuLogicTermine = localStorage.getItem("benedictcumberbatch");
    console.log(jeuMotriceTermine);
    console.log(jeuSensoTermine);
    console.log(jeuLogicTermine);
    //lancement selon progression
    if (jeuMotriceTermine && jeuSensoTermine === null && jeuLogicTermine === null) {
        var liensJeux = [
            "introchristopher.html",
            "introbenedict.html"
        ];
        var choixLien = Math.floor(Math.random() * liensJeux.length);
        // construct the link to be opened
        // open it in a new window / tab (depends on browser setting)
        window.open(liensJeux[choixLien],'_self',false);
    } else if (jeuSensoTermine && jeuLogicTermine === null && jeuMotriceTermine === null) {
        var liensJeux = [
            "introtom.html",
            "introbenedict.html"
        ];
        var choixLien = Math.floor(Math.random() * liensJeux.length);
        // construct the link to be opened
        // open it in a new window / tab (depends on browser setting)
        window.open(liensJeux[choixLien],'_self',false);
    } else if (jeuLogicTermine && jeuSensoTermine === null && jeuMotriceTermine === null) {
        var liensJeux = [
            "introtom.html",
            "introchristopher.html"
        ];
        var choixLien = Math.floor(Math.random() * liensJeux.length);
        // construct the link to be opened
        // open it in a new window / tab (depends on browser setting)
        window.open(liensJeux[choixLien],'_self',false);
    } else if (jeuMotriceTermine && jeuSensoTermine && jeuLogicTermine === null) {
        // open it in a new window / tab (depends on browser setting)
        window.open("introbenedict.html",'_self',false);
    } else if (jeuMotriceTermine && jeuLogicTermine && jeuSensoTermine === null) {
        // open it in a new window / tab (depends on browser setting)
        window.open("christopherreeve.html",'_self',false);
    } else if (jeuSensoTermine && jeuLogicTermine && jeuMotriceTermine === null) {
        // open it in a new window / tab (depends on browser setting)
        window.open("introtom.html",'_self',false);
    } else if (jeuMotriceTermine && jeuSensoTermine && jeuLogicTermine) {
        //fin du jeu
        window.open("queen.html",'_self',false);
    } else {
        // liens vers les jeux
        var liensJeux = [
            "introtom.html",
            "introchristopher.html",
            "introbenedict.html"];
        // get a random number between 0 and the number of links
        var randIdx = Math.random() * liensJeux.length;
        // round it, so it can be used as array index
        randIdx = parseInt(randIdx, 10);
        // construct the link to be opened
        var lien = liensJeux[randIdx]; //à décommenter pour avoir un lancement aléatoire des jeux
        // var lien = "introtom.html"; //à décommenter pour ne lancer que ce jeu
        // open it in a new window / tab (depends on browser setting)
        window.open(lien,'_self',false);
    }
}

//----------------------------feedback visuels----------------------------
function colorButton() {
    document.getElementById('commencerJeu').style.backgroundColor="373b3d";
}

function uncolorButton() {
    document.getElementById('commencerJeu').style.backgroundColor="757575";
}

function afficherResults() {
    var jeuMotriceTermine = localStorage.getItem("tomcruise");
    var jeuSensoTermine = localStorage.getItem("christopherreeve");
    var jeuLogicTermine = localStorage.getItem("benedictcumberbatch");

    if (jeuMotriceTermine) {
        //document.getElementById("affichageTom").style.display = "block"; 
        document.getElementById("resultTom").style.display = "block";
        document.getElementById("resultTomSauves").style.display = "block";
        document.getElementById("resultTomPerdus").style.display = "block";
    }
    
    if (jeuSensoTermine) {
        //document.getElementById("affichageChristopher").style.display = "block"; 
        document.getElementById("resultChristopher").style.display = "block";
        document.getElementById("resultChristopherSauves").style.display = "block";
        document.getElementById("resultChristopherPerdus").style.display = "block";
    }
    
    if (jeuLogicTermine) {
        //document.getElementById("affichageBenedict").style.display = "block"; 
        document.getElementById("resultBenedict").style.display = "block";
        document.getElementById("resultBenedictSauves").style.display = "block";
        document.getElementById("resultBenedictPerdus").style.display = "block";
    }
}

//----------------------------enregistrer données du joueur dans fichier csv pour la version local (à commenter pour la version en ligne)----------------------------
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


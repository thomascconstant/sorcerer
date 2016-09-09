var IDjoueur = ""; //donner une ID au joueur

var phpFile = "php/toto.php"; // version locale, à commenter pour la version en ligne
//var phpFile = "../sorcerer/php/toto.php"; // à décommenter pour la version en ligne

function donnerID () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    var IDjoueur = Math.random().toString(36).substr(2, 9);
    console.log(IDjoueur);
    localStorage.setItem("joueur",IDjoueur);

    //enregistrerDonnees(0, "IDjoueur" + ";" + "nom_du_jeu" + ";" + "action_de_jeu" + ";" + "sequence" + ";" + "mise" + ";" + "difficulty" + ";" + "score" + ";" + "gagnant" + ";" + "\n");
    enregistrerDonnees(1,"\n");
    lancerJeu();
    
}

function afficherLien() {
    document.getElementById("affichageLienJeu").style.display = "block";
    document.getElementById("affichageLienQuestionnaire").style.display = "none";
}

//lancer de manière aléatoire ou selon progression le prochain jeu dans une nouvelle fenêtre
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
        document.getElementById("affichageTom").style.display = "block"; 
        document.getElementById("resultTom").style.display = "block"; 
    }
    
    if (jeuSensoTermine) {
        document.getElementById("affichageChristopher").style.display = "block"; 
        document.getElementById("resultChristopher").style.display = "block";
    }
    
    if (jeuLogicTermine) {
        document.getElementById("affichageBenedict").style.display = "block"; 
        document.getElementById("resultBenedict").style.display = "block";
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


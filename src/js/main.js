//donner une ID au joueur
var IDjoueur = "";

function donnerID () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    var IDjoueur = Math.random().toString(36).substr(2, 9);
    console.log(IDjoueur);

    //enregistrer nom dans csv
    enregistrerDonnees(0, IDjoueur);
    
};

//lancer de manière aléatoire le prochain jeu dans une nouvelle fenêtre
// liens vers les jeux
var liensJeux = [
    "tomcruise.html",
    "christopherreeve.html",
    "test3.html"];

function lancerJeu () {
    // get a random number between 0 and the number of links
    var randIdx = Math.random() * liensJeux.length;
    // round it, so it can be used as array index
    randIdx = parseInt(randIdx, 10);
    // construct the link to be opened
    var lien = liensJeux[randIdx];
    // open it in a new window / tab (depends on browser setting)
    window.open(lien,'_self',false);
};

// enregistrer données du joueur dans fichier csv
function enregistrerDonnees (type, data) {
    var xhttp = new XMLHttpRequest();
    //xhttp.addEventListener("load", reqListener);
    if (type == 0) {
        xhttp.open("GET", "http://localhost:63342/confiance_diff/src/php/toto.php?joueur=" + data + "");
    } else if (type == 1) {
        xhttp.open("GET", "http://localhost:63342/confiance_diff/src/php/toto.php?data=" + data + "");
    } else if (type == 2) {
        xhttp.open("GET", "http://localhost:63342/confiance_diff/src/php/toto.php?fin=1");
    }


    //xhttp.open("POST", "http://localhost:63342/Bandit2/src/php/toto.php", true);
    //xhttp.setRequestHeader("Content-type", "text/plain");
    //xhttp.send("data=\"" + donneesJoueur + "\"");
    //xhttp.send("data=15");

    xhttp.send();

    console.log("Sent data");
}



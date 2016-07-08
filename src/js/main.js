//donner une ID au joueur
var IDjoueur = "";

function donnerID () {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    var IDjoueur = Math.random().toString(36).substr(2, 9);
    console.log(IDjoueur);

    enregistrerDonnees(0, IDjoueur + ";");
    lancerJeu();
    
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
    // var lien = liensJeux[randIdx]; à décommenter pour avoir un lancement aléatoire des jeux
    var lien = "tomcruise.html"; //à commenter pour ne pas lancer uniquement ce jeu
    // open it in a new window / tab (depends on browser setting)
    window.open(lien,'_self',false);
};

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



<?php


function openFile () {
    return fopen("../data.csv", "a");
}

function enregisterJoueur ($joueur) {
    $handle = openFile();
    fwrite($handle, PHP_EOL . $joueur);
}

function enregister ($data) {
    $handle = openFile();
    fwrite($handle, $data);
}

if (isset($_GET['joueur'])) {
    enregisterJoueur($_GET['joueur']);
} else if (isset($_GET['data'])) {
    enregister($_GET['data']);
} else if (isset($_GET['score'])) {
    enregister($_GET['score']);
}
?>
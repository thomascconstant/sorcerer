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

if (isset($_REQUEST['joueur'])) {
    enregisterJoueur($_REQUEST['joueur']);
} else if (isset($_REQUEST['data'])) {
    enregister($_REQUEST['data']);
} else if (isset($_REQUEST['score'])) {
    enregister($_REQUEST['score']);
}
?>
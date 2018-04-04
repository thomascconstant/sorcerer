<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

function enregistrerAxel($data) {
    //$dest = "ftp://username:password@ftp.mywebsite.com/path/to/the/file/data.csv"; // à décommenter pour la version en ligne
    $dest = "../data"; // à commenter pour la version en ligne
	$dest .= $_REQUEST["id"];
	$dest .= ".csv";
    
    $filedata ='';
    if(file_exists($dest))
        $filedata = file_get_contents($dest);
    $filedata.= $data;

    $streamcontext = stream_context_create(array('ftp' => array('overwrite' => true)));

    $result = file_put_contents($dest, $filedata, 0, $streamcontext);
    if ($result === FALSE) {
           echo "erreur";     
    } else {
        echo "success";
    }

}

function enregistrer($data) {
    //$dest = "ftp://username:password@ftp.mywebsite.com/path/to/the/file/data.csv"; // à décommenter pour la version en ligne
    $dest = "../data/data"; // à commenter pour la version en ligne
    $dest .= $_REQUEST["id"];
    $dest .= ".csv";
    
	/*$date = date('Y-m-d H:i:s:v');
	
	//On le rajoute a chaque début de ligne
	$data_array = explode("\n",$data);
	for($i=0;$i<count($data_array);$i++){
		if(!empty($data_array[$i])){
			$data_array[$i] = $date.';'.$data_array[$i];
		}	
	}
		
	$data = implode("\n",$data_array);*/
	
    $handle = fopen($dest, "a");
    fwrite($handle, $data);
    fclose($handle);

}

/*echo("request");
print_r($_REQUEST);
echo("post");
print_r($_POST);*/

if (isset($_REQUEST['data'])) {
    enregistrer($_REQUEST['data']);
} else {
    echo "erreur data"; 
}

// old version local, fonctionnelle
/*function openFile () {
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
}*/

?>
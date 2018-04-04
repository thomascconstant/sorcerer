<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$dir = "../data/";
$data = "";
$dh  = opendir($dir);
while (false !== ($filename = readdir($dh))) {
    
    if(substr($filename,0,4) == 'data'){
        $data .= file_get_contents($dir.$filename);
    }

    
}

$filename = "../data/data_" . date("ymd_his").".csv";
$handle = fopen($filename,"w");
fwrite($handle, "timestamp;nom_du_joueur;IDjoueur;heure_connexion_joueur;nom_du_jeu;modeTest;mise_first_1;action_de_jeu;duree_tour_ms;mise;confiance;difficulty;gameDiff;near_miss;moutons_sauves;moutons_tues;score;gagnant");
fwrite($handle,"\n");
fwrite($handle,$data);
fclose($handle);
echo $filename." created";

$zip = new ZipArchive();
$zip->open($filename.".zip", ZipArchive::CREATE | ZipArchive::OVERWRITE);
$rootpath = "../data/";
// Create recursive directory iterator
/** @var SplFileInfo[] $files */
$files = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($rootpath),
    RecursiveIteratorIterator::LEAVES_ONLY
);

foreach ($files as $name => $file)
{
    // Skip directories (they would be added automatically)
    if (!$file->isDir())
    {
        // Get real and relative path for current file
        $filePath = $file->getRealPath();
        $relativePath = substr($filePath, strlen($rootpath) + 1);

        // Add current file to archive
        $zip->addFile($filePath, $relativePath);
    }
}

// Zip archive will be created only after closing object
$zip->close();


?>
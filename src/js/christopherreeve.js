var nomDuJeu = "Sensoriel";
var IDjoueur = localStorage.getItem("joueur");

var nbCells = 2;
var width = 300;
var difficulty = 0;
var score = 0;
var anim = 0;
var colorTarget =  0;
var colorCurrent = 0;
var colorBase =  0;
var nbCasesToFind = 0;
var miseValide = false; //Si la mise n'est pas validée par le joueur

var score = 0; //Score actuel
var mise = 0; //Combien le joueur a misé
var tours = 2; //Nombre de tours restants

function animate(){

    var step = Math.floor((colorCurrent - colorBase) / 10);
    step = Math.max(1,step);

    var cells = document.getElementsByName("cellWin");
    //console.log(colorTarget+'/'+colorBase);
    if(colorCurrent - colorBase > step)
        colorCurrent -= step;
    else {
        colorCurrent = colorBase;
    }
    for(var i=0;i<cells.length;i++){
        cells[i].style.backgroundColor = toHexColor(colorCurrent,colorCurrent,colorCurrent);
    }
}

function init() {
    document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;
    go();

}

function go() {
    makeGame(width,nbCells,1-difficulty);
    anim = setInterval(animate,10);
    /*document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;*/
    /*if(hideTarget) {
        document.getElementById("target").style.visibility = "hidden";
    }
    document.getElementById("tableMise").style.visibility = "hidden";*/
}

//récupérer mise
function recupMise() {
    if(document.getElementById('mise1').checked) {
        //boutton de mise 1 est validé
        mise = 1;
        document.getElementById("boutonMiser").disabled = true;
    }else if(document.getElementById('mise2').checked) {
        mise = 2;
        document.getElementById("boutonMiser").disabled = true;
    }else if(document.getElementById('mise3').checked) {
        mise = 3;
        document.getElementById("boutonMiser").disabled = true;
    }else if(document.getElementById('mise4').checked) {
        mise = 4;
        document.getElementById("boutonMiser").disabled = true;
    }else if(document.getElementById('mise5').checked) {
        mise = 5;
        document.getElementById("boutonMiser").disabled = true;
    }else if(document.getElementById('mise6').checked) {
        mise = 6;
        document.getElementById("boutonMiser").disabled = true;
    }else if(document.getElementById('mise7').checked) {
        mise = 7;
        document.getElementById("boutonMiser").disabled = true;
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

function showMise(){
    document.getElementById("tableMise").style.visibility = "visible";
    document.getElementById("tours").innerHTML = tours;
    document.getElementById("score").innerHTML = score;
    document.getElementById("mise").innerHTML = mise;
}

function win(){
    if (miseValide === true){
      nbCasesToFind--;
        if(nbCasesToFind <= 0) {
            score += mise;
            document.getElementById("res").innerHTML = "Vous avez sauvé "+score+" chaton(s). Choisissez votre mise pour relancer le jeu.";
            console.log(nbCasesToFind + "to go");
            //Un tour de moins, reset de la mise
            tours--;
            mise = "?";
            document.getElementById("tours").innerHTML = tours;
            document.getElementById("score").innerHTML = score;
            document.getElementById("mise").innerHTML = mise;

            //if(Math.random() < 0.7) {
            if(difficulty >= 0.95) {
                difficulty = Math.min(0.99,difficulty + 0.01);
            } else {
                difficulty = Math.min(0.95,difficulty + 0.05);
            }
                //}else{
            //	nbCells = Math.min(6, nbCells+1);
            //}
            makeGame(width,nbCells,1-difficulty);
            feedbackSonore();
            
            miseValide = false;
            
            document.getElementById("boutonMiser").disabled = false;
            //déverrouiller boutons de sélection de mise
            document.getElementById("mise1").disabled = false;
            document.getElementById("mise2").disabled = false;
            document.getElementById("mise3").disabled = false;
            document.getElementById("mise4").disabled = false;
            document.getElementById("mise5").disabled = false;
            document.getElementById("mise6").disabled = false;
            document.getElementById("mise7").disabled = false;
        }
        //bloquer le jeu pour et déverouiller bouton de mise sauf si plus de tours
        if (tours === 0 && miseValide === false) {
            finDePartie();

        }

        //makeGame(width,nbCells,1-difficulty);

        console.log(difficulty + "difficulté win");  
    }
    
}

function fail(){
    if (miseValide === true){
        score -= mise;
        document.getElementById("res").innerHTML = "Vous avez tué " +score+" chaton(s). Choisissez votre mise pour relancer le jeu.";

        //Un tour de moins, reset de la mise
        tours--;
        mise = "?";
        document.getElementById("tours").innerHTML = tours;
        document.getElementById("score").innerHTML = score;
        document.getElementById("mise").innerHTML = mise;

        //if(Math.random() < 0.7) {
        if(difficulty > 0.95) {
            difficulty = difficulty - 0.01;
        } else {
            difficulty = Math.max(0,difficulty - 0.05);
        }
        //makeGame(width,nbCells,1-difficulty);
            //}else{
        //	nbCells = Math.max(2,nbCells-1);
        //}

        //bloquer le jeu pour et déverouiller bouton de mise sauf si plus de tours
        if (tours > 0) {
            miseValide = false;
            document.getElementById("boutonMiser").disabled = false;
            //déverrouiller boutons de sélection de mise
            document.getElementById("mise1").disabled = false;
            document.getElementById("mise2").disabled = false;
            document.getElementById("mise3").disabled = false;
            document.getElementById("mise4").disabled = false;
            document.getElementById("mise5").disabled = false;
            document.getElementById("mise6").disabled = false;
            document.getElementById("mise7").disabled = false;
        } else {
            finDePartie();
        }

        makeGame(width,nbCells,1-difficulty);

        console.log(difficulty + "difficulté fail");
    }
    
}

function toHex(d) {
    return  ("0"+(Number(d).toString(16))).slice(-2).toUpperCase()
}

function toHexColor(R,V,B){
    return "#"+toHex(R)+toHex(V)+toHex(B);
}

function makeGame(width,nbCellsX,diffColor) {
    nbCellsX = 5;

    //Calc des props
    var widthCell = width / nbCellsX;
    var colorBaseR = Math.floor(Math.random() * 128 + 64);
    var colorBaseV = Math.floor(Math.random() * 128 + 64);
    var colorBaseB = Math.floor(Math.random() * 128 + 64);

    colorBaseR = 128;
    colorBaseV = colorBaseR;
    colorBaseB = colorBaseR;


    colorBase = colorBaseR;

    var colorFindR = Math.floor(colorBaseR + 64 * diffColor);
    var colorFindV = Math.floor(colorBaseV + 64 * diffColor);
    var colorFindB = Math.floor(colorBaseB + 64 * diffColor);

    colorTarget = colorFindB;
    colorCurrent = colorTarget;

    var colorBaseHex = toHexColor(colorBaseR,colorBaseV,colorBaseB);
    var colorFindHex = toHexColor(colorFindR,colorFindV,colorFindB);

    console.log(colorBaseHex);
    console.log(colorFindHex);

    var cases = [];

    var nbCells = 4;
    nbCasesToFind = 4;

    for(var i=0;i<nbCells;i++)	{
        var ijFind = 0;
        while(cases.indexOf(ijFind) >= 0)
            ijFind = Math.floor(Math.random() * (nbCellsX * nbCellsX));
        cases.push(ijFind);
    }

    var iFind = Math.floor(Math.random() * nbCellsX);
    var jFind = Math.floor(Math.random() * nbCellsX);

    var iDecoy = Math.floor(Math.random() * nbCellsX);
    var jDecoy = Math.floor(Math.random() * nbCellsX);

    var strHtml = '';
    strHtml += '<table>';
    for(var i=0;i<nbCellsX;i++) {
        strHtml += '<tr>';
        for(var j=0;j<nbCellsX;j++) {
            var color = colorBaseHex;
            var clickFun = "fail()";
            var name = "cellFail";

            var ijFind = i + j * nbCellsX;

            if(cases.indexOf(ijFind) >= 0) {
                color = colorFindHex;
                clickFun = "win()";
                name = "cellWin";
            }


            strHtml += '<td name="'+name+'" style="background-color:'+color+'; width:'+widthCell+'px; height:'+widthCell+'px" onclick="'+clickFun+'">&nbsp;';
            strHtml += '</td>';
        }
        strHtml += '</tr>';
    }
    strHtml += '</table>';

    document.getElementById("board").innerHTML = strHtml;
}

function finDePartie() {
    if (tours == 0){
        //créer le bouton
        var boutton = document.createElement("input");
        boutton.type = "button";
        boutton.value = "Fin de partie.";
        boutton.name = "FIN";
        var results = function resultat(){
            var messageFinPartie = confirm("Votre partie est terminée. Votre score est de " + score +" Cliquez pour passer au jeu suivant.");
            if (messageFinPartie==true) {
                x = "Prototype en cours de développement, veuillez patienter.";
                enregistrerDonnees(1,nomDuJeu + ";" + resultatJoueur);
                var jeuMotriceTermine = true;
                localStorage.getItem("christopherreeve", jeuSensoTermine);
           
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

function feedbackSonore() {
    var x = document.getElementById("winSound");
    x.play();
}
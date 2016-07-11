
var figures = [
    "../src/img/cool.svg",
    "../src/img/deg.svg",
    "../src/img/triste.svg",
    "../src/img/haha.svg",
    "../src/img/meh.svg",
    "../src/img/cheveux.svg",
    "../src/img/smile.svg",]
var order = [0,1,2,3,4,5,6];
var me;
var him;
var score = 0;
var difficulte = 0; //de 0 à order.length - 2

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
}

function doIBeatHim(me, him){
	for(var i=0;i<order.length;i++){
		if(order[i] == me)
			return false;
		if (order[i] == him)
			return true;
	}
}

function newRound(){
	var nbElts = 2 + difficulte;
	console.log("NbElts="+nbElts);
	var meBefore = me;
	me = Math.floor(Math.random() * nbElts);
	while (me == meBefore) 
		me = Math.floor(Math.random() * nbElts);
	him = Math.floor(Math.random() * nbElts);
	while (him == me) 
		him = Math.floor(Math.random() * nbElts);
		
	document.getElementById("me").innerHTML = '<img src="'+figures[me]+'">'; 
	document.getElementById("him").innerHTML = '<img src="'+figures[him]+'">'; 
}

function go(){
	shuffleOrder();
	newRound();	
}

function diff(sens){
	difficulte += sens;
	difficulte = Math.max(2,difficulte);
	difficulte = Math.min(order.length-2,difficulte);
	newRound();	
}

function res(win){
	var msg;
	if(doIBeatHim(me,him) == win){
		msg = 'ouaaaaais !'
		score++;
	}else{
		msg = 'ben non.'
		score--;
	}
		
	score = Math.max(0,score);
		
	document.getElementById("res").innerHTML = msg + " "+ score + "pt";
	
	newRound();
}

//GESTION DE LA DIFFICULTE

var diffModel = {

    //utils
    normal: function(moy, et) {
        var A = Math.sqrt(-2*Math.log(Math.random()+1e-15)) * Math.cos(2*Math.PI*Math.random());
        return (A*et+moy);
    },


    //Paramètres du logit
    beta0 :3,
    beta1 :-0.4,
    minChallenge: 0.001,
    maxChallenge: 100,

    setParams: function(b0, b1) {
        this.beta0 = b0;
        this.beta1 = b1;
    },

    //Challenge c'est la variable qui genere la difficulte (vitesse du slider, etc...)
    //Retourne la diff, donc 1-p(win)
    getDiffFromChallenge: function(challenge) {
        return 1-(1/(1+Math.exp(-(this.beta0+this.beta1*challenge))))
    },

    //Donner la difficulte (1-p(win)) pour avoir le param du challenge
    getChallengeFromDiff: function(diff) {
        diff = 1-diff;
        var challenge = - (Math.log((1/diff) - 1) + this.beta0)/this.beta1;
        challenge = Math.max(this.minChallenge,challenge);
        challenge = Math.min(this.maxChallenge,challenge);
        return challenge;
    },


    curve: [0.3,0.35,0.3,0.5,0.55,0.5],
    currentStep: 0,
    mode:0, ///0:courbe,1:dda,2:random
    currentDiff: 0.2,
    setCurrentDiff: function(d) {this.currentDiff = d},
    setMode:function(m){this.mode = m},
    setStepInCurve:function(s){this.currentStep=s},

    //win : resultat du dernier coup win / loss
    nextDifficulty:function(win) {

        //Si mode follow curve
        if(this.mode == 0) {
            this.currentDiff = curve[this.currentStep];
            this.currentStep = (this.currentStep + 1)%curve.length;
        }

        //si mode dda
        if(this.mode == 1) {
            this.currentDiff += win ? 0.05 : -0.05;
        }

        if(this.mode == 2) {
            this.currentDiff = normal(0.4,0.5);
        }

        this.currentDiff = Math.max(0,this.currentDiff);
        this.currentDiff = Math.min(1,this.currentDiff);

        return this.currentDiff;
    }

}

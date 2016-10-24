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
    minChallenge: 0.05,
    maxChallenge: 10,
    

    setParams: function(b0, b1) {
        this.beta0 = b0;
        this.beta1 = b1;
    },

    setChallengeMinMax: function(minCh,maxCh){
        this.minChallenge = minCh;
        this.maxChallenge = maxCh;
    },

   

    //Challenge c'est la variable qui genere la difficulte (vitesse du slider, etc...)
    //Retourne la diff, donc 1-p(win)
    getDiffFromChallengeLogit: function(challenge) {
        return 1-(1/(1+Math.exp(-(this.beta0+this.beta1*challenge))))
    },

    //Donner la difficulte (1-p(win)) pour avoir le param du challenge
    getChallengeFromDiffLogit: function(diff) {
        diff = 1-diff;
        var challenge = - (Math.log((1/diff) - 1) + this.beta0)/this.beta1;
        challenge = Math.max(this.minChallenge,challenge);
        challenge = Math.min(this.maxChallenge,challenge);
        return challenge;
    },

    getChallengeFromDiffLinear: function (diff) {
        if (diff < 0 || diff > 1)
            console.log("DIFF: ERROR difficulte hors norme " + diff);

        var challenge = (this.maxChallenge - this.minChallenge) * diff + this.minChallenge;
        challenge = Math.max(this.minChallenge, challenge);
        challenge = Math.min(this.maxChallenge, challenge);

        console.log("DIFF: chall " + challenge.toFixed(2));

        return challenge;
    },


    curve: [0.3,0.35,0.3,0.5,0.55,0.5],
    currentStep: 0,
    ddaStep: 0, //permet d'avoir un sursaut sur la DDA (mode MODE_DDA_SAUT)
    currentDdaStep: 0, //increment du step dda (mode MODE_DDA_SAUT)
    ddaStepJump: 0, //de combien on saut si on est au moment du jump dda (mode MODE_DDA_SAUT)
    mode: 0, 
    MODE_COURBE: 0,
    MODE_DDA: 1,
    MODE_RANDOM: 2,
    MODE_DDA_SAUT: 3,
    currentDiff: 0.2,
    stepDiff: 0.1,

    setCurrentDiff: function (d) {
        this.currentDiff = d;
        this.currentDiff = Math.max(0, this.currentDiff);
        this.currentDiff = Math.min(1, this.currentDiff);
        console.log("DIFF: diff " + this.currentDiff.toFixed(2));
    },
    setDiffStep: function (step) { this.stepDiff = step;},
    setMode: function(m) {this.mode = m},
    setStepInCurve: function (s) { this.currentStep = s },
    setDdaJump(ddaStep,ddaStepJump){
        this.ddaStep = ddaStep;
        this.ddaStepJump = ddaStepJump;
    },
    resetDdaJump: function(){this.currentDdaStep = 0;},

    //win : resultat du dernier coup win / loss
    nextDifficulty:function(win) {

        //Si mode follow curve
        if (this.mode == this.MODE_COURBE) {
            this.currentDiff = curve[this.currentStep];
            this.currentStep = (this.currentStep + 1)%curve.length;
        }

        //si mode dda
        if(this.mode == this.MODE_DDA) {
            this.currentDiff += win ? this.stepDiff : -this.stepDiff;
        }

        if (this.mode == this.MODE_DDA_SAUT) {
            if (this.currentDdaStep == this.ddaStep)
                this.currentDiff += win ? this.ddaStepJump : -this.ddaStepJump;
            else
                this.currentDiff += win ? this.stepDiff : -this.stepDiff;
            this.currentDdaStep++;
        }

        if(this.mode == this.MODE_RANDOM) {
            this.currentDiff = this.normal(0.5, 0.4);

        }

        this.setCurrentDiff(this.currentDiff);

        console.log("DIFF: diff ("+(win?"win":"lose")+") : " + this.currentDiff.toFixed(2));

        return this.currentDiff;
    }

}

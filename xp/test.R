  
file = "./log_thomas_XPFINALES_ENCOURS.txt"


csv.data <- read.csv(file,header=TRUE,sep=";")
DT <- as.data.table(csv.data)
DTM <- csv.data[which(csv.data$nom_du_jeu=="Motrice"),]
DTM <- as.data.table(DTM)

DTM$difficulty <-  (DTM$difficulty)/ abs(max(DTM$difficulty)) #normalisation difficulte

DTLoc <- DTM;
trace=FALSE;
titre = "titre";

#echec au lieu de succes pour diff c'est mieux
DTLoc$perdant <- 1-DTLoc$gagnant;

#normalisation de la mise
DTLoc$miseNorm <- DTLoc$mise / 7;

#difficulte évaluée par le joueur
DTLoc$evalDiff <- 1 - DTLoc$miseNorm;

#On ajoute une colonne de la difficulte estimee, a partir d'un 
#logit de la difficulte supposée sur l'échec constaté
mylogit <- glm(perdant ~ difficulty, data = DTLoc, family = "binomial"(link = "logit"))
sample = data.frame(difficulty=DTLoc$difficulty);
DTLoc$estDiff =  predict(mylogit, newdata = sample, type = "response");

#erreur d'estimation de la difficulte par le joueur (exces de confiance ?)
DTLoc$erreurdiff <- DTLoc$evalDiff - DTLoc$estDiff;

#nombre de fail consecutifs
DTNbFail <- DTLoc[1,]
nbFailCpt = 0;#DTLoc[1,perdant]
DTNbFail <- cbind(DTNbFail,data.table(nbFail=nbFailCpt))

for(i in 2:nrow(DTLoc)){
  if(DTLoc[i-1,gagnant] == 0){
    nbFailCpt = nbFailCpt+1;
  }else{
    nbFailCpt = 0;
  }
  DTNbFail <- rbind(DTNbFail,cbind(DTLoc[i,],data.table(nbFail=nbFailCpt)))
}
DTLoc <- DTNbFail

#nombre de wins consecutifs
DTNbWin <- DTLoc[1,]
nbWinCpt = 0;#DTLoc[1,gagnant]
DTNbWin <- cbind(DTNbWin,data.table(nbWin=nbWinCpt))

for(i in 2:nrow(DTLoc)){
  if(DTLoc[i-1,gagnant] == 1){
    nbWinCpt = nbWinCpt+1;
  }else{
    nbWinCpt = 0;
  }
  DTNbWin <- rbind(DTNbWin,cbind(DTLoc[i,],data.table(nbWin=nbWinCpt)))
}
DTLoc <- DTNbWin

#On calcule une somme lissée des echecs et succes
DTResLisse <- DTLoc[1,];
resLisseCur <- 0;
DTResLisse <- cbind(DTResLisse,data.table(resLisse=resLisseCur));

alpha <- 0.5;

for(i in 2:nrow(DTLoc)){
  res <- (DTLoc[i-1,gagnant]*2)-1;
  resLisseCur <- alpha * resLisseCur + res;
  DTResLisse <- rbind(DTResLisse,cbind(DTLoc[i,],data.table(resLisse=resLisseCur)));
}
DTLoc <- DTResLisse

DTDesc = data.table();
DTDesc = DTLoc[,.(id="Moteur",sdMise=sd(miseNorm)),by=IDjoueur]
DTDesc = rbind(DTDesc,DTLoc[,.(id="Senso",sdMise=sd(miseNorm)),by=IDjoueur])
p <- ggplot(DTDesc, aes(id,sdMise))
p <- p + geom_boxplot() + geom_point(shape=1) 
print(p)
#outlier <- boxplot.stats(DTDesc$sdMise)$out

print("Anova res lisse")
fit <- aov(erreurdiff ~ resLisse, data=DTLoc)
sum_fit1 = unlist(summary(fit))

print("Anova nbWin")
fit <- aov(erreurdiff ~ nbWin, data=DTLoc)
sum_fit2 = unlist(summary(fit))

print("Anova nbFail")
fit <- aov(erreurdiff ~ nbFail, data=DTLoc)
sum_fit3 = unlist(summary(fit))
#print(summary(fit))



print(sum_fit1["Pr(>F)1"]);
print(sum_fit2["Pr(>F)1"]);
print(sum_fit3["Pr(>F)1"]);

print("Regression linéaire")
#fitl <- glm(DTLoc$erreurdiff ~ DTLoc$resLisse)
#abline(a =fitl$coefficients[1], b=fitl$coefficients[2], col="green")
#print(summary(fitl))
#plot(fitl)


#install.packages("data.table")
require(data.table)

#----------------------------------- configuration
useMotrice = TRUE
useSensorielle = TRUE
useLogique = TRUE
drawLogit = TRUE
file = "./log_thomas.txt"
file = "./log_thomas_correct_motrice.txt"

#---------------------------------- fonctions

addVariables <- function(DTLoc,trace = FALSE){
  
  #echec au lieu de succes pour diff c'est mieux
  DTLoc$perdant <- 1-DTLoc$gagnant;
  
  #normalisation de la mise
  DTLoc$miseNorm <- DTLoc$mise / 7;
  
  #difficulte évaluée par le joueur
  DTLoc$evalDiff <- 1 - DTLoc$miseNorm;
  
  #On ajoute une colonne de la difficulte estimee, a partir d'un 
  #logit de la difficulte supposée sur l'échec constaté
  mylogit <- glm(perdant ~ difficulty, data = DTLoc, family = "binomial"(link = "logit"))
  sample = data.frame(difficulty=DTLoc$difficulty)
  DTLoc$estDiff =  predict(mylogit, newdata = sample, type = "response")
  
  if(trace){
    sample = data.frame(difficulty=seq(0, 1, 0.05))
    newres = predict(mylogit, newdata = sample, type = "response")
    plot(DT$difficulty, DT$perdant, xlab="difficulty",  ylab="perdant",  col=rgb(0,100,0,100,maxColorValue=255))
    points(data.frame(sample,newres), type="o")
  }
  
  #erreur d'estimation de la difficulte par le joueur (exces de confiance ?)
  DT$erreurdiff <- DT$evalDiff - DT$estDiff;
  
  return (DTLoc)
}

#---------------------------------- traitement

#on recup les données
csv.data <- read.csv(file,header=TRUE,sep=";")

#difficulte logique
DTL <- csv.data[which(csv.data$nom_du_jeu=="Logique2"),]
DTL <- addVariables(DTL,drawLogit)

#difficulte sensorielle
DTS <- csv.data[which(csv.data$nom_du_jeu=="Sensoriel"),]
DTS <- addVariables(DTS,drawLogit)

#difficulte motrice
DTM <- csv.data[which(csv.data$nom_du_jeu=="Motrice"),]
DTM$difficulty <-  (DTM$difficulty)/ abs(max(DTM$difficulty)) #normalisation difficulte
DTM <- addVariables(DTM,drawLogit)

#creation de la table totale
DT <- data.table()
if(useLogique) DT <- rbind(DT,DTL)
if(useMotrice) DT <- rbind(DT,DTM)
if(useSensorielle) DT <- rbind(DT,DTS)


DTDiffDir <- DT[1,]
DTDiffDir <- cbind(DTDiffDir,data.table(mont="desc"))
for(i in 2:nrow(DT)){
  if(DT[i-1,"difficulty"] > DT[i,"difficulty"]){
    DTDiffDir <- rbind(DTDiffDir,cbind(DT[i,],data.table(mont="desc")))
  }else{
    DTDiffDir <- rbind(DTDiffDir,cbind(DT[i,],data.table(mont="mont")))
  }
}
DT <- DTDiffDir

#DTMiseHaute <- cbind(DT,data.table(miseHaute=0))
#DTMiseHaute = DTMiseHaute[0,]
#for(i in 1:nrow(DT)){
#  if(DT[i,"mise"] > 5){
#    DTMiseHaute <- rbind(DTMiseHaute,cbind(DT[i,],data.table(miseHaute="haute")))
#  }else{
#    DTMiseHaute <- rbind(DTMiseHaute,cbind(DT[i,],data.table(miseHaute="faible")))
#  }
#}
#DT <- DTMiseHaute

DTMiseHaute <- cbind(DT,data.table(miseHaute=0))
DTMiseHaute = DTMiseHaute[0,]
for(i in 1:nrow(DT)){
  if(DT[i,"mise"] > 5){
    DTMiseHaute <- rbind(DTMiseHaute,cbind(DT[i,],data.table(miseHaute="2haute")))
  }else if(DT[i,"mise"] > 2){
    DTMiseHaute <- rbind(DTMiseHaute,cbind(DT[i,],data.table(miseHaute="1moyen")))
  }else{
    DTMiseHaute <- rbind(DTMiseHaute,cbind(DT[i,],data.table(miseHaute="0faible")))
  }
}
DT <- DTMiseHaute

DTNbFail <- DT[1,]
nbFailCpt = 1-DT[1,"gagnant"]
DTNbFail <- cbind(DTNbFail,data.table(nbFail=nbFailCpt))

for(i in 2:nrow(DT)){
  if(DT[i,"gagnant"] == 0){
    nbFailCpt = nbFailCpt+1;

  }else{
    nbFailCpt = 0;
    
  }
  DTNbFail <- rbind(DTNbFail,cbind(DT[i,],data.table(nbFail=nbFailCpt)))
}
DT <- DTNbFail

DTNbWin <- DT[1,]
nbWinCpt = DT[1,"gagnant"]
DTNbWin <- cbind(DTNbWin,data.table(nbWin=nbWinCpt))

for(i in 2:nrow(DT)){
  if(DT[i,"gagnant"] == 1){
    nbWinCpt = nbWinCpt+1;
    
  }else{
    nbWinCpt = 0;
    
  }
  DTNbWin <- rbind(DTNbWin,cbind(DT[i,],data.table(nbWin=nbWinCpt)))
}
DT <- DTNbWin

#garder que les 20 derniers tours de chaque personne
DT <- as.data.table(DT)
setkey(DT, IDjoueur, nom_du_jeu)
#DT <- DT[, tail(.SD, 20), by = key(DT)]
#DT <- DT[, head(.SD, 20), by = key(DT)]

fit <- aov(erreurdiff ~ nbFail, data=DT)
summary(fit)



plot(x=DT$nbWin, y=DT$erreurdiff)

TMP <- DT[, .(meanDiffEstimated=mean(erreurdiff)),by=nbWin]
setkey(TMP, nbWin)
points(y=TMP$meanDiffEstimated, x=TMP$nbWin, col="red", type="o")




#-----------------tracer difficulte

mylogit <- glm(perdant ~ difficulty, data = DT, family = "binomial"(link = "logit"))
summary(mylogit)

sample = data.frame(difficulty=seq(0, 1, 0.05))
newres = predict(mylogit, newdata = sample, type = "response")
plot(DT$difficulty, DT$perdant, xlab="difficulty",  ylab="perdant",  col=rgb(0,100,0,100,maxColorValue=255))
points(data.frame(sample,newres), type="o")





#tbl = table(DT$mont, DT$erreurdiff)
#tbl

#chisq.test(tbl)
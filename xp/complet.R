#install.packages("data.table")
require(data.table)

#----------------------------------- configuration
useMotrice = TRUE
useSensorielle = TRUE
useLogique = TRUE
drawLogit = TRUE
removeTenFirst = FALSE
file = "./log_thomas.txt"
file = "./log_thomas_correct_motrice.txt"

#---------------------------------- fonctions

addVariables <- function(DTLoc,trace = FALSE,titre="noTitle"){
  
  #echec au lieu de succes pour diff c'est mieux
  DTLoc$perdant <- 1-DTLoc$gagnant;
  
  #normalisation de la mise
  DTLoc$miseNorm <- DTLoc$mise / 7;
  
  #difficulte �valu�e par le joueur
  DTLoc$evalDiff <- 1 - DTLoc$miseNorm;
  
  #On ajoute une colonne de la difficulte estimee, a partir d'un 
  #logit de la difficulte suppos�e sur l'�chec constat�
  mylogit <- glm(perdant ~ difficulty, data = DTLoc, family = "binomial"(link = "logit"))
  sample = data.frame(difficulty=DTLoc$difficulty)
  DTLoc$estDiff =  predict(mylogit, newdata = sample, type = "response")
  
  if(trace){
    sample = data.frame(difficulty=seq(0, 1, 0.05))
    newres = predict(mylogit, newdata = sample, type = "response")
    plot(DTLoc$difficulty, DTLoc$perdant, main=titre, xlab="difficulty",  ylab="perdant",  col=rgb(0,100,0,100,maxColorValue=255))
    points(data.frame(sample,newres), type="o")
  }
  
  #erreur d'estimation de la difficulte par le joueur (exces de confiance ?)
  DTLoc$erreurdiff <- DTLoc$evalDiff - DTLoc$estDiff;
  
  #nombre de fail consecutifs
  DTNbFail <- DTLoc[1,]
  nbFailCpt = DTLoc[1,perdant]
  DTNbFail <- cbind(DTNbFail,data.table(nbFail=nbFailCpt))

  for(i in 2:nrow(DTLoc)){
    if(DTLoc[i,gagnant] == 0){
      nbFailCpt = nbFailCpt+1;
    }else{
      nbFailCpt = 0;
    }
    DTNbFail <- rbind(DTNbFail,cbind(DTLoc[i,],data.table(nbFail=nbFailCpt)))
  }
  DTLoc <- DTNbFail
  
  #nombre de wins consecutifs
  DTNbWin <- DTLoc[1,]
  nbWinCpt = DTLoc[1,gagnant]
  DTNbWin <- cbind(DTNbWin,data.table(nbWin=nbWinCpt))
  
  for(i in 2:nrow(DTLoc)){
    if(DTLoc[i,gagnant] == 1){
      nbWinCpt = nbWinCpt+1;
    }else{
      nbWinCpt = 0;
    }
    DTNbWin <- rbind(DTNbWin,cbind(DTLoc[i,],data.table(nbWin=nbWinCpt)))
  }
  DTLoc <- DTNbWin
  
  return (DTLoc)
}

removeHeadTail <- function(DTLoc,nb,bHead=TRUE){
  #garder que les 20 derniers tours de chaque personne
  DTLoc <- as.data.table(DTLoc)
  setkey(DTLoc, IDjoueur, nom_du_jeu, action_de_jeu)
  if(bHead)
    DTLoc <- DTLoc[, tail(.SD, nrow(.SD)-nb), by = .(IDjoueur,nom_du_jeu)]
  else
    DTLoc <- DTLoc[, head(.SD, nrow(.SD)-nb), by = .(IDjoueur,nom_du_jeu)]
  
  
  return(DTLoc)
}

lienErreurEvalDiffFailsRepetes <- function(DTLoc,fails = TRUE,titre="title"){

  if(fails){
    fit <- aov(erreurdiff ~ nbFail, data=DTLoc)
    plot(x=DTLoc$nbFail, y=DTLoc$erreurdiff, main=titre, xlab="Nombre d'�checs cons�cutifs", ylab="Erreur d'estimation de la difficult�")
    TMP <- DTLoc[, .(meanDiffEstimated=mean(erreurdiff)),by=nbFail]
    TMP2 <- DTLoc[, .(varUpDiffEstimated=mean(erreurdiff)+var(erreurdiff)),by=nbFail]
    TMP3 <- DTLoc[, .(varDownDiffEstimated=mean(erreurdiff)-var(erreurdiff)),by=nbFail]
    setkey(TMP,nbFail)
    setkey(TMP2,nbFail)
    setkey(TMP3,nbFail)
    points(y=TMP$meanDiffEstimated, x=TMP$nbFail, col="red", type="o")
    points(y=TMP2$varUpDiffEstimated, x=TMP2$nbFail, col="blue", type="o")
    points(y=TMP3$varDownDiffEstimated, x=TMP3$nbFail, col="blue", type="o")
  }
  else{
    fit <- aov(erreurdiff ~ nbWin, data=DTLoc)
    plot(x=DTLoc$nbWin, y=DTLoc$erreurdiff, main=titre, xlab="Nombre de succ�s cons�cutifs", ylab="Erreur d'estimation de la difficult�")
    TMP <- DTLoc[, .(meanDiffEstimated=mean(erreurdiff)),by=nbWin]
    TMP2 <- DTLoc[, .(varUpDiffEstimated=mean(erreurdiff)+var(erreurdiff)),by=nbWin]
    TMP3 <- DTLoc[, .(varDownDiffEstimated=mean(erreurdiff)-var(erreurdiff)),by=nbWin]
    setkey(TMP,nbWin)
    setkey(TMP2,nbWin)
    setkey(TMP3,nbWin)
    points(y=TMP$meanDiffEstimated, x=TMP$nbWin, col="red", type="o")
    points(y=TMP2$varUpDiffEstimated, x=TMP2$nbWin, col="blue", type="o")
    points(y=TMP3$varDownDiffEstimated, x=TMP3$nbWin, col="blue", type="o")
  }

  return(fit)
}

#---------------------------------- traitement

#Prepa plot
#attach(mtcars)
#par(mfrow=c(5,3))

#on recup les donn�es
csv.data <- read.csv(file,header=TRUE,sep=";")

#difficulte logique
DTL <- csv.data[which(csv.data$nom_du_jeu=="Logique2"),]
DTL <- as.data.table(DTL)
DTL <- addVariables(DTL,drawLogit,titre="Logique")

#difficulte sensorielle
DTS <- csv.data[which(csv.data$nom_du_jeu=="Sensoriel"),]
DTS <- as.data.table(DTS)
DTS <- addVariables(DTS,drawLogit,titre="Sensorielle")

#difficulte motrice
DTM <- csv.data[which(csv.data$nom_du_jeu=="Motrice"),]
DTM <- as.data.table(DTM)
DTM$difficulty <-  (DTM$difficulty)/ abs(max(DTM$difficulty)) #normalisation difficulte
DTM <- addVariables(DTM,drawLogit,titre="Motrice")

#creation de la table totale
DT <- data.table()
if(useLogique) DT <- rbind(DT,DTL)
if(useMotrice) DT <- rbind(DT,DTM)
if(useSensorielle) DT <- rbind(DT,DTS)

#supprimer le debut ou la fin
if(removeTenFirst)
  DT <- removeHeadTail(DT,10);

#lien erreur d'eval diff (esces confiance ?) et fails ou succes r�p�t�s
fit <- lienErreurEvalDiffFailsRepetes(DT,TRUE,"Tous les jeux")
summary(fit)
fit <- lienErreurEvalDiffFailsRepetes(DT,FALSE,"Tous les jeux")
summary(fit)

fit <- lienErreurEvalDiffFailsRepetes(DTL,TRUE,"Logique")
summary(fit)
fit <- lienErreurEvalDiffFailsRepetes(DTL,FALSE,"Logique")
summary(fit)

fit <- lienErreurEvalDiffFailsRepetes(DTM,TRUE,"Motrice")
summary(fit)
fit <- lienErreurEvalDiffFailsRepetes(DTM,FALSE,"Motrice")
summary(fit)

fit <- lienErreurEvalDiffFailsRepetes(DTS,TRUE,"Sensorielle")
summary(fit)
fit <- lienErreurEvalDiffFailsRepetes(DTS,FALSE,"Sensorielle")
summary(fit)


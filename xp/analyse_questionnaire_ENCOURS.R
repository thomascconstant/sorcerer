
#install.packages("data.table")
#install.packages("ggplot2")
#install.packages("xlsx")
#install.packages("plyr")
#install.packages("likert")
library("xlsx")
require(xlsx)
require(data.table)
require(ggplot2)
require(plyr)
require(likert)

#setwd("C:/Users/Thomas Constant/Source/Repos/sorcerer/xp")
file = "./log_questionnaire_XP_WEEK2_REWRITED.xlsx"

#========================================TRAITEMENT
dataQ <- read.xlsx(file,sheetIndex=1,header=TRUE)

#effacer ligne 81 (vide)
dataQ <- dataQ[-c(81), ]

#effacer colonne 37 (vide)
dataQ <- subset(dataQ, select = -37)

#---------------------------------- sexe des participants
#compter les occurences de chacun
CumulMasculin <- table(dataQ$sexe==0)
CumulFeminin <- table(dataQ$sexe==1)

#afficher les résultats
bpSexe <- barplot(CumulMasculin, 
              names.arg=c("Feminin", "Masculin"),
              col = c("lightblue", "lightgreen"),
              xlab="Genre",  
              ylab="Nombre de participants", 
              ylim = c(0, 60))
text(bpSexe, 0, round(CumulMasculin, 1),cex=1,pos=3) 

#---------------------------------- niveau d'étude des participants
#compter les occurences de chacun
counts <- table(dataQ$niveauEtude)
#old
# CumulSansDiplome <- table(dataQ$niveauEtude==0)
# CumulBEPC <- table(dataQ$niveauEtude==1)
# CumulBEPCAP <- table(dataQ$niveauEtude==2)
# CumulBAC <- table(dataQ$niveauEtude==3)
# CumulBAC2 <- table(dataQ$niveauEtude==4)
# CumulBAC3 <- table(dataQ$niveauEtude==5)
# CumulBAC4 <- table(dataQ$niveauEtude==6)
# CumulBAC5 <- table(dataQ$niveauEtude==7)
# CumulBAC8 <- table(dataQ$niveauEtude==8)

#afficher les résultats
bpEtudes <- barplot(counts, main="Niveau d'études", horiz=FALSE,
                    names.arg=c("Aucun", "BEPC", "BEP, CAP", "BAC", "BAC+2", "BAC+3", "BAC+4", "BAC+5", "BAC+8"),
                    legend.text = NULL, beside = TRUE,
                    axes = TRUE, axisnames = TRUE,
                    xlab="Diplômes",  
                    ylab="Répartition selon les participants", 
                    ylim = c(0, 35))
text(bpEtudes, 0, round(counts, 1),cex=1,pos=3) 

#---------------------------------- profil de joueur des participants
#sélectionner uniquement les données qui nous intéressent pour construire le profil
dataProfilJoueurs <- dataQ[,c("profilJoueur1","profilJoueur2","profilJoueur3","profilJoueur4","profilJoueur5","profilJoueur6","profilJoueur7")]

#somme de l'ensemble des données profilJoueur et intégration dans tableau
dataQ$sumProfilJoueur <- rowSums(dataProfilJoueurs, na.rm=TRUE)
# détail du résultat sumProfilJoueur (7 questions sur échelle de Likert de 1 à 5)
# de 7 à 14 : non joueur
# de 15 à 21 : joueur occasionnel
# de 22 à 28 : joueur régulier
# de 29 à 35 : pgm

#moyenne de l'ensemble des données profilJoueur et intégration dans tableau
dataQ$meanProfilJoueur <- rowMeans(dataProfilJoueurs, na.rm=TRUE)

#---------------------------------- sentiment d'auto efficacité (AE) des participants comme joueurs
#sélectionner uniquement les données qui nous intéressent pour construire le sentiment d'AE
dataProfilAE <- dataQ[,c("autoEffJoueur1","autoEffJoueur2","autoEffJoueur3","autoEffJoueur4","autoEffJoueur5","autoEffJoueur6","autoEffJoueur7","autoEffJoueur8","autoEffJoueur9","autoEffJoueur10")]

#somme de l'ensemble des données du sentiment d'auto efficacité et intégration dans tableau
dataQ$sumProfilAE <- rowSums(dataProfilAE, na.rm=TRUE)
# détail du résultat sumProfilAE (10 questions sur échelle de Likert de 1 à 5)
# 0 : n'a pas répondu au questionnaire, ne se considère pas comme joueur (réponse à profilJoueur8)
# de 10 à 20 : sentiment AE faible
# de 21 à 30 : sentiment AE moyen
# de 31 à 40 : sentiment AE fort
# de 41 à 50 : sentiment AE très fort (à regrouper ?)

#moyenne de l'ensemble des données du sentiment d'auto efficacité et intégration dans tableau
dataQ$meanProfilAE <- rowMeans(dataProfilAE, na.rm=TRUE)


#---------------------------------- aversion au risque (RA) des participants
#sélectionner uniquement les données qui nous intéressent pour construire le sentiment d'AE
dataProfilRA <- dataQ[,c("loterie1","loterie2","loterie3","loterie4","loterie5","loterie6","loterie7","loterie8","loterie9","loterie10")]

#somme de l'ensemble des données du test d'aversion au risque et intégration dans tableau
dataQ$sumProfilRA <- rowSums(dataProfilRA, na.rm=TRUE)
# nombre de choix sûrs
# 0-1 : highly risk loving
# 2 : very risk loving
# 3 : risk loving
# 4 : risk neutral
# 5 : slightly risk averse
# 6 : risk averse
# 7 : very risk averse
# 8 : highly risk avers
# 9-10 : max choix sûr


#========================================TESTS A LA C** EN COURS
dataProfilJoueurs$freq <- apply(dataProfilJoueurs,1,table)

 
apply(dataProfilJoueurs,1,table) 

df <- as.data.frame(apply(dataProfilJoueurs,1,table))
summary(df)



table(dataProfilJoueurs)

tapply(dataProfilJoueurs, max)

apply(iris.x, 2, function(x) tapply(x, iris.s, mean))


attach(dataQ)
#dataProfilJoueurs <- dataQ[order(IDjoueur, profilJoueur2, profilJoueur3, profilJoueur4, profilJoueur5, profilJoueur6, profilJoueur7),]

table(dataProfilJoueurs)
summary(table)
data.frame(table(dataProfilJoueurs))

count(data, c('IDjoueur', 'profilJoueur1', 'profilJoueur2', 'profilJoueur3', 'profilJoueur4', 'profilJoueur5', 'profilJoueur6', 'profilJoueur7'))

# data$countProfilJoueurIs1 <- ave(data$profilJoueur1, data$IDjoueur,  FUN = seq_along)
# 
# data %>% group_by(profilJoueur1, profilJoueur2) %>% mutate(count = n())
# 
# names(which.max(table(data$profilJoueur2)))

table(data$IDjoueur, data$profilJoueur2)
counts[which.max(data$profilJoueur2)]

# setDT(dataProfilJoueurs)[, count:=.N, by = .(data.IDjoueur, data.profilJoueur1)]

#setDT(data)[profilJoueur1==2, count.2:=1:.N, by=IDjoueur][]

#========================================OLD MY FRIEND
#---------------------------------- fonctions
Unaccent <- function(text) {
  text <- gsub("['`^~\"]", " ", text)
  text <- iconv(text, to="ASCII//TRANSLIT//IGNORE")
  text <- gsub("['`^~\"]", "", text)
  return(text)
}

TrueOrFalse <- function(Sexe) {
  Sexe <- gsub("Feminin", 1, Sexe)
  Sexe <- gsub("Masculin", 0, Sexe)
  return(Sexe)
}

clean <- function(ttt){
  as.numeric( gsub('Feminin', '1', gsub('Masculin', '0', ttt)))
}

pyramide <- function(data,laxis,raxis) {
  par(cex=0.8)
  a<-as.character(data$A); m<-data$M; f<-data$F
  ff<- -f
  ll<- -laxis
  op<-par(mfrow=c(1,2),omi=c(0,0,0,0),ps=18,xaxt="s",cex=0.8)
  
  par(mar=c(4,2,3,1.5))
  
  barplot(ff,
          horiz=T,main="Femmes",
          space=0,
          col="grey",
          xlim=c(min(ll),0),
          axes=F,
          axisnames=F,
          cex.axis =0.7,
          xaxt="n")
  
  axis(1,
       at=ll,
       labels=formatC(laxis,format="d"), 
       cex.axis =0.7)
  
  par(mar=c(4,2,3,2), xaxt="s")
  
  barplot(m,
          horiz=T,
          main="Hommes",
          space=0,col="grey",
          xlim=c(0,max(raxis)),
          axes=T,axisnames=T, 
          cex.axis =0.7)
  
  axis(2,
       at=c(1:NROW(a))-0.5,
       labels=formatC(a,format="s"),
       pos=-2,
       las=1,tcl=0,
       lty=0, 
       cex.axis =0.5) 
  par(op)
}

#---------------------------------- code
data <- read.xlsx(file,sheetIndex=1,header=TRUE,)
data2 <- data.frame(data$Sexe)
data.sexeMasculin = data[which(data$Sexe=="Masculin"),]
data.sexeFeminin = data[which(data$Sexe=="Feminin"),]

CountMasculin <- sort(data$Sexe=="Masculin")
TotalMasculin <- sum(CountMasculin)
CountFeminin <- sort(data$Sexe=="Feminin")
TotalFeminin <- sum(CountFeminin)

#transformer Feminin en 1 et Masculin en 0
dataSexe <- sapply(data2, clean)

#compter les occurences de chacun
CumulMasculin <- table(dataSexe==0)
CumulFeminin <- table(dataSexe==1)

bp <- barplot(CumulMasculin, 
              names.arg=c("Feminin", "Masculin"),
              col = c("lightblue", "lightgreen"),
              xlab="Genre",  
              ylab="Nombre de participants", 
              ylim = c(0, 60))

bp <- barplot(CumulMasculin, 
              names.arg=c("Feminin", "Masculin"),
              col = c("lightblue", "lightgreen"),
              xlab="Genre",  
              ylab="Nombre de participants", 
              ylim = c(0, 60), 
              text(bp, 0, round(CumulMasculin, 1), cex=2, pos=3))

#dataSexe <- TrueOrFalse(data)


#vieux code moisi
length(which(data.sexeMasculin == "Masculin"))

occurences<-table(unlist(data))
data.occurences = occurences

barplot(data.sexeFeminin)
barplot(data.sexeFeminin, data.sexeMasculin, xlab="feminin",  ylab="masculin")

#data2 <- Unaccent(data)


#================Tests likert
require(likert)

question1 <- data.frame(data$column8)
likert(data, summary, grouping = NULL, factors = NULL, importance,
       nlevels = length(levels(items[, 1])))

euro <- "\u20AC"
euro

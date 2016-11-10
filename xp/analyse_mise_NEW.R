DT2 <- DT
DT2[, lag_mise:=c(NA,mise[1:(length(mise)-1)]), by=c("difficulty", "nom_du_jeu", "IDjoueur")]
DT2[, passage:=1:.N, by=c("difficulty", "nom_du_jeu", "IDjoueur")]

#setwd("C:/Users/Thomas Constant/Source/Repos/sorcerer/xp")
# write.csv(DT2, file = "./log_thomas_XPFINALES_WEEK2_RMODIF.csv", quote = FALSE, 
#           eol = "\n", na = "NA", row.names = TRUE,
#           fileEncoding = "CP1252")

#================vérifier si différence de niveau entre les joueurs par le nombre de moutons sauvés et tués
library(lme4) #nécessite package Matrix
require(data.table)
require(ggplot2)

#DT2maxMoutons <- pmax(DT2$moutons_sauves:DT2$IDjoueur, na.rm = FALSE)

#logique <- DT2[DT2$nom_du_jeu == "Logique2",]
#senso <- DT2[DT2$nom_du_jeu == "Sensoriel",]
#motrice <- DT2[DT2$nom_du_jeu == "Motrice",]

motriceNiveauxJoueurs = data.table();
motriceNiveauxJoueurs = DTM[,.(type="Moteur",totalMoutonsSauves=max(moutons_sauves),totalMoutonsTues=max(moutons_tues)),by=IDjoueur]
sensoNiveauxJoueurs = data.table();
sensoNiveauxJoueurs = DTM[,.(type="Sensorielle",totalMoutonsSauves=max(moutons_sauves),totalMoutonsTues=max(moutons_tues)),by=IDjoueur]
logiqueNiveauxJoueurs = data.table();
logiqueNiveauxJoueurs = DTM[,.(type="Logique",totalMoutonsSauves=max(moutons_sauves),totalMoutonsTues=max(moutons_tues)),by=IDjoueur]

#calcul niveau des joueurs par jeu Senso
niveauxJoueursSenso <- glmer(cbind(totalMoutonsSauves,totalMoutonsTues) ~ 1 + (1|IDjoueur),
                       data = sensoNiveauxJoueurs, family = binomial)

summary(niveauxJoueursSenso)
fixef(niveauxJoueursSenso)
ranef(niveauxJoueursSenso, condVar = TRUE) #permet d'observer les différences de niveau

#calcul niveau des joueurs par jeu Logique
niveauxJoueursLogique <- glmer(cbind(totalMoutonsSauves,totalMoutonsTues) ~ 1 + (1|IDjoueur),
                             data = logiqueNiveauxJoueurs, family = binomial)

summary(niveauxJoueursLogique)
fixef(niveauxJoueursLogique)
ranef(niveauxJoueursLogique, condVar = TRUE) #permet d'observer les différences de niveau

#calcul niveau des joueurs par jeu Motrice
niveauxJoueursMotrice <- glmer(cbind(totalMoutonsSauves,totalMoutonsTues) ~ 1 + (1|IDjoueur),
                             data = motriceNiveauxJoueurs, family = binomial)

summary(niveauxJoueursMotrice)
fixef(niveauxJoueursMotrice)
ranef(niveauxJoueursMotrice, condVar = TRUE) #permet d'observer les différences de niveau

#================vérifier si différence de niveau entre les joueurs par le nombre de win et fail
library(lme4) #nécessite package Matrix
require(data.table)
require(ggplot2)

niveauxJoueursWF = data.table();
niveauxJoueursWF = DT[,.(totalWin=sum(gagnant),totalFail=sum(perdant)),by=c("IDjoueur","nom_du_jeu")]

#calcul niveau des joueurs par jeu
niveauxJoueursALLWF <- glmer(cbind(1*totalWin,1*totalFail) ~ nom_du_jeu + (1|IDjoueur),
                               data = niveauxJoueursWF, family = binomial)

summary(niveauxJoueursALLWF)
ranef(niveauxJoueursALLWF, condVar = TRUE)

motriceNiveauxJoueursWF = data.table();
motriceNiveauxJoueursWF = DTM[,.(type="Moteur",totalWin=sum(gagnant),totalFail=sum(perdant)),by=IDjoueur]
sensoNiveauxJoueursWF = data.table();
sensoNiveauxJoueursWF = DTM[,.(type="Sensorielle",totalWin=sum(gagnant),totalFail=sum(perdant)),by=IDjoueur]
logiqueNiveauxJoueursWF = data.table();
logiqueNiveauxJoueursWF = DTM[,.(type="Logique",totalWin=sum(gagnant),totalFail=sum(perdant)),by=IDjoueur]

#calcul niveau des joueurs par jeu Senso
niveauxJoueursSensoWF <- glmer(cbind(10*totalWin,10*totalFail) ~ (1|IDjoueur),
                             data = sensoNiveauxJoueursWF, family = binomial)

summary(niveauxJoueursSensoWF)
fixef(niveauxJoueursSensoWF)
ranef(niveauxJoueursSensoWF, condVar = TRUE) #permet d'observer les différences de niveau

#calcul niveau des joueurs par jeu Logique
niveauxJoueursLogiqueWF <- glmer(cbind(totalWin,totalFail) ~ 1 + (1|IDjoueur),
                               data = logiqueNiveauxJoueursWF, family = binomial)

summary(niveauxJoueursLogiqueWF)
fixef(niveauxJoueursLogiqueWF)
ranef(niveauxJoueursLogiqueWF, condVar = TRUE) #permet d'observer les différences de niveau

#calcul niveau des joueurs par jeu Motrice
niveauxJoueursMotriceWF <- glmer(cbind(totalWin,totalFail) ~ 1 + (1|IDjoueur),
                               data = motriceNiveauxJoueursWF, family = binomial)

summary(niveauxJoueursMotriceWF)
fixef(niveauxJoueursMotriceWF)
ranef(niveauxJoueursMotriceWF, condVar = TRUE) #permet d'observer les différences de niveau



#================calculs mises
DTMb


library(reshape2)
joueur <- DT2[DT2$IDjoueur==DT2$IDjoueur[1]]
DT3 <- dcast(joueur,  nom_du_jeu + passage ~ difficulty, value.var = "mise",fun.aggregate=sum)

View(DT3[DT3$nom_du_jeu=="Logique2",])

# sachant gagnant
joueur <- DT2[DT2$IDjoueur==DT2$IDjoueur[1] & DT2$nbWin>=1 ]
gagnant <- dcast(joueur,  nom_du_jeu + passage ~ difficulty, value.var = "mise",fun.aggregate=sum)
View(gagnant[gagnant$nom_du_jeu=="Logique2",])

# sachant perdant
joueur <- DT2[DT2$IDjoueur==DT2$IDjoueur[1] & DT2$nbFail>=1 ]
perdant <- dcast(joueur,  nom_du_jeu + passage ~ difficulty, value.var = "mise",fun.aggregate=sum)
View(perdant[perdant$nom_du_jeu=="Logique2",])

#normalisation resLisseBase
DT2$resLisseBaseNorm <- DT2$resLisseBase / 2.5

#limiter set de données au 15 premiers tours
DT15t <- DT[which(DT$action_de_jeu <= 15),]

#limiter set de données au 15 derniers tours
DT15tH <- DT[which(DT$action_de_jeu >= 15),]

#erreur d'estimation de la difficulte par le joueur sur les 15 premiers tours (exces de confiance ?)
DT15t$erreurdiff <- DT15t$evalDiff - DT15t$estDiff

#ne garder que l'erreur de diff positive
excesconfiance <- DT[which(DT$erreurdiff > 0),]
library(glm2)
modelEDC <- glm2(formula = gagnant ~ evalDiff + nbWin, data = excesconfiance)
summary(modelEDC)
anova(modelEDC)

#ne garder que l'erreur de diff negative
manqueconfiance <- DT[which(DT$erreurdiff < 0),]
library(glm2)
modelMDC <- glm2(formula = gagnant ~ evalDiff + nbFail, data = manqueconfiance)
summary(modelMDC)
anova(modelMDC)

#=====================other stuff

library(glm2)
model <- glm2(formula = estDiff ~ erreurdiff + gagnant, data = DT)
print(model)
summary(model)
coef(model)
anova(model)
plot(model)
plot(anova(model))

#install.packages("ResourceSelection")
library(ResourceSelection)
hoslem.test(DT$gagnant, fitted(model))

DTM1P <- DTM[DTM$IDjoueur==DTM$IDjoueur[31]]

model2 <- glm(perdant ~ difficulty, data = DTM1P, family = "binomial"(link = "logit"))
print(model2)
summary(model2)
plot(model2)

sample = data.frame(difficulty=seq(0, 1, 0.05))
newres = predict(model2, newdata = sample, type = "response")
plot(DTM1P$difficulty, DTM1P$perdant, xlab="Difficulté hypothétique",  ylab="Difficulté objective (estimée)",  col=rgb(0,100,0,100,maxColorValue=255))
points(data.frame(sample,newres), type="o")


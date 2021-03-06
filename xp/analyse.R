#install.packages("data.table")
require(data.table)

csv.data <- read.csv("./log_thomas.txt",header=TRUE,sep=";")

#csv.data = csv.data[which(csv.data$nom_du_jeu=="Sensoriel" & csv.data$diff<0.0075),]
csv.data = csv.data[which(csv.data$nom_du_jeu=="Logique2"),]

# Keep only last sequence element
#DT <- as.data.table(csv.data)
#setkey(DT, IDjoueur, nom_du_jeu)
#logique <- DT[nom_du_jeu=="Logique2"]
#logique <- logique[, tail(.SD, 1), by = key(DT)]
#DT <- DT[nom_du_jeu!="Logique"]
#DT <- rbind(logique, DT)
#logique
#dataDiff <- logique[,c("difficulty","gagnant")]


dataDiff <- csv.data[,c("difficulty","gagnant")]

dataDiffSample <- dataDiff[sample(1:nrow(dataDiff), nrow(dataDiff)*0.99, replace=FALSE),] 

mylogit <- glm(gagnant ~ difficulty + mise, data = csv.data, family = "binomial"(link = "logit"))

sample = data.frame(difficulty=seq(0, 1, 0.05))
newres = predict(mylogit, newdata = sample, type = "response")
plot(data.frame(sample,newres))

summary(mylogit)

#coef(mylogit)

curve(predict(mylogit, data.frame(difficulty=x), type="resp"), add=TRUE, col="red")

#comparaison des datas win et fail
#install.packages("plotrix")
require(plotrix)

dataDiffWin <- csv.data[which(csv.data$gagnant=="1"),]
dataDiffFail <- csv.data[which(csv.data$gagnant=="0"),]

dataDiffWin <- logique[which(csv.data$gagnant=="1"),]
dataDiffFail <- logique[which(csv.data$gagnant=="0"),]

l <- list(dataDiffFail$diff,dataDiffWin$diff)
multhist(l)


#summary(csv.data)
summary(mylogit)
#confint(mylogit)
#wald.test(b = coef(mylogit), Sigma = vcov(mylogit), Terms = 4:6)

#plot(mylogit)



#--------------------------------
DT <- csv.data
mylogit <- glm(gagnant ~ difficulty, data = DT, family = "binomial"(link = "logit"))

sample = data.frame(difficulty=seq(0, 1, 0.05))
newres = predict(mylogit, newdata = sample, type = "response")
plot(DT$difficulty, DT$gagnant, xlab="difficulty",  ylab="gagnant",  col=rgb(0,100,0,20,maxColorValue=255))
points(data.frame(sample,newres), type="l")

summary(mylogit)


#------- Mise -------
DT <- csv.data
mylogit <- glm(gagnant ~ mise, data = DT, family = "binomial"(link = "logit"))
summary(mylogit)

sample = data.frame(mise=seq(1, 7, 1))
newres = predict(mylogit, newdata = sample, type = "response")
plot(DT$mise, DT$difficulty, xlab="mise",  ylab="difficulty",  col=rgb(0,100,0,150,maxColorValue=255))
points(data.frame(sample,newres), type="l")


l <- list(csv.data$diff)
multhist(l)


#------------- histogrammes des mises
DT <- csv.data
dataMise1 <- DT[which(DT$mise=="1"),]
dataMise2 <- DT[which(DT$mise=="2"),]
dataMise3 <- DT[which(DT$mise=="3"),]
dataMise4 <- DT[which(DT$mise=="4"),]
dataMise5 <- DT[which(DT$mise=="5"),]
dataMise6 <- DT[which(DT$mise=="6"),]
dataMise7 <- DT[which(DT$mise=="7"),]

l <- list(dataMise1$diff,dataMise2$diff,dataMise3$diff,dataMise4$diff,dataMise5$diff,dataMise6$diff,dataMise7$diff)
multhist(l)

#------------- histogrammes des mises groupes
dataMise1 <- csv.data[which(csv.data$mise=="1"),]
dataMise23 <- csv.data[which(csv.data$mise=="2" & csv.data$mise=="3"),]
dataMise4 <- csv.data[which(csv.data$mise=="4"),]
dataMise56 <- csv.data[which(csv.data$mise=="5") & csv.data$mise=="6",]
dataMise7 <- csv.data[which(csv.data$mise=="7"),]


l <- list(dataMise1$diff,dataMise23$diff,dataMise4$diff,dataMise56$diff,dataMise7$diff)
multhist(l)

#------------- histogrammes des mises
DT <- csv.data[which(csv.data$gagnant=="1"),]
dataMiseWin1 <- DT[which(DT$mise=="1"),]
dataMiseWin7 <- DT[which(DT$mise=="7"),]

DT <- csv.data[which(csv.data$gagnant=="0"),]
dataMiseFail1 <- DT[which(DT$mise=="1"),]
dataMiseFail7 <- DT[which(DT$mise=="7"),]

l <- list(dataMiseWin1$diff,dataMiseWin7$diff,dataMiseFail1$diff,dataMiseFail7$diff)
multhist(l)

#------------- chi2 confiance
csv.data <- read.csv("./log_thomas.txt",header=TRUE,sep=";")
#DT <- csv.data[which(csv.data$nom_du_jeu=="Logique2"),]
DT <- csv.data[which(csv.data$nom_du_jeu=="Sensoriel"),]
#DT <- csv.data[which(csv.data$nom_du_jeu=="Motrice"),]
#DT <- csv.data

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

#garder que les 20 derniers tours de chaque personne
DT <- as.data.table(DT)
setkey(DT, IDjoueur, nom_du_jeu)
DT <- DT[, tail(.SD, 20), by = key(DT)]

tbl = table(DT$mont, DT$miseHaute)
tbl

chisq.test(tbl)





setwd("C:/Users/Thomas Constant/Source/Repos/sorcerer/xp")

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
mylogit <- glm(difficulty ~ mise, data = DT, family = "binomial"(link = "logit"))
summary(mylogit)

sample = data.frame(mise=seq(1, 7, 1))
newres = predict(mylogit, newdata = sample, type = "response")
plot(DT$mise, DT$difficulty, xlab="mise",  ylab="difficulty",  col=rgb(0,100,0,20,maxColorValue=255))
points(data.frame(sample,newres), type="l")

#------- Mise * Diff * Tours -------
#install.packages("rgl") # installer la librairie
library(rgl) # lancer la librairie
plot3d(DT$action_de_jeu, DT$mise, DT$difficulty, type="s",col="red",xlab="tours",ylab="mise",zlab="difficulte")
ellipse <- ellipse3d(cov(cbind(DT$action_de_jeu,DT$mise,DT$difficulty)), centre=c(mean(DT$action_de_jeu), mean(DT$mise), mean(DT$difficulty)), level = 0.5) 
plot3d(ellipse, col = "blue", alpha = 0.4, add = TRUE, type="shade")

dev.print(jpeg,filename="image.jpg",quality=100,units="px",width=2500,res=300) #pour enregristrer en jpg, possible avec pdf

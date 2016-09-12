#install.packages("data.table")
require(data.table)

csv.data <- read.csv("./log_thomas.txt",header=TRUE,sep=";")

#csv.data = csv.data[which(csv.data$nom_du_jeu=="Sensoriel" & csv.data$diff<0.0075),]
csv.data = csv.data[which(csv.data$nom_du_jeu=="Logique"),]

# Keep only last sequence element
DT <- as.data.table(csv.data)
setkey(DT, IDjoueur, nom_du_jeu, sequence)
logique <- DT[nom_du_jeu=="Logique"]
logique <- logique[, tail(.SD, 1), by = key(DT)]
#DT <- DT[nom_du_jeu!="Logique"]
#DT <- rbind(logique, DT)
#logique
dataDiff <- logique[,c("diff","win")]


dataDiff <- csv.data[,c("diff","win")]

dataDiffSample <- dataDiff[sample(1:nrow(dataDiff), nrow(dataDiff)*0.99, replace=FALSE),] 

mylogit <- glm(win ~ diff, data = dataDiffSample, family = "binomial"(link = "logit"))

sample = data.frame(diff=seq(1, 10, 0.25))
newres = predict(mylogit, newdata = sample, type = "response")
plot(data.frame(sample,newres))

summary(mylogit)

#coef(mylogit)

#plot(dataDiff$diff, dataDiff$win, xlab="Diff",  ylab="win",  col=rgb(0,100,0,20,maxColorValue=255))
curve(predict(mylogit, data.frame(diff=x), type="resp"), add=TRUE, col="red")

#comparaison des datas win et fail
#install.packages("plotrix")
require(plotrix)

dataDiffWin <- csv.data[which(csv.data$win=="1"),]
dataDiffFail <- csv.data[which(csv.data$win=="0"),]

dataDiffWin <- logique[which(csv.data$win=="1"),]
dataDiffFail <- logique[which(csv.data$win=="0"),]

l <- list(dataDiffFail$diff,dataDiffWin$diff)
multhist(l)


#summary(csv.data)
summary(mylogit)
#confint(mylogit)
#wald.test(b = coef(mylogit), Sigma = vcov(mylogit), Terms = 4:6)

#plot(mylogit)




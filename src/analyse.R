
csv.data <- read.csv("./log.txt",header=TRUE,sep=";")

dataDiff <- csv.data[,c("diff","win")]

dataDiffSample <- dataDiff[sample(1:nrow(dataDiff), nrow(dataDiff)*0.95, replace=FALSE),] 
#dataDiffSample <- dataDiff[sample(1:nrow(dataDiff), 80, replace=FALSE),] 

mylogit <- glm(win ~ diff, data = dataDiffSample, family = "binomial"(link = "logit"))

sample = data.frame(diff=seq(1, 20, 0.25))
newres = predict(mylogit, newdata = sample, type = "response")
plot(data.frame(sample,newres))

summary(mylogit)

#coef(mylogit)

#plot(dataDiff$diff, dataDiff$win, xlab="Diff",  ylab="win")
#curve(predict(mylogit, data.frame(diff=x), type="resp"), add=TRUE, col="red")





#summary(csv.data)
#summary(mylogit)
#confint(mylogit)
#wald.test(b = coef(mylogit), Sigma = vcov(mylogit), Terms = 4:6)
#plot(mylogit)


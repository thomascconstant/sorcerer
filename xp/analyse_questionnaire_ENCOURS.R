
#install.packages("data.table")
#install.packages("ggplot2")
#install.packages("xlsx")
library("xlsx")
require(xlsx)
require(data.table)
require(ggplot2)

#setwd("C:/Users/Thomas Constant/Source/Repos/sorcerer/xp")
file = "./log_questionnaire_XP_WEEK1ANDWEEK2.xlsx"

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


#install.packages("data.table")
#install.packages("ggplot2")
#install.packages("xlsx")
library("xlsx")
require(xlsx)
require(data.table)
require(ggplot2)

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

#---------------------------------- code
data <- read.xlsx(file,sheetIndex=1,header=TRUE)
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

euro <- "\u20AC"
euro

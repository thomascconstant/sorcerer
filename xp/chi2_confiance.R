#install.packages("data.table")
require(data.table)

csv.data <- read.csv("./log_thomas.txt",header=TRUE,sep=";")
#DT <- csv.data[which(csv.data$nom_du_jeu=="Logique2"),]
#DT <- csv.data[which(csv.data$nom_du_jeu=="Sensoriel"),]
#DT <- csv.data[which(csv.data$nom_du_jeu=="Motrice"),]
DT <- csv.data


#normalisation de la mise
DT$miseNorm <- DT$mise / 7;
DT$evalDiff <- 1 - DT$miseNorm;
DT$erreurdiff <- DT$difficulty - DT$evalDiff;

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
#DT <- DT[, tail(.SD, 20), by = key(DT)]
#DT <- DT[, head(.SD, 20), by = key(DT)]

tbl = table(DT$mont, DT$miseHaute)
tbl

chisq.test(tbl)
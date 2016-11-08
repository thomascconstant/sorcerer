DT2 <- DT
DT2[, lag_mise:=c(NA,mise[1:(length(mise)-1)]), by=c("difficulty", "nom_du_jeu", "IDjoueur")]
DT2[, passage:=1:.N, by=c("difficulty", "nom_du_jeu", "IDjoueur")]

#setwd("C:/Users/Thomas Constant/Source/Repos/sorcerer/xp")
# write.csv(DT2, file = "./log_thomas_XPFINALES_WEEK2_RMODIF.csv", quote = FALSE, 
#           eol = "\n", na = "NA", row.names = TRUE,
#           fileEncoding = "CP1252")


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

model2 <- glm2(gagnant ~ estDiff + nb, data = DT, family = "binomial"(link = "logit"))
print(model2)
summary(model2)

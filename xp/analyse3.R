setwd("C:/Users/Thomas Constant/Source/Repos/sorcerer/xp")

#install.packages("data.table")
#install.packages("ggplot2")
require(data.table)
require(ggplot2)

csv.data <- read.csv("./log_thomas.txt",header=TRUE,sep=";")

plot()
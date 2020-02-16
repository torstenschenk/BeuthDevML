#install the packages if required
require(neuralnet)
require(NHANES)
require(ROCR)

#Select the variables we want to use and omit the rows with missing values. 
Diabetes<-data.frame(NHANES[,c("Diabetes","Gender","Race1","BMI","Age","Pulse","BPSysAve","BPDiaAve","HealthGen","DaysPhysHlthBad","DaysMentHlthBad","LittleInterest","Depressed")])
Diabetes<-na.omit(Diabetes)
names(Diabetes)
dim(Diabetes)

n<-nrow(Diabetes)

table(Diabetes$Gender)
table(Diabetes$Race1)

#convert factor variables to binary 0s and 1s using model.matrix
m <- as.data.frame(model.matrix(~Diabetes+Gender+Race1+BMI+Age+Pulse+BPSysAve+BPDiaAve+HealthGen+
                                  DaysPhysHlthBad+DaysMentHlthBad+LittleInterest+Depressed,
                                data = Diabetes ))

table(Diabetes$Race1,m$Race1Hispanic)
names(m)
head(m)
#drop column called (Intercept)
m<-m[,-1]


# creating training and validation set and scaling
set.seed(70)
valididx<-sample(n,1500)


max = apply(m[-valididx , ], 2 , max)
min = apply(m[-valididx , ], 2 , min)
DiabetesNN = as.data.frame(scale(m, center = min, scale = max - min))
trainNN =DiabetesNN[-valididx , ]  
validNN =DiabetesNN[valididx , ]




#The formula specification is long, so define it here and save it to a "formula object".
form <- as.formula("DiabetesYes~Gendermale+Race1Hispanic+Race1Mexican+Race1White+Race1Other+
                   BMI+Age+Pulse+BPSysAve+BPDiaAve+HealthGenVgood+HealthGenGood+
                   HealthGenFair+HealthGenPoor+DaysPhysHlthBad+DaysMentHlthBad+
                   LittleInterestSeveral+LittleInterestMost+DepressedSeveral+DepressedMost" )
#run the neural net (takes about 1 minute)
set.seed(71)
NN=neuralnet(form,data=trainNN,hidden=3,linear.output= F,lifesign = "full",threshold=0.01)


plot(NN,rep="best")

##get the predicted probabilities for the valid data set
predict_validNN = compute(NN, validNN)$net.result

boxplot(predict_validNN)

#Misclassification table
table(predict_validNN>0.5,validNN$DiabetesYes)
table(predict_validNN>0.2,validNN$DiabetesYes)

#calculate the RM-squared error los for the valid data set
RMSENN1<-sqrt(mean((predict_validNN-validNN$DiabetesYes)^2))
RMSENN1

#function to plot the ROC amd print the AUC
rocplot=function(pred, truth, ...){
  predob = ROCR::prediction(pred, truth)
  perf = ROCR::performance(predob, "tpr","fpr")
    plot(perf,...)
    text(0.9,0.01,paste("AUC: ",round(performance(predob, measure = "auc")@y.values[[1]],4)))
}


rocplot(predict_validNN,validNN$DiabetesYes)




###try different configurations
NN=neuralnet(form,data=trainNN,hidden=c(3,3),linear.output= F,lifesign = "full",threshold=0.1)
predict_validNN = compute(NN, validNN)$net.result
rocplot(predict_validNN,validNN$DiabetesYes)


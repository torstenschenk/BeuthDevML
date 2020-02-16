library(RSNNS)  #you will probably need to install these packages.
library(dplyr)



tt<-read.csv("shampoo-sales.csv",sep=";")
head(tt)


plot(tt$Sales, type = "l")



#Normalise the time series data
xseries<-normalizeData(tt$Sales,type="0_1")

#We'll be using the functions lag() and lead() to shape the data
lead(1:10,2)
lag(1:10,2)

#############################################################
#exercise 2
###NN with no time delay operator, one step ahead forecasting
D<-0  #number of time delays
K<-1  #K step ahead forecasting
n<-length(xseries)

xinput<-xseries[1:(n-K)]
y<-lead(xseries,1)[1:(n-K)]



hidden<-1
nn <- mlp(x=xinput,y=y,
          size = hidden,
          linOut = FALSE,
          inputsTest = as.matrix(xinput),
          targetsTest = y, 
          maxit = 350)
plotIterativeError(nn)


#predict and mlp expect the input data to be in matrix form
preds <- predict(nn,as.matrix(xinput))
plotRegressionError(fitted.values(nn), y)

plot(y, type = "l")
lines(preds,col=2)

rmse<-sqrt(mean((preds-y)^2));print(rmse)
#try other values for hidden 



###with one time delay operator, one step ahead forecasting
D<-1
K<-1
#xinput data as a matrix
xinput<-cbind(xseries,lead(xseries,1))[1:(n-D-K),]
y<-lead(xseries,D+K)[1:(n-D-K)]

#add NN code here


###with two time delay operators, one step ahead forecasting
D<-2
K<-1


###with two time delay operators, and two step ahead forecasting
D<-2
K<-2
xinput<-cbind(xseries,lead(xseries,1),lead(xseries,2))[1:(n-D-K),]
y<-cbind(lead(xseries,3),lead(xseries,4))[1:(n-D-K),]


######################################
#Ex. 3 sunspot data
#######################################
tt<-read.csv("sunspots.csv",sep=";")
head(tt)

#now that we have actual month and year data we can coerce the text into a variable with class "Date"
#and plot it as a time series 
tt$Date<- as.Date(paste(tt$Month,"-01",sep=""),format="%Y-%m-%d")
plot(Sunspots ~ Date, tt, type = "l")

#Normalize the time series
xseries<-???


###with no time delay operator, one step ahead forecasting
D<-0
K<-1
 
##split the dat so that the first 2000 values are the training set and the rest are the validation set



hidden<-1
nn <- mlp(x=xinput.train,y=y.train,
          size = hidden,
          inputsTest = xinput.val,
          targetsTest = y.val, 
          linOut = TRUE,
          maxit = 100)

preds <- predict(nn,as.matrix(xinput.val))



###with one time delay operator, one step ahead forecasting
D<-1
K<-1


###with two time delay operators, one step ahead forecasting
D<-2
K<-1


###with three time delay operators, one step ahead forecasting
D<-3
K<-1





########################################
#EX 4.recurrent neural networks rnn
########################################



##elman model

modelElman <- elman(x=xinput.train,y=y.train,
                    size = 1,
                    learnFuncParams = c(0.1),  inputsTest = as.matrix(xinput.val),
                    targetsTest = y.val, 
                    linOut = FALSE,maxit = 100)

plotIterativeError(modelElman)

preds <- predict(modelElman,as.matrix(xinput.val))




##jordan model
modelJordan <- jordan(x=xinput.train,y=y.train,
                      size = 1, 
                      learnFuncParams = c(0.1),  inputsTest = as.matrix(xinput.val),
                      targetsTest = y.val, 
                      linOut = FALSE,maxit = 100)

plotIterativeError(modelJordan)
preds <- predict(modelJordan,as.matrix(xinput.val))



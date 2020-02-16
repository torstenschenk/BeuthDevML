##Workshop 7: Projection pursuit regression

library(MASS)

# Exercise 1 
# Simulating data to inversigate ppr

# Define a matrix of random normal values in 2 dimensions corresponding to 
# 50 observations  and2 variables X[,1] and X[,2] 
set.seed(1)
X<-matrix(rnorm(100,0,5),50,2)
plot(X,pch=16,asp=1)


#define two direction vectors omega1 and omega2
omega1<- c(0.6,0.8)
sum(omega1^2)

omega2<- c(-0.5,sqrt(1-0.5^2))
omega2
sum(omega2^2)


#take the scalar products of each omega and the rows of X
V<-matrix(NA,50,2)
V[,1]<- omega1[1]*X[,1]+omega1[2]*X[,2]
V[,2]<- omega?[?]*X[,?]+omega2[?]*X[,?]

#plot the line defined by omega1
abline(c(0,omega1[2]/omega?[?]))
#and add the origin in green
points(0,0,pch=16,col=3)

#we'll look in more deatail at what the value of V[,1] means by taking the 43rd observation
i<-42
points(X[i,1],X[i,2],pch=16,col=2)

##the following calculates the coordinates for the projection of the ith point onto the line
px<-omega1[1]*(omega1[1]*X[i,1]+omega1[2]*X[i,2])
py<- -omega1[2]*(-omega1[1]*X[i,1]-omega1[2]*X[i,2])
points(px,py,col=2)

  
##print the coordinates and the distance to the origin, the last value is the ith value ovf V[,1] 
print(round(c(px,py,sqrt(px^2+py^2),V[i,1]),3))

#The last two values are equal up to the sign, indicating that V[,1] is the the distance along 
#the projectiopn line. 

#repeat the above for a couple of arbitrary values of i (between 1 aand 50)

#Add a for loop to the above code so that all 50 projection points are plotted 

#Now lets look at the second direction
#plot the line defined by omega2
abline(c(0,omega?[?]/omega?[?]))

i<-42
points(X[i,1],X[i,2],pch=16,col=4)

##the following calculates the coordinates for the projection of the ith point onto the line
px<-omega?[?]*(omega?[?]*X[i,1]+omega?[?]*X[i,2])
py<- -omega?[?]*(-omega?[?]*X[i,1]-omega?[?]*X[i,2])
points(px,py,col=4)

##print the coordinates and the distance to the origin, the last value is the ith value ovf V[,2] 
print(round(c(px,py,??,V[i,2]),3))


#Add a for loop to the above code so that all 50 projection points are plotted 

#
# generate an outcome variable ytrue and perturb it with a bit of 
#random noise giving out observed vector y
ytrue<-3+3.1*log(V[,1]+15)+0.05*V[,2]^2
y<-ytrue+rnorm(50,0,0.5)

# investigate y graphically
boxplot(y)

plot(V[,1],y)
plot(V[,2],y)

plot(X[,1],y)
plot(X[,2],y)

#lets see if projection pursuit can find the projections and theform of the regression 
#knowing that there should be 2 terms in the formula
ppr.obj <- ppr(y ~ X,nterms = 2)
summary(ppr.obj)

#output just the direction vectors
ppr.obj$?
##how well do the projections that ppr() has found match up with our omega vectors?
#make a note the value of goodness of fit for the next part 

#how good is the fit? calculate the MSE, and make a note of it. 
sum((ppr.obj$fitted-ytrue)^2)/50

#now plot the two estimated ridge functions
plot(ppr.obj,ask=TRUE)

##the quadratic part is estimated well. The logarithm function is not too bad but is wavy in the central part.
## The reason why the log function is left to right reversed is because alpha:term2 is the negative of our omega1.

#Can we do better if we allow more terms?
ppr.obj2 <- ppr(y ~ X,nterms = 3)
summary(ppr.obj2)

plot(ppr.obj2,ask=TRUE)

#how good is the MSE?
sum((ppr.obj2$fitted-ytrue)^2)/50

#the fit to the true values is worse with three ridge functions than with two.


###exercise 2
#Analysing the Auto data set
library(ISLR)
dim(Auto)
names(Auto)

#create  a training data set
set.seed(1)
train <- sample(1:392, 300 )
traindata<-Auto[train,]
ppr.obj <- ppr(mpg ~ cylinders+displacement+horsepower+weight+acceleration+year,data=traindata,nterms = 2)
summary(ppr.obj)


#We will now see how the MSE depends on the number of terms 
mse<-rep(NA,10)
for(i in 1:10){
  ppr.obj <- ppr(mpg ~ cylinders+displacement+horsepower+weight+acceleration+year,data=traindata,nterms = i,max.terms=10)
  mse[i]<-mean((ppr.obj$fitted-traindata$mpg)^2)
}
mse
plot(1:10,mse,type="b")

#choose the number of terms (rige functions) that you think is appropriate 

ppr.obj <- ppr(mpg ~ cylinders+displacement+horsepower+weight+acceleration+year,data=traindata,nterms = 4)
summary(ppr.obj)

plot(ppr.obj,ask=TRUE)
#calculate the MSE
mean((ppr.obj$fitted-traindata$mpg)^2)

#calculate the MSE on the test data 
test.ppr<-predict(ppr.obj,Auto[-train,])
mean((Auto[-train,"mpg"]-test.ppr)^2)

#compare with a regression tree model (without tweaking the model)
library(rpart)
Auto.tree <- rpart(mpg ~ cylinders+displacement+horsepower+weight+acceleration+year,
                 data=traindata)


test.tree<-predict(Auto.tree,Auto[-train,])
mean((Auto[-train,"mpg"]-test.tree)^2)

#which is better?
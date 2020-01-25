####R-Test: Model solution for Session A
##Note that the model solution for session B is the same only using DataB.
##The exercises were the same but the data was different, and the CheckValue function 
##was different.
###########################################


##Tim Downie
##Matriculation Number 999999

load(file="RTestA.Rda")
loaded()

#Exercise 1
#a)
dim(DataA)
#b)
names(DataA)
#c)
mean(DataA$distance)
#d)
sd(DataA$distance)
#e)
quantile(DataA$distance,c(0.1,0.9))
#f)
hist(DataA$distance,main="Histogram of Distance",xlab="Distance (Km)")
#g)
table(DataA$vehicle)
#h) No R code required. Vehicle is a nominal variable
#i)
boxplot(distance~vehicle,data=DataA)
#j)
table(DataA$passengers,DataA$vehicle)

#Exercise 2
## The first function, with a for loop
moment1<-function(x,m=3)
{
  n<-length(x)
  s<-0
  for(i in 1:length(x)) s<-s+(x[i]-mean(x))^m
  s/n
}

#obtain the output values for the third and fourth moment for distance
moment1(DataA$distance)
moment1(DataA$distance,4)

## The second function without a loop
moment2<-function(x,m=3) sum((x-mean(x))^m/length(x))
##check the results are the same
moment2(DataA$distance)
moment2(DataA$distance,4)

#Finishing off
CheckValue(999999)



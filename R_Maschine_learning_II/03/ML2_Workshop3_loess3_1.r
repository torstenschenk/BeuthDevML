#the definintion of the tricube weight function
K<-function(d,maxd) ifelse(maxd>d,(1 - (abs(d)/maxd)^3)^3,0)


#define your x variable
x<-???
#define your outcome variable variable
y<-???  

#loess parameter
span<-0.4
#the x value to estimate f(x) using local regression 
x0<-???
n<-length(x)
ninwindow<-round(span*n)


#we need to find the distance to the furthest point within the window
windowdist<-sort(abs(x-x0))[ninwindow]

#calculate the weights using the Kernelfunction above. 
#If the distance is greater than window distance the weight will be zero
weight<-K(abs(???),???)



#fit a weighted linear regression 
lmx0<-lm(y~x,weights=weight)

prx0=predict(lmx0,newdata=list(x=x0))
plot(x,y)
abline(lmx0)
points(x0,prx0,col=2,pch=16)


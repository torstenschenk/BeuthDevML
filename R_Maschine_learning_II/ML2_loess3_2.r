#the definintion of the tricube weight function
K<-function(d,maxd) ifelse(maxd>d,(1 - (abs(d)/maxd)^3)^3,0)

#define your x variable
x<-???
#define your outcome variable variable
y<-??? 
  
##define x.grid the output coordinates for the loess curve
x.grid<-seq(min(x),???,length=100)  
  
  
span<-0.4
n<-???
ninwindow<-round(span*n)
yloess<-rep(0,length(x.grid))
for(i in 1:length(x.grid)){
  x0<-x.grid[i] 
  windowdist<-???
  weight<-???

  lmx0<-lm(???~???,weights=???)
  
  yloess[???]<-predict(lmx0,data.frame(x=x0))
  
}

plot(x,y)
lines(x.grid, ???,col ="blue")

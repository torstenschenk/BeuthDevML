################workshop 8 

#import the provided data
load(file="Pathname/NNdatasets.Rda")


###################
#Exercise 1
# First of all scale the data 
#scale the training data
x1sc<-scale(x1)
x2sc<-scale(x2)
ysc<-scale(y)

#scale the test data
#note we have to scale using the transformations used for the test data 

x1testsc<-(x1test-attr(x1sc,"scaled:center"))/attr(x1sc,"scaled:scale")
x2testsc<-(x2test-attr(x2sc,"scaled:center"))/attr(x2sc,"scaled:scale")
ytestsc<-(ytest-attr(ysc,"scaled:center"))/attr(ysc,"scaled:scale")




#define the sigmoid function which is not in the base version of R 
sigmoid<-function(v) 1/(1+???(-v))


NN<-function(param,x1sc,x2sc)
{
  #  This function is the neural network
  #Input data is x1 and x2
  #weights are in the param vector 
  
  ## unpick the param vector
  whl11<-param[1]
  whl12<-param[2]
  bhl1<-param[3]
  wol1<-param[4]
  bol<-param[5]
  
  #  hidden layer
  z1<-whl11*x1sc+whl12*x2sc+bhl1
  # activation
  a1<-sigmoid(z1)
  
  #output layer
  a2<-wol1*a1+bol
  #  print(c(z1,a1,a2))
  #  browser()
  return(a2)
}  


#initialise parameters
whl11.curr<-0.01
whl12.curr<--0.01
bhl1.curr<-0.05
wol1.curr<-0.01
bol.curr<--0.05
n<-length(x1sc)

bestSSE<-Inf
niter<-10
window<-0.5
for(iter in 1:niter){
  #We update parameter in turn and select the update if it gives a lower SSE   
  
  Delta<-rep(0,5)  #initialise the change vector
  # define which parameter to perturb
  j<- (iter %% 5) +1
  
  #  window<-max(window*0.999,0.001) #for later reduce the window size incrementally
  
  Delta[j]<-rnorm(1,0,window) #generate the change in parameter and assign it
  
  #define the new parameter vector 
  whl11<-whl11.curr+Delta[1]
  whl12<-whl12.curr+Delta[2]
  bhl1<-bhl1.curr+Delta[3]
  wol1<-wol1.curr+Delta[4]
  bol<-bol.curr+Delta[5]
  
  
  
  #  fitted<-rep(NA,n)
  #call NN for each observation
  fitted<-NN(c(whl11,whl12,bhl1,wol1,bol),x1sc,x2sc)
  #loss function
  SSE<-sum((fitted-ysc)^2)
  
  #if SSE is better, then update 
  if(SSE<bestSSE){
    whl11.curr<-whl11
    whl12.curr<-whl12
    bhl1.curr<-bhl1
    wol1.curr<-wol1
    bol.curr<-bol
    bestSSE<-SSE
    best.fitted<-fitted
    
    #print(bestSSE)
  }
  
  
}
print(bestSSE)
plot(ysc,best.fitted);abline(c(0,1))

#niter<-40000
#source("NN_Source_file1.R")


#for the "best" parameter vector obtain the predicted values
test.predicted<-NN(c(whl11.curr,whl12.curr,bhl1.curr,wol1.curr,bol.curr),x1testsc,x2testsc)
testSSE<-sum((test.predicted-ytestsc)^2)
print(testSSE)


plot(ytestsc,test.predicted);abline(c(0,1))
#note that these are for the scaled data, the genuine predictions have to be unscaled
plot(ytest,test.predicted*attr(ysc,"scaled:scale")+attr(ysc,"scaled:center"));abline(c(0,1))


#The current parameters are
whl11.curr
whl12.curr
bhl1.curr
wol1.curr
bol.curr


######################################
##Things to try
##run the code to get better values
##adapt: more iterations
##slowly reduce window size


##############
#Exercise 2
#We will add a second node to the hidden layer

NN2<-function(param,x1sc,x2sc)
{
  #  This function is the neural network
  #Input data is x1 and x2
  #weights are in the param vector 
  
  ## unpick the param vector
  whl11<-param[1]
  whl12<-param[2]
  whl21<-param[3]
  whl22<-param[4]
  bhl1<-param[5]
  bhl2<-param[6]
  wol1<-param[7]
  wol2<-param[8]
  bol<-param[9]
  
  #  hidden layer
  z1<-whl11*x1sc+whl12*x2sc+bhl1
  z2<-???
  # activation
  a11<-sigmoid(z1)
  a12<-sigmoid(???)
  
  #output layer
  a2<-wol1*a11+wol2*a12+bol
  return(a2)
}  

#initialise parameters
whl11.curr<-0.01
whl12.curr<--0.02
whl21.curr<--0.01
whl22.curr<-0.02
bhl1.curr<-0.01
bhl2.curr<--0.01
wol1.curr<- -0.01
wol2.curr<-0.01
bol.curr<-0


bestSSE<-Inf

niter<-20
window<-0.5
for(iter in 1:niter){
  #We update parameter in turn and select the update if it gives a lower SSE   
  
  Delta<-rep(0,9)  #initialise the change vector
  # define which parameter
  j<- (iter %% 9) +1
  
  #  window<-max(window*0.99,0.001) #for later
  
  Delta[j]<-rnorm(1,0,window) #generate the change in parameter and assign it
  whl11<-whl11.curr+Delta[1]
  whl12<-whl12.curr+Delta[2]
  whl21<-whl21.curr+Delta[3]
  whl22<-whl22.curr+Delta[4]
  bhl1<-bhl1.curr+Delta[5]
  bhl2<-bhl2.curr+Delta[6]
  wol1<-wol1.curr+Delta[7]
  wol2<-wol2.curr+Delta[8]
  bol<-bol.curr+Delta[9]
  
  param<-c(whl11,whl12,whl21,whl22,bhl1,bhl2,wol1,wol2,bol)
  
  fitted<-rep(NA,n)
  #call NN for each observation
  for(i in 1:n) fitted[i]<-NN2(param,x1sc[i],x2sc[i])
  
  
  SSE<-sum((???-ysc)???)
  
  #if SSE is better update 
  if(SSE<bestSSE){
    whl11.curr<-whl11
    whl12.curr<-whl12
    whl21.curr<-whl21
    whl22.curr<-whl22
    bhl1.curr<-bhl1
    bhl2.curr<-bhl2
    wol1.curr<-wol1
    wol2.curr<-wol2
    bol.curr<-bol
    bestSSE<-SSE
    best.fitted<-fitted
    
    #print(bestSSE)
  }
  
  
}
print(bestSSE)
plot(ysc,best.fitted);abline(c(0,1))


test.predicted<-rep(NA,20)
for(i in 1:n) test.predicted[i]<-NN2(c(whl11.curr,whl12.curr,whl21.curr,whl22.curr,bhl1.curr,bhl2.curr,wol1.curr,wol2.curr,
                                       bol.curr),x1testsc[i],x2testsc[i])
testSSE<-sum((test.predicted-ytestsc)^2)
print(testSSE)


#The current parameters are
whl11.curr
whl12.curr
whl21.curr
whl22.curr
bhl1.curr
bhl2.curr
wol1.curr
wol2.curr
bol.curr



#####
#exercise 3  classifier NN with K=3


# First of all scale the data 
#scale the training data
xcl1sc<-scale(xcl1)
xcl2sc<-scale(xcl2)

#We do not need to scale the output 
table(ycl)


#scale the test data
#note we have to scale using the transformations used for the test data 

xcl1testsc<-(xcl1test-attr(xcl1sc,"scaled:center"))/attr(xcl1sc,"scaled:scale")
xcl2testsc<-(xcl2test-attr(xcl2sc,"scaled:center"))/attr(xcl2sc,"scaled:scale")

table(ycltest)


NN3<-function(param,xcl1sc,xcl2sc)
{
  #  This function is the neural network
  #Input data is xcl1sc and xcl2sc
  #weights are in the param vector 
  
  ## unpick the param vector
  whl11<-param[1]
  whl12<-param[2]
  whl21<-param[3]
  whl22<-param[4]
  bhl1<-param[5]
  bhl2<-param[6]
  wol11<-param[7]
  wol12<-param[8]
  wol21<-param[9]
  wol22<-param[10]
  wol31<-param[11]
  wol32<-param[12]
  bol1<-param[13]
  bol2<-param[14]
  bol3<-param[15]
  
  #  hidden layer
  z1<-whl11*xcl1sc+whl12*xcl2sc+bhl1
  z2<-???
  # activation
  a11<-sigmoid(???)
  a12<-???
  
  #output layer
  a21<-sigmoid(wol11*a11+wol12*a12+bol1)
  a22<-???
  a23<-???
  
  #and produce the fitted probabilities
  pimat<-t(apply(cbind(a21,a22,a23),1,function(x) x/sum(x))) ##calculates the proportions for each row
  
  return(pimat)
}  



#initialise parameters
whl11.curr<-0.01
whl12.curr<--0.01
whl21.curr<-0.011
whl22.curr<--0.011
bhl1.curr<-0.01
bhl2.curr<---0.01
wol11.curr<-0.013
wol12.curr<--0.004
wol21.curr<--0.005
wol22.curr<-0.01
wol31.curr<--0.013
wol32.curr<-0.014
bol1.curr<-0.01
bol2.curr<-0.02
bol3.curr<- -0.1
n<-length(xcl1)

#initialise
fitted.probs<-matrix(1/3,n,3)
bestLoss<-Inf

niter<-20
window<-0.5
for(iter in 1:niter){
  #We update parameter in turn and select the update if it gives a lower SSE   
  
  Delta<-rep(0,15)  #initialise the change vector
  # define which parameter
  j<- (iter %% 15) +1
  
  ## window<-max(window*0.999,0.001) #for later
  
  Delta[j]<-rnorm(1,0,window) #generate the change in parameter and assign it
  
  whl11<-whl11.curr+Delta[1]
  whl12<-whl12.curr+Delta[2]
  whl21<-whl21.curr+Delta[3]
  whl22<-whl22.curr+Delta[4]
  bhl1<-bhl1.curr+Delta[5]
  bhl2<-bhl2.curr+Delta[6]
  wol11<-wol11.curr+Delta[7]
  wol12<-wol12.curr+Delta[8]
  wol21<-wol21.curr+Delta[9]
  wol22<-wol22.curr+Delta[10]
  wol31<-wol31.curr+Delta[11]
  wol32<-wol32.curr+Delta[12]
  bol1<-bol1.curr+Delta[13]
  bol2<-bol2.curr+Delta[14]
  bol3<-bol3.curr+Delta[15]
  
  param<-c(whl11,whl12,whl21,whl22,bhl1,bhl2,  wol11,
           wol12,wol21,wol22,wol31,wol32,bol1,bol2,bol3)
  
  
  
  
  
  #call NN for each observation
  for(i in 1:n) fitted.probs[i,]<-NN3(param,xcl1sc[i],xcl2sc[i])
  #  fitted.probs<-NN3b(param,xcl1,xcl2)
  
  Loss<-rep(NA,n)
  Loss[ycl==1]<- -log(fitted.probs[ycl==1,1])
  Loss[ycl==2]<- -log(fitted.probs[ycl==2,2])
  Loss[ycl==3]<- -log(fitted.probs[ycl==3,3])
  
  sumLoss<-sum(Loss)
  
  #if sumLoss is better, update 
  if(sumLoss<bestLoss){
    whl11.curr<-whl11
    whl12.curr<-whl12
    whl21.curr<-whl21
    whl22.curr<-whl22
    bhl1.curr<-bhl1
    bhl2.curr<-bhl2
    wol11.curr<-wol11
    wol12.curr<-wol12
    wol21.curr<-wol21
    wol22.curr<-wol22
    wol31.curr<-wol31
    wol32.curr<-wol32
    bol1.curr<-bol1
    bol2.curr<-bol2
    bol3.curr<-bol3
    bestLoss<-sumLoss
    best.fitted.probs<-fitted.probs
    #print(bestLoss)
  }
  #  if(iter %% 500 == 0) 
  #    {
  #    for(i in 1:ntest) test.fitted.probs[i,]<-NN3(param,xcl1testsc[i],xcl2testsc[i])
  #    testLoss<-rep(NA,n)
  #    testLoss[ycltest==1]<- -log(test.fitted.probs[ycltest==1,1])
  #    testLoss[ycltest==2]<- -log(test.fitted.probs[ycltest==2,2])
  #    testLoss[ycltest==3]<- -log(test.fitted.probs[ycltest==3,3])
  #    print(round(c(bestLoss,sum(testLoss)),5))
  #  }
}
print(bestLoss)


##a stripchart of the current probabilities of the true outcome
stripchart((best.fitted.probs[cbind(1:n,ycl)]~ycl))
##the mean of those values (we want this to be large)
mean(best.fitted.probs[cbind(1:n,ycl)])


##get the prdicted outcomes
pred.ycl<-apply(best.fitted.probs,1,which.max)
table(ycl,pred.ycl)


#look at the test data set
ntest<-length(????)
test.fitted.probs<-matrix(1/3,ntest,3)
for(i in 1:ntest) test.fitted.probs[i,]<-NN3(param,xcl1testsc[i],xcl2testsc[i])



pred.ycltest<-apply(test.fitted.probs,1,which.max)
table(ycltest,pred.ycltest) 




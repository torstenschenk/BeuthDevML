##The up to date version of mxnet has to be installed from the specified source, 
## and requires the package htmltools. 

if (!require(htmltools)) {
   install.packages("htmltools")
   require(htmltools)
}  
  
  
install.packages("https://s3.ca-central-1.amazonaws.com/jeremiedb/share/mxnet/CPU/mxnet.zip", repos = NULL)
require(mxnet)

##Now load/install the package mlbench
##containing "benchmark data sets for machine learning"
if (!require(mlbench)) {
  install.packages("mlbench")
  require(mlbench)
}


####exercise 1 simple example
#load the Sonar dataset suitable for a binary classifier
data(Sonar, package="mlbench")
##read the help page
browseURL("https://www.rdocumentation.org/packages/mlbench/versions/2.1-1/topics/Sonar")

dim(Sonar)
Sonar[,61] = as.numeric(Sonar[,61])-1
train.ind = c(1:50, 100:150)
train.x = data.matrix(Sonar[train.ind, 1:60])
train.y = Sonar[train.ind, 61]
test.x = data.matrix(Sonar[-train.ind, 1:60])
test.y = Sonar[-train.ind, 61]


#For a simple mlp use mx.mlp()
ctx<-mx.cpu()
mx.set.seed(0)
model <- mx.mlp(train.x, train.y, hidden_node=10, out_node=2, out_activation="softmax",
                num.round=20, array.batch.size=15, learning.rate=0.07, momentum=0.9,
                array.layout="rowmajor", eval.metric=mx.metric.accuracy,ctx=ctx)

#Create a diagram of the NN
graph.viz(model$symbol)

#Get the predictions and look at the results 
preds = predict(model, test.x)
pred.label = max.col(t(preds))-1

class_mat = table(pred.label, test.y)
print(class_mat)
cat("Testing accuracy rate=", sum(diag(class_mat))/sum(class_mat))


#####the usual approach in mx-net is to define each stage/layer in using the relevant functions and 
### linking them together in a chain using the object names.

#define the NN structure
chain.data <- mx.symbol.Variable("data")
chain.fc1 <- mx.symbol.FullyConnected(chain.data,name="FC layer", num_hidden=10)
chain.sm <- mx.symbol.SoftmaxOutput(chain.fc1, name="Output layer")
graph.viz(chain.sm)

#train the NN to the data
mx.set.seed(1)
model1 <- mx.model.FeedForward.create(chain.sm, X=train.x, y=train.y,
                                      num.round=20, array.batch.size=15, learning.rate=0.07, momentum=0.9,
                                      array.layout="rowmajor", eval.metric=mx.metric.accuracy,ctx=ctx)
                                      
##obtain the results
preds = predict(model1, test.x,array.layout="rowmajor")
pred.label = max.col(t(preds))-1
class_mat = table(pred.label, test.y)
print(class_mat)
cat("Testing accuracy rate=", sum(diag(class_mat))/sum(class_mat))



##########if we want two hidden layers then we add an activation layer and another fully connected layer
chain.data <- mx.symbol.Variable("data")
chain.fc1 <- mx.symbol.FullyConnected(chain.data,name="FC layer 1", num_hidden=10)
chain.act1<- mx.symbol.Activation(chain.fc1, name="act1", act.type="tanh")
chain.fc2 <- mx.symbol.FullyConnected(chain.act1, name="FC layer 2",num_hidden=10)
chain.sm <- mx.symbol.SoftmaxOutput(chain.fc2, name="Output layer")
graph.viz(chain.sm)
mx.set.seed(2)
model1 <- mx.model.FeedForward.create(chain.sm, X=train.x, y=train.y,
                                      num.round=20, array.batch.size=15, learning.rate=0.07, momentum=0.9,
                                      array.layout="rowmajor", eval.metric=mx.metric.accuracy,ctx=ctx)

preds = predict(model1, test.x)
pred.label = max.col(t(preds))-1
class_mat = table(pred.label, test.y)
print(class_mat)
cat("Testing accuracy rate=", sum(diag(class_mat))/sum(class_mat))




##########Exercise 2 image data



load("Mypath/mnist.Rdata")

train.x<- t(mnist$train$x[1:10000,])
train.y<- mnist$train$y[1:10000]


test.x<- t(mnist$test$x[1:5000,])
test.y<- mnist$test$y[1:5000]



#Every image is represented as a single row in train/test.

train.x <- data.matrix(train.x)
test.x <- data.matrix(test.x)


#a frequency table for the labels
table(train.y)


###a fully connected model for the data (not using the spatial information)
data <- mx.symbol.Variable("data")
fc1 <- mx.symbol.FullyConnected(data, name="fc1", num_hidden=128)
act1 <- mx.symbol.Activation(fc1, name="relu1", act_type="relu")
fc2 <- mx.symbol.FullyConnected(act1, name="fc2", num_hidden=64)
act2 <- mx.symbol.Activation(fc2, name="relu2", act_type="relu")
fc3 <- mx.symbol.FullyConnected(act2, name="fc3", num_hidden=10)
mxmodel <- mx.symbol.SoftmaxOutput(fc3, name="sm")

#Create a diagram of the NN
graph.viz(mxmodel)

#Train the NN to the data 
mx.set.seed(0)
model <- mx.model.FeedForward.create(mxmodel, X = train.x, y = train.y, num.round = 10,
                                     array.batch.size = 100,
                                     array.layout="colmajor",
                                     learning.rate = 0.07, momentum = 0.9,
                                     eval.metric = mx.metric.accuracy,
                                     initializer = mx.init.uniform(0.07))

#Get the predictions and look at the results 
preds <- predict(model, test.x)
dim(preds)
##preds is a matrix with probabilities of each class.  
##look at the prediction for the first observation
plot(0:9,preds[,1],type="b")
###it looks like it's a seven


i<-1
img = as.raster(t(matrix(1-test.x[,i], nrow = 28)))
plot(NA, xlim = 0:1, ylim = 0:1, xaxt = "n", yaxt = "n", bty = "n",ylab="",xlab="")
rasterImage(img, -0.04, -0.04, 1.04, 1.04)#, interpolate=TRUE)
text(0.05, 0.95, test.y[i], col = "blue", cex = 1.5)
###also looks like a seven


pred.label <- max.col(t(preds)) - 1
table(pred.label)
class_mat_1 = table(pred.label, test.y)
print(class_mat_1)
cat("Testing accuracy rate =", sum(diag(class_mat_1))/sum(class_mat_1))


#####now  use two convolutions with pooling 
#(note that this optimises the weights rather than uses a feature detector) 

data <- mx.symbol.Variable('data')
# first conv layer
conv1 <- mx.symbol.Convolution(data=data, kernel=c(5,5), num_filter=20)
relu1 <- mx.symbol.Activation(data=conv1, act_type="relu")
pool1 <- mx.symbol.Pooling(data=relu1, pool_type="max",
                           kernel=c(2,2), stride=c(2,2))
# second conv layer
conv2 <- mx.symbol.Convolution(data=pool1, kernel=c(5,5), num_filter=50)
relu2 <- mx.symbol.Activation(data=conv2, act_type="relu")
pool2 <- mx.symbol.Pooling(data=relu2, pool_type="max",
                           kernel=c(2,2), stride=c(2,2))
# first fully connected layer
flatten <- mx.symbol.Flatten(data=pool2)
fc1 <- mx.symbol.FullyConnected(data=flatten, num_hidden=500)
relu3 <- mx.symbol.Activation(data=fc1, act_type="relu")
# second  fully connected layer
fc2 <- mx.symbol.FullyConnected(data=relu3, num_hidden=10)
# loss
lenet <- mx.symbol.SoftmaxOutput(data=fc2)

### we need to put the dat into array format
train.array <- train.x
dim(train.array) <- c(28, 28, 1, ncol(train.x))
test.array <- test.x
dim(test.array) <- c(28, 28, 1, ncol(test.x))

graph.viz(lenet)

lenet_model <- mx.model.FeedForward.create(lenet, X = train.array, y = train.y, num.round = 8,
                                     array.batch.size = 100,
                                     array.layout="colmajor",
                                     learning.rate = 0.07, momentum = 0.9,
                                     eval.metric = mx.metric.accuracy,
                                     initializer = mx.init.uniform(0.07))

## much slower takes about 2 minutes on a mid-level laptop.
preds <- predict(lenet_model, test.array)
pred.label <- max.col(t(preds)) - 1
class_mat_2 = table(pred.label, test.y)
print(class_mat_2)
cat("Testing accuracy rate fc model=", sum(diag(class_mat_1))/sum(class_mat_1))
cat("Testing accuracy rate le-net model=", sum(diag(class_mat_2))/sum(class_mat_2))

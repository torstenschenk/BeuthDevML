# comment here!!!
setwd("~/Documents/beuth_WS_1920/BeuthDevML/R_Maschine_learning_II/Rfiles")
# This is a very simple program that illustrates the value of comments.
# It starts by asking the user to input their name ...
#username <- readline(prompt="Please input your name: ")
# ... and then it says hello to them, personally.
#cat(paste("Hello, ",username,"!\n",sep=""))
# test
#dat <- c(3,3,3)
#print(dat)

x <-seq(-5,5,0.1)
y <-x^2
plot(x,y,type='l') # "lines" is obsolete, use "l"

#dev.copy(jpeg,"quadratic.jpg",quality=95) # or jpeg
#plot(x,y,type='l')
#dev.off()
#dev.copy(postscript,"quadratic.ps",paper="a4",horizontal=TRUE)
#dev.off()

# example to install package
#install.packages("packagename")

import numpy as np
import cv2
import glob
from sklearn import svm
import matplotlib.pyplot as plt

# show plot first run
#%matplotlib inline 
# test autocompletion with tab or tab+shift
#%config IPCompleter.greedy=True 

############################################################
#
#              Support Vector Machine
#              Image Classification
#
############################################################

def show_image(img):
    """
    Shows an image (img) using matplotlib
    """
    if isinstance(img, np.ndarray):
        if img.shape[-1] == 3 or img.shape[-1] == 4:
            plt.imshow(img[...,:3])
        if img.shape[-1] == 1 or img.shape[-1] > 4:
            plt.imshow(img[:,:], cmap="gray")
        plt.show()


# 1. Implement a SIFT feature extraction for a set of training images ./images/db/train/** (see 2.3 image retrieval)
# use 256x256 keypoints on each image with subwindow of 15x15px
def create_keypoints(w, h):
    keypoints = []
    keypointSize = 15
    numkeypoints = 15
        
    offset = int(keypointSize/2)
    p_h = np.linspace(offset,h-offset, numkeypoints)
    print(p_h)
    p_w = np.linspace(offset,w-offset, numkeypoints)
    print(p_w)
    point_h=p_h.astype(int)
    point_w=p_w.astype(int)
    
    #print(point_h)
    #print(point_w)
    
    # YOUR CODE HERE
    for r in point_h:
        for c in point_w:
            #print(r,c)
            keypoints.append(cv2.KeyPoint(r,c, keypointSize))
    
    return keypoints

# 1. preprocessing and load
allimg = glob.glob('./images/db/train/*/*.jpg')
images = glob.glob('./images/db/train/**')
labelstr = ['car', 'flower', 'face']
X = []
Y = []

test_images = glob.glob('./images/db/*/*.jpg')
# 2. create keypoints on a regular grid (cv2.KeyPoint(r, c, keypointSize), as keypoint size use e.g. 11)
keypoints = create_keypoints(256, 256)
#print(len(keypoints))

# 2. each descriptor (set of features) need to be flattened in one vector
# That means you need a X_train matrix containing a shape of (num_train_images, num_keypoints*num_entry_per_keypoint)
# num_entry_per_keypoint = histogram orientations as talked about in class
# You also need a y_train vector containing the labels encoded as integers


loopc = 0
sift = cv2.xfeatures2d.SIFT_create()
for idx,name in enumerate(images):
    trainset = glob.glob(name+'/*')
    #print(trainset)
    for n, img in enumerate(trainset):
        Y = np.append(Y,idx)
        #img_set_train.append(cv2.imread(name))
        timg = cv2.imread(img)
        key,des = sift.compute(timg,keypoints)
        #descriptors.append(des)
        if idx+n == 0:
            X = np.ravel(des,order='C')
            continue

        b = np.ravel(des,order='C')
        X = np.vstack((X,b)) 
        #print(X.shape)


# 3. We use scikit-learn to train a SVM classifier - however you need to test with different kernel options to get
# good results for our dataset.
clf = svm.SVC(gamma='scale')
clf.fit(X, Y)

# 4. We test on a variety of test images ./images/db/test/ by extracting an image descriptor
# the same way we did for the training (except for a single image now) and use .predict()
# to classify the image
#print(allimg)

for idx,timg in enumerate(test_images):
#for idx,timg in enumerate(allimg):
    timg = cv2.imread(timg)
    key,des = sift.compute(timg,keypoints)
    Xpred = np.ravel(des,order='C')
    # 5. output the class + corresponding name
    show_image(timg)
    print( labelstr[ int( clf.predict([Xpred]) ) ])
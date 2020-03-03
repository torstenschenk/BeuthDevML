import cv2 as cv
import numpy as np


from mpl_toolkits.mplot3d import axes3d
import matplotlib.pyplot as plt

# tiffile example
#import tifffile



img_list = []
foldname = 'exp_edge_gripper/'
#foldname = 'exp_edge_button/'

for i in range(3):
    num =str(i)
    file_name = num.zfill(2) 
    print(foldname+file_name + '.tiff')
    img = cv.imread(foldname+file_name + '.tiff',cv.IMREAD_ANYCOLOR | cv.IMREAD_ANYDEPTH)

    # swap color channels to XYZ
    #XYZimg = img[:,:,::-1]
    #print(rgbimg.shape)
    #cv.imshow("TIF opencv swap: rgb", img)
    #cv.waitKey(0)
    #cv.destroyWindow("TIF opencv swap: rgb")

    img_list.append(img)
    
print('loaded img:',len(img_list))

img = img_list[0]
x = img[:,:,2]
y = img[:,:,1]
z = img[:,:,0]
idx = z > 1.0
#print(idx.shape)
Xp = x[idx]
Yp = y[idx]
Zp = z[idx]
#print(Zp.shape)
 
Op = np.ones((Xp.shape[0]))
print(Xp.shape)
print(Yp.shape)
print(Op.shape)
Atmp = np.vstack([Xp,Yp,Op])
print(type(Atmp))

    
b = np.matrix(Zp).T
A = np.matrix(Atmp.T)
print(A.shape)

fit = (A.T * A).I * A.T * b
errors = b - A * fit
residual = np.linalg.norm(errors)

print ("solution:")
print ("%f x + %f y + %f = z" % (fit[0], fit[1], fit[2]))
print ("errors:",errors)
print ("residual:",residual)


# plot plane
# plot raw data
#plt.figure()
plt.figure(figsize=(20,10))
ax = plt.subplot(111, projection='3d')
ax.scatter(Xp, Yp, Zp, color='g')

xlim = ax.get_xlim()
ylim = ax.get_ylim()
X,Y = np.meshgrid(np.arange(xlim[0], xlim[1]),
                  np.arange(ylim[0], ylim[1]))
Z = np.zeros(X.shape)
for r in range(X.shape[0]):
    for c in range(X.shape[1]):
        Z[r,c] = fit[0] * X[r,c] + fit[1] * Y[r,c] + fit[2]
ax.plot_wireframe(X,Y,Z, color='grey')

ax.set_xlabel('x')
ax.set_ylabel('y')
ax.set_zlabel('z')

# rotate the axes and update
for angle in range(0, 360, 10):
    ax.view_init(30, angle)
    plt.draw()
    plt.pause(.001)


#plt.show()










#fig = plt.figure()
#ax = fig.add_subplot(111, projection='3d')

# load some test data for demonstration and plot a wireframe
#X, Y, Z = axes3d.get_test_data(0.1)
#ax.plot_wireframe(X, Y, Z, rstride=5, cstride=5)

# rotate the axes and update
#for angle in range(0, 360):
#    ax.view_init(30, angle)
#    plt.draw()
#    plt.pause(.001)

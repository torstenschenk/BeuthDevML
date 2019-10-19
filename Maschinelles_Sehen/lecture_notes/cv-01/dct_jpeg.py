import numpy as np
import cv2
import matplotlib.pyplot as plt
from scipy.fftpack import dct, idct


def im2double(im):
    """
    Converts uint image (0-255) to double image (0.0-1.0) and generalizes
    this concept to any range.

    :param im:
    :return: normalized image
    """
    min_val = np.min(im.ravel())
    max_val = np.max(im.ravel())
    out = (im.astype('float') - min_val) / (max_val - min_val)
    return out


# Open image. We also convert to grayscale to make it simpler to deal with
img = cv2.imread('./images/Lenna.png', cv2.IMREAD_GRAYSCALE)
img = im2double(img)

imsize = img.shape
dct_array = np.zeros(imsize)
reconstructed_img = np.zeros(imsize)

# Hints: JPEG compression works in its basic way like this - as discussed in the lecture 
#       1. You need to split the image in 8x8 pixel patches
#       2. For each patch you need to compute the 2D DCT (by calling it twice axis-0 and -1).
#       3. Then clamp values in each dct-patch by a meaningful threshold. 
#       4. Do a reconstruction of the image by doing an inverse DCT (idct) on each patch.
# YOUR CODE HERE
# 2ddct on 8x8 pixel patches - 
# Hint: yes, you can use two for-loops over the image here
		
# Display entire DCT - all 8x8 patches with imshow
# YOUR CODE HERE 

# Choose different thresholds small/large and show how it results in
# different results
# YOUR CODE HERE 

# Display entire thresholded DCT - all 8x8 patches with imshow
# YOUR CODE HERE 

# compute 2D idct on thresholded all 8x8 DCT patches
# YOUR CODE HERE 

# plt.figure()
# plt.imshow( np.hstack( (img, reconstructed_img) ) ,cmap='gray')
# plt.title("Comparison between original and DCT compressed images" )
# plt.show()
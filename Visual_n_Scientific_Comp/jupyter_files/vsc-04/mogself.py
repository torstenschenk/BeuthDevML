import numpy as np
import matplotlib.image as mpimage

def convolution2D(img, kernel):
    """
    Computes the convolution between kernel and image

    :param img: grayscale image
    :param kernel: convolution matrix
    :return: result of the convolution
    """
    
    # 1.1.1 TODO. Initialisieren Sie das resultierende Bild
    # Codebeispiel: new_img = np.zeros(img.shape)
    newimg = np.zeros(img.shape)
    newimg = newimg.astype("float64")
    
    if img.ndim!=2:
        print ('convolution_2d: only 2 dim images are supported')
        return newimg
    
    # 1.1.2 TODO. Implementieren Sie die Faltung.
    # Achtung: die Faltung (convolution) soll mit beliebig großen Kernels funktionieren.
    # Tipp: Nutzen Sie so gut es geht Numpy, sonst dauert der Algorithmus zu lange.
    # D.h. Iterieren Sie nicht über den Kernel, nur über das Bild. Der Rest geht mit Numpy.

    # Achtung! Achteten Sie darauf, dass wir ein Randproblem haben. Wie ist die Faltung am Rand definiert?
    # Tipp: Es gibt eine Funktion np.pad(Matrix, 5, mode="edge") die ein Array an den Rändern erweitert.

    offset = int(kernel.shape[0])
    # copy input image to larger with padded edges
    workimg = np.pad(img, int(offset/2), mode="edge")
    
    #print(kernel.shape)
    #print(workimg.shape)
    
    #rk, ck = kernel.shape[:2]
    ri, ci = img.shape[:2]
    
    for r in range (ri): # here rows of image
        for c in range (ci): # here columns of image
            # slice out kernel sized section
            newimg[r,c] = np.sum(workimg[r:r+offset,c:c+offset] * kernel)   

    # 1.1.3 TODO. Returnen Sie das resultierende "Bild"/Matrix
    # Codebeispiel: return newimg      
    return newimg

def magnitude_of_gradients(RGB_img):
    """
    Computes the magnitude of gradients using x-sobel and y-sobel 2Dconvolution

    :param img: RGB image
    :return: length of the gradient
    """
    # 3.1.1 TODO. Wandeln Sie das RGB Bild in ein grayscale Bild um.
    img = RGB_img.astype("float64")
    # Wandelt RGB Bild in ein grayscale Bild um
    gray = img[...,:3]@np.array([0.299, 0.587, 0.114])
    # 3.1.2 TODO: Definieren Sie den x-Sobel Kernel und y-Sobel Kernel.
    sobelmask_x = np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])
    sobelmask_y = np.array([[1, 2, 1], [0, 0, 0], [-1, -2, -1]])
    # 3.1.3 TODO: Nutzen Sie sie convolution2D Funktion um die Gradienten in x- und y-Richtung zu berechnen.
    sobx = convolution2D(gray, sobelmask_x)
    soby = convolution2D(gray, sobelmask_y)
    # 3.1.4 TODO: Nutzen Sie die zwei resultierenden Gradienten um die gesammt Gradientenlängen an jedem Pixel auszurechnen.
    mog = np.sqrt(sobx*sobx + soby*soby)
    return mog

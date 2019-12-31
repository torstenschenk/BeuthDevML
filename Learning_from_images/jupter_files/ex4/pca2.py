import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
from matplotlib import gridspec
import os


def load_images(path: str, file_ending: str=".png") -> (list, int, int):
    """
    Load all images in path with matplotlib that have given file_ending

    Arguments:
    path: path of directory containing image files that can be assumed to have all the same dimensions
    file_ending: string that image files have to end with, if not->ignore file

    Return:
    images: list of images (each image as numpy.ndarray and dtype=float64)
    dimension_x: size of images in x direction
    dimension_y: size of images in y direction
    """

    images = []

    # TODO read each image in path as numpy.ndarray and append to images

    files = os.listdir(path)
    files.sort()
    for cur in files:
        if not cur.endswith(file_ending):
            continue

        try:
            image = mpl.image.imread(path + cur)
            img_mtx = np.asarray(image, dtype="float64")
            images.append(img_mtx)
        except:
            continue

    dimension_y = images[0].shape[0]
    dimension_x = images[0].shape[1]

    return images, dimension_x, dimension_y


if __name__ == '__main__':

    images, x, y = load_images('./data/train/')

    # setup data matrix
    D = np.zeros((len(images), images[0].size), dtype=images[0].dtype)
    for i in range(len(images)):
        D[i, :] = images[i].flatten()

    # 1. calculate and subtract mean to center the data in D
    # TODO YOUR CODE HERE

    # calculate PCA
    # 2. now we can do a linear operation on the data
    #    and find the best linear mapping (eigenbasis) - use the np.linalg.svd with the
    #    parameter 'full_matrices=False'
    # TODO YOUR CODE HERE

    # take 10 / 75 / 300 first eigenvectors
    k = 10
    # cut off number of Principal Components / compress the information to most important eigenvectors
    # That means we only need the first k rows in the Vt matrix
    # TODO YOUR CODE HERE

    # now we use the eigenbasis to compress and reconstruct test images
    # and measure their reconstruction error
    errors = []
    images_test, x, y = load_images('./data/test/')

    for i, test_image in enumerate(images_test):

        # flatten and center the test image
        # TODO YOUR CODE HERE

        # project in basis by using the dot product of the eigenbasis and the flattened image vector
        # the result is a set of coefficients that are sufficient to reconstruct the image afterwards
        # coeff_test_image = ...
        # TODO YOUR CODE HERE
        # print("encoded / compact image shape: ", coeff_test_image.shape)
        # reconstruct from coefficient vector and add mean
        # reconstructed_image = ...
        # TODO YOUR CODE HERE
        # print("reconstructed image shape: ", reconstructed_image.shape)
        # img_reconst = reconstructed_image.reshape(images_test[0].shape)

        # error = np.linalg.norm(test_image - img_reconst)
        # errors.append(error)
        # print("reconstruction error: ", error)

    grid = plt.GridSpec(2, 9)

    plt.subplot(grid[0, 0:3])
    plt.imshow(test_image, cmap='Greys_r')
    plt.xlabel('Original person')

    plt.subplot(grid[0, 3:6])
    plt.imshow(img_reconst, cmap='Greys_r')
    plt.xlabel('Reconstructed image')

    plt.subplot(grid[0, 6:])
    plt.plot(np.arange(len(images_test)), errors)
    plt.xlabel('Errors all images')

    plt.savefig("pca_solution.png")
    plt.show()

    print("Mean error", np.asarray(errors).mean())


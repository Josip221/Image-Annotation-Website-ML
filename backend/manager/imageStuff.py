
import cv2
import numpy as np


def makeEmptyMask():
    image = np.zeros((1080, 1920, 3), dtype=np.uint8)

    cv2.imwrite('example.png', image)


def makeMask():
    # maskfile = '%s/mask_%05d-frame-%02d.png' % ("dir", 11, 1)

    image = np.zeros((1080, 1920, 3), dtype=np.uint8)

    pts = np.array([[100, 100], [200, 100], [200, 200], [300, 200],
                    [300, 300], [150, 300], [150, 200]], np.int32)

    pts = pts.reshape((-1, 1, 2))

    cv2.fillPoly(image, [pts],  (255, 255, 255))

    cv2.imwrite("test.png", image)

    print("Image created")

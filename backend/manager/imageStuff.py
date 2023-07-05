
import cv2
import numpy as np


def makeEmptyMask():
    image = np.zeros((1080, 1920, 3), dtype=np.uint8)

    cv2.imwrite('example.png', image)


def makeMask(selections, index, destination):
    # maskfile = '%s/mask_%05d-frame-%02d.png' % ("dir", 11, 1)

    image = np.zeros((1080, 1920, 3), dtype=np.uint8)

    for selection in selections:
        onlyFirstPositionsOfEdges = []
        for edge in selection:
            onlyFirstPositionsOfEdges.append(edge[0])

        pts = np.array(onlyFirstPositionsOfEdges, np.int32)
        pts = pts.reshape((-1, 1, 2))
        cv2.fillPoly(image, [pts],  (255, 255, 255))

    cv2.imwrite(f"images/test{index}.png", image)


def savePng(maskfile, image):
    cv2.imwrite(maskfile, image)

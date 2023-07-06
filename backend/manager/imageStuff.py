
import cv2
import numpy as np

def makeMask(selections, index, sequence_name, frame_00):


    seqNameNumber = frame_00.split("_")[1].split("-")[0]

    if index < 10:
        zfill = str(index).zfill(2)
    else:
        zfill = index
    image = np.zeros((1080, 1920, 3), dtype=np.uint8)
    for selection in selections:
        if selection == []:
            image = np.zeros((1080, 1920, 3), dtype=np.uint8)
        else:
            onlyFirstPositionsOfEdges = []
            for edge in selection:
                onlyFirstPositionsOfEdges.append(edge[0])

            pts = np.array(onlyFirstPositionsOfEdges, np.int32)
            pts = pts.reshape((-1, 1, 2))
            cv2.fillPoly(image, [pts],  (255, 255, 255))

    cv2.imwrite(f"../UPLOAD-SEKVENCE/NEOZNACENE/{sequence_name}/mask_{seqNameNumber}-frame-{zfill}.png", image)


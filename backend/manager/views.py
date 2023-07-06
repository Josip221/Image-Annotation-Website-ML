
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer, ReviewedSequenceSerializer
from django.contrib.auth import login
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from .imageStuff import makeMask
from .models import User, ReviewedSequence as ReviewedSequenceModel
import io
import base64
from PIL import Image
import os
import random
from datetime import datetime, timedelta
from rest_framework.pagination import PageNumberPagination



class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        print(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "data": [AuthToken.objects.create(user)[1], datetime.now() + timedelta(hours=10),]
        })


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        print("user print", user.id)
        temp_list=super(LoginAPI, self).post(request, format=None)
        temp_list.data["user_id"] = user.id
        temp_list.data["username"] = user.username
        return Response({ "data": temp_list.data})



class ProtectedRoute(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response({"succes": True, "message": "Protected route accessed"})

class ReviewedSequence(APIView):
    permission_classes = (permissions.IsAuthenticated)

    def get(self, request):
        return Response({"success": True})
    
class SequencePagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class Sequence(APIView):
    # must be logged in
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk=None, user=None, paramSeq = None, paramImg = None,*args, **kwargs):
        id = pk or request.query_params.get('id')
        user = user or request.query_params.get('user')
        paramSeq = paramSeq or request.query_params.get('paramSeq')
        paramImg = paramImg or request.query_params.get('paramImg')
        if id:
            data = ReviewedSequenceModel.objects.filter(id = id)
            paginator = SequencePagination()
            user = User.objects.filter(id=list(data.values("user"))[0]["user"])
            username = user.values("username")[0]["username"]
            
            print(data.values("user"))
            paginated_data = paginator.paginate_queryset(data, request)
            serializer = ReviewedSequenceSerializer(paginated_data, many=True)
   
            return paginator.get_paginated_response(serializer.data)
        elif user:
            data = ReviewedSequenceModel.objects.filter(user__username=user)
            paginator = SequencePagination()
            paginated_data = paginator.paginate_queryset(data, request)
            serializer = ReviewedSequenceSerializer(paginated_data, many=True)
            return paginator.get_paginated_response(serializer.data)
        elif paramSeq and paramImg:

            data = ReviewedSequenceModel.objects.filter(sequence_name=paramSeq, frame_00=f"{paramImg}-frame-00")
            if not data:
                  return Response({"success": False, "message": "Doesn't exist"})
            sequence = list(data.values())[0]
            amountOfFrames = list(data.values("length"))[0]["length"]
            images = []

            for i in range(amountOfFrames):
                if i < 10:
                    zfill = str(i).zfill(2)
                else:
                    zfill = i
                file_path = f"../UPLOAD-SEKVENCE/NEOZNACENE/{paramSeq}/{paramImg}-frame-{zfill}.jpg"
                if os.path.isfile(file_path):
                    with open(file_path, 'rb') as file:
                        image_data = file.read()
                            
                image = Image.open(io.BytesIO(image_data))
                image_buffer = io.BytesIO()
                image.save(image_buffer, format='JPEG')
                image_buffer.seek(0)
                encoded_image = base64.b64encode(image_buffer.getvalue()).decode('utf-8')
                images.append({"imageName": paramImg, "image": encoded_image})
            finalImages = sorted(images, key=lambda x: x["imageName"])
            return Response({"success": True, "data": {"sequenceName": paramSeq, "images": finalImages, "selection": sequence}})
        else:
            finalSequenceName = None
            finalImages = None
            searchingMarkedSeq = True
            excludeSequenceArray = []
            excludeImageFrameArray = []
            while searchingMarkedSeq:

                dirList = os.listdir("../UPLOAD-SEKVENCE/NEOZNACENE")
                seqName = random.choice([item for item in dirList if item not in excludeSequenceArray])
                file_list = os.listdir(f"../UPLOAD-SEKVENCE/NEOZNACENE/{seqName}")
                jpeg_files_with_frame00 = [file for file in file_list if file.startswith("image_") and "frame-00" in file]
                random_image_with_frame00 = random.choice([image for image in jpeg_files_with_frame00 if image not in excludeImageFrameArray])
                if ReviewedSequenceModel.objects.filter(sequence_name=seqName, frame_00=random_image_with_frame00.split(".")[0]).exists():

                    excludeImageFrameArray.append(random_image_with_frame00)
                    if len(excludeImageFrameArray) == len(jpeg_files_with_frame00):
                        excludeSequenceArray.append(seqName)
                        excludeImageFrameArray = []
                        if len(excludeSequenceArray) == len(dirList):
                            searchingMarkedSeq = False
                else:
                    searchingMarkedSeq = False
                    base_filename = random_image_with_frame00.replace("frame-00.jpg", "")
                    selected_files = [
                        file for file in file_list if file.startswith(base_filename)
                    ]
                    images = []
                    for file in selected_files:
                        imageName = file.split(".")[0]

                        file_path=f"../UPLOAD-SEKVENCE/NEOZNACENE/{seqName}/{file}"
            
                        if os.path.isfile(file_path):
                            with open(file_path, 'rb') as file:
                                image_data = file.read()
                            
                        image = Image.open(io.BytesIO(image_data))
                        image_buffer = io.BytesIO()
                        image.save(image_buffer, format='JPEG')
                        image_buffer.seek(0)
                        encoded_image = base64.b64encode(image_buffer.getvalue()).decode('utf-8')
                        images.append({"imageName": imageName, "image": encoded_image})

                    finalImages = sorted(images, key=lambda x: x["imageName"])
                    finalSequenceName = seqName
            return Response({"success": True, "data": {"sequenceName": finalSequenceName, "images": finalImages}})

    def post(self, request):

    
        sequence_name = request.data["sequence_name"]
        frame_00 = request.data["frame_00"]
        
        selections = request.data["selections"]
        allSelectionsInAnImage = dict()

        for selection in selections:
            image_id = selection['imageId']
            edges = selection["selection"]["edges"]
            if image_id in allSelectionsInAnImage:
                allSelectionsInAnImage[image_id].append(edges)
            else:
                allSelectionsInAnImage[image_id] = []
                allSelectionsInAnImage[image_id].append(edges)
        for index in allSelectionsInAnImage:
            makeMask(allSelectionsInAnImage[index], index, sequence_name, frame_00)


        user = User.objects.get(id=request.data["user"]["user_id"])
        request.data["user"] = user.id
        serializer=ReviewedSequenceSerializer(data=request.data)
        if serializer.is_valid():
            sequence = serializer.save()
        else:
            print(serializer.errors)


        return Response({"succes": True, "message": "Sequence sent"})
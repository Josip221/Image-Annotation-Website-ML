
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer, DataSerializer, SequenceSerializer
from django.contrib.auth import login
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from .imageStuff import makeMask
import io
import base64
from PIL import Image
import environ
import os
import random


env = environ.Env()
environ.Env.read_env()


class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "data": AuthToken.objects.create(user)[1]
        })


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)


class LogOutAPI(generics.GenericAPIView):
    permission_classes = (permissions.IsAuthenticated,)

class ProtectedRoute(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response({"succes": True, "message": "Protected route accessed"})


class Sequence(APIView):
    # must be logged in
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, reqeust):
        print("test")
        print(os.getcwd())
        seqName = random.choice(os.listdir("../UPLOAD-SEKVENCE/NEOZNACENE"))
        file_list = os.listdir(f"../UPLOAD-SEKVENCE/NEOZNACENE/{seqName}")
        jpeg_files_with_frame00 = [file for file in file_list if file.startswith("image_") and "frame-00" in file]

        if not jpeg_files_with_frame00:
            print("No images with frame-00 found.")
        else:
            random_image_with_frame00 = random.choice(jpeg_files_with_frame00)
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

        sorted_images = sorted(images, key=lambda x: x["imageName"])
        return Response({"success": True, "data": {"sequenceName": seqName, "images": sorted_images}})

    def post(self, request):

        serializer = DataSerializer(data=request.data)
        if serializer.is_valid():
            sequence_name = serializer.validated_data["sequence_name"]
            selections = serializer.validated_data["selections"]
            allSelectionsInAnImage = dict()
            # destructuring the selection object
            for selection in selections:
                image_id = selection['imageId']
                edges = selection["selection"]["edges"]
                if image_id in allSelectionsInAnImage:
                    allSelectionsInAnImage[image_id].append(edges)
                else:
                    allSelectionsInAnImage[image_id] = []
                    allSelectionsInAnImage[image_id].append(edges)
            for index in allSelectionsInAnImage:
                makeMask(allSelectionsInAnImage[index], index)

            # print("Sequence reviewed", serializer.validated_data)
            # save reviewed sequence and tag it
            validated_data = {
                'sequence_name': 'Example Sequence',
                'review_amount': 5,
                'images': 'example.jpg'
            }
            sez = SequenceSerializer(data=validated_data)
            if sez.is_valid():
                instance = sez.save()

            return Response({"succes": True, "message": "Sequence sent"})
        else:
            print(serializer.error_messages)
            return Response({"fail": True, "message": "Sequence not valid"})

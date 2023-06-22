import paramiko
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer, DataSerializer
from django.contrib.auth import login
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView

from .imageStuff import makeMask
from .models import ReviewedSequence
import environ
import json

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
            "token": AuthToken.objects.create(user)[1]
        })


class LoginAPI(KnoxLoginView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginAPI, self).post(request, format=None)


class ProtectedRoute(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response({"succes": True, "message": "Protected route accessed"})


class Sequence(APIView):
    # must be logged in
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, reqeust):
        hostname = env("HOSTNAME")
        port = env("PORT")
        username = env("USER")
        password = env("PASSWORD")

        pathToLocal = "images/imageFetched.png"

        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname, port, username, password)
        # _stdin, _stdout, _stderr = ssh.exec_command("ls")

        # fetch a previously tagged sequence

        # if no tagged sequences, fetch random sequence
        _stdin, _stdout, _stderr = ssh.exec_command(
            'ls /home/jmaretic')
        random_folder = _stdout.read().decode().strip()
        print("Random folder", random_folder)

        # sftp = ssh.open_sftp()

        # try:
        #     sftp.chdir("testingFolder1")
        #     sftp.get("image_02621-frame-01.jpg", pathToLocal)
        #     print("image found")
        # except FileNotFoundError:
        #     print("not found")
        # finally:
        #     sftp.close()
        #     ssh.close()
        # return the sequence
        return Response({"success": True, "data": "sequence"})

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

            return Response({"succes": True, "message": "Sequence sent"})
        else:
            print(serializer.error_messages)
            return Response({"fail": True, "message": "Sequence not valid"})

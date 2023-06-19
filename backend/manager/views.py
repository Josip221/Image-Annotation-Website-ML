from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer, DataSerializer
from django.contrib.auth import login
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView

from .imageStuff import makeMask

import paramiko


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
        hostname = 
        port = 22
        username = 
        password = 

        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname, port, username, password)
        # _stdin, _stdout, _stderr = ssh.exec_command("ls")

        _stdin, _stdout, _stderr = ssh.exec_command(
            'find / -maxdepth 1 -type d -not -path "*/\.*" | shuf -n 1')
        random_folder = _stdout.read().decode().strip()
        print("Random folder", random_folder)
        ssh.close()
        return Response({"success": True, "data": "sequence"})

    def post(self, request):

        serializer = DataSerializer(data=request.data)
        if serializer.is_valid():
            selections = serializer.validated_data["selections"]
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
                makeMask(allSelectionsInAnImage[index], index)

            # save reviewed sequence
            return Response({"succes": True, "message": "Sequence sent"})
        else:
            print(serializer.error_messages)
            return Response({"fail": True, "message": "Sequence not valid"})

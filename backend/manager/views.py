import paramiko
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer, DataSerializer, SequenceSerializer
from django.contrib.auth import login
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView
from django.http import FileResponse
from .imageStuff import makeMask
import io
import base64
from PIL import Image
import environ


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

        try:
            ssh.connect(hostname, port, username, password)

            # _stdin, _stdout, _stderr = ssh.exec_command(
            # 'ls /home/jmaretic/UPLOAD-SEKVENCE/NEOZNACENE/Srima_001-1920x1080-v5p2')
            _stdin, _stdout, _stderr = ssh.exec_command(
            'pwd')
            random_folder = _stdout.read().decode().strip()
            #print("Random folder \n", random_folder)

            

            sftp = ssh.open_sftp()
            seqName = sftp.listdir("./UPLOAD-SEKVENCE/NEOZNACENE")[2]
            #sftp.get( "/home/jmaretic/UPLOAD-SEKVENCE/NEOZNACENE/Srima_001-1920x1080-v5p2/image_09703-frame-11.jpg", pathToLocal)
            file_obj = sftp.open("/home/jmaretic/UPLOAD-SEKVENCE/NEOZNACENE/Srima_001-1920x1080-v5p2/image_09703-frame-11.jpg", 'rb')
            image_data = file_obj.read()
            file_obj.close()
            sftp.close()

            image = Image.open(io.BytesIO(image_data))
           

            image_buffer = io.BytesIO()
            image.save(image_buffer, format='JPEG')
            image_buffer.seek(0)
            encoded_image = base64.b64encode(image_buffer.getvalue()).decode('utf-8')


            
           
        except paramiko.AuthenticationException:
            print("Authentication failed. Please check your credentials.")
        except paramiko.SSHException as e:
            print("Unable to establish SSH connection:", str(e))
        finally:
             ssh.close()
        # if no tagged sequences, fetch random sequence
        
        #response = FileResponse(image_buffer, content_type='image/jpeg')
        #return response
        return Response({"success": True, "data": {"sequenceName": seqName, "images": [{"imageName": "test", "image": encoded_image}, {"imageName": "test", "image": encoded_image}, {"imageName": "test", "image": encoded_image}, {"imageName": "test", "image": encoded_image}]}})

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

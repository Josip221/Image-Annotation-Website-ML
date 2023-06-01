from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from knox.models import AuthToken
from .serializers import UserSerializer, RegisterSerializer, DataSerializer
from django.contrib.auth import login
from rest_framework.authtoken.serializers import AuthTokenSerializer
from knox.views import LoginView as KnoxLoginView

from .imageStuff import makeMask


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

# test view


class ProtectedRoute(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        return Response({"succes": True, "message": "Protected route accessed"})


class SendMarkedSequence(APIView):
    # must be logged in
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):

        serializer = DataSerializer(data=request.data)
        # print(request.data)
        if serializer.is_valid():
            selections = serializer.validated_data["selections"]
            allSelectionsInAnImage = dict()
            i = 0
            for selection in selections:
                image_id = selection['imageId']
                selection_id = selection['selection']['selectionId']
                edges = selection["selection"]["edges"]

                if image_id in allSelectionsInAnImage:
                    allSelectionsInAnImage[image_id].append(edges)
                else:
                    allSelectionsInAnImage[image_id] = []
                    allSelectionsInAnImage[image_id].append(edges)
                # else:
                # allSelectionsInAnImage[image_id] = []

                # makeMask(edges, i)
                # for each selection, array of edges, make a mask for it

                # there can be multiple selections in one image
                # print(
                #     f"Image ID: {image_id}, Selection ID: {selection_id}, Edges: {edges}")
                # i += 1
            for index in allSelectionsInAnImage:
                makeMask(allSelectionsInAnImage[index], index)
            return Response({"succes": True, "message": "Sequence sent"})
        else:
            print(serializer.error_messages)
            return Response({"fail": True, "message": "Sequence bad"})

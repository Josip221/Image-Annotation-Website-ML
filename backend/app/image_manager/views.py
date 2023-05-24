from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from .models import Sequence
from .serializers import SequenceSerializer

# Create your views here.

class SequenceView(APIView):
    def get(self, request):
        items = Sequence.objects.all()
        serializer = SequenceSerializer(items, many=True)
        return Response({"sucess": True, "data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
       
        serializer =  SequenceSerializer(data ={"author": request.data.get("author"), "sequence_id": 2, "length": 20})
        if serializer.is_valid(raise_exception=True):
            author_saved = serializer.save()
        return Response({"succes": "Article '{} created succesfully'".format(author_saved)}, status=status.HTTP_201_CREATED)

class SequenceReview(APIView):
    def get(self, request):
       return Response({"sucess": True}, status=status.HTTP_200_OK)
    
    def post(self, request):
       return Response({"sucess": True}, status=status.HTTP_200_OK)
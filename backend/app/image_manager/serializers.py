from rest_framework import serializers
from .models import Sequence, SequenceReview, Image

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image

class SequenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sequence
        fields = '__all__'

    def create(self, validated_data):
        return Sequence.objects.create(**validated_data)
        

class SequenceReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = SequenceReview
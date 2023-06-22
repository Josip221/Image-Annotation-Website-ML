from rest_framework import serializers
from .models import Sequence, User, ReviewedSequence


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'], validated_data['email'], validated_data['password'])

        return user


# selection for submit
class SelectionSerializer(serializers.Serializer):
    selectionId = serializers.IntegerField()
    edges = serializers.ListField()


class ImageSelectionSerializer(serializers.Serializer):
    imageId = serializers.IntegerField()
    selection = SelectionSerializer()


class DataSerializer(serializers.Serializer):
    selections = serializers.ListField(child=ImageSelectionSerializer())
    sequence_name = serializers.CharField(max_length=100)


class SequenceSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return Sequence.objects.create(**validated_data)

    class Meta:
        model = Sequence
        fields = '__all__'


class ReviewedSequenceSerializer(serializers.ModelSerializer):
    # reviewed_at = serializers.DateTimeField()

    def create(self, validated_data):
        return ReviewedSequence.objects.create(**validated_data)

    class Meta:
        model = ReviewedSequence
        fields = "__all__"

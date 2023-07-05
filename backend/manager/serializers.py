from rest_framework import serializers
from .models import User, ReviewedSequence


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





class ReviewedSequenceSerializer(serializers.ModelSerializer):
    # reviewed_at = serializers.DateTimeField()

    def create(self, validated_data):
        print(validated_data)
        return ReviewedSequence.objects.create(**validated_data)

    class Meta:
        model = ReviewedSequence
        fields = "__all__"

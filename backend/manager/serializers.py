from rest_framework import serializers
from .models import Sequence, User


# class SequenceSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Sequence
#         fields = '__all__'

#     def create(self, validated_data):
#         return Sequence.objects.create(**validated_data)


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
        user = User.objects.create_user(validated_data['username'], validated_data['email'], validated_data['password'])

        return user
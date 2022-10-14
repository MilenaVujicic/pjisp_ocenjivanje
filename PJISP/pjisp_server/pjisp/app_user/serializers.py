from rest_framework import serializers
from .models import AppUser
from django.contrib.auth.hashers import make_password


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('id', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password':{'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super(UserSerializer, self).create(validated_data)


class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ['id', 'email']


class SuperUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('id', 'email', 'first_name', 'last_name', 'password', 'is_admin', 'is_superuser', 'is_staff')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data.get('password'))
        return super(SuperUserSerializer, self).create(validated_data)

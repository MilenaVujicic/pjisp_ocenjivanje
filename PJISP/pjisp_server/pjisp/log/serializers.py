from rest_framework import serializers
from app_user.serializers import EmailSerializer
from .models import LogEntry


class LogEntrySerializer(serializers.ModelSerializer):
    user = EmailSerializer()

    class Meta:
        model = LogEntry
        fields = "__all__"


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = LogEntry
        fields = ['index_number', 'first_name', 'last_name', 't1234', 'sov', 'p1', 'p2', 'exam']

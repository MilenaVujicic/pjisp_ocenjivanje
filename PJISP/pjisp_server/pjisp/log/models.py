from django.db import models
from app_user.models import AppUser


class LogEntry(models.Model):
    user = models.ForeignKey(AppUser, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now=True)
    index_number = models.CharField(max_length=15)
    last_name = models.CharField(max_length=100)
    first_name = models.CharField(max_length=100)
    t1234 = models.IntegerField()
    sov = models.IntegerField()
    p1 = models.IntegerField()
    p2 = models.IntegerField()
    exam = models.IntegerField()
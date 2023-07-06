from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField
from django.db import models

class User(AbstractUser):
    def __str__(self):
        return self.username

class ReviewedSequence(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sequence_name = models.CharField(max_length=100)
    frame_00 = models.CharField(max_length=100)
    selections = models.JSONField()
    reviewed_at = models.DateTimeField(auto_now_add=True)
    length = models.IntegerField()


    def __str__(self):
        return self.sequence_name

    class Meta:
        ordering = ["-reviewed_at"]

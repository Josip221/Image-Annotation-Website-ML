from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from rest_framework.authtoken.models import Token

# Create your models here.


class User(AbstractUser):
    def __str__(self):
        return self.username


# pull from db an array(sequence) of images to be reviewed
class Sequence(models.Model):
    sequence_id = models.CharField(max_length=100)
    length = models.IntegerField()
    review_amount = models.IntegerField()

    def __str__(self):
        return self.id


# store reviewed sequence, with its selections
class ReviewedSequence(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sequence_id = models.CharField(max_length=100)
    reviewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.id

    class Meta:
        ordering = ["reviewed_at"]

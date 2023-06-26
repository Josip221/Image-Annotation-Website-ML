from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.

class User(AbstractUser):
    def __str__(self):
        return self.username


# pull from db an array(sequence) of images to be reviewed
class Sequence(models.Model):
    sequence_name = models.CharField(max_length=100)
    review_amount = models.IntegerField()
    images = models.CharField(max_length=100)

    def __str__(self):
        return self.sequence_name


# store reviewed sequence, with its selections
class ReviewedSequence(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    sequence_name = models.CharField(max_length=100)
    reviewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sequence_name

    class Meta:
        ordering = ["reviewed_at"]

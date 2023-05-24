from django.db import models

# Create your models here.

class Image(models.Model):
    image_id = models.CharField(max_length=100)
    image_name = models.CharField(max_length=100)
    image_path =  models.CharField(max_length=100)
    image_group =  models.CharField(max_length=100)

    def __str__(self):
        return self.image_id
    
class Sequence(models.Model):
    sequence_id = models.CharField(max_length=100)
    author = models.CharField(max_length=20)
    length = models.IntegerField()

    def __str__(self):
        return self.sequence_id 
    
class SequenceReview(models.Model):
    review_id = models.CharField( max_length=100)
    user_id = models.CharField( max_length=100)
    sequence_id = models.CharField( max_length=100)
    tag = models.IntegerField()
    

    def __str__(self): 
        return self.review_id
from django.contrib import admin
from .models import  Image, Sequence, SequenceReview

# Register your models here.

admin.site.register(Image)
admin.site.register(Sequence)
admin.site.register(SequenceReview)
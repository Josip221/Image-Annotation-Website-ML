from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ReviewedSequence, Sequence

# Register your models here.

admin.site.register(User, UserAdmin)
admin.site.register(Sequence)
admin.site.register(ReviewedSequence)

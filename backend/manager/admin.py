from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group
from .models import User, ReviewedSequence


# Register your models here.


class ReviewedSequenceAdmin(admin.ModelAdmin):
    list_display = ["id", "sequence_name","frame_00", "user", "reviewed_at" , "length"]
    search_fields = ['sequence_name', "user__username"]



admin.site.register(User, UserAdmin)
admin.site.register(ReviewedSequence, ReviewedSequenceAdmin)
admin.site.unregister(Group)

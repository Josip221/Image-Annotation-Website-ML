from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ReviewedSequence

# Register your models here.


class ReviewedSequenceAdmin(admin.ModelAdmin):
    list_display = ["id", "sequence_name", "user", "reviewed_at", "frame_00"]
    search_fields = ['sequence_name', "user__username"]



admin.site.register(User, UserAdmin)
admin.site.register(ReviewedSequence, ReviewedSequenceAdmin)

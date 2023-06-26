from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ReviewedSequence, Sequence

# Register your models here.


class ReviewedSequenceAdmin(admin.ModelAdmin):
    list_display = ["sequence_name", "user", "reviewed_at"]


class SequenceAdmin(admin.ModelAdmin):
    list_display = ["sequence_name", "review_amount"]


admin.site.register(User, UserAdmin)
admin.site.register(Sequence, SequenceAdmin)
admin.site.register(ReviewedSequence, ReviewedSequenceAdmin)

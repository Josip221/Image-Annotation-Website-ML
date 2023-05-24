from django.urls import include, path
from rest_framework import routers
from .views import SequenceView

urlpatterns = [
	path("sequence/", SequenceView.as_view(), name="sequence")
]

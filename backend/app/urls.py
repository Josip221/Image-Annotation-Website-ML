from manager.views import RegisterAPI, LoginAPI, ProtectedRoute, Sequence
from django.urls import path
from django.contrib import admin
from knox import views as knox_views

# login register logout work
urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/register/', RegisterAPI.as_view(), name='register'),
    path('api/login/', LoginAPI.as_view(), name='login'),
    path('api/logout/', knox_views.LogoutView.as_view(), name='logout'),
    path("api/protected/", ProtectedRoute.as_view()),
    path("api/sequence/<int:pk>", Sequence.as_view()),
    path("api/sequence/<str:user>", Sequence.as_view()),
    path("api/sequence/", Sequence.as_view())
]

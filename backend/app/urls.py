from manager.views import RegisterAPI, LoginAPI, ProtectedRoute
from django.urls import path
from knox import views as knox_views

#login register logout work
urlpatterns = [
    path('api/register/', RegisterAPI.as_view(), name='register'),
    path('api/login/', LoginAPI.as_view(), name='login'),
    path('api/logout/', knox_views.LogoutView.as_view(), name='logout'),
    path("api/protected/", ProtectedRoute.as_view())
]


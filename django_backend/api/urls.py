
from django.urls import path, include

from .views import (
    MovieApiView,
    MoviesApiView,
    MovieRatingsApiView,
    getData
)
from rest_framework import routers
from .views import UserViewSet, GroupViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)


urlpatterns = [
    path('movies', MoviesApiView.as_view()),
    path('movies/<str:id>', MovieApiView.as_view()),
    path('ratings', MovieRatingsApiView.as_view()),
    path('', include(router.urls)),
    path('try', getData)
]
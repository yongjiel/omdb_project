
from django.urls import path, include, re_path

from .views import (
    MoviesApiView,
    MovieRatingsApiView,
    UserMoviesApiView
)

from .view_test import TokenValidationView
from rest_framework import routers
from .views import UserViewSet, GroupViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', GroupViewSet)

urlpatterns = [
    re_path(r"^movies/?(?P<id>\w+)?", MoviesApiView.as_view(), name="get_movies",),
    path('ratings', MovieRatingsApiView.as_view()),
    path('', include(router.urls)),
    path('validate-token/', TokenValidationView.as_view(), name='validate-token',),
    re_path(r'^userlist/?', UserMoviesApiView.as_view(), name='user-movie-list',)
]
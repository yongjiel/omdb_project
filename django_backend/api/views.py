
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User, Group
from .models import Movie, Rating, UserMovie
from .serializers import (MovieSerializer, MovieRatingSerializer,
                         UserSerializer, GroupSerializer, UserMoviesSerializer)
import copy
from rest_framework import viewsets
from django.contrib.auth.decorators import permission_required
from django.utils.decorators import method_decorator
from rest_framework.authtoken.models import Token


def _get_user_by_token(request):
    print(request)
    if hasattr(request, 'user') and hasattr( request.user, "username"): # simplejwt
        username = request.user.username
        return User.objects.filter(username=username).first()
    if hasattr(request, 'user'):
        return request.user
    if request.META.get('HTTP_AUTHORIZATION', None):
        tok = request.META.get('HTTP_AUTHORIZATION').replace("Token ", "")
        token = Token.objects.get(key=tok)
        return User.objects.get(id=token.user_id)
    else:
        raise Exception("No user/token found.")


class UserMoviesApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = (JWTAuthentication,TokenAuthentication,SessionAuthentication)
    serializer_class = MovieSerializer

    def get(self, request, *args, **kwargs):
        print("//.//////")
        user = _get_user_by_token(request)
        print(user.id)
        uvs = UserMovie.objects.filter(user=user).all()
        print([uv.movie for uv in uvs])
        mvs = [{"imdbID": uv.movie.imdbID, "Title": uv.movie.Title, 
                    "Year": uv.movie.Year} for uv in uvs]
        #serializer = MovieSerializer(mvs, many=True)
        return Response(mvs, status=status.HTTP_200_OK)

class MovieRatingsApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = (JWTAuthentication, TokenAuthentication,SessionAuthentication)
    serializer_class = MovieRatingSerializer

    def get(self, request, *args, **kwargs):
        ratings = Rating.objects.all()
        ratings = Rating.objects.all()
        serializer = MovieRatingSerializer(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MoviesApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = (JWTAuthentication, TokenAuthentication,SessionAuthentication)
    serializer_class = MovieSerializer

    def get(self, request, id=None):
        if id:
            try:
                movie = Movie.objects.get(imdbID=id)
                setattr(movie, 'Ratings_set', movie.ratings.all())
                serializer = MovieSerializer(movie)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Exception as e:
                return Response(str(e), status=status.HTTP_404_NOT_FOUND)

        movies = Movie.objects.all()
        for m in movies:
            setattr(m, 'Ratings_set', m.ratings.all())
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data
        print(data)
        m = None
        serializer = MovieSerializer(data=data)
        m = Movie.objects.filter(imdbID=data['imdbID']).first()
        if not m:
            if serializer.is_valid():
                m = serializer.save()
            else:
                print(serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            if 'Ratings' in data:
                for r in data['Ratings']:
                    try:
                        Rating.objects.create(Source=r['Source'], Value=r['Value'], movie=m)
                    except Exception as e:
                        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        user = _get_user_by_token(request)
        uv = UserMovie.objects.filter(user=user, movie=m).first()
        if not uv:
            try:
                UserMovie.objects.create(user=user, movie=m)
            except Exception as e:
                print(str(e))
                return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

        serializer = MovieSerializer(m)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def delete(self, request, id, *args, **kwargs):
        if not id:
            return Response("id must be defined.", status=status.HTTP_400_BAD_REQUEST)
        
        movie = Movie.objects.filter(imdbID=id).first()
        if not movie:
            return Response(None, status=204)
        user = _get_user_by_token(request)
        uv = UserMovie.objects.filter(user=user, movie=movie).first()
        if uv:
            uv.delete()
        else:
            print("No userlist {} {} exists".format(user.id, movie.imdbID))
            #return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        movie.delete()
        return Response(None, status=204)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
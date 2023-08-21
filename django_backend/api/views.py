
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import User, Group
from .models import Movie, Rating
from .serializers import (MovieSerializer, MovieRatingSerializer,
                         UserSerializer, GroupSerializer)
import copy
from rest_framework import viewsets
from django.contrib.auth.decorators import permission_required
from django.utils.decorators import method_decorator


class MovieRatingsApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = (TokenAuthentication,)
    serializer_class = MovieRatingSerializer

    def get(self, request, *args, **kwargs):
        ratings = Rating.objects.all()
        ratings = Rating.objects.all()
        serializer = MovieRatingSerializer(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MoviesApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = (TokenAuthentication,)
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
        try:
            # created, if not created, will throw exception
            movie = Movie.objects.filter(imdbID=data['imdbID']).first()
            movie_cp = copy.deepcopy(movie.__dict__)
            if '_state' in movie_cp:
                del movie_cp['_state']
            return Response(movie_cp, status=status.HTTP_200_OK)
        except Exception: 
            ratings = None
            if "Ratings" in data:
                ratings = copy.deepcopy(data['Ratings'])
                del data['Ratings']
            serializer = MovieSerializer(data=data)
            m = None
            if serializer.is_valid():
                m = serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            if ratings:
                for r in ratings:
                    try:
                        Rating.objects.create(Source=r['Source'], Value=r['Value'], movie=m)
                    except Exception as e:
                        return Response(str(e), status=status.HTTP_400_BAD_REQUEST)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def delete(self, request, id, *args, **kwargs):
        if not id:
            return Response("id must be defined.", status=status.HTTP_400_BAD_REQUEST)

        movie = Movie.objects.get(imdbID=id)
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
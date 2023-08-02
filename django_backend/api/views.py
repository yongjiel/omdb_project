
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework import permissions
from django.contrib.auth.models import User, Group
from .models import Movie, Rating
from .serializers import (MovieSerializer, MovieRatingSerializer,
                         UserSerializer, GroupSerializer)
import copy
from rest_framework import viewsets


@api_view(['GET'])
def getData(request):
    person = {"user": "DOW", "age": 21}
    return Response(person)


class MovieRatingsApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MovieRatingSerializer

    def get(self, request, *args, **kwargs):
        ratings = Rating.objects.all()
        ratings = Rating.objects.all()
        serializer = MovieRatingSerializer(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MovieApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MovieSerializer

    def get(self, request, id, *args, **kwargs):
        movie = Movie.objects.get(imdbID=id)
        setattr(movie, 'Ratings_set', movie.ratings.all())
        serializer = MovieSerializer(movie)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, id, *args, **kwargs):
        movie = Movie.objects.get(imdbID=id)
        movie.delete()
        return Response(None, status=204)


class MoviesApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MovieSerializer

    def get(self, request, *args, **kwargs):
        movies = Movie.objects.all()
        for m in movies:
            setattr(m, 'Ratings_set', m.ratings.all())
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data
        try:
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
                    Rating.objects.create(Source=r['Source'], Value=r['Value'], movie=m)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
    

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
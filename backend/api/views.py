from rest_framework import generics, views, status
from rest_framework.response import Response
from .serializers import UserSerializer, MovieSerializer, SaveMoviesSerializer
from .models import CustomUser, Movie
from rest_framework.permissions import AllowAny, IsAuthenticated
import logging

logger = logging.getLogger(__name__)

class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class AddMovieView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user  # Directly assign the user instance

        logger.debug(f"Request data received: {data}")

        try:
            movie, created = Movie.objects.update_or_create(
                imdb_id=data['imdb_id'], user=request.user,
                defaults=data
            )
            if created:
                logger.debug(f"Movie created: {movie.title}")
                return Response(MovieSerializer(movie).data, status=status.HTTP_201_CREATED)
            else:
                logger.debug(f"Movie updated: {movie.title}")
                return Response(MovieSerializer(movie).data, status=status.HTTP_200_OK)
        except KeyError as e:
            logger.error(f"Missing field: {e}")
            return Response({"error": f"Missing field: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Exception: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RemoveMovieView(views.APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, imdb_id):
        try:
            movie = Movie.objects.get(imdb_id=imdb_id, user=request.user)
            movie.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Movie.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class RateMovieView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, imdb_id):
        try:
            movie = Movie.objects.get(imdb_id=imdb_id, user=request.user)
            movie.rating = request.data.get('rating')
            movie.save()
            return Response(status=status.HTTP_200_OK)
        except Movie.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class SaveMoviesView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SaveMoviesSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)  # Print the validation errors to the console
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListMoviesView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        movies = Movie.objects.filter(user=request.user)
        serializer = MovieSerializer(movies, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ListRatingsView(views.APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        movies = Movie.objects.filter(user=request.user).values('imdb_id', 'rating')
        return Response(movies, status=status.HTTP_200_OK)

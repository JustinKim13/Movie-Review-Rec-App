from rest_framework import generics, views, status
from rest_framework.response import Response
from .serializers import UserSerializer, MovieSerializer, SaveMoviesSerializer
from .models import CustomUser, Movie
from rest_framework.permissions import AllowAny, IsAuthenticated
import logging
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

logger = logging.getLogger(__name__)

class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class AddMovieView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user

        logger.debug(f"Request data received: {data}")

        try:
            # Ensure 'title' is in the data payload
            if 'title' not in data:
                raise KeyError("Missing field: 'title'")
            
            # Check if the movie already exists for the user
            movie, created = Movie.objects.update_or_create(
                title=data['title'], user=request.user,
                defaults=data
            )
            if created:
                logger.debug(f"Movie created: {movie.title}")
                print(f"Movie created: {movie.title}")
                return Response(MovieSerializer(movie).data, status=status.HTTP_201_CREATED)
            else:
                logger.debug(f"Movie updated: {movie.title}")
                print(f"Movie updated: {movie.title}")
                return Response(MovieSerializer(movie).data, status=status.HTTP_200_OK)
        except KeyError as e:
            logger.error(f"Missing field: {e}")
            print(f"Missing field: {e}")
            return Response({"error": f"Missing field: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Exception: {e}")
            print(f"Exception: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RemoveMovieView(views.APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, title):
        try:
            # Decode the title from URL
            from urllib.parse import unquote
            decoded_title = unquote(title)
            print(f"Decoded title: {decoded_title}")

            # Delete all movies with the given title for the current user
            movies = Movie.objects.filter(title=decoded_title, user=request.user)
            if movies.exists():
                movies.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"error": "Movie not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Exception: {e}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RateMovieView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, title):
        try:
            movie = Movie.objects.get(title=title, user=request.user)
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
        movies = Movie.objects.filter(user=request.user).values('title', 'rating')
        return Response(movies, status=status.HTTP_200_OK)

class RecommendationView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_id = request.user.id
        print(f"Logged in user ID: {user_id}")

        # Fetch movies for the logged-in user
        user_movies = list(Movie.objects.filter(user_id=user_id).values())
        if not user_movies:
            return Response({"error": "No movies found for this user"}, status=status.HTTP_400_BAD_REQUEST)

        print(f"User Movies from DB: {user_movies}")

        try:
            imdb_data_path = os.path.join(os.path.dirname(__file__), 'data', 'imdb_top_1000.csv')
            imdb_data = pd.read_csv(imdb_data_path)
            if 'Series_Title' not in imdb_data.columns:
                raise KeyError("The 'Series_Title' column is missing in the IMDB dataset")
        except FileNotFoundError:
            print("IMDB data file not found")
            return Response({"error": "IMDB data file not found"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except KeyError as e:
            print(str(e))
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user_df = pd.DataFrame(user_movies)

        if 'title' not in user_df.columns:
            print("Title column missing from user_df")
            return Response({"error": "Title column missing from user data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user_df = user_df.rename(columns={'title': 'Series_Title'})

        # Merge datasets on movie title to get a combined dataset
        combined_data = pd.merge(user_df, imdb_data, on='Series_Title', how='inner')
        print(f"Combined Data:\n{combined_data.head()}")
        print(f"Number of combined entries: {len(combined_data)}")

        # If the combined data is empty, use top IMDB movies as fallback
        if combined_data.empty:
            top_imdb_movies = imdb_data.head(4)
            recommendations = top_imdb_movies[['Series_Title', 'Poster_Link']].to_dict('records')
            return Response(recommendations, status=status.HTTP_200_OK)

        features = imdb_data[['Series_Title', 'Genre', 'Director', 'Star1', 'Star2', 'Star3', 'Star4']]
        features = features.fillna('')
        features['combined_features'] = features.apply(lambda row: ' '.join(row.values.astype(str)), axis=1)

        cv = CountVectorizer()
        count_matrix = cv.fit_transform(features['combined_features'])
        cosine_sim = cosine_similarity(count_matrix)

        def get_index_from_title(title):
            try:
                return features[features['Series_Title'] == title].index.values[0]
            except IndexError:
                return None

        def get_title_from_index(index):
            return features.iloc[index]['Series_Title']

        # Calculate the weighted average of similarities based on user ratings
        user_sim_scores = []
        for _, row in user_df.iterrows():
            idx = get_index_from_title(row['Series_Title'])
            if idx is not None:
                sim_scores = list(enumerate(cosine_sim[idx]))
                user_sim_scores.extend([(i, sim * row['rating']) for i, sim in sim_scores])

        # Aggregate the scores
        user_sim_scores = pd.DataFrame(user_sim_scores, columns=['movie_index', 'score'])
        user_sim_scores = user_sim_scores.groupby('movie_index').sum().reset_index()

        # Remove movies already rated by the user
        rated_indices = user_df['Series_Title'].apply(get_index_from_title)
        user_sim_scores = user_sim_scores[~user_sim_scores['movie_index'].isin(rated_indices)]

        # Get the top N recommendations
        user_sim_scores = user_sim_scores.sort_values(by='score', ascending=False)
        top_recommendations = user_sim_scores.head(4)

        # Get the poster URLs for the recommended movies
        recommended_titles = top_recommendations['movie_index'].apply(get_title_from_index)
        recommendations = pd.DataFrame({'Series_Title': recommended_titles})

        recommendations = pd.merge(recommendations, imdb_data[['Series_Title', 'Poster_Link']], on='Series_Title', how='inner')

        return Response(recommendations[['Series_Title', 'Poster_Link']].to_dict('records'), status=status.HTTP_200_OK)

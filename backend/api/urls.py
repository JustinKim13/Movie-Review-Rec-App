from django.urls import path
from .views import (
    CreateUserView,
    AddMovieView,
    RemoveMovieView,
    RateMovieView,
    SaveMoviesView,
    ListMoviesView,
    ListRatingsView,
    RecommendationView  
)

urlpatterns = [
    path('users/create/', CreateUserView.as_view(), name='create_user'),
    path('movies/add/', AddMovieView.as_view(), name='add_movie'),
    path('movies/remove/<str:title>/', RemoveMovieView.as_view(), name='remove_movie'),
    path('movies/rate/<str:title>/', RateMovieView.as_view(), name='rate_movie'),
    path('movies/save/', SaveMoviesView.as_view(), name='save_movies'),
    path('movies/', ListMoviesView.as_view(), name='list_movies'),
    path('movies/ratings/', ListRatingsView.as_view(), name='list_ratings'),
    path('recommendations/', RecommendationView.as_view(), name='recommendations'),  
]

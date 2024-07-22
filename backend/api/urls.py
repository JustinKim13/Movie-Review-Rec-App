from django.urls import path
from .views import CreateUserView, AddMovieView, RemoveMovieView, RateMovieView, ListMoviesView, SaveMoviesView, ListRatingsView

urlpatterns = [
    path("user/register/", CreateUserView.as_view(), name="register"),
    path("movies/add/", AddMovieView.as_view(), name="add_movie"),
    path("movies/remove/<str:imdb_id>/", RemoveMovieView.as_view(), name="remove_movie"),
    path("movies/rate/<str:imdb_id>/", RateMovieView.as_view(), name="rate_movie"),
    path("movies/", ListMoviesView.as_view(), name="list_movies"),
    path("movies/save/", SaveMoviesView.as_view(), name="save_movies"),
    path("movies/ratings/", ListRatingsView.as_view(), name="list_ratings"),
]

from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    pass

class Movie(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="movies")
    title = models.CharField(max_length=255)
    year = models.CharField(max_length=4)
    rated = models.CharField(max_length=5, null=True, blank=True)
    released = models.CharField(max_length=15, null=True, blank=True)
    runtime = models.CharField(max_length=10, null=True, blank=True)
    genre = models.CharField(max_length=255, null=True, blank=True)
    director = models.CharField(max_length=255, null=True, blank=True)
    writer = models.CharField(max_length=255, null=True, blank=True)
    actors = models.CharField(max_length=255, null=True, blank=True)
    plot = models.TextField(null=True, blank=True)
    language = models.CharField(max_length=255, null=True, blank=True)
    country = models.CharField(max_length=255, null=True, blank=True)
    awards = models.CharField(max_length=255, null=True, blank=True)
    poster = models.URLField(null=True, blank=True)
    metascore = models.CharField(max_length=5, null=True, blank=True)
    imdb_rating = models.CharField(max_length=5, null=True, blank=True)
    imdb_votes = models.CharField(max_length=20, null=True, blank=True)
    type = models.CharField(max_length=20, null=True, blank=True)
    dvd = models.CharField(max_length=20, null=True, blank=True)
    box_office = models.CharField(max_length=20, null=True, blank=True)
    production = models.CharField(max_length=255, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True)  # User rating from 1-5

    def __str__(self):
        return self.title

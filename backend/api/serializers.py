from rest_framework import serializers
from .models import CustomUser, Movie

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "password", "email"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'

class SaveMoviesSerializer(serializers.Serializer):
    movies = MovieSerializer(many=True)

    def create(self, validated_data):
        user = self.context['request'].user
        movies_data = validated_data['movies']
        movies = []
        for movie_data in movies_data:
            movie, created = Movie.objects.update_or_create(
                user=user,
                title=movie_data['title'],
                defaults=movie_data
            )
            movies.append(movie)
        return {"movies": movies}

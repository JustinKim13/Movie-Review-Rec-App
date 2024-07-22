from rest_framework import generics
from .serializers import UserSerializer
from .models import CustomUser
from rest_framework.permissions import AllowAny

class CreateUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

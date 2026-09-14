from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .models import Profile
from .serializers import RegisterSerializer, UserSerializer


def tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {'access': str(refresh.access_token), 'refresh': str(refresh)}


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {'user': UserSerializer(user).data, 'tokens': tokens_for_user(user)},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email', '')
        password = request.data.get('password', '')
        user = authenticate(username=email, password=password)
        if user is None:
            return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({'user': UserSerializer(user).data, 'tokens': tokens_for_user(user)})


class GoogleLoginView(APIView):
    """
    Verifies a Google Identity Services ID token sent from the frontend and
    logs the user in (creating an account on first sign-in). Requires
    GOOGLE_OAUTH_CLIENT_ID to be set in the environment.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from django.conf import settings
        id_token_str = request.data.get('id_token')
        if not id_token_str:
            return Response({'detail': 'id_token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            from google.oauth2 import id_token as google_id_token
            from google.auth.transport import requests as google_requests

            idinfo = google_id_token.verify_oauth2_token(
                id_token_str, google_requests.Request(), settings.GOOGLE_OAUTH_CLIENT_ID
            )
        except Exception as exc:
            return Response({'detail': f'Invalid Google token: {exc}'}, status=status.HTTP_401_UNAUTHORIZED)

        email = idinfo.get('email')
        google_sub = idinfo.get('sub')
        full_name = idinfo.get('name', '')
        avatar_url = idinfo.get('picture', '')

        user, created = User.objects.get_or_create(
            username=email,
            defaults={'email': email, 'first_name': full_name.split(' ')[0] if full_name else ''},
        )
        profile, _ = Profile.objects.get_or_create(user=user)
        profile.google_sub = google_sub
        profile.auth_provider = 'google'
        profile.avatar_url = avatar_url
        profile.nickname = profile.nickname or full_name
        profile.save()

        return Response({'user': UserSerializer(user).data, 'tokens': tokens_for_user(user)})


class GuestLoginView(APIView):
    """
    Lets someone in with just a nickname - no password, no email. Creates a
    lightweight throwaway account. Good for quick demos; encourage users to
    register properly (or link Google) if they want to keep their history
    across devices/browsers.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        import uuid

        nickname = (request.data.get('nickname') or '').strip()[:60]
        if not nickname:
            return Response({'detail': 'nickname is required.'}, status=status.HTTP_400_BAD_REQUEST)

        username = f"guest_{uuid.uuid4().hex[:12]}"
        user = User.objects.create_user(username=username, password=uuid.uuid4().hex)
        user.first_name = nickname
        user.save()
        Profile.objects.create(user=user, nickname=nickname, auth_provider='guest')

        return Response(
            {'user': UserSerializer(user).data, 'tokens': tokens_for_user(user)},
            status=status.HTTP_201_CREATED,
        )


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)

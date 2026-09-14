from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):
    """Extra profile data on top of Django's built-in User."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    nickname = models.CharField(max_length=60, blank=True)
    avatar_url = models.URLField(blank=True)
    google_sub = models.CharField(max_length=255, blank=True, null=True, unique=True)
    auth_provider = models.CharField(
        max_length=20,
        choices=[('password', 'Password'), ('google', 'Google'), ('guest', 'Nickname (guest)')],
        default='password',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Profile<{self.user.username}>"

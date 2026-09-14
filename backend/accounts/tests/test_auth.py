from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status


class AuthTests(APITestCase):
    def test_register_creates_user_and_returns_tokens(self):
        response = self.client.post('/api/auth/register/', {
            'email': 'jane@example.com',
            'password': 'StrongPass123!',
            'full_name': 'Jane Doe',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data['tokens'])
        self.assertTrue(User.objects.filter(email='jane@example.com').exists())

    def test_register_rejects_duplicate_email(self):
        User.objects.create_user(username='dup@example.com', email='dup@example.com', password='StrongPass123!')
        response = self.client.post('/api/auth/register/', {
            'email': 'dup@example.com',
            'password': 'StrongPass123!',
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_valid_credentials(self):
        User.objects.create_user(username='login@example.com', email='login@example.com', password='StrongPass123!')
        response = self.client.post('/api/auth/login/', {
            'email': 'login@example.com',
            'password': 'StrongPass123!',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data['tokens'])

    def test_login_with_invalid_credentials(self):
        response = self.client.post('/api/auth/login/', {
            'email': 'nouser@example.com',
            'password': 'wrong',
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_guest_login_creates_account_with_nickname(self):
        response = self.client.post('/api/auth/guest/', {'nickname': 'Speedy'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['first_name'], 'Speedy')
        self.assertIn('access', response.data['tokens'])

    def test_guest_login_requires_nickname(self):
        response = self.client.post('/api/auth/guest/', {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_me_requires_authentication(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

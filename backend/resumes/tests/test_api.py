from unittest.mock import patch

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status

from resumes.models import Resume, JobDescription, Analysis


class AnalysisApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='u@example.com', email='u@example.com', password='pass12345!')
        self.client.force_authenticate(user=self.user)

        self.resume = Resume.objects.create(
            user=self.user, title='My Resume', file_type='pdf',
            raw_text='Experienced Python Django developer with PostgreSQL and Docker skills.',
        )
        self.jd = JobDescription.objects.create(
            user=self.user, title='Backend Engineer',
            raw_text='Looking for a Python Django engineer with PostgreSQL and Docker experience.',
        )

    def test_analyze_without_ai_returns_deterministic_score(self):
        response = self.client.post('/api/analyze/', {
            'resume_id': self.resume.id,
            'job_description_id': self.jd.id,
            'run_ai_analysis': False,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('ats_score', response.data)
        self.assertTrue(Analysis.objects.filter(resume=self.resume, job_description=self.jd).exists())

    def test_analyze_requires_authentication(self):
        self.client.force_authenticate(user=None)
        response = self.client.post('/api/analyze/', {
            'resume_id': self.resume.id, 'job_description_id': self.jd.id,
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_analyze_rejects_other_users_resume(self):
        other = User.objects.create_user(username='o@example.com', email='o@example.com', password='pass12345!')
        self.client.force_authenticate(user=other)
        response = self.client.post('/api/analyze/', {
            'resume_id': self.resume.id, 'job_description_id': self.jd.id,
        })
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('resumes.services.gemini.analyze_resume')
    def test_analyze_with_ai_uses_gemini_service(self, mock_analyze):
        mock_analyze.return_value = {
            'summary': 'Strong match.', 'strengths': ['Python'], 'weaknesses': [], 'suggestions': ['Add AWS'],
        }
        response = self.client.post('/api/analyze/', {
            'resume_id': self.resume.id, 'job_description_id': self.jd.id, 'run_ai_analysis': True,
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['ai_summary'], 'Strong match.')
        mock_analyze.assert_called_once()

    def test_templates_endpoint_lists_templates(self):
        response = self.client.get('/api/templates/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 6)

    def test_compare_analyses_endpoint(self):
        a1 = Analysis.objects.create(user=self.user, resume=self.resume, job_description=self.jd, ats_score=70)
        a2 = Analysis.objects.create(user=self.user, resume=self.resume, job_description=self.jd, ats_score=85)
        response = self.client.get(f'/api/analyses/compare/?ids={a1.id},{a2.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)


class ResumeUploadApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='u2@example.com', email='u2@example.com', password='pass12345!')
        self.client.force_authenticate(user=self.user)

    def test_upload_rejects_unsupported_file_type(self):
        bad_file = SimpleUploadedFile('resume.txt', b'plain text resume', content_type='text/plain')
        response = self.client.post('/api/resumes/', {'file': bad_file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_upload_requires_file(self):
        response = self.client.post('/api/resumes/', {}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

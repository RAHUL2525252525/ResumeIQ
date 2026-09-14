from django.contrib.auth.models import User
from django.db import models


def resume_upload_path(instance, filename):
    return f"resumes/user_{instance.user_id}/{filename}"


class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=200, blank=True)
    file = models.FileField(upload_to=resume_upload_path)
    file_type = models.CharField(max_length=10, choices=[('pdf', 'PDF'), ('docx', 'DOCX')])
    raw_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title or f"Resume #{self.pk}"


class JobDescription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_descriptions')
    title = models.CharField(max_length=200, blank=True)
    company = models.CharField(max_length=200, blank=True)
    raw_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title or f"Job Description #{self.pk}"


class Analysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='analyses')
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='analyses')
    job_description = models.ForeignKey(JobDescription, on_delete=models.CASCADE, related_name='analyses')

    ats_score = models.FloatField(default=0)
    similarity_score = models.FloatField(default=0)
    keyword_coverage = models.FloatField(default=0)

    matched_keywords = models.JSONField(default=list)
    missing_keywords = models.JSONField(default=list)
    skills_match = models.JSONField(default=dict)
    keyword_density = models.JSONField(default=dict)
    health_check = models.JSONField(default=dict)
    formatting_issues = models.JSONField(default=list)

    ai_summary = models.TextField(blank=True)
    ai_suggestions = models.JSONField(default=list)

    previous_score = models.FloatField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Analysis #{self.pk} ({self.ats_score:.0f}/100)"


class BuilderResume(models.Model):
    """User-authored resume content for the resume builder / template preview."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='builder_resumes')
    template = models.CharField(max_length=50, default='classic-ats')
    title = models.CharField(max_length=200, default='My Resume')
    data = models.JSONField(default=dict)  # {contact, summary, experience[], education[], skills[], projects[]}
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.title

from rest_framework import serializers

from .models import Resume, JobDescription, Analysis, BuilderResume


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'title', 'file', 'file_type', 'raw_text', 'created_at']
        read_only_fields = ['file_type', 'raw_text', 'created_at']
        extra_kwargs = {'file': {'write_only': True}}


class JobDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobDescription
        fields = ['id', 'title', 'company', 'raw_text', 'created_at']
        read_only_fields = ['created_at']


class AnalysisSerializer(serializers.ModelSerializer):
    resume_title = serializers.CharField(source='resume.title', read_only=True)
    job_title = serializers.CharField(source='job_description.title', read_only=True)

    class Meta:
        model = Analysis
        fields = [
            'id', 'resume', 'job_description', 'resume_title', 'job_title',
            'ats_score', 'similarity_score', 'keyword_coverage',
            'matched_keywords', 'missing_keywords', 'skills_match',
            'keyword_density', 'health_check', 'formatting_issues',
            'ai_summary', 'ai_suggestions', 'previous_score', 'created_at',
        ]
        read_only_fields = fields


class AnalysisCreateSerializer(serializers.Serializer):
    resume_id = serializers.IntegerField()
    job_description_id = serializers.IntegerField()
    run_ai_analysis = serializers.BooleanField(default=True)


class BuilderResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = BuilderResume
        fields = ['id', 'template', 'title', 'data', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

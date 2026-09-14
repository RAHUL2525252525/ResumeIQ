from django.conf import settings
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Resume, JobDescription, Analysis, BuilderResume
from .serializers import (
    ResumeSerializer, JobDescriptionSerializer, AnalysisSerializer,
    AnalysisCreateSerializer, BuilderResumeSerializer,
)
from .services import text_extraction, scoring, gemini
from .services.templates_meta import RESUME_TEMPLATES


class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'detail': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

        if file_obj.size > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
            return Response(
                {'detail': f'File too large. Max {settings.MAX_UPLOAD_SIZE_MB}MB.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            file_type = text_extraction.infer_file_type(file_obj.name)
        except ValueError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            raw_text = text_extraction.extract_text(file_obj, file_type)
        except Exception as exc:
            return Response({'detail': f'Could not read file: {exc}'}, status=status.HTTP_400_BAD_REQUEST)

        title = request.data.get('title') or file_obj.name
        resume = Resume.objects.create(
            user=request.user, title=title, file=file_obj,
            file_type=file_type, raw_text=raw_text,
        )
        return Response(ResumeSerializer(resume).data, status=status.HTTP_201_CREATED)


class JobDescriptionViewSet(viewsets.ModelViewSet):
    serializer_class = JobDescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobDescription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AnalysisViewSet(viewsets.ReadOnlyModelViewSet):
    """Read-only - analyses are created via AnalyzeView. Doubles as history."""
    serializer_class = AnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Analysis.objects.filter(user=self.request.user)


class AnalyzeView(APIView):
    """
    Core endpoint: score a resume against a job description.
    Runs deterministic scoring always; runs Gemini AI analysis when
    run_ai_analysis=True (default) and a key is configured.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = AnalysisCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        try:
            resume = Resume.objects.get(pk=data['resume_id'], user=request.user)
            jd = JobDescription.objects.get(pk=data['job_description_id'], user=request.user)
        except (Resume.DoesNotExist, JobDescription.DoesNotExist):
            return Response({'detail': 'Resume or job description not found.'}, status=status.HTTP_404_NOT_FOUND)

        score_data = scoring.compute_ats_score(resume.raw_text, jd.raw_text)
        skills = scoring.skills_match(resume.raw_text, jd.raw_text)
        density = scoring.keyword_density(resume.raw_text, score_data['matched_keywords'][:15])
        health = scoring.resume_health_check(resume.raw_text)
        formatting_issues = scoring.ats_formatting_check(resume.file_type, resume.raw_text)

        ai_summary = ''
        ai_suggestions = []
        if data['run_ai_analysis']:
            try:
                ai_result = gemini.analyze_resume(resume.raw_text, jd.raw_text)
                ai_summary = ai_result.get('summary', '')
                ai_suggestions = ai_result.get('suggestions', [])
            except gemini.GeminiNotConfigured:
                ai_summary = 'AI analysis unavailable: GEMINI_API_KEY is not configured on the server.'
            except gemini.GeminiRequestError as exc:
                ai_summary = f'AI analysis failed: {exc}'

        previous = Analysis.objects.filter(
            user=request.user, resume=resume, job_description=jd
        ).order_by('-created_at').first()

        analysis = Analysis.objects.create(
            user=request.user, resume=resume, job_description=jd,
            ats_score=score_data['ats_score'],
            similarity_score=score_data['similarity_score'],
            keyword_coverage=score_data['keyword_coverage'],
            matched_keywords=score_data['matched_keywords'],
            missing_keywords=score_data['missing_keywords'],
            skills_match=skills,
            keyword_density=density,
            health_check=health,
            formatting_issues=formatting_issues,
            ai_summary=ai_summary,
            ai_suggestions=ai_suggestions,
            previous_score=previous.ats_score if previous else None,
        )
        return Response(AnalysisSerializer(analysis).data, status=status.HTTP_201_CREATED)


class CompareAnalysesView(APIView):
    """GET /api/analyses/compare/?ids=1,2,3 - side-by-side comparison."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        ids_param = request.query_params.get('ids', '')
        ids = [int(i) for i in ids_param.split(',') if i.strip().isdigit()]
        if not ids:
            return Response({'detail': 'Provide ?ids=1,2,3'}, status=status.HTTP_400_BAD_REQUEST)

        analyses = Analysis.objects.filter(user=request.user, id__in=ids)
        return Response(AnalysisSerializer(analyses, many=True).data)


class BulletImproverView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        bullet = request.data.get('bullet', '').strip()
        role_context = request.data.get('role_context', '')
        if not bullet:
            return Response({'detail': 'bullet is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            improved = gemini.improve_bullet_point(bullet, role_context)
        except gemini.GeminiNotConfigured as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_412_PRECONDITION_FAILED)
        except gemini.GeminiRequestError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_502_BAD_GATEWAY)
        return Response({'original': bullet, 'improved': improved})


class ProfessionalSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_text = request.data.get('resume_text', '')
        resume_id = request.data.get('resume_id')
        target_role = request.data.get('target_role', '')

        if resume_id and not resume_text:
            resume = Resume.objects.filter(pk=resume_id, user=request.user).first()
            resume_text = resume.raw_text if resume else ''

        if not resume_text.strip():
            return Response({'detail': 'resume_text or a valid resume_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            summary = gemini.generate_professional_summary(resume_text, target_role)
        except gemini.GeminiNotConfigured as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_412_PRECONDITION_FAILED)
        except gemini.GeminiRequestError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_502_BAD_GATEWAY)
        return Response({'summary': summary})


class InterviewQuestionsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get('resume_id')
        jd_id = request.data.get('job_description_id')
        try:
            resume = Resume.objects.get(pk=resume_id, user=request.user)
            jd = JobDescription.objects.get(pk=jd_id, user=request.user)
        except (Resume.DoesNotExist, JobDescription.DoesNotExist, TypeError, ValueError):
            return Response({'detail': 'Valid resume_id and job_description_id are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            questions = gemini.generate_interview_questions(resume.raw_text, jd.raw_text)
        except gemini.GeminiNotConfigured as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_412_PRECONDITION_FAILED)
        except gemini.GeminiRequestError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_502_BAD_GATEWAY)
        return Response({'questions': questions})


class CoverLetterView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        resume_id = request.data.get('resume_id')
        jd_id = request.data.get('job_description_id')
        company = request.data.get('company', '')
        tone = request.data.get('tone', 'professional')
        try:
            resume = Resume.objects.get(pk=resume_id, user=request.user)
            jd = JobDescription.objects.get(pk=jd_id, user=request.user)
        except (Resume.DoesNotExist, JobDescription.DoesNotExist, TypeError, ValueError):
            return Response({'detail': 'Valid resume_id and job_description_id are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            letter = gemini.generate_cover_letter(resume.raw_text, jd.raw_text, company, tone)
        except gemini.GeminiNotConfigured as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_412_PRECONDITION_FAILED)
        except gemini.GeminiRequestError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_502_BAD_GATEWAY)
        return Response({'cover_letter': letter})


class BuilderResumeViewSet(viewsets.ModelViewSet):
    serializer_class = BuilderResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BuilderResume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ResumeTemplatesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(RESUME_TEMPLATES)

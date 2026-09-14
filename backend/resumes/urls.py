from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ResumeViewSet, JobDescriptionViewSet, AnalysisViewSet, BuilderResumeViewSet,
    AnalyzeView, CompareAnalysesView, BulletImproverView, ProfessionalSummaryView,
    InterviewQuestionsView, CoverLetterView, ResumeTemplatesView,
)

router = DefaultRouter()
router.register('resumes', ResumeViewSet, basename='resume')
router.register('job-descriptions', JobDescriptionViewSet, basename='job-description')
router.register('analyses', AnalysisViewSet, basename='analysis')
router.register('builder-resumes', BuilderResumeViewSet, basename='builder-resume')

urlpatterns = [
    path('analyze/', AnalyzeView.as_view(), name='analyze'),
    path('analyses/compare/', CompareAnalysesView.as_view(), name='analyses-compare'),
    path('ai/improve-bullet/', BulletImproverView.as_view(), name='improve-bullet'),
    path('ai/professional-summary/', ProfessionalSummaryView.as_view(), name='professional-summary'),
    path('ai/interview-questions/', InterviewQuestionsView.as_view(), name='interview-questions'),
    path('ai/cover-letter/', CoverLetterView.as_view(), name='cover-letter'),
    path('templates/', ResumeTemplatesView.as_view(), name='templates'),
    path('', include(router.urls)),
]

from django.contrib import admin
from .models import Resume, JobDescription, Analysis, BuilderResume

admin.site.register(Resume)
admin.site.register(JobDescription)
admin.site.register(Analysis)
admin.site.register(BuilderResume)

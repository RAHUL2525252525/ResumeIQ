from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.generic import TemplateView
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('resumes.urls')),

    # Serve uploaded files (works even when DEBUG=False; fine for a demo)
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),

    # Everything else goes to the React app
    re_path(r'^(?!api|admin|media|assets|static).*$',
            TemplateView.as_view(template_name='index.html')),
]

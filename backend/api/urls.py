"""
URL routing for API endpoints
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views, auth_views

app_name = 'api'

urlpatterns = [
    # Public endpoints
    path('health/', views.health_check, name='health-check'),
    
    # Authentication endpoints
    path('auth/register/', auth_views.register, name='register'),
    path('auth/login/', auth_views.login, name='login'),
    path('auth/logout/', auth_views.logout, name='logout'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('auth/profile/', auth_views.user_profile, name='user-profile'),
    path('auth/verify-email/', auth_views.verify_email, name='verify-email'),
    path('auth/resend-verification/', auth_views.resend_verification, name='resend-verification'),
    
    # Resume endpoints (protected)
    path('resumes/', views.resume_list, name='resume-list'),
    path('resumes/<str:pk>/', views.resume_detail, name='resume-detail'),
]


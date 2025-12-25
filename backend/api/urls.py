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
    path('auth/forgot-password/', auth_views.forgot_password, name='forgot-password'),
    path('auth/reset-password/', auth_views.reset_password, name='reset-password'),
    
    # Resume endpoints (protected)
    path('resumes/', views.resume_list, name='resume-list'),
    path('resumes/parse/', views.parse_resume, name='resume-parse'),  # Must come before <str:pk> pattern
    path('resumes/<str:resume_id>/pdf/', views.generate_resume_pdf, name='resume-pdf'),
    path('resumes/<str:pk>/', views.resume_detail, name='resume-detail'),
    
    # Blog post endpoints
    path('blog-posts/', views.blog_post_list, name='blog-post-list'),
    path('blog-posts/<str:post_id>/', views.blog_post_detail, name='blog-post-detail'),
]


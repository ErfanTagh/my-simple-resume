"""
API Views for Resume/CV operations
"""
from .resume_views import resume_list, resume_detail
from .parse_views import parse_resume
from .health_views import health_check
from .pdf_views import generate_resume_pdf
from .blog_views import blog_post_list, blog_post_detail

__all__ = [
    'resume_list',
    'resume_detail',
    'parse_resume',
    'health_check',
    'generate_resume_pdf',
    'blog_post_list',
    'blog_post_detail',
]


"""
API Views for Resume/CV operations
"""
from .resume_views import resume_list, resume_detail
from .parse_views import parse_resume
from .health_views import health_check
from .pdf_views import generate_resume_pdf
from .blog_views import blog_post_list, blog_post_detail
from .sitemap_views import generate_sitemap
from .match_views import match_resume_to_job

__all__ = [
    'resume_list',
    'resume_detail',
    'parse_resume',
    'health_check',
    'generate_resume_pdf',
    'blog_post_list',
    'blog_post_detail',
    'generate_sitemap',
    'match_resume_to_job',
]


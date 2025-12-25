"""
Role-based permissions for blog system
"""
import os
from django.contrib.auth.models import User


# Default role permissions mapping
DEFAULT_ROLE_PERMISSIONS = {
    'admin': {
        'can_create': True,
        'can_edit': True,
        'can_delete': True,
        'can_publish': True,
        'can_schedule': True,
        'can_manage_all': True,
        'can_edit_own': True,
    },
    'editor': {
        'can_create': True,
        'can_edit': True,
        'can_delete': True,
        'can_publish': True,
        'can_schedule': True,
        'can_manage_all': True,
        'can_edit_own': True,
    },
    'writer': {
        'can_create': True,
        'can_edit': True,
        'can_delete': False,
        'can_publish': False,
        'can_schedule': True,
        'can_manage_all': False,
        'can_edit_own': True,
    },
    'viewer': {
        'can_create': False,
        'can_edit': False,
        'can_delete': False,
        'can_publish': False,
        'can_schedule': False,
        'can_manage_all': False,
        'can_edit_own': False,
    },
}


def get_user_role(user: User) -> str:
    """
    Get user role from various sources.
    
    Priority:
    1. user.profile.role (if UserProfile exists)
    2. user.role (if custom User model has role field)
    3. user.is_superuser -> 'admin'
    4. user.is_staff -> 'editor'
    5. Environment variable mapping (BLOG_USER_ROLES=username:role,username2:role2)
    6. Default: 'viewer'
    """
    if not user or not user.is_authenticated:
        return 'viewer'
    
    # Check for UserProfile extension (common pattern)
    if hasattr(user, 'profile') and hasattr(user.profile, 'role'):
        return getattr(user.profile, 'role', 'viewer')
    
    # Check for custom role field on User model
    if hasattr(user, 'role'):
        return getattr(user, 'role', 'viewer')
    
    # Check Django built-in flags
    if user.is_superuser:
        return 'admin'
    
    if user.is_staff:
        return 'editor'
    
    # Check environment variable mapping
    # Format: BLOG_USER_ROLES=username1:role1,username2:role2
    role_mapping = os.getenv('BLOG_USER_ROLES', '')
    if role_mapping:
        mappings = dict(item.split(':') for item in role_mapping.split(',') if ':' in item)
        if user.username in mappings:
            return mappings[user.username]
    
    # Default role
    return 'viewer'


def get_user_permissions(user: User) -> dict:
    """Get permissions for a user based on their role."""
    role = get_user_role(user)
    return DEFAULT_ROLE_PERMISSIONS.get(role, DEFAULT_ROLE_PERMISSIONS['viewer']).copy()


def has_permission(user: User, permission: str, post_author_id: str = None) -> bool:
    """
    Check if user has a specific permission.
    
    Args:
        user: Django User object
        permission: Permission name (e.g., 'can_create', 'can_edit', 'can_delete', 'can_publish')
        post_author_id: Optional author ID to check ownership for edit/delete permissions
    
    Returns:
        bool: True if user has permission
    """
    if not user or not user.is_authenticated:
        return False
    
    perms = get_user_permissions(user)
    
    # Check permission
    if permission not in perms:
        return False
    
    if not perms[permission]:
        return False
    
    # For edit/delete, check if user can manage all or only own posts
    if permission in ('can_edit', 'can_delete'):
        if perms['can_manage_all']:
            return True
        
        if perms['can_edit_own'] and post_author_id:
            return str(user.id) == str(post_author_id)
        
        return False
    
    return True


def can_create(user: User) -> bool:
    """Check if user can create blog posts."""
    return has_permission(user, 'can_create')


def can_edit(user: User, post_author_id: str = None) -> bool:
    """Check if user can edit blog posts."""
    return has_permission(user, 'can_edit', post_author_id)


def can_delete(user: User, post_author_id: str = None) -> bool:
    """Check if user can delete blog posts."""
    return has_permission(user, 'can_delete', post_author_id)


def can_publish(user: User) -> bool:
    """Check if user can publish blog posts."""
    return has_permission(user, 'can_publish')


def can_schedule(user: User) -> bool:
    """Check if user can schedule blog posts."""
    return has_permission(user, 'can_schedule')


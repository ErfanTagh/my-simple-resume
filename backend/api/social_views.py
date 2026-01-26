"""
REST API views for social authentication using OAuth 2.0
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.conf import settings
import requests
import secrets
import logging
from urllib.parse import urlencode, parse_qs, urlparse

logger = logging.getLogger(__name__)

# Store OAuth state temporarily (in production, use Redis or database)
_oauth_states = {}


def get_jwt_tokens_for_user(user):
    """Generate JWT tokens for a user"""
    refresh = RefreshToken.for_user(user)
    
    # Add custom claims
    from .permissions import get_user_role
    role = get_user_role(user)
    
    refresh['username'] = user.username
    refresh['email'] = user.email
    refresh['role'] = role
    
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


def get_or_create_user_from_social(email, first_name='', last_name='', provider='', provider_id=''):
    """Get or create a user from social account information"""
    # Try to find existing user by email
    try:
        user = User.objects.get(email=email)
        # User exists, activate if inactive
        if not user.is_active:
            user.is_active = True
            user.save()
        return user
    except User.DoesNotExist:
        # Create new user
        # Generate username from email
        base_username = email.split('@')[0]
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
        
        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name or '',
            last_name=last_name or '',
            is_active=True,  # Social logins are trusted, no email verification needed
        )
        return user


@api_view(['GET'])
@permission_classes([AllowAny])
def social_login_url(request, provider):
    """
    Get the OAuth login URL for a provider
    
    Returns the URL the frontend should redirect to for OAuth login.
    """
    if provider not in ['google', 'linkedin', 'xing']:
        return Response(
            {'error': f'Unsupported provider: {provider}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)
    _oauth_states[state] = {
        'provider': provider,
        'redirect_uri': request.GET.get('redirect_uri', ''),
    }
    
    base_url = request.build_absolute_uri('/').rstrip('/')
    callback_url = f"{base_url}/api/auth/social/{provider}/callback/"
    
    if provider == 'google':
        client_id = settings.GOOGLE_CLIENT_ID if hasattr(settings, 'GOOGLE_CLIENT_ID') else ''
        if not client_id:
            return Response(
                {'error': 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID in environment variables.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        params = {
            'client_id': client_id,
            'redirect_uri': callback_url,
            'response_type': 'code',
            'scope': 'openid email profile',
            'state': state,
            'access_type': 'online',
        }
        auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
        
    elif provider == 'linkedin':
        client_id = settings.LINKEDIN_CLIENT_ID if hasattr(settings, 'LINKEDIN_CLIENT_ID') else ''
        if not client_id:
            return Response(
                {'error': 'LinkedIn OAuth not configured. Please set LINKEDIN_CLIENT_ID in environment variables.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        params = {
            'client_id': client_id,
            'redirect_uri': callback_url,
            'response_type': 'code',
            'scope': 'openid profile email',
            'state': state,
        }
        auth_url = f"https://www.linkedin.com/oauth/v2/authorization?{urlencode(params)}"
        
    elif provider == 'xing':
        client_id = settings.XING_CLIENT_ID if hasattr(settings, 'XING_CLIENT_ID') else ''
        if not client_id:
            return Response(
                {'error': 'Xing OAuth not configured. Please set XING_CLIENT_ID in environment variables.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        params = {
            'client_id': client_id,
            'redirect_uri': callback_url,
            'response_type': 'code',
            'scope': 'profile',
            'state': state,
        }
        auth_url = f"https://api.xing.com/auth/oauth2/authorize?{urlencode(params)}"
    
    else:
        return Response(
            {'error': f'Provider {provider} not implemented'},
            status=status.HTTP_501_NOT_IMPLEMENTED
        )
    
    return Response({
        'auth_url': auth_url,
        'state': state,
        'callback_url': callback_url,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def social_login_callback(request, provider):
    """
    Handle OAuth callback from provider
    
    This endpoint receives the OAuth callback, exchanges the code for tokens,
    fetches user info, and returns JWT tokens.
    """
    code = request.GET.get('code')
    state = request.GET.get('state')
    error = request.GET.get('error')
    
    if error:
        return Response(
            {'error': f'OAuth error: {error}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not code or not state:
        return Response(
            {'error': 'Missing code or state parameter'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verify state
    if state not in _oauth_states:
        return Response(
            {'error': 'Invalid state parameter'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    state_data = _oauth_states.pop(state)
    if state_data['provider'] != provider:
        return Response(
            {'error': 'State provider mismatch'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    base_url = request.build_absolute_uri('/').rstrip('/')
    callback_url = f"{base_url}/api/auth/social/{provider}/callback/"
    
    try:
        if provider == 'google':
            user_info = _handle_google_callback(code, callback_url)
        elif provider == 'linkedin':
            user_info = _handle_linkedin_callback(code, callback_url)
        elif provider == 'xing':
            user_info = _handle_xing_callback(code, callback_url)
        else:
            return Response(
                {'error': f'Unsupported provider: {provider}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create user
        user = get_or_create_user_from_social(
            email=user_info['email'],
            first_name=user_info.get('first_name', ''),
            last_name=user_info.get('last_name', ''),
            provider=provider,
            provider_id=user_info.get('id', ''),
        )
        
        # Generate JWT tokens
        tokens = get_jwt_tokens_for_user(user)
        
        # Redirect to frontend callback URL with tokens
        redirect_uri = state_data.get('redirect_uri', '')
        if not redirect_uri:
            # Default to /oauth/callback if no redirect_uri provided
            redirect_uri = f"{request.build_absolute_uri('/').rstrip('/')}/oauth/callback"
        
        # Append tokens to redirect URI
        from urllib.parse import urlencode
        token_params = urlencode({
            'access_token': tokens['access'],
            'refresh_token': tokens['refresh'],
            'state': state,  # Include state for verification
        })
        redirect_url = f"{redirect_uri}?{token_params}"
        
        # Redirect to frontend
        from django.shortcuts import redirect
        return redirect(redirect_url)
            
    except Exception as e:
        logger.error(f"Social login callback error: {str(e)}", exc_info=True)
        return Response(
            {'error': f'Social login failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


def _handle_google_callback(code, callback_url):
    """Handle Google OAuth callback"""
    client_id = settings.GOOGLE_CLIENT_ID if hasattr(settings, 'GOOGLE_CLIENT_ID') else ''
    client_secret = settings.GOOGLE_CLIENT_SECRET if hasattr(settings, 'GOOGLE_CLIENT_SECRET') else ''
    
    if not client_id or not client_secret:
        raise ValueError('Google OAuth not configured')
    
    # Exchange code for tokens
    token_url = 'https://oauth2.googleapis.com/token'
    token_data = {
        'code': code,
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': callback_url,
        'grant_type': 'authorization_code',
    }
    
    token_response = requests.post(token_url, data=token_data)
    token_response.raise_for_status()
    tokens = token_response.json()
    access_token = tokens['access_token']
    
    # Get user info
    user_info_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
    headers = {'Authorization': f'Bearer {access_token}'}
    user_response = requests.get(user_info_url, headers=headers)
    user_response.raise_for_status()
    user_data = user_response.json()
    
    return {
        'id': user_data.get('id', ''),
        'email': user_data.get('email', ''),
        'first_name': user_data.get('given_name', ''),
        'last_name': user_data.get('family_name', ''),
    }


def _handle_linkedin_callback(code, callback_url):
    """Handle LinkedIn OAuth callback"""
    client_id = settings.LINKEDIN_CLIENT_ID if hasattr(settings, 'LINKEDIN_CLIENT_ID') else ''
    client_secret = settings.LINKEDIN_CLIENT_SECRET if hasattr(settings, 'LINKEDIN_CLIENT_SECRET') else ''
    
    if not client_id or not client_secret:
        raise ValueError('LinkedIn OAuth not configured')
    
    # Exchange code for tokens
    token_url = 'https://www.linkedin.com/oauth/v2/accessToken'
    token_data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': callback_url,
        'client_id': client_id,
        'client_secret': client_secret,
    }
    
    token_response = requests.post(token_url, data=token_data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
    token_response.raise_for_status()
    tokens = token_response.json()
    access_token = tokens['access_token']
    
    # Get user info
    user_info_url = 'https://api.linkedin.com/v2/userinfo'
    headers = {'Authorization': f'Bearer {access_token}'}
    user_response = requests.get(user_info_url, headers=headers)
    user_response.raise_for_status()
    user_data = user_response.json()
    
    # LinkedIn returns name in sub object
    name = user_data.get('name', {})
    
    return {
        'id': user_data.get('sub', ''),
        'email': user_data.get('email', ''),
        'first_name': name.get('given_name', ''),
        'last_name': name.get('family_name', ''),
    }


def _handle_xing_callback(code, callback_url):
    """Handle Xing OAuth callback"""
    client_id = settings.XING_CLIENT_ID if hasattr(settings, 'XING_CLIENT_ID') else ''
    client_secret = settings.XING_CLIENT_SECRET if hasattr(settings, 'XING_CLIENT_SECRET') else ''
    
    if not client_id or not client_secret:
        raise ValueError('Xing OAuth not configured')
    
    # Exchange code for tokens
    token_url = 'https://api.xing.com/auth/oauth2/token'
    token_data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': callback_url,
        'client_id': client_id,
        'client_secret': client_secret,
    }
    
    token_response = requests.post(token_url, data=token_data)
    token_response.raise_for_status()
    tokens = token_response.json()
    access_token = tokens['access_token']
    
    # Get user info
    user_info_url = 'https://api.xing.com/v1/users/me'
    headers = {'Authorization': f'Bearer {access_token}'}
    user_response = requests.get(user_info_url, headers=headers)
    user_response.raise_for_status()
    user_data = user_response.json()
    
    # Xing returns user data in 'users' array
    user = user_data.get('users', [{}])[0] if user_data.get('users') else {}
    
    return {
        'id': user.get('id', ''),
        'email': user.get('active_email', ''),
        'first_name': user.get('first_name', ''),
        'last_name': user.get('last_name', ''),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def xing_plugin_login(request):
    """
    Handle XING Login Plugin authentication
    
    This endpoint receives user data directly from the XING Login Plugin
    (client-side JavaScript widget) and creates/retrieves user account.
    """
    try:
        data = request.data
        user_data = data.get('user', {})
        
        if not user_data:
            return Response(
                {'error': 'No user data provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract user information from XING plugin response
        # XING plugin returns data in this format:
        # {
        #   "user": {
        #     "id": "...",
        #     "first_name": "...",
        #     "last_name": "...",
        #     "display_name": "...",
        #     "active_email": "...",
        #     ...
        #   }
        # }
        email = user_data.get('active_email', '')
        if not email:
            return Response(
                {'error': 'Email is required for XING login'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        first_name = user_data.get('first_name', '')
        last_name = user_data.get('last_name', '')
        xing_id = user_data.get('id', '')
        
        # Get or create user
        user = get_or_create_user_from_social(
            email=email,
            first_name=first_name,
            last_name=last_name,
            provider='xing',
            provider_id=xing_id,
        )
        
        # Generate JWT tokens
        tokens = get_jwt_tokens_for_user(user)
        
        # Return tokens and user info
        return Response({
            'tokens': tokens,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
        })
        
    except Exception as e:
        logger.error(f"XING plugin login error: {str(e)}", exc_info=True)
        return Response(
            {'error': f'XING login failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

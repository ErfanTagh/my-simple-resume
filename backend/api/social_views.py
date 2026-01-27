"""
REST API views for social authentication using OAuth 2.0
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.conf import settings
import requests
import secrets
import logging
from urllib.parse import urlencode, parse_qs, urlparse

logger = logging.getLogger(__name__)

# OAuth state is stored in Django sessions (works across multiple workers)


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
    if provider not in ['google', 'linkedin', 'github']:
        return Response(
            {'error': f'Unsupported provider: {provider}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Generate state for CSRF protection
    state = secrets.token_urlsafe(32)
    # Store state in session (works across multiple workers)
    request.session[f'oauth_state_{state}'] = {
        'provider': provider,
        'redirect_uri': request.GET.get('redirect_uri', ''),
    }
    request.session.save()  # Ensure session is saved
    
    # Build callback URL - use DOMAIN from settings if available, otherwise use request
    # This ensures consistency in production when behind a reverse proxy
    domain = getattr(settings, 'DOMAIN', '')
    if domain and not domain.startswith('localhost'):
        # Production: use configured domain
        if domain.startswith('http'):
            base_url = domain.rstrip('/')
        else:
            base_url = f"https://{domain}".rstrip('/')
    else:
        # Development: use request host
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
        
        # Log the callback URL for debugging (without sensitive data)
        logger.info(f"LinkedIn OAuth: Generated callback URL: {callback_url}")
        
        params = {
            'client_id': client_id,
            'redirect_uri': callback_url,
            'response_type': 'code',
            # LinkedIn OpenID Connect scopes
            # Basic: 'openid profile email' - gives name, email, picture
            # For detailed profile data (positions, education, etc.), you may need:
            # - Partner Program access
            # - Additional permissions in LinkedIn Developer Portal
            # - Different API endpoints (v2/me, v2/positions, etc.)
            'scope': 'openid profile email',
            'state': state,
        }
        auth_url = f"https://www.linkedin.com/oauth/v2/authorization?{urlencode(params)}"
        
    elif provider == 'github':
        client_id = settings.GITHUB_CLIENT_ID if hasattr(settings, 'GITHUB_CLIENT_ID') else ''
        if not client_id:
            return Response(
                {'error': 'GitHub OAuth not configured. Please set GITHUB_CLIENT_ID in environment variables.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        params = {
            'client_id': client_id,
            'redirect_uri': callback_url,
            'scope': 'user:email',
            'state': state,
        }
        auth_url = f"https://github.com/login/oauth/authorize?{urlencode(params)}"
        
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
    
    # Verify state from session (works across multiple workers)
    state_key = f'oauth_state_{state}'
    if state_key not in request.session:
        logger.error(f"State not found in session. Received state: {state[:20]}..., Available session keys: {list(request.session.keys())[:5]}")
        return Response(
            {'error': 'Invalid state parameter - state not found in session'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    state_data = request.session.pop(state_key)
    if state_data['provider'] != provider:
        logger.error(f"State provider mismatch - expected: {provider}, got: {state_data.get('provider')}")
        return Response(
            {'error': 'State provider mismatch'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Build callback URL - use DOMAIN from settings if available, otherwise use request
    # This ensures consistency in production when behind a reverse proxy
    domain = getattr(settings, 'DOMAIN', '')
    if domain and not domain.startswith('localhost'):
        # Production: use configured domain
        if domain.startswith('http'):
            base_url = domain.rstrip('/')
        else:
            base_url = f"https://{domain}".rstrip('/')
    else:
        # Development: use request host
        base_url = request.build_absolute_uri('/').rstrip('/')
    
    callback_url = f"{base_url}/api/auth/social/{provider}/callback/"
    
    # Log callback URL for debugging
    if provider == 'linkedin':
        logger.info(f"LinkedIn callback: Using redirect URI: {callback_url}")
    
    try:
        if provider == 'google':
            user_info = _handle_google_callback(code, callback_url)
        elif provider == 'linkedin':
            user_info = _handle_linkedin_callback(code, callback_url)
        elif provider == 'github':
            user_info = _handle_github_callback(code, callback_url)
        else:
            return Response(
                {'error': f'Unsupported provider: {provider}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get or create user
        logger.info(f"Creating/retrieving user for {provider} - email: {user_info.get('email', 'N/A')[:20]}...")
        user = get_or_create_user_from_social(
            email=user_info['email'],
            first_name=user_info.get('first_name', ''),
            last_name=user_info.get('last_name', ''),
            provider=provider,
            provider_id=user_info.get('id', ''),
        )
        logger.info(f"User created/retrieved: {user.username}")
        
        # Generate JWT tokens
        logger.info(f"Generating JWT tokens for user: {user.username}")
        tokens = get_jwt_tokens_for_user(user)
        logger.info("JWT tokens generated successfully")
        
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
        logger.info(f"Redirecting to frontend: {redirect_uri[:50]}...")
        
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
    
    logger.info(f"LinkedIn token exchange: URL={token_url}, redirect_uri={callback_url}")
    token_response = requests.post(token_url, data=token_data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
    
    # Better error handling for LinkedIn
    if not token_response.ok:
        error_text = token_response.text
        logger.error(f"LinkedIn token exchange failed: status={token_response.status_code}, response={error_text}")
        try:
            error_json = token_response.json()
            error_description = error_json.get('error_description', error_text)
            error_code = error_json.get('error', 'unknown')
            raise ValueError(f'LinkedIn token exchange failed: {error_code} - {error_description}')
        except:
            raise ValueError(f'LinkedIn token exchange failed: {token_response.status_code} - {error_text}')
    
    logger.info("LinkedIn token exchange successful")
    
    tokens = token_response.json()
    access_token = tokens.get('access_token')
    
    if not access_token:
        raise ValueError('LinkedIn did not return an access token')
    
    # Get user info - LinkedIn uses v2/userinfo endpoint for OpenID Connect
    user_info_url = 'https://api.linkedin.com/v2/userinfo'
    headers = {'Authorization': f'Bearer {access_token}'}
    logger.info(f"LinkedIn user info request: URL={user_info_url}")
    user_response = requests.get(user_info_url, headers=headers)
    
    if not user_response.ok:
        error_text = user_response.text
        logger.error(f"LinkedIn user info failed: status={user_response.status_code}, response={error_text}")
        try:
            error_json = user_response.json()
            error_description = error_json.get('error_description', error_text)
            raise ValueError(f'LinkedIn user info failed: {error_description}')
        except:
            raise ValueError(f'LinkedIn user info failed: {user_response.status_code} - {error_text}')
    
    logger.info("LinkedIn user info retrieved successfully")
    
    user_data = user_response.json()
    
    # LinkedIn OpenID Connect returns name - could be object or string
    name = user_data.get('name', {})
    
    # Handle both cases: name as object with given_name/family_name, or name as string
    if isinstance(name, dict):
        first_name = name.get('given_name', '')
        last_name = name.get('family_name', '')
    elif isinstance(name, str):
        # If name is a string, try to split it
        name_parts = name.strip().split(' ', 1)
        first_name = name_parts[0] if len(name_parts) > 0 else ''
        last_name = name_parts[1] if len(name_parts) > 1 else ''
    else:
        # Fallback: try given_name and family_name directly from user_data
        first_name = user_data.get('given_name', '')
        last_name = user_data.get('family_name', '')
    
    return {
        'id': user_data.get('sub', ''),
        'email': user_data.get('email', ''),
        'first_name': first_name,
        'last_name': last_name,
    }


def _handle_github_callback(code, callback_url):
    """Handle GitHub OAuth callback"""
    client_id = settings.GITHUB_CLIENT_ID if hasattr(settings, 'GITHUB_CLIENT_ID') else ''
    client_secret = settings.GITHUB_CLIENT_SECRET if hasattr(settings, 'GITHUB_CLIENT_SECRET') else ''
    
    if not client_id or not client_secret:
        raise ValueError('GitHub OAuth not configured')
    
    # Exchange code for tokens
    token_url = 'https://github.com/login/oauth/access_token'
    token_data = {
        'client_id': client_id,
        'client_secret': client_secret,
        'code': code,
        'redirect_uri': callback_url,
    }
    
    token_response = requests.post(
        token_url,
        data=token_data,
        headers={'Accept': 'application/json'}
    )
    token_response.raise_for_status()
    tokens = token_response.json()
    access_token = tokens.get('access_token')
    
    if not access_token:
        raise ValueError('GitHub did not return an access token')
    
    # Get user info
    user_info_url = 'https://api.github.com/user'
    headers = {
        'Authorization': f'token {access_token}',
        'Accept': 'application/vnd.github.v3+json'
    }
    user_response = requests.get(user_info_url, headers=headers)
    user_response.raise_for_status()
    user_data = user_response.json()
    
    # GitHub API doesn't return email in user endpoint by default
    # Need to fetch email separately
    email = user_data.get('email', '')
    if not email:
        # Try to get email from email endpoint
        email_url = 'https://api.github.com/user/emails'
        email_response = requests.get(email_url, headers=headers)
        if email_response.ok:
            emails = email_response.json()
            # Get primary email or first verified email
            primary_email = next((e for e in emails if e.get('primary')), None)
            if primary_email:
                email = primary_email.get('email', '')
            elif emails:
                # Get first verified email
                verified_email = next((e for e in emails if e.get('verified')), None)
                if verified_email:
                    email = verified_email.get('email', '')
    
    # GitHub name might be full name or username
    name = user_data.get('name', '') or user_data.get('login', '')
    name_parts = name.strip().split(' ', 1) if name else ['', '']
    first_name = name_parts[0] if len(name_parts) > 0 else ''
    last_name = name_parts[1] if len(name_parts) > 1 else ''
    
    return {
        'id': str(user_data.get('id', '')),
        'email': email,
        'first_name': first_name,
        'last_name': last_name,
    }



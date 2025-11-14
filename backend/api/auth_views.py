"""
Authentication views for user registration and login
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings
from .models import EmailVerification, PasswordReset
from .email_verification import (
    generate_verification_token,
    create_verification_link,
    send_verification_email,
    send_welcome_email,
    send_password_reset_email,
    send_password_changed_email
)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Custom token serializer to include user info"""
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user info to response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom token view"""
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user
    
    Expected payload:
    {
        "username": "string",
        "email": "string",
        "password": "string",
        "first_name": "string" (optional),
        "last_name": "string" (optional)
    }
    """
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    
    # Validation
    if not username or not email or not password:
        return Response(
            {'error': 'Username, email, and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if user already exists
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Username already exists'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if User.objects.filter(email=email).exists():
        return Response(
            {'error': 'Email already registered'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create user (inactive until email is verified)
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_active=False  # User must verify email first
        )
        
        # Generate verification token
        token = generate_verification_token()
        
        # Create verification record
        verification = EmailVerification.objects.create(
            user=user,
            token=token
        )
        
        # Send verification email
        domain = settings.DOMAIN
        verification_link = create_verification_link(token, domain)
        email_sent = send_verification_email(email, username, verification_link)
        
        if not email_sent:
            # If email fails, still return success but warn the user
            return Response({
                'message': 'User registered but email could not be sent. Please contact support.',
                'email_verified': False,
                'user': {
                    'username': username,
                    'email': email,
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'message': 'Registration successful! Please check your email to verify your account.',
            'email_verified': False,
            'user': {
                'username': username,
                'email': email,
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user
    
    Expected payload:
    {
        "username": "string",
        "password": "string"
    }
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if user exists
    try:
        user_obj = User.objects.get(username=username)
        
        # Check if email is verified
        if not user_obj.is_active:
            try:
                verification = EmailVerification.objects.get(user=user_obj)
                if not verification.is_verified:
                    return Response({
                        'error': 'Please verify your email before logging in. Check your inbox for the verification link.',
                        'email_verified': False
                    }, status=status.HTTP_403_FORBIDDEN)
            except EmailVerification.DoesNotExist:
                pass
    except User.DoesNotExist:
        pass
    
    user = authenticate(username=username, password=password)
    
    if user is not None:
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    else:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
def logout(request):
    """
    Logout user by blacklisting the refresh token
    
    Expected payload:
    {
        "refresh": "refresh_token_string"
    }
    """
    try:
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'error': 'Refresh token is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        token = RefreshToken(refresh_token)
        token.blacklist()
        
        return Response(
            {'message': 'Logout successful'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
def user_profile(request):
    """
    Get current user profile
    """
    user = request.user
    
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    """
    Verify user email with token
    
    Expected payload:
    {
        "token": "verification_token_string"
    }
    """
    token = request.data.get('token')
    
    if not token:
        return Response(
            {'error': 'Verification token is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        verification = EmailVerification.objects.get(token=token)
        
        # Check if already verified
        if verification.is_verified:
            return Response({
                'message': 'Email already verified. You can log in now.',
                'email_verified': True
            })
        
        # Check if token is expired
        if verification.is_expired():
            return Response({
                'error': 'Verification link has expired. Please request a new one.',
                'expired': True
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Mark as verified and activate user
        verification.is_verified = True
        verification.save()
        
        user = verification.user
        user.is_active = True
        user.save()
        
        # Send welcome email
        send_welcome_email(user.email, user.username)
        
        return Response({
            'message': 'Email verified successfully! You can now log in.',
            'email_verified': True,
            'user': {
                'username': user.username,
                'email': user.email
            }
        })
        
    except EmailVerification.DoesNotExist:
        return Response({
            'error': 'Invalid verification token',
            'invalid': True
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def resend_verification(request):
    """
    Resend verification email
    
    Expected payload:
    {
        "email": "user@example.com"
    }
    """
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'error': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
        
        # Check if already verified
        if user.is_active:
            return Response({
                'message': 'Email is already verified. You can log in now.'
            })
        
        # Get or create verification record
        try:
            verification = EmailVerification.objects.get(user=user)
            
            # Check if already verified
            if verification.is_verified:
                user.is_active = True
                user.save()
                return Response({
                    'message': 'Email is already verified. You can log in now.'
                })
            
            # Generate new token
            verification.token = generate_verification_token()
            from django.utils import timezone
            from datetime import timedelta
            verification.expires_at = timezone.now() + timedelta(hours=24)
            verification.save()
            
        except EmailVerification.DoesNotExist:
            # Create new verification record
            verification = EmailVerification.objects.create(
                user=user,
                token=generate_verification_token()
            )
        
        # Send new verification email
        domain = settings.DOMAIN
        verification_link = create_verification_link(verification.token, domain)
        email_sent = send_verification_email(email, user.username, verification_link)
        
        if not email_sent:
            return Response({
                'error': 'Failed to send verification email. Please try again later.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            'message': 'Verification email sent! Please check your inbox.'
        })
        
    except User.DoesNotExist:
        # Don't reveal if email exists or not (security)
        return Response({
            'message': 'If this email is registered, a verification link has been sent.'
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """
    Send password reset email
    
    Expected payload:
    {
        "email": "user@example.com"
    }
    """
    email = request.data.get('email')
    
    if not email:
        return Response(
            {'error': 'Email is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
        
        # Generate reset token
        token = generate_verification_token()
        
        # Invalidate any previous unused reset tokens for this user
        PasswordReset.objects.filter(user=user, is_used=False).update(is_used=True)
        
        # Create new password reset record
        password_reset = PasswordReset.objects.create(
            user=user,
            token=token
        )
        
        # Send password reset email
        domain = settings.DOMAIN
        reset_link = f"https://{domain}/reset-password?token={token}"
        email_sent = send_password_reset_email(email, user.username, reset_link)
        
        if not email_sent:
            return Response({
                'error': 'Failed to send password reset email. Please try again later.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({
            'message': 'Password reset email sent! Please check your inbox.'
        })
        
    except User.DoesNotExist:
        # Don't reveal if email exists or not (security)
        return Response({
            'message': 'If this email is registered, a password reset link has been sent.'
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """
    Reset password with token
    
    Expected payload:
    {
        "token": "reset_token_string",
        "password": "new_password"
    }
    """
    token = request.data.get('token')
    new_password = request.data.get('password')
    
    if not token or not new_password:
        return Response(
            {'error': 'Token and new password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate password length
    if len(new_password) < 6:
        return Response(
            {'error': 'Password must be at least 6 characters long'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        password_reset = PasswordReset.objects.get(token=token)
        
        # Check if already used
        if password_reset.is_used:
            return Response({
                'error': 'This password reset link has already been used.',
                'used': True
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if token is expired
        if password_reset.is_expired():
            return Response({
                'error': 'Password reset link has expired. Please request a new one.',
                'expired': True
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Reset the password
        user = password_reset.user
        user.set_password(new_password)
        user.save()
        
        # Mark token as used
        password_reset.is_used = True
        password_reset.save()
        
        # Send confirmation email
        send_password_changed_email(user.email, user.username)
        
        return Response({
            'message': 'Password has been reset successfully! You can now log in with your new password.',
            'success': True
        })
        
    except PasswordReset.DoesNotExist:
        return Response({
            'error': 'Invalid password reset token',
            'invalid': True
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


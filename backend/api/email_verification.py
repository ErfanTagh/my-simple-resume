"""
Email verification utilities
"""
import secrets
import hashlib
from datetime import datetime, timedelta
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string


def generate_verification_token():
    """Generate a unique verification token"""
    return secrets.token_urlsafe(32)


def create_verification_link(token, domain):
    """Create a verification link"""
    return f"https://{domain}/verify-email?token={token}"


def send_verification_email(user_email, username, verification_link):
    """Send verification email to user"""
    subject = 'Verify Your Email - 123Resume'
    
    # Simple plain text email
    plain_message = f"""Welcome to 123Resume

Hi {username},

Thanks for signing up. To get started, please verify your email address by clicking the link below:

{verification_link}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

© 2025 123Resume. All rights reserved.
"""
    
    # Simple HTML version
    html_message = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2>Welcome to 123Resume</h2>
    <p>Hi {username},</p>
    <p>Thanks for signing up. To get started, please verify your email address by clicking the link below:</p>
    <p><a href="{verification_link}">{verification_link}</a></p>
    <p>This link will expire in 24 hours.</p>
    <p>If you didn't create an account, you can safely ignore this email.</p>
    <hr>
    <p style="color: #666; font-size: 12px;">© 2025 123Resume. All rights reserved.</p>
</body>
</html>
"""
    
    try:
        # Ensure FROM email matches the authenticated email to avoid blocking
        from_email = settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER
        if not from_email:
            print("Error: EMAIL_HOST_USER or DEFAULT_FROM_EMAIL not configured")
            return False
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=from_email,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        error_msg = str(e)
        print(f"Error sending email: {error_msg}")
        
        # Provide helpful error messages
        if "blocked" in error_msg.lower() or "550" in error_msg:
            print("⚠️  Email blocked. Common causes:")
            print("   1. FROM email doesn't match authenticated email")
            print("   2. Gmail requires App Password (not regular password)")
            print("   3. Missing SPF/DKIM records for custom domain")
            print("   4. Email flagged as spam")
        elif "authentication" in error_msg.lower() or "535" in error_msg:
            print("⚠️  Authentication failed. Check:")
            print("   1. EMAIL_HOST_USER is correct")
            print("   2. EMAIL_HOST_PASSWORD is an App Password (for Gmail)")
            print("   3. Less secure app access is enabled (if using regular password)")
        
        return False


def send_welcome_email(user_email, username):
    """Send welcome email after successful verification"""
    subject = 'Email Verified - Welcome to 123Resume'
    
    plain_message = f"""Email Verified - Welcome to 123Resume

Great news, {username}!

Your email has been successfully verified. You're all set to start building your professional resume.

What's next?
- Create Your Resume: Use our step-by-step form
- Choose Templates: Modern, Classic, Minimal, or Creative
- Track Completeness: Get real-time scores
- Save & Export: Download as PDF anytime

Ready to get started? Visit https://123resume.de

© 2025 123Resume. All rights reserved.
"""
    
    html_message = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2>Email Verified - Welcome to 123Resume</h2>
    <p>Great news, {username}!</p>
    <p>Your email has been successfully verified. You're all set to start building your professional resume.</p>
    <h3>What's next?</h3>
    <ul>
        <li>Create Your Resume: Use our step-by-step form</li>
        <li>Choose Templates: Modern, Classic, Minimal, or Creative</li>
        <li>Track Completeness: Get real-time scores</li>
        <li>Save & Export: Download as PDF anytime</li>
    </ul>
    <p>Ready to get started? Visit <a href="https://123resume.de">https://123resume.de</a></p>
    <hr>
    <p style="color: #666; font-size: 12px;">© 2025 123Resume. All rights reserved.</p>
</body>
</html>
"""
    
    try:
        from_email = settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER
        if not from_email:
            print("Error: EMAIL_HOST_USER or DEFAULT_FROM_EMAIL not configured")
            return False
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=from_email,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending welcome email: {e}")
        return False


def send_password_reset_email(user_email, username, reset_link):
    """Send password reset email to user"""
    subject = 'Reset Your Password - 123Resume'
    
    plain_message = f"""Password Reset Request - 123Resume

Hi {username},

We received a request to reset your password for your 123Resume account.

Click the link below to reset your password:
{reset_link}

SECURITY NOTICE:
- This link expires in 1 hour
- If you didn't request this, please ignore this email
- Your password won't change unless you click the link above

If you didn't request a password reset, someone may be trying to access your account.

© 2025 123Resume. All rights reserved.
"""
    
    html_message = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2>Password Reset Request</h2>
    <p>Hi {username},</p>
    <p>We received a request to reset your password for your 123Resume account.</p>
    <p>Click the link below to reset your password:</p>
    <p><a href="{reset_link}">{reset_link}</a></p>
    <p><strong>SECURITY NOTICE:</strong></p>
    <ul>
        <li>This link expires in 1 hour</li>
        <li>If you didn't request this, please ignore this email</li>
        <li>Your password won't change unless you click the link above</li>
    </ul>
    <p>If you didn't request a password reset, someone may be trying to access your account.</p>
    <hr>
    <p style="color: #666; font-size: 12px;">© 2025 123Resume. All rights reserved.</p>
</body>
</html>
"""
    
    try:
        from_email = settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER
        if not from_email:
            print("Error: EMAIL_HOST_USER or DEFAULT_FROM_EMAIL not configured")
            return False
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=from_email,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending password reset email: {e}")
        return False


def send_password_changed_email(user_email, username):
    """Send confirmation email after password was changed"""
    subject = 'Password Changed - 123Resume'
    
    plain_message = f"""Password Successfully Changed - 123Resume

Hi {username},

Your password for your 123Resume account has been successfully changed.

DIDN'T CHANGE YOUR PASSWORD?
If you didn't make this change, please contact us immediately and secure your account.

You can now log in with your new password at https://123resume.de/login

© 2025 123Resume. All rights reserved.
"""
    
    html_message = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2>Password Successfully Changed</h2>
    <p>Hi {username},</p>
    <p>Your password for your 123Resume account has been successfully changed.</p>
    <p><strong>DIDN'T CHANGE YOUR PASSWORD?</strong><br>
    If you didn't make this change, please contact us immediately and secure your account.</p>
    <p>You can now log in with your new password at <a href="https://123resume.de/login">https://123resume.de/login</a></p>
    <hr>
    <p style="color: #666; font-size: 12px;">© 2025 123Resume. All rights reserved.</p>
</body>
</html>
"""
    
    try:
        from_email = settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER
        if not from_email:
            print("Error: EMAIL_HOST_USER or DEFAULT_FROM_EMAIL not configured")
            return False
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=from_email,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending password changed email: {e}")
        return False


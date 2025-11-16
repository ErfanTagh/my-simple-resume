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
    
    # HTML email content
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Welcome to 123Resume!</h1>
            </div>
            <div class="content">
                <h2>Hi {username}! 👋</h2>
                <p>Thanks for signing up! We're excited to help you create amazing resumes.</p>
                <p>To get started, please verify your email address by clicking the button below:</p>
                <center>
                    <a href="{verification_link}" class="button">Verify My Email</a>
                </center>
                <p>Or copy and paste this link into your browser:</p>
                <p style="background: white; padding: 15px; border-radius: 5px; word-break: break-all; font-size: 12px;">
                    {verification_link}
                </p>
                <p><strong>This link will expire in 24 hours.</strong></p>
                <p>If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                <p>© 2025 123Resume. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text fallback
    plain_message = f"""
    Welcome to 123Resume!
    
    Hi {username}!
    
    Thanks for signing up! To get started, please verify your email address by clicking the link below:
    
    {verification_link}
    
    This link will expire in 24 hours.
    
    If you didn't create an account, you can safely ignore this email.
    
    © 2025 123Resume. All rights reserved.
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
    subject = '✅ Email Verified - Welcome to 123Resume!'
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .feature {{ background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #10b981; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Email Verified!</h1>
            </div>
            <div class="content">
                <h2>Great news, {username}! 🎉</h2>
                <p>Your email has been successfully verified. You're all set to start building your professional resume!</p>
                
                <h3>What's next?</h3>
                <div class="feature">
                    <strong>📝 Create Your Resume</strong><br>
                    Use our step-by-step form to build a professional resume.
                </div>
                <div class="feature">
                    <strong>🎨 Choose Templates</strong><br>
                    Select from Modern, Classic, Minimal, or Creative designs.
                </div>
                <div class="feature">
                    <strong>📊 Track Completeness</strong><br>
                    Get real-time scores to optimize your resume.
                </div>
                <div class="feature">
                    <strong>💾 Save & Export</strong><br>
                    Download your resume as PDF anytime.
                </div>
                
                <p style="margin-top: 30px;">
                    <strong>Ready to get started? <a href="https://123resume.de/create-resume">Create your first resume now!</a></strong>
                </p>
            </div>
            <div class="footer">
                <p>© 2025 123Resume. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = f"""
    Email Verified - Welcome to 123Resume!
    
    Great news, {username}!
    
    Your email has been successfully verified. You're all set to start building your professional resume!
    
    What's next?
    - Create Your Resume: Use our step-by-step form
    - Choose Templates: Modern, Classic, Minimal, or Creative
    - Track Completeness: Get real-time scores
    - Save & Export: Download as PDF anytime
    
    Ready to get started? Visit https://123resume.de/create-resume
    
    © 2025 123Resume. All rights reserved.
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
    
    # HTML email content
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .button {{ display: inline-block; padding: 15px 30px; background: #f97316; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            .warning {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
                <h2>Hi {username},</h2>
                <p>We received a request to reset your password for your 123Resume account.</p>
                <p>Click the button below to reset your password:</p>
                <center>
                    <a href="{reset_link}" class="button">Reset My Password</a>
                </center>
                <p>Or copy and paste this link into your browser:</p>
                <p style="background: white; padding: 15px; border-radius: 5px; word-break: break-all; font-size: 12px;">
                    {reset_link}
                </p>
                
                <div class="warning">
                    <strong>⚠️ Security Notice:</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        <li>This link expires in <strong>1 hour</strong></li>
                        <li>If you didn't request this, please ignore this email</li>
                        <li>Your password won't change unless you click the link above</li>
                    </ul>
                </div>
                
                <p style="margin-top: 20px; color: #666; font-size: 14px;">
                    If you didn't request a password reset, someone may be trying to access your account. 
                    Consider changing your password if you suspect unauthorized access.
                </p>
            </div>
            <div class="footer">
                <p>© 2025 123Resume. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Plain text fallback
    plain_message = f"""
    Password Reset Request - 123Resume
    
    Hi {username},
    
    We received a request to reset your password for your 123Resume account.
    
    Click the link below to reset your password:
    {reset_link}
    
    ⚠️ SECURITY NOTICE:
    - This link expires in 1 hour
    - If you didn't request this, please ignore this email
    - Your password won't change unless you click the link above
    
    If you didn't request a password reset, someone may be trying to access your account.
    
    © 2025 123Resume. All rights reserved.
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
    subject = '✅ Password Changed - 123Resume'
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
            .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            .alert {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Password Successfully Changed</h1>
            </div>
            <div class="content">
                <h2>Hi {username},</h2>
                <p>Your password for your 123Resume account has been successfully changed.</p>
                
                <div class="alert">
                    <strong>⚠️ Didn't change your password?</strong><br>
                    If you didn't make this change, please contact us immediately and secure your account.
                </div>
                
                <p>You can now log in with your new password.</p>
                <p style="margin-top: 20px;">
                    <a href="https://123resume.de/login" style="color: #10b981;">Go to Login →</a>
                </p>
            </div>
            <div class="footer">
                <p>© 2025 123Resume. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = f"""
    Password Successfully Changed - 123Resume
    
    Hi {username},
    
    Your password for your 123Resume account has been successfully changed.
    
    ⚠️ DIDN'T CHANGE YOUR PASSWORD?
    If you didn't make this change, please contact us immediately and secure your account.
    
    You can now log in with your new password.
    
    © 2025 123Resume. All rights reserved.
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


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
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
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
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user_email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending welcome email: {e}")
        return False


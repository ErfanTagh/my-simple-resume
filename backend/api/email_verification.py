"""
Email verification utilities
"""
import secrets
import hashlib
import uuid
import json
from datetime import datetime, timedelta
from django.core.mail import EmailMessage, EmailMultiAlternatives, send_mail
from django.conf import settings
from django.template.loader import render_to_string

# Try to import SendGrid SDK (optional - falls back to SMTP if not available)
try:
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail, Email, TrackingSettings, ClickTracking
    SENDGRID_AVAILABLE = True
except ImportError:
    SENDGRID_AVAILABLE = False


def generate_verification_token():
    """Generate a unique verification token"""
    return secrets.token_urlsafe(32)


def create_verification_link(token, domain):
    """Create a verification link"""
    return f"https://{domain}/verify-email?token={token}"


def send_verification_email(user_email, username, verification_link):
    """Send verification email to user with improved spam prevention"""
    subject = 'Verify Your Email - 123Resume'
    
    # Plain text email
    plain_message = f"""Welcome to 123Resume

Hi {username},

Thanks for signing up. To get started, please verify your email address by clicking the link below:

{verification_link}

This link will expire in 24 hours.

If you didn't create an account, you can safely ignore this email.

Best regards,
The 123Resume Team

---
123Resume - Build Professional Resumes
https://123resume.de
© 2025 123Resume. All rights reserved.
"""
    
    # Improved HTML version with better structure
    html_message = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Verify Your Email - 123Resume</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background-color: #667eea; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome to 123Resume</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px 40px;">
                            <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Hi {username},</p>
                            <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Thanks for signing up. To get started, please verify your email address by clicking the button below:</p>
                            <table role="presentation" style="width: 100%; margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="{verification_link}" style="display: inline-block; padding: 14px 32px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Verify Email Address</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 20px 0 10px; font-size: 14px; color: #666666;">Or copy and paste this link into your browser:</p>
                            <p style="margin: 0 0 20px; font-size: 14px; color: #667eea; word-break: break-all;">{verification_link}</p>
                            <p style="margin: 0 0 20px; font-size: 14px; color: #666666;">This link will expire in 24 hours.</p>
                            <p style="margin: 0; font-size: 14px; color: #999999;">If you didn't create an account, you can safely ignore this email.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 40px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; font-size: 12px; color: #999999; text-align: center;">
                                Best regards,<br>
                                The 123Resume Team<br><br>
                                <a href="https://123resume.de" style="color: #667eea; text-decoration: none;">123resume.de</a><br>
                                © 2025 123Resume. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""
    
    try:
        # Ensure FROM email matches the authenticated email to avoid blocking
        from_email = settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER
        if not from_email:
            print("Error: EMAIL_HOST_USER or DEFAULT_FROM_EMAIL not configured")
            return False
        
        # Use SendGrid SDK if available and API key is set (allows disabling click tracking)
        if SENDGRID_AVAILABLE and settings.SENDGRID_API_KEY:
            try:
                sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
                
                # Create email with tracking disabled
                message = Mail(
                    from_email=Email(from_email, "123Resume"),
                    to_emails=user_email,
                    subject=subject,
                    plain_text_content=plain_message,
                    html_content=html_message
                )
                
                # Disable click tracking to avoid SSL certificate issues
                message.tracking_settings = TrackingSettings(
                    click_tracking=ClickTracking(enable=False),
                )
                
                # Set reply-to
                message.reply_to = Email('contact@123resume.de')
                
                # Send via SendGrid API
                response = sg.send(message)
                return True
            except Exception as sg_error:
                print(f"SendGrid API error: {sg_error}, falling back to SMTP")
                # Fall through to SMTP fallback
        
        # Fallback to SMTP (Django's email backend)
        from_email_display = f"123Resume <{from_email}>"
        
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=from_email_display,
            to=[user_email],
            reply_to=['contact@123resume.de'],
        )
        
        email.attach_alternative(html_message, "text/html")
        
        email.extra_headers = {
            'Message-ID': f'<{uuid.uuid4()}@123resume.de>',
            'X-Mailer': '123Resume Email System',
        }
        
        email.send(fail_silently=False)
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
        
        # Use SendGrid SDK if available and API key is set
        if SENDGRID_AVAILABLE and settings.SENDGRID_API_KEY:
            try:
                sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
                message = Mail(
                    from_email=Email(from_email, "123Resume"),
                    to_emails=user_email,
                    subject=subject,
                    plain_text_content=plain_message,
                    html_content=html_message
                )
                message.tracking_settings = TrackingSettings(
                    click_tracking=ClickTracking(enable=False),
                )
                message.reply_to = Email('contact@123resume.de')
                sg.send(message)
                return True
            except Exception as sg_error:
                print(f"SendGrid API error: {sg_error}, falling back to SMTP")
        
        # Fallback to SMTP
        from_email_display = f"123Resume <{from_email}>"
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=from_email_display,
            to=[user_email],
            reply_to=['contact@123resume.de'],
        )
        email.attach_alternative(html_message, "text/html")
        email.extra_headers = {
            'Message-ID': f'<{uuid.uuid4()}@123resume.de>',
            'X-Mailer': '123Resume Email System',
        }
        email.send(fail_silently=False)
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

Best regards,
The 123Resume Team

---
123Resume - Build Professional Resumes
https://123resume.de
© 2025 123Resume. All rights reserved.
"""
    
    html_message = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Reset Your Password - 123Resume</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background-color: #ef4444; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Password Reset Request</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px 40px;">
                            <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Hi {username},</p>
                            <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">We received a request to reset your password for your 123Resume account.</p>
                            <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Click the button below to reset your password:</p>
                            <table role="presentation" style="width: 100%; margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="{reset_link}" style="display: inline-block; padding: 14px 32px; background-color: #ef4444; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Reset Password</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 20px 0 10px; font-size: 14px; color: #666666;">Or copy and paste this link into your browser:</p>
                            <p style="margin: 0 0 20px; font-size: 14px; color: #ef4444; word-break: break-all;">{reset_link}</p>
                            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0 0 10px; font-size: 14px; font-weight: 600; color: #991b1b;">SECURITY NOTICE:</p>
                                <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #991b1b;">
                                    <li style="margin-bottom: 5px;">This link expires in 1 hour</li>
                                    <li style="margin-bottom: 5px;">If you didn't request this, please ignore this email</li>
                                    <li style="margin-bottom: 5px;">Your password won't change unless you click the link above</li>
                                </ul>
                            </div>
                            <p style="margin: 0; font-size: 14px; color: #666666;">If you didn't request a password reset, someone may be trying to access your account.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 40px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; font-size: 12px; color: #999999; text-align: center;">
                                Best regards,<br>
                                The 123Resume Team<br><br>
                                <a href="https://123resume.de" style="color: #667eea; text-decoration: none;">123resume.de</a><br>
                                © 2025 123Resume. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""
    
    try:
        from_email = settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER
        if not from_email:
            print("Error: EMAIL_HOST_USER or DEFAULT_FROM_EMAIL not configured")
            return False
        
        # Use SendGrid SDK if available and API key is set
        if SENDGRID_AVAILABLE and settings.SENDGRID_API_KEY:
            try:
                sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
                message = Mail(
                    from_email=Email(from_email, "123Resume"),
                    to_emails=user_email,
                    subject=subject,
                    plain_text_content=plain_message,
                    html_content=html_message
                )
                message.tracking_settings = TrackingSettings(
                    click_tracking=ClickTracking(enable=False),
                )
                message.reply_to = Email('contact@123resume.de')
                sg.send(message)
                return True
            except Exception as sg_error:
                print(f"SendGrid API error: {sg_error}, falling back to SMTP")
        
        # Fallback to SMTP
        from_email_display = f"123Resume <{from_email}>"
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=from_email_display,
            to=[user_email],
            reply_to=['contact@123resume.de'],
        )
        email.attach_alternative(html_message, "text/html")
        email.extra_headers = {
            'Message-ID': f'<{uuid.uuid4()}@123resume.de>',
            'X-Mailer': '123Resume Email System',
        }
        email.send(fail_silently=False)
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

Best regards,
The 123Resume Team

---
123Resume - Build Professional Resumes
https://123resume.de
© 2025 123Resume. All rights reserved.
"""
    
    html_message = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Password Changed - 123Resume</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background-color: #10b981; border-radius: 8px 8px 0 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Password Changed</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px 40px;">
                            <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Hi {username},</p>
                            <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Your password for your 123Resume account has been successfully changed.</p>
                            <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #991b1b;">DIDN'T CHANGE YOUR PASSWORD?</p>
                                <p style="margin: 10px 0 0; font-size: 14px; color: #991b1b;">If you didn't make this change, please contact us immediately and secure your account.</p>
                            </div>
                            <table role="presentation" style="width: 100%; margin: 30px 0;">
                                <tr>
                                    <td style="text-align: center;">
                                        <a href="https://123resume.de/login" style="display: inline-block; padding: 14px 32px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Log In Now</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 40px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; font-size: 12px; color: #999999; text-align: center;">
                                Best regards,<br>
                                The 123Resume Team<br><br>
                                <a href="https://123resume.de" style="color: #667eea; text-decoration: none;">123resume.de</a><br>
                                © 2025 123Resume. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""
    
    try:
        from_email = settings.DEFAULT_FROM_EMAIL or settings.EMAIL_HOST_USER
        if not from_email:
            print("Error: EMAIL_HOST_USER or DEFAULT_FROM_EMAIL not configured")
            return False
        
        # Use SendGrid SDK if available and API key is set
        if SENDGRID_AVAILABLE and settings.SENDGRID_API_KEY:
            try:
                sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
                message = Mail(
                    from_email=Email(from_email, "123Resume"),
                    to_emails=user_email,
                    subject=subject,
                    plain_text_content=plain_message,
                    html_content=html_message
                )
                message.tracking_settings = TrackingSettings(
                    click_tracking=ClickTracking(enable=False),
                )
                message.reply_to = Email('contact@123resume.de')
                sg.send(message)
                return True
            except Exception as sg_error:
                print(f"SendGrid API error: {sg_error}, falling back to SMTP")
        
        # Fallback to SMTP
        from_email_display = f"123Resume <{from_email}>"
        email = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=from_email_display,
            to=[user_email],
            reply_to=['contact@123resume.de'],
        )
        email.attach_alternative(html_message, "text/html")
        email.extra_headers = {
            'Message-ID': f'<{uuid.uuid4()}@123resume.de>',
            'X-Mailer': '123Resume Email System',
        }
        email.send(fail_silently=False)
        return True
    except Exception as e:
        print(f"Error sending password changed email: {e}")
        return False


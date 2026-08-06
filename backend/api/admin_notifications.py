"""
Admin alerts about activity on the site (currently: new user signups).

Mail goes to settings.ADMIN_NOTIFICATION_EMAIL (contact@123resume.de by default)
through the same Mailgun helper the user-facing emails use. Sending happens on a
background thread and never raises, so a mail outage can't slow down or break a
signup.
"""
import html
import logging
import threading

from django.conf import settings
from django.contrib.auth.models import User

from .email_verification import _send_with_mailgun

logger = logging.getLogger(__name__)


def _esc(value):
    """Escape user-controlled text before it goes into the HTML body."""
    return html.escape(str(value or ""))


def _build_new_user_email(user, provider):
    """Return (subject, plain_text, html) for the new-signup alert."""
    full_name = f"{user.first_name} {user.last_name}".strip() or "-"
    joined = user.date_joined.strftime('%d %b %Y, %H:%M UTC') if user.date_joined else "-"

    try:
        total_users = User.objects.filter(is_active=True).count()
    except Exception:
        total_users = None

    subject = f"🎉 New signup: {user.username} joined 123Resume"

    milestone = ""
    if total_users:
        milestone = f"\nThat makes {total_users} people building resumes with 123Resume."

    plain_message = f"""Great news - someone new just joined 123Resume!

Username:   {user.username}
Name:       {full_name}
Email:      {user.email}
Signed up:  {provider}
Joined:     {joined}
{milestone}

Keep it up!

---
123Resume - Build Professional Resumes
https://123resume.de
"""

    total_block = ""
    if total_users:
        total_block = f"""
                            <table role="presentation" style="width: 100%; margin: 28px 0 8px;">
                                <tr>
                                    <td style="text-align: center; padding: 20px; background-color: #ecfdf5; border-radius: 8px;">
                                        <p style="margin: 0; font-size: 32px; font-weight: 700; color: #059669;">{total_users}</p>
                                        <p style="margin: 4px 0 0; font-size: 14px; color: #047857;">people are now building resumes with 123Resume</p>
                                    </td>
                                </tr>
                            </table>"""

    html_message = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>New signup - 123Resume</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f4f4f4;">
        <tr>
            <td style="padding: 20px 0;">
                <table role="presentation" style="width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 40px 40px 30px; text-align: center; background-color: #10b981; border-radius: 8px 8px 0 0;">
                            <p style="margin: 0 0 8px; font-size: 40px;">🎉</p>
                            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">A new user just signed up!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px 40px 10px;">
                            <p style="margin: 0 0 24px; font-size: 16px; color: #333333;">
                                Welcome aboard, <strong style="color: #059669;">{_esc(user.username)}</strong> - your community keeps growing.
                            </p>
                            <table role="presentation" style="width: 100%; border-collapse: collapse; font-size: 15px;">
                                <tr>
                                    <td style="padding: 10px 0; color: #666666; width: 130px;">Username</td>
                                    <td style="padding: 10px 0; color: #333333; font-weight: 600;">{_esc(user.username)}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #666666; border-top: 1px solid #f1f1f1;">Name</td>
                                    <td style="padding: 10px 0; color: #333333; border-top: 1px solid #f1f1f1;">{_esc(full_name)}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #666666; border-top: 1px solid #f1f1f1;">Email</td>
                                    <td style="padding: 10px 0; color: #333333; border-top: 1px solid #f1f1f1;">{_esc(user.email)}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #666666; border-top: 1px solid #f1f1f1;">Signed up with</td>
                                    <td style="padding: 10px 0; color: #333333; border-top: 1px solid #f1f1f1;">{_esc(provider)}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; color: #666666; border-top: 1px solid #f1f1f1;">Joined</td>
                                    <td style="padding: 10px 0; color: #333333; border-top: 1px solid #f1f1f1;">{_esc(joined)}</td>
                                </tr>
                            </table>{total_block}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 40px; background-color: #f8f9fa; border-top: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; font-size: 12px; color: #999999; text-align: center;">
                                Sent automatically by 123Resume<br><br>
                                <a href="https://123resume.de" style="color: #10b981; text-decoration: none;">123resume.de</a>
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

    return subject, plain_message, html_message


def send_new_user_notification(user, provider='Email'):
    """
    Blocking send of the new-signup alert. Returns True on success.
    Use notify_new_user() from request paths instead.
    """
    recipient = getattr(settings, 'ADMIN_NOTIFICATION_EMAIL', '')
    if not recipient:
        logger.info("ADMIN_NOTIFICATION_EMAIL not set - skipping new-user notification")
        return False

    try:
        subject, plain_message, html_message = _build_new_user_email(user, provider)
        # Sent from the default noreply@<mailgun domain> rather than contact@:
        # a From that equals the To address tends to get flagged as spam.
        return _send_with_mailgun(
            subject=subject,
            plain_message=plain_message,
            html_message=html_message,
            to_email=recipient,
        )
    except Exception as e:
        logger.error("New-user notification failed: %s", e)
        return False


def notify_new_user(user, provider='Email'):
    """
    Announce a new signup by email. Safe to call from a view: never raises,
    never blocks the response.
    """
    try:
        threading.Thread(
            target=send_new_user_notification,
            args=(user, provider),
            daemon=True,
        ).start()
    except Exception as e:
        logger.error("Could not start new-user notification thread: %s", e)

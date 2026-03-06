"""
Feedback and contact views.

Provides a simple endpoint that allows users to send feedback or support
requests from the resume builder UI. The message is forwarded via email
to the 123Resume support inbox.
"""

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from django.conf import settings
from api import email_verification
import logging


@api_view(["POST"])
@permission_classes([AllowAny])
def send_feedback(request):
    """
    Receive feedback from the frontend and forward it to the support email.

    Expected JSON payload (camelCase on frontend, snake_case here after conversion):
    - name: optional, name of the user sending feedback
    - email: required, reply-to email address
    - message: required, feedback / support message
    - context: optional, extra context such as current page, step, or resume id
    """
    data = request.data or {}

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip()
    message = (data.get("message") or "").strip()
    context = (data.get("context") or "").strip()

    if not email:
        return Response(
            {"error": "Email is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not message:
        return Response(
            {"error": "Message is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    support_email = "contact@123resume.de"

    subject_parts = ["New feedback from 123Resume"]
    if name:
        subject_parts.append(f"- {name}")
    subject = " ".join(subject_parts)

    # Keep body simple and text-only for reliability
    lines = [
      f"From: {name or 'Anonymous'}",
      f"Email: {email}",
    ]
    if context:
        lines.append(f"Context: {context}")
    lines.append("")
    lines.append("Message:")
    lines.append(message)

    body = "\n".join(lines)

    # Use shared email helper so we follow the same SendGrid/API logic
    success = email_verification.send_feedback_email(
        support_email=support_email,
        reply_to_email=email,
        subject=subject,
        plain_message=body,
    )

    if success:
        return Response({"success": True}, status=status.HTTP_200_OK)

    # Avoid logging PII (email/message). Log only technical details.
    logger = logging.getLogger(__name__)
    logger.error(
        "Feedback email send failed (helper returned False) - host=%s backend=%s",
        getattr(settings, "EMAIL_HOST", None),
        getattr(settings, "EMAIL_BACKEND", None),
    )
    return Response(
        {"error": "Failed to send feedback. Please try again later."},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )


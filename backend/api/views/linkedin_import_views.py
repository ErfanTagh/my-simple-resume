"""
LinkedIn profile import endpoints (Member Data Portability / DMA).

Separate from the login flow in social_views.py: logging in uses the
`openid profile email` scopes (name/email only), while importing a profile
needs the `r_dma_portability_3rd_party` consent. Keeping them apart means a
user signing in isn't asked for data-portability consent they don't need.
"""
import logging
import secrets
from urllib.parse import urlencode

import requests
from django.conf import settings
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .. import linkedin_import

logger = logging.getLogger(__name__)

LINKEDIN_AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization"
LINKEDIN_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken"


def _frontend_callback_url(request) -> str:
    """Frontend route LinkedIn redirects back to (must be registered in the app)."""
    domain = getattr(settings, "DOMAIN", "")
    if domain and not domain.startswith("localhost"):
        base_url = domain.rstrip("/") if domain.startswith("http") else f"https://{domain}".rstrip("/")
    else:
        base_url = request.build_absolute_uri("/").rstrip("/")
    return f"{base_url}/linkedin-import/callback"


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def linkedin_import_url(request):
    """
    Return the LinkedIn consent URL for importing profile data.

    Response: { auth_url, state }
    """
    client_id = getattr(settings, "LINKEDIN_CLIENT_ID", "")
    if not client_id:
        return Response(
            {"error": "LinkedIn is not configured on this server."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    state = secrets.token_urlsafe(32)
    request.session[f"li_import_state_{state}"] = {"user_id": request.user.pk}
    request.session.save()

    params = {
        "client_id": client_id,
        "redirect_uri": _frontend_callback_url(request),
        "response_type": "code",
        # DMA data-portability consent — this is what unlocks positions/education/skills.
        "scope": linkedin_import.PORTABILITY_SCOPE,
        "state": state,
    }
    return Response(
        {"auth_url": f"{LINKEDIN_AUTH_URL}?{urlencode(params)}", "state": state},
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def linkedin_import_profile(request):
    """
    Exchange the consent code, pull the member snapshot, and return it mapped
    onto the resume form shape.

    Body: { code }
    Response: { resume, imported }
    """
    code = (request.data or {}).get("code", "").strip()
    if not code:
        return Response({"error": "code is required"}, status=status.HTTP_400_BAD_REQUEST)

    client_id = getattr(settings, "LINKEDIN_CLIENT_ID", "")
    client_secret = getattr(settings, "LINKEDIN_CLIENT_SECRET", "")
    if not client_id or not client_secret:
        return Response(
            {"error": "LinkedIn is not configured on this server."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    # Exchange the authorization code for an access token.
    try:
        token_resp = requests.post(
            LINKEDIN_TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": _frontend_callback_url(request),
                "client_id": client_id,
                "client_secret": client_secret,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            timeout=20,
        )
    except requests.RequestException:
        logger.exception("linkedin_import: token request failed")
        return Response(
            {"error": "Could not reach LinkedIn. Please try again."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    if not token_resp.ok:
        logger.error(
            "linkedin_import: token exchange failed status=%s body=%s",
            token_resp.status_code,
            token_resp.text[:300],
        )
        return Response(
            {"error": "LinkedIn rejected the authorization. Please try connecting again."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    access_token = (token_resp.json() or {}).get("access_token")
    if not access_token:
        return Response(
            {"error": "LinkedIn did not return an access token."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    logger.info("linkedin_import: start user_id=%s", request.user.pk)

    try:
        result = linkedin_import.build_resume_from_linkedin(access_token)
    except PermissionError as e:
        # Missing product access, or member outside the EU/EEA.
        logger.warning("linkedin_import: permission denied user_id=%s", request.user.pk)
        return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
    except Exception:
        logger.exception("linkedin_import: failed user_id=%s", request.user.pk)
        return Response(
            {"error": "Could not import your LinkedIn profile. Please try again later."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    # LinkedIn builds the snapshot asynchronously; tell the caller when it's empty
    # so the UI can explain "try again in a moment" rather than showing a blank form.
    if not any(result["imported"].values()):
        return Response(
            {
                "error": "LinkedIn is still preparing your data. This can take a few "
                         "minutes after you grant access — please try again shortly.",
                "imported": result["imported"],
            },
            status=status.HTTP_409_CONFLICT,
        )

    return Response(result, status=status.HTTP_200_OK)

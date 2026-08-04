"""
Import a LinkedIn profile into the resume form via LinkedIn's
Member Data Portability (3rd Party) API.

This is the DMA (EU Digital Markets Act) product — distinct from the plain
"Sign in with LinkedIn" flow used for authentication, which only ever returns
name/email/picture. The portability API returns real profile data (positions,
education, skills, ...) once the member consents with the
`r_dma_portability_3rd_party` scope.

Hard constraints (LinkedIn side, not ours):
  * The app must be granted the "Member Data Portability (3rd Party)" product
    in the LinkedIn developer portal (company page + business verification).
  * Only members located in the EU/EEA or Switzerland can consent.
  * The snapshot is built asynchronously after consent, so a domain may return
    no data for a short while right after the member authorizes.

Docs: https://learn.microsoft.com/en-us/linkedin/dma/member-data-portability/
"""
from __future__ import annotations

import logging
import re
from typing import Any, Dict, List, Optional

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

SNAPSHOT_URL = "https://api.linkedin.com/rest/memberSnapshotData"
# The snapshot endpoint ONLY supports this version; anything else -> 426.
LINKEDIN_VERSION = "202312"
PORTABILITY_SCOPE = "r_dma_portability_3rd_party"

# Domains we need to build a resume. Order matters only for logging.
RESUME_DOMAINS = [
    "PROFILE",
    "POSITIONS",
    "EDUCATION",
    "SKILLS",
    "CERTIFICATIONS",
    "PROJECTS",
    "LANGUAGES",
    "COURSES",
    "EMAIL_ADDRESSES",
    "PHONE_NUMBERS",
]

# Safety caps so one import can't spin forever on pagination.
MAX_PAGES_PER_DOMAIN = 20
REQUEST_TIMEOUT = 20


def _get(row: Dict[str, Any], *names: str) -> str:
    """
    Read a value from a snapshot row, tolerating key-spelling differences.

    LinkedIn returns human-readable, export-style keys ("Company Name",
    "Started On", ...). Exact spellings vary by domain and have changed over
    time, so match case/space/punctuation-insensitively and accept aliases
    rather than hard-coding one spelling.
    """
    if not isinstance(row, dict):
        return ""

    def norm(s: str) -> str:
        return re.sub(r"[^a-z0-9]", "", str(s).lower())

    normalized = {norm(k): v for k, v in row.items()}
    for name in names:
        val = normalized.get(norm(name))
        if val not in (None, ""):
            return str(val).strip()
    return ""


def _normalize_date(value: str) -> str:
    """
    Convert LinkedIn date strings to the form's `YYYY-MM` format.

    Handles the shapes LinkedIn actually emits: "Jan 2020", "January 2020",
    "2020-01-15", "2020-01", "2020". Returns "" when unparseable (better an
    empty date field than a wrong one).
    """
    raw = (value or "").strip()
    if not raw:
        return ""

    months = {
        "jan": "01", "feb": "02", "mar": "03", "apr": "04", "may": "05", "jun": "06",
        "jul": "07", "aug": "08", "sep": "09", "oct": "10", "nov": "11", "dec": "12",
    }

    # "Jan 2020" / "January 2020"
    m = re.match(r"^([A-Za-z]{3,})\s+(\d{4})$", raw)
    if m:
        mon = months.get(m.group(1)[:3].lower())
        if mon:
            return f"{m.group(2)}-{mon}"

    # "2020-01-15" or "2020-01"
    m = re.match(r"^(\d{4})-(\d{1,2})", raw)
    if m:
        return f"{m.group(1)}-{int(m.group(2)):02d}"

    # "2020"
    m = re.match(r"^(\d{4})$", raw)
    if m:
        return f"{m.group(1)}-01"

    logger.info("linkedin_import: unparsed date value=%r", raw[:40])
    return ""


def fetch_snapshot_domain(access_token: str, domain: str) -> List[Dict[str, Any]]:
    """
    Fetch every row for one snapshot domain, following pagination.

    Returns [] when the member has no data for the domain, or when LinkedIn has
    not finished building the snapshot yet (both surface as an empty/absent
    element rather than an error).
    """
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Linkedin-Version": LINKEDIN_VERSION,
        "Content-Type": "application/json",
    }

    rows: List[Dict[str, Any]] = []
    start = 0
    for _ in range(MAX_PAGES_PER_DOMAIN):
        resp = requests.get(
            SNAPSHOT_URL,
            headers=headers,
            params={"q": "criteria", "domain": domain, "start": start},
            timeout=REQUEST_TIMEOUT,
        )

        if resp.status_code == 403:
            # App lacks the portability product, or member is outside the EU/EEA.
            raise PermissionError(
                "LinkedIn denied access to the Member Data Portability API. The app "
                "needs the 'Member Data Portability (3rd Party)' product, and the "
                "member must be located in the EU/EEA or Switzerland."
            )
        if not resp.ok:
            body = resp.text[:300]
            # "No data found for this memberId" is the documented end-of-pages /
            # not-ready signal, not a real failure.
            if "no data found" in body.lower():
                break
            logger.warning(
                "linkedin_import: domain=%s status=%s body=%s", domain, resp.status_code, body
            )
            break

        payload = resp.json()
        elements = payload.get("elements") or []
        if not elements:
            break

        data = elements[0].get("snapshotData") or []
        rows.extend(r for r in data if isinstance(r, dict))

        # Follow the documented `next` link; stop when there isn't one.
        links = (payload.get("paging") or {}).get("links") or []
        if not any(l.get("rel") == "next" for l in links):
            break
        start += 1

    logger.info("linkedin_import: domain=%s rows=%d", domain, len(rows))
    return rows


def _map_positions(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    out = []
    for r in rows:
        position = _get(r, "Title", "Position", "Job Title")
        company = _get(r, "Company Name", "Company", "Organization")
        if not position and not company:
            continue
        out.append({
            "position": position,
            "company": company,
            "location": _get(r, "Location"),
            "startDate": _normalize_date(_get(r, "Started On", "Start Date", "From")),
            "endDate": _normalize_date(_get(r, "Finished On", "End Date", "To")),
            "description": _get(r, "Description"),
            "responsibilities": [],
            "technologies": [],
            "competencies": [],
        })
    return out


def _map_education(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    out = []
    for r in rows:
        institution = _get(r, "School Name", "School", "Institution")
        degree = _get(r, "Degree Name", "Degree")
        if not institution and not degree:
            continue
        notes = _get(r, "Notes", "Activities", "Description")
        out.append({
            "institution": institution,
            "degree": degree,
            "field": _get(r, "Field Of Study", "Field"),
            "location": _get(r, "Location"),
            "startDate": _normalize_date(_get(r, "Start Date", "Started On", "From")),
            "endDate": _normalize_date(_get(r, "End Date", "Finished On", "To")),
            "keyCourses": [],
            "descriptions": [{"description": notes}] if notes else [],
        })
    return out


def _map_simple_list(rows: List[Dict[str, Any]], key: str, *names: str) -> List[Dict[str, str]]:
    """Map rows to [{key: value}] (used for skills), skipping blanks/dupes."""
    seen = set()
    out = []
    for r in rows:
        val = _get(r, *names)
        if val and val.lower() not in seen:
            seen.add(val.lower())
            out.append({key: val})
    return out


def _map_certifications(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    out = []
    for r in rows:
        name = _get(r, "Name", "Certification Name", "Title")
        if not name:
            continue
        out.append({
            "name": name,
            "organization": _get(r, "Authority", "Issuing Organization", "Organization"),
            "issueDate": _normalize_date(_get(r, "Started On", "Issue Date", "Start Date")),
            "expirationDate": _normalize_date(_get(r, "Finished On", "Expiration Date", "End Date")),
            "credentialId": _get(r, "License Number", "Credential ID"),
            "url": _get(r, "Url", "URL"),
        })
    return out


def _map_projects(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    out = []
    for r in rows:
        name = _get(r, "Title", "Name", "Project Name")
        if not name:
            continue
        out.append({
            "name": name,
            "description": _get(r, "Description"),
            "startDate": _normalize_date(_get(r, "Started On", "Start Date")),
            "endDate": _normalize_date(_get(r, "Finished On", "End Date")),
            "link": _get(r, "Url", "URL"),
            "highlights": [],
            "technologies": [],
        })
    return out


# LinkedIn's proficiency wording -> the app's canonical keys, so templates can
# translate them (see frontend lib/languageProficiency.ts). Unknown values pass
# through unchanged and render as free text.
_LINKEDIN_PROFICIENCY = {
    "native or bilingual proficiency": "native",
    "full professional proficiency": "fluent",
    "professional working proficiency": "advanced",
    "limited working proficiency": "intermediate",
    "elementary proficiency": "basic",
}


def _map_languages(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    out = []
    for r in rows:
        name = _get(r, "Name", "Language")
        if not name:
            continue
        raw = _get(r, "Proficiency", "Level")
        out.append({
            "language": name,
            "proficiency": _LINKEDIN_PROFICIENCY.get(raw.strip().lower(), raw),
        })
    return out


def build_resume_from_linkedin(access_token: str) -> Dict[str, Any]:
    """
    Fetch the member's snapshot and map it onto the resume form shape
    (same camelCase structure the frontend CVFormData uses).

    Returns {"resume": {...}, "imported": {domain: row_count}} so the caller can
    tell the user what actually came through — LinkedIn may still be building
    parts of the snapshot.
    """
    data: Dict[str, List[Dict[str, Any]]] = {}
    for domain in RESUME_DOMAINS:
        try:
            data[domain] = fetch_snapshot_domain(access_token, domain)
        except PermissionError:
            raise
        except Exception:
            logger.exception("linkedin_import: failed domain=%s", domain)
            data[domain] = []

    profile = data.get("PROFILE") or [{}]
    p = profile[0] if profile else {}

    emails = data.get("EMAIL_ADDRESSES") or []
    phones = data.get("PHONE_NUMBERS") or []

    # Prefer the primary/confirmed address when LinkedIn marks one.
    email = ""
    for row in emails:
        if _get(row, "Primary").lower() in ("yes", "true"):
            email = _get(row, "Email Address", "Email")
            break
    if not email and emails:
        email = _get(emails[0], "Email Address", "Email")

    websites = _get(p, "Websites")
    resume: Dict[str, Any] = {
        "personalInfo": {
            "firstName": _get(p, "First Name"),
            "lastName": _get(p, "Last Name"),
            "professionalTitle": _get(p, "Headline"),
            "summary": _get(p, "Summary"),
            "location": _get(p, "Geo Location", "Location", "Address"),
            "email": email,
            "phone": _get(phones[0], "Number", "Phone Number") if phones else "",
            "website": websites,
            "linkedin": "",
            "github": "",
            "interests": [],
        },
        "workExperience": _map_positions(data.get("POSITIONS") or []),
        "education": _map_education(data.get("EDUCATION") or []),
        "skills": _map_simple_list(data.get("SKILLS") or [], "skill", "Name", "Skill"),
        "certificates": _map_certifications(data.get("CERTIFICATIONS") or []),
        "projects": _map_projects(data.get("PROJECTS") or []),
        "languages": _map_languages(data.get("LANGUAGES") or []),
    }

    imported = {d: len(rows) for d, rows in data.items()}
    logger.info("linkedin_import: built resume counts=%s", imported)
    return {"resume": resume, "imported": imported}

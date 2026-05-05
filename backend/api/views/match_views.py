"""
Resume-Job Matching: DeepSeek (default when configured) with embedding fallback.
"""
import logging
import os
import traceback

from bson import ObjectId
from django.conf import settings
from pymongo import MongoClient
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

logger = logging.getLogger(__name__)


def get_resume_text(resume_doc):
    """Convert resume document to text for matching"""
    text_parts = []

    # Personal info
    personal_info = resume_doc.get("personal_info", {})
    if personal_info.get("first_name"):
        text_parts.append(
            f"{personal_info.get('first_name', '')} {personal_info.get('last_name', '')}"
        )
    if personal_info.get("professional_title"):
        text_parts.append(personal_info.get("professional_title"))
    if personal_info.get("summary"):
        text_parts.append(personal_info.get("summary"))

    # Work experience
    work_experience = resume_doc.get("work_experience", [])
    for exp in work_experience:
        exp_parts = []
        if exp.get("position"):
            exp_parts.append(exp.get("position"))
        if exp.get("company"):
            exp_parts.append(f"at {exp.get('company')}")
        if exp.get("start_date") or exp.get("end_date"):
            dates = f"{exp.get('start_date', '')} - {exp.get('end_date', 'Present')}"
            exp_parts.append(dates)
        if exp.get("description"):
            exp_parts.append(exp.get("description"))
        if exp_parts:
            text_parts.append(". ".join(exp_parts))

    # Education
    education = resume_doc.get("education", [])
    for edu in education:
        edu_parts = []
        if edu.get("degree"):
            edu_parts.append(edu.get("degree"))
        if edu.get("institution"):
            edu_parts.append(f"from {edu.get('institution')}")
        if edu_parts:
            text_parts.append(", ".join(edu_parts))

    # Skills
    skills = resume_doc.get("skills", [])
    if skills:
        skill_list = [s.get("skill", "") for s in skills if s.get("skill")]
        if skill_list:
            text_parts.append(f"Skills: {', '.join(skill_list)}")

    return " ".join(text_parts)


def _match_with_embeddings(resume_text, job_title, job_description, resume_id):
    """Legacy sentence-transformers cosine similarity."""
    from sentence_transformers import SentenceTransformer
    import numpy as np

    model = SentenceTransformer("anass1209/resume-job-matcher-all-MiniLM-L6-v2")
    texts = [resume_text, job_description]
    embeddings = model.encode(texts, show_progress_bar=False)
    resume_embedding = embeddings[0]
    job_embedding = embeddings[1]
    similarity = float(
        np.dot(resume_embedding, job_embedding)
        / (np.linalg.norm(resume_embedding) * np.linalg.norm(job_embedding))
    )
    match_percentage = round(similarity * 100, 1)
    summary = resume_text[:200] + "..." if len(resume_text) > 200 else resume_text

    return Response(
        {
            "resume_id": resume_id,
            "job_title": job_title,
            "job_description": job_description,
            "similarity": round(similarity, 3),
            "match_percentage": match_percentage,
            "resume_summary": summary,
        }
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def match_resume_to_job(request, resume_id):
    """
    Match a saved resume to a job description.

    POST body: { "title": optional, "description": required }

    Query:
    - matcher=auto (default): DeepSeek when DEEPSEEK_API_KEY is set; else embeddings;
      on AI failure in auto mode, falls back to embeddings.
    - matcher=ai: DeepSeek only (502 on failure).
    - matcher=embeddings: sentence-transformers only.

    Returns: resume_id, job_title, job_description, similarity (0–1),
    match_percentage (0–100), resume_summary
    """
    try:
        # MongoDB
        connection_string = os.getenv("MONGODB_CONNECTION_STRING")
        if connection_string:
            try:
                client = MongoClient(connection_string)
                client.admin.command("ping")
            except Exception:
                connection_string = None

        if not connection_string:
            mongo_host = os.getenv("MONGODB_HOST", "mongodb")
            mongo_port = int(os.getenv("MONGODB_PORT", 27017))
            mongo_username = os.getenv("MONGODB_USERNAME", "")
            mongo_password = os.getenv("MONGODB_PASSWORD", "")

            if mongo_username and mongo_password:
                client = MongoClient(
                    mongo_host,
                    mongo_port,
                    username=mongo_username,
                    password=mongo_password,
                    authSource="admin",
                    authMechanism="SCRAM-SHA-1",
                )
            else:
                client = MongoClient(mongo_host, mongo_port)

        mongo_db_name = os.getenv("MONGODB_NAME", "resume_db")
        db = client[mongo_db_name]

        try:
            resume_object_id = ObjectId(resume_id)
        except Exception:
            return Response(
                {"error": "Invalid resume ID format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        resume_doc = db.resumes.find_one(
            {"_id": resume_object_id, "user_id": request.user.id}
        )
        if not resume_doc:
            return Response(
                {"error": "Resume not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        job_title = request.data.get("title", "Job Description")
        job_description = request.data.get("description", "")

        if not str(job_description).strip():
            return Response(
                {"error": "Please provide a job description"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        resume_text = get_resume_text(resume_doc)
        if not resume_text.strip():
            return Response(
                {"error": "Resume is empty or has no content"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        matcher = (request.query_params.get("matcher") or "auto").lower()
        if matcher == "ai" and not settings.DEEPSEEK_API_KEY:
            return Response(
                {"error": "AI job matching requires DEEPSEEK_API_KEY on the server."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        use_ai = matcher == "ai" or (
            matcher == "auto" and bool(settings.DEEPSEEK_API_KEY)
        )

        if use_ai and matcher != "embeddings":
            try:
                from ..resume_ai_job_match import match_job_with_deepseek

                ai = match_job_with_deepseek(resume_text, job_title, job_description)
                logger.info(
                    "Job match via DeepSeek resume=%s match_pct=%s",
                    resume_id,
                    ai.get("match_percentage"),
                )
                return Response(
                    {
                        "resume_id": resume_id,
                        "job_title": job_title,
                        "job_description": job_description,
                        "similarity": ai["similarity"],
                        "match_percentage": ai["match_percentage"],
                        "resume_summary": ai["resume_summary"],
                    }
                )
            except Exception as e:
                logger.warning("DeepSeek job match failed: %s", e)
                if matcher == "ai":
                    return Response(
                        {
                            "error": "AI job match failed. Try again or use matcher=embeddings.",
                        },
                        status=status.HTTP_502_BAD_GATEWAY,
                    )

        try:
            return _match_with_embeddings(
                resume_text, job_title, job_description, resume_id
            )
        except ImportError:
            return Response(
                {
                    "error": "sentence-transformers not installed. "
                    "Install with: pip install sentence-transformers",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    except Exception as e:
        return Response(
            {
                "error": f"Failed to match resume: {str(e)}",
                "detail": str(traceback.format_exc()),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

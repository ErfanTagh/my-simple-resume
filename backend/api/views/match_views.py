"""
Resume-Job Matching Views using AI/ML
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
import os
from pymongo import MongoClient
import json


def get_resume_text(resume_doc):
    """Convert resume document to text for matching"""
    text_parts = []
    
    # Personal info
    personal_info = resume_doc.get('personal_info', {})
    if personal_info.get('first_name'):
        text_parts.append(f"{personal_info.get('first_name', '')} {personal_info.get('last_name', '')}")
    if personal_info.get('professional_title'):
        text_parts.append(personal_info.get('professional_title'))
    if personal_info.get('summary'):
        text_parts.append(personal_info.get('summary'))
    
    # Work experience
    work_experience = resume_doc.get('work_experience', [])
    for exp in work_experience:
        exp_parts = []
        if exp.get('position'):
            exp_parts.append(exp.get('position'))
        if exp.get('company'):
            exp_parts.append(f"at {exp.get('company')}")
        if exp.get('start_date') or exp.get('end_date'):
            dates = f"{exp.get('start_date', '')} - {exp.get('end_date', 'Present')}"
            exp_parts.append(dates)
        if exp.get('description'):
            exp_parts.append(exp.get('description'))
        if exp_parts:
            text_parts.append(". ".join(exp_parts))
    
    # Education
    education = resume_doc.get('education', [])
    for edu in education:
        edu_parts = []
        if edu.get('degree'):
            edu_parts.append(edu.get('degree'))
        if edu.get('institution'):
            edu_parts.append(f"from {edu.get('institution')}")
        if edu_parts:
            text_parts.append(", ".join(edu_parts))
    
    # Skills
    skills = resume_doc.get('skills', [])
    if skills:
        skill_list = [s.get('skill', '') for s in skills if s.get('skill')]
        if skill_list:
            text_parts.append(f"Skills: {', '.join(skill_list)}")
    
    return " ".join(text_parts)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def match_resume_to_job(request, resume_id):
    """
    Match a resume to a single job description using AI semantic similarity
    
    Expects POST request with job description in body:
    {
        "title": "Job Title (optional)",
        "description": "Job description text..."
    }
    
    Returns:
    {
        "resume_id": "...",
        "job_title": "...",
        "similarity": 0.85,
        "match_percentage": 85.0,
        "resume_summary": "..."
    }
    """
    try:
        # Import here to avoid loading model on startup
        from sentence_transformers import SentenceTransformer
        import numpy as np
        
        # Connect to MongoDB
        connection_string = os.getenv('MONGODB_CONNECTION_STRING')
        if connection_string:
            try:
                client = MongoClient(connection_string)
                client.admin.command('ping')
            except Exception:
                connection_string = None
        
        if not connection_string:
            mongo_host = os.getenv('MONGODB_HOST', 'mongodb')
            mongo_port = int(os.getenv('MONGODB_PORT', 27017))
            mongo_db = os.getenv('MONGODB_NAME', 'resume_db')
            mongo_username = os.getenv('MONGODB_USERNAME', '')
            mongo_password = os.getenv('MONGODB_PASSWORD', '')
            
            if mongo_username and mongo_password:
                client = MongoClient(
                    mongo_host,
                    mongo_port,
                    username=mongo_username,
                    password=mongo_password,
                    authSource='admin',
                    authMechanism='SCRAM-SHA-1'
                )
            else:
                client = MongoClient(mongo_host, mongo_port)
        
        mongo_db = os.getenv('MONGODB_NAME', 'resume_db')
        db = client[mongo_db]
        
        # Validate resume ID
        try:
            resume_object_id = ObjectId(resume_id)
        except Exception:
            return Response(
                {'error': 'Invalid resume ID format'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get resume from database
        resume_doc = db.resumes.find_one({'_id': resume_object_id, 'user_id': request.user.id})
        if not resume_doc:
            return Response(
                {'error': 'Resume not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get job description from request
        job_title = request.data.get('title', 'Job Description')
        job_description = request.data.get('description', '')
        
        if not job_description.strip():
            return Response(
                {'error': 'Please provide a job description'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Convert resume to text
        resume_text = get_resume_text(resume_doc)
        
        if not resume_text.strip():
            return Response(
                {'error': 'Resume is empty or has no content'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Load the matching model
        model = SentenceTransformer("anass1209/resume-job-matcher-all-MiniLM-L6-v2")
        
        # Prepare texts for encoding
        texts = [resume_text, job_description]
        
        # Generate embeddings
        embeddings = model.encode(texts, show_progress_bar=False)
        
        # Calculate similarity score
        resume_embedding = embeddings[0]
        job_embedding = embeddings[1]
        
        # Calculate cosine similarity
        similarity = float(np.dot(resume_embedding, job_embedding) / (
            np.linalg.norm(resume_embedding) * np.linalg.norm(job_embedding)
        ))
        
        match_percentage = round(similarity * 100, 1)
        
        return Response({
            'resume_id': resume_id,
            'job_title': job_title,
            'job_description': job_description,
            'similarity': round(similarity, 3),
            'match_percentage': match_percentage,
            'resume_summary': resume_text[:200] + '...' if len(resume_text) > 200 else resume_text
        })
        
    except ImportError:
        return Response(
            {'error': 'sentence-transformers not installed. Please install it: pip install sentence-transformers'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        import traceback
        return Response(
            {'error': f'Failed to match resume: {str(e)}', 'detail': str(traceback.format_exc())},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


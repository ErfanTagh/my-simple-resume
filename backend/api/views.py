"""
API Views for Resume/CV operations
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Resume
from .serializers import ResumeSerializer
from .resume_scorer import calculate_resume_quality
from bson import ObjectId
from datetime import datetime


def format_mongo_date(date_value):
    """Convert MongoDB date to ISO string format"""
    if not date_value:
        return None
    if hasattr(date_value, 'isoformat'):
        return date_value.isoformat()
    if isinstance(date_value, str):
        return date_value
    return str(date_value)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def resume_list(request):
    """
    List all resumes for the authenticated user or create a new resume
    """
    if request.method == 'GET':
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            # Get raw data from MongoDB without instantiating abstract models
            from pymongo import MongoClient
            from bson import ObjectId as BsonObjectId
            import os
            
            # Connect to MongoDB directly
            # First try to use connection string if available
            connection_string = os.getenv('MONGODB_CONNECTION_STRING')
            if connection_string:
                # Try using connection string, but if it fails, fall back to individual vars
                try:
                    client = MongoClient(connection_string)
                    # Test the connection
                    client.admin.command('ping')
                except Exception:
                    # Connection string might have encoding issues, use individual vars
                    connection_string = None
            
            if not connection_string:
                # Use individual env vars (more reliable for special characters)
                from urllib.parse import quote_plus
                mongo_host = os.getenv('MONGODB_HOST', 'localhost')
                mongo_port = int(os.getenv('MONGODB_PORT', 27017))
                mongo_db = os.getenv('MONGODB_NAME', 'resume_db')
                mongo_username = os.getenv('MONGODB_USERNAME', '')
                mongo_password = os.getenv('MONGODB_PASSWORD', '')
                
                # Create authenticated connection
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
            
            # Get resumes for this user
            user_id = request.user.id
            resumes_cursor = db.resumes.find({'user_id': user_id})
            
            resumes_data = []
            for resume_doc in resumes_cursor:
                resume_dict = {
                    'id': str(resume_doc['_id']),
                    'personal_info': resume_doc.get('personal_info', {}),
                    'work_experience': resume_doc.get('work_experience', []),
                    'education': resume_doc.get('education', []),
                    'projects': resume_doc.get('projects', []),
                    'certificates': resume_doc.get('certificates', []),
                    'languages': resume_doc.get('languages', []),
                    'skills': resume_doc.get('skills', []),
                    'template': resume_doc.get('template', 'modern'),
                    'section_order': resume_doc.get('section_order', [
                        'summary',
                        'workExperience',
                        'education',
                        'projects',
                        'certificates',
                        'skills',
                        'languages',
                        'interests',
                    ]),
                    'completeness_score': resume_doc.get('completeness_score', 0.0),
                    'clarity_score': resume_doc.get('clarity_score', 0.0),
                    'formatting_score': resume_doc.get('formatting_score', 0.0),
                    'impact_score': resume_doc.get('impact_score', 0.0),
                    'overall_score': resume_doc.get('overall_score', 0.0),
                    'created_at': format_mongo_date(resume_doc.get('created_at')),
                    'updated_at': format_mongo_date(resume_doc.get('updated_at')),
                }
                resumes_data.append(resume_dict)
            
            logger.error(f"Found {len(resumes_data)} resumes")
            return Response(resumes_data)
        except Exception as e:
            logger.error(f"Error listing resumes: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    elif request.method == 'POST':
        import logging
        logger = logging.getLogger(__name__)
        
        logger.error(f"Received POST data: {request.data}")
        
        serializer = ResumeSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Save data from validated_data to model
                data = serializer.validated_data
                
                # Calculate quality scores
                quality_scores = calculate_resume_quality(request.data)
                
                # Calculate quality scores
                quality_scores = calculate_resume_quality(request.data)
                
                resume = Resume(
                    user=request.user,  # Link resume to authenticated user
                    personal_info=data.get('personal_info'),
                    work_experience=data.get('work_experience', []),
                    education=data.get('education', []),
                    projects=data.get('projects', []),
                    certificates=data.get('certificates', []),
                    languages=data.get('languages', []),
                    skills=data.get('skills', []),
                    template=data.get('template', 'modern'),
                    section_order=data.get('section_order', [
                        'summary',
                        'workExperience',
                        'education',
                        'projects',
                        'certificates',
                        'skills',
                        'languages',
                        'interests',
                    ]),
                    completeness_score=quality_scores['completeness_score'],
                    clarity_score=quality_scores['clarity_score'],
                    formatting_score=quality_scores['formatting_score'],
                    impact_score=quality_scores['impact_score'],
                    overall_score=quality_scores['overall_score'],
                )
                resume.save()
                
                # Return the created resume
                response_serializer = ResumeSerializer(resume)
                return Response(
                    response_serializer.data, 
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                logger.error(f"Error saving resume: {str(e)}")
                import traceback
                logger.error(traceback.format_exc())
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        logger.error(f"Serializer validation failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def resume_detail(request, pk):
    """
    Retrieve, update or delete a resume (only if it belongs to the authenticated user)
    """
    # Setup MongoDB connection for all methods
    from pymongo import MongoClient
    from bson import ObjectId as BsonObjectId
    import os
    
    # First try to use connection string if available
    connection_string = os.getenv('MONGODB_CONNECTION_STRING')
    if connection_string:
        # Try using connection string, but if it fails, fall back to individual vars
        try:
            client = MongoClient(connection_string)
            # Test the connection
            client.admin.command('ping')
        except Exception:
            # Connection string might have encoding issues, use individual vars
            connection_string = None
    
    if not connection_string:
        # Use individual env vars (more reliable for special characters)
        mongo_host = os.getenv('MONGODB_HOST', 'localhost')
        mongo_port = int(os.getenv('MONGODB_PORT', 27017))
        mongo_db = os.getenv('MONGODB_NAME', 'resume_db')
        mongo_username = os.getenv('MONGODB_USERNAME', '')
        mongo_password = os.getenv('MONGODB_PASSWORD', '')
        
        # Create authenticated connection
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
    
    # Validate ObjectId format
    try:
        resume_id = BsonObjectId(pk)
    except Exception:
        return Response(
            {'error': 'Invalid resume ID format'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if request.method == 'GET':
        import logging
        logger = logging.getLogger(__name__)
        
        try:
            # Get the specific resume
            resume_doc = db.resumes.find_one({'_id': resume_id, 'user_id': request.user.id})
            
            if not resume_doc:
                return Response(
                    {'error': 'Resume not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            resume_dict = {
                'id': str(resume_doc['_id']),
                'personal_info': resume_doc.get('personal_info', {}),
                'work_experience': resume_doc.get('work_experience', []),
                'education': resume_doc.get('education', []),
                'projects': resume_doc.get('projects', []),
                'certificates': resume_doc.get('certificates', []),
                'languages': resume_doc.get('languages', []),
                'skills': resume_doc.get('skills', []),
                'template': resume_doc.get('template', 'modern'),
                'section_order': resume_doc.get('section_order', [
                    'summary',
                    'workExperience',
                    'education',
                    'projects',
                    'certificates',
                    'skills',
                    'languages',
                    'interests',
                ]),
                'completeness_score': resume_doc.get('completeness_score', 0.0),
                'clarity_score': resume_doc.get('clarity_score', 0.0),
                'formatting_score': resume_doc.get('formatting_score', 0.0),
                'impact_score': resume_doc.get('impact_score', 0.0),
                'overall_score': resume_doc.get('overall_score', 0.0),
                'created_at': format_mongo_date(resume_doc.get('created_at')),
                'updated_at': format_mongo_date(resume_doc.get('updated_at')),
            }
            return Response(resume_dict)
        except Exception as e:
            logger.error(f"Error serializing resume: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    elif request.method == 'PUT':
        serializer = ResumeSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Calculate quality scores
                quality_scores = calculate_resume_quality(request.data)
                
                # Update the resume in MongoDB
                update_data = serializer.validated_data
                update_data.update(quality_scores)  # Add scores to update
                
                result = db.resumes.update_one(
                    {'_id': resume_id, 'user_id': request.user.id},
                    {'$set': update_data}
                )
                
                if result.matched_count == 0:
                    return Response(
                        {'error': 'Resume not found'}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                # Return updated resume
                updated_doc = db.resumes.find_one({'_id': resume_id})
                resume_dict = {
                    'id': str(updated_doc['_id']),
                    'personal_info': updated_doc.get('personal_info', {}),
                    'work_experience': updated_doc.get('work_experience', []),
                    'education': updated_doc.get('education', []),
                    'projects': updated_doc.get('projects', []),
                    'certificates': updated_doc.get('certificates', []),
                    'languages': updated_doc.get('languages', []),
                    'skills': updated_doc.get('skills', []),
                    'completeness_score': updated_doc.get('completeness_score', 0.0),
                    'clarity_score': updated_doc.get('clarity_score', 0.0),
                    'formatting_score': updated_doc.get('formatting_score', 0.0),
                    'impact_score': updated_doc.get('impact_score', 0.0),
                    'overall_score': updated_doc.get('overall_score', 0.0),
                    'created_at': updated_doc.get('created_at'),
                    'updated_at': updated_doc.get('updated_at'),
                }
                return Response(resume_dict)
            except Exception as e:
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        result = db.resumes.delete_one({'_id': resume_id, 'user_id': request.user.id})
        
        if result.deleted_count == 0:
            return Response(
                {'error': 'Resume not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        return Response(
            {'message': 'Resume deleted successfully'}, 
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Simple health check endpoint (public)
    """
    return Response({
        'status': 'healthy',
        'message': 'Resume API is running'
    })


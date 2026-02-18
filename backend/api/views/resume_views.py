"""
Resume CRUD views (list, create, retrieve, update, delete)
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from bson import ObjectId as BsonObjectId
from datetime import datetime
from .utils import get_date_or_now
from ..serializers import ResumeSerializer
# Backend scorer removed - scores are now calculated on frontend


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def resume_list(request):
    """
    List all resumes for the authenticated user
    """
    import logging
    import sys
    logger = logging.getLogger(__name__)
    
    # Verbose request logging removed - only styling-specific logs remain
    
    if request.method == 'GET':
        try:
            # Get raw data from MongoDB without instantiating abstract models
            from pymongo import MongoClient
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
                # Get dates with fallback
                created_at_raw = resume_doc.get('created_at')
                updated_at_raw = resume_doc.get('updated_at')
                
                resume_dict = {
                    'id': str(resume_doc['_id']),
                    'name': resume_doc.get('name'),
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
                    'created_at': get_date_or_now(created_at_raw),
                    'updated_at': get_date_or_now(updated_at_raw),
                }
                resumes_data.append(resume_dict)
            
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
        import sys
        logger = logging.getLogger(__name__)
        
        # Verbose request logging removed - only styling-specific logs remain
        print("=" * 50, file=sys.stderr)
        
        logger.error(f"Received POST data: {request.data}")
        
        serializer = ResumeSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Setup MongoDB connection
                from pymongo import MongoClient
                import os
                
                # First try to use connection string if available
                connection_string = os.getenv('MONGODB_CONNECTION_STRING')
                if connection_string:
                    try:
                        client = MongoClient(connection_string)
                        client.admin.command('ping')
                    except Exception:
                        connection_string = None
                
                if not connection_string:
                    # In Docker, use service name 'mongodb', otherwise 'localhost'
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
                
                # Save data from validated_data
                data = serializer.validated_data
                
                # Get quality scores from request (calculated on frontend)
                # Default to 0.0 if not provided (should always be provided by frontend)
                quality_scores = {
                    'completeness_score': data.get('completeness_score', 0.0),
                    'clarity_score': data.get('clarity_score', 0.0),
                    'formatting_score': data.get('formatting_score', 0.0),
                    'impact_score': data.get('impact_score', 0.0),
                    'overall_score': data.get('overall_score', 0.0),
                }
                
                # Minimal logging of styling when creating resume
                styling_from_request = data.get('styling', {})
                print(f"[STYLING LOG] resume_list POST (create): has_styling_in_request={'styling' in request.data}, has_styling_in_validated={'styling' in data}, styling_keys={list(styling_from_request.keys()) if isinstance(styling_from_request, dict) else None}, font_size={styling_from_request.get('font_size') if isinstance(styling_from_request, dict) else None}", file=sys.stderr)
                
                # Prepare document for MongoDB
                resume_doc = {
                    'user_id': request.user.id,
                    'name': data.get('name'),
                    'personal_info': data.get('personal_info', {}),
                    'work_experience': data.get('work_experience', []),
                    'education': data.get('education', []),
                    'projects': data.get('projects', []),
                    'certificates': data.get('certificates', []),
                    'languages': data.get('languages', []),
                    'skills': data.get('skills', []),
                    'template': data.get('template', 'modern'),
                    'section_order': data.get('section_order', [
                        'summary',
                        'workExperience',
                        'education',
                        'projects',
                        'certificates',
                        'skills',
                        'languages',
                        'interests',
                    ]),
                    'styling': data.get('styling', {}),  # Include styling field
                    'completeness_score': quality_scores.get('completeness_score', 0.0),
                    'clarity_score': quality_scores.get('clarity_score', 0.0),
                    'formatting_score': quality_scores.get('formatting_score', 0.0),
                    'impact_score': quality_scores.get('impact_score', 0.0),
                    'overall_score': quality_scores.get('overall_score', 0.0),
                    'created_at': datetime.utcnow(),
                    'updated_at': datetime.utcnow(),
                }
                
                # Insert into MongoDB
                result = db.resumes.insert_one(resume_doc)
                resume_id = result.inserted_id
                
                # Retrieve the created resume
                created_doc = db.resumes.find_one({'_id': resume_id})
                
                # Minimal logging of styling after creation
                created_styling = created_doc.get('styling')
                print(f"[STYLING LOG] resume_list POST (after create): resume_id={resume_id}, has_styling={created_styling is not None}, styling_keys={list(created_styling.keys()) if isinstance(created_styling, dict) else None}, font_size={(created_styling or {}).get('font_size') if isinstance(created_styling, dict) else None}", file=sys.stderr)
                
                # Format response
                resume_dict = {
                    'id': str(created_doc['_id']),
                    'name': created_doc.get('name'),
                    'personal_info': created_doc.get('personal_info', {}),
                    'work_experience': created_doc.get('work_experience', []),
                    'education': created_doc.get('education', []),
                    'projects': created_doc.get('projects', []),
                    'certificates': created_doc.get('certificates', []),
                    'languages': created_doc.get('languages', []),
                    'skills': created_doc.get('skills', []),
                    'template': created_doc.get('template', 'modern'),
                    'section_order': created_doc.get('section_order', [
                        'summary',
                        'workExperience',
                        'education',
                        'projects',
                        'certificates',
                        'skills',
                        'languages',
                        'interests',
                    ]),
                    'completeness_score': created_doc.get('completeness_score', 0.0),
                    'clarity_score': created_doc.get('clarity_score', 0.0),
                    'formatting_score': created_doc.get('formatting_score', 0.0),
                    'impact_score': created_doc.get('impact_score', 0.0),
                    'overall_score': created_doc.get('overall_score', 0.0),
                    'created_at': get_date_or_now(created_doc.get('created_at')),
                    'updated_at': get_date_or_now(created_doc.get('updated_at')),
                }
                
                return Response(resume_dict, status=status.HTTP_201_CREATED)
            except Exception as e:
                import traceback
                error_traceback = traceback.format_exc()
                error_message = str(e)
                logger.error(f"Error saving resume: {error_message}")
                logger.error(error_traceback)
                print(f"ERROR SAVING RESUME: {error_message}")
                print(error_traceback)
                return Response(
                    {'error': error_message, 'detail': error_traceback.split('\n')[-5:] if error_traceback else []},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
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
        import sys
        logger = logging.getLogger(__name__)
        
        try:
            # Get the specific resume
            resume_doc = db.resumes.find_one({'_id': resume_id, 'user_id': request.user.id})
            
            if not resume_doc:
                return Response(
                    {'error': 'Resume not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Minimal logging to trace styling presence without PII
            styling_from_db = resume_doc.get('styling')
            print(f"[STYLING LOG] resume_detail GET: resume_id={resume_doc.get('_id')}, has_styling={styling_from_db is not None}, styling_keys={list(styling_from_db.keys()) if isinstance(styling_from_db, dict) else None}, font_size={(styling_from_db or {}).get('font_size') if isinstance(styling_from_db, dict) else None}", file=sys.stderr)
            
            resume_dict = {
                'id': str(resume_doc['_id']),
                'name': resume_doc.get('name'),
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
                'styling': resume_doc.get('styling', {}),  # Include styling field
                'completeness_score': resume_doc.get('completeness_score', 0.0),
                'clarity_score': resume_doc.get('clarity_score', 0.0),
                'formatting_score': resume_doc.get('formatting_score', 0.0),
                'impact_score': resume_doc.get('impact_score', 0.0),
                'overall_score': resume_doc.get('overall_score', 0.0),
                'created_at': get_date_or_now(resume_doc.get('created_at')),
                'updated_at': get_date_or_now(resume_doc.get('updated_at')),
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
        import sys
        serializer = ResumeSerializer(data=request.data)
        if serializer.is_valid():
            try:
                # Get quality scores from request (calculated on frontend)
                # Default to 0.0 if not provided (should always be provided by frontend)
                data = serializer.validated_data
                quality_scores = {
                    'completeness_score': data.get('completeness_score', 0.0),
                    'clarity_score': data.get('clarity_score', 0.0),
                    'formatting_score': data.get('formatting_score', 0.0),
                    'impact_score': data.get('impact_score', 0.0),
                    'overall_score': data.get('overall_score', 0.0),
                }
                
                # Update the resume in MongoDB
                # Get existing resume to preserve created_at
                existing_doc = db.resumes.find_one({'_id': resume_id, 'user_id': request.user.id})
                if not existing_doc:
                    return Response(
                        {'error': 'Resume not found'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                # Minimal logging of styling coming from frontend / serializer (no PII)
                print(f"[STYLING LOG] resume_detail PUT (before update): resume_id={resume_id}, has_styling_in_request={'styling' in request.data}, has_styling_in_validated={'styling' in data}, validated_styling_keys={list((data.get('styling') or {}).keys()) if isinstance(data.get('styling'), dict) else None}", file=sys.stderr)
                
                # Prepare update data - preserve created_at, update everything else
                update_data = serializer.validated_data.copy()
                update_data.update(quality_scores)  # Add scores to update
                update_data['updated_at'] = datetime.utcnow()  # Set updated_at timestamp
                # Preserve created_at from existing document
                if 'created_at' in existing_doc:
                    update_data['created_at'] = existing_doc['created_at']
                
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
                
                # Minimal logging of styling after update (to compare with request)
                updated_styling = updated_doc.get('styling')
                print(f"[STYLING LOG] resume_detail PUT (after update): resume_id={updated_doc.get('_id')}, has_styling={updated_styling is not None}, styling_keys={list(updated_styling.keys()) if isinstance(updated_styling, dict) else None}, font_size={(updated_styling or {}).get('font_size') if isinstance(updated_styling, dict) else None}", file=sys.stderr)
                
                resume_dict = {
                    'id': str(updated_doc['_id']),
                    'name': updated_doc.get('name'),
                    'personal_info': updated_doc.get('personal_info', {}),
                    'work_experience': updated_doc.get('work_experience', []),
                    'education': updated_doc.get('education', []),
                    'projects': updated_doc.get('projects', []),
                    'certificates': updated_doc.get('certificates', []),
                    'languages': updated_doc.get('languages', []),
                    'skills': updated_doc.get('skills', []),
                    'template': updated_doc.get('template', 'modern'),
                    'section_order': updated_doc.get('section_order', [
                        'summary',
                        'workExperience',
                        'education',
                        'projects',
                        'certificates',
                        'skills',
                        'languages',
                        'interests',
                    ]),
                    'styling': updated_doc.get('styling', {}),  # Include styling field
                    'completeness_score': updated_doc.get('completeness_score', 0.0),
                    'clarity_score': updated_doc.get('clarity_score', 0.0),
                    'formatting_score': updated_doc.get('formatting_score', 0.0),
                    'impact_score': updated_doc.get('impact_score', 0.0),
                    'overall_score': updated_doc.get('overall_score', 0.0),
                    'created_at': get_date_or_now(updated_doc.get('created_at')),
                    'updated_at': get_date_or_now(updated_doc.get('updated_at')),
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


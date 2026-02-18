#!/usr/bin/env python3
"""
Fetch "Marketing Resume" for user erfantagh94 from server MongoDB and export as JSON.
This script should be run on the server.
"""
import os
import sys
import json
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

# Add Django project to path - try multiple possible locations
possible_paths = [
    os.path.join(os.path.dirname(__file__), '..', 'backend'),
    '/app',  # Docker container path
    os.path.dirname(os.path.abspath(__file__)),
]
for path in possible_paths:
    if os.path.exists(path) and os.path.exists(os.path.join(path, 'config', 'settings.py')):
        sys.path.insert(0, path)
        break
else:
    # Default to /app if we're in a container
    if os.path.exists('/app'):
        sys.path.insert(0, '/app')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django
django.setup()

from django.contrib.auth.models import User


def get_db():
    """Connect to MongoDB"""
    host = os.getenv('MONGODB_HOST', 'localhost')
    port = int(os.getenv('MONGODB_PORT', 27017))
    dbname = os.getenv('MONGODB_NAME', 'resume_db')
    user = os.getenv('MONGODB_USERNAME', '')
    pw = os.getenv('MONGODB_PASSWORD', '')
    
    if user and pw:
        client = MongoClient(
            host, 
            port, 
            username=user, 
            password=pw, 
            authSource='admin', 
            authMechanism='SCRAM-SHA-1'
        )
    else:
        client = MongoClient(host, port)
    
    return client[dbname]


def serialize_datetime(obj):
    """Convert datetime objects to ISO format strings"""
    if isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Type {type(obj)} not serializable")


def main():
    username = 'erfantagh94'
    resume_name = 'Marketing Resume'
    
    # Find user in Django
    try:
        user = User.objects.get(username=username)
        user_id = user.id
        print(f"Found user: {username} (ID: {user_id})", file=sys.stderr)
    except User.DoesNotExist:
        print(f"Error: User '{username}' not found", file=sys.stderr)
        sys.exit(1)
    
    # Connect to MongoDB
    db = get_db()
    
    # Find resume by user_id and name
    resume_doc = db.resumes.find_one({
        'user_id': user_id,
        'name': resume_name
    })
    
    if not resume_doc:
        # Try without exact name match (case insensitive)
        resume_doc = db.resumes.find_one({
            'user_id': user_id,
            'name': {'$regex': resume_name, '$options': 'i'}
        })
    
    if not resume_doc:
        print(f"Error: Resume '{resume_name}' not found for user '{username}'", file=sys.stderr)
        # List all resumes for this user
        all_resumes = list(db.resumes.find({'user_id': user_id}, {'name': 1, '_id': 1}))
        if all_resumes:
            print(f"Available resumes for {username}:", file=sys.stderr)
            for r in all_resumes:
                print(f"  - {r.get('name', 'Unnamed')} (ID: {r['_id']})", file=sys.stderr)
        sys.exit(1)
    
    # Convert ObjectId to string and datetime to ISO format
    resume_dict = {}
    for key, value in resume_doc.items():
        if isinstance(value, ObjectId):
            resume_dict[key] = str(value)
        elif isinstance(value, datetime):
            resume_dict[key] = value.isoformat()
        elif isinstance(value, list):
            # Handle nested lists (e.g., work_experience, education)
            resume_dict[key] = []
            for item in value:
                if isinstance(item, dict):
                    processed_item = {}
                    for k, v in item.items():
                        if isinstance(v, ObjectId):
                            processed_item[k] = str(v)
                        elif isinstance(v, datetime):
                            processed_item[k] = v.isoformat()
                        else:
                            processed_item[k] = v
                    resume_dict[key].append(processed_item)
                else:
                    resume_dict[key].append(item)
        elif isinstance(value, dict):
            # Handle nested dicts (e.g., personal_info)
            processed_dict = {}
            for k, v in value.items():
                if isinstance(v, ObjectId):
                    processed_dict[k] = str(v)
                elif isinstance(v, datetime):
                    processed_dict[k] = v.isoformat()
                else:
                    processed_dict[k] = v
            resume_dict[key] = processed_dict
        else:
            resume_dict[key] = value
    
    # Output as JSON
    print(json.dumps(resume_dict, indent=2, default=serialize_datetime))


if __name__ == '__main__':
    main()

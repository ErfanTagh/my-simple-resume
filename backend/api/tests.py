"""
Test cases for Resume API
"""
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status


class ResumeAPITestCase(TestCase):
    """Test cases for Resume API endpoints"""
    
    def setUp(self):
        """Set up test client"""
        self.client = APIClient()
        
        self.valid_payload = {
            'personalInfo': {
                'firstName': 'John',
                'lastName': 'Doe',
                'email': 'john@example.com',
                'interests': []
            },
            'workExperience': [],
            'education': [],
            'projects': [],
            'certificates': [],
            'languages': [],
            'skills': []
        }
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'healthy')
    
    def test_create_resume(self):
        """Test creating a new resume"""
        response = self.client.post(
            '/api/resumes/',
            data=self.valid_payload,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
    
    def test_get_resume_list(self):
        """Test getting list of resumes"""
        response = self.client.get('/api/resumes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)


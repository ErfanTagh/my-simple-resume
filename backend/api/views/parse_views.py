"""
Resume parsing views
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def parse_resume(request):
    """
    Parse uploaded resume (PDF or text) and return structured data
    
    POST /api/resumes/parse/
    Accepts:
    - file: PDF or text file (optional - backend will extract text using pdfplumber)
    - text: Plain text string (optional - if frontend already extracted)
    
    Returns structured resume data matching CVFormData format
    """
    try:
        from ..resume_parser import get_resume_parser
        from ..pdf_parser import extract_text_from_pdf
        
        text = None
        
        # Check if file is uploaded (backend will extract text using pdfplumber)
        if 'file' in request.FILES:
            file = request.FILES['file']
            print(f"\n📄 File: {file.name} ({file.content_type}, {file.size} bytes)")
            
            # Check file type
            if file.content_type == 'application/pdf':
                text = extract_text_from_pdf(file)
                if not text:
                    return Response(
                        {"error": "Failed to extract text from PDF. Please ensure the PDF contains readable text."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            elif file.content_type == 'text/plain':
                text = file.read().decode('utf-8')
            else:
                return Response(
                    {"error": "Unsupported file type. Please upload PDF or text file."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Check if text is provided directly (frontend already extracted)
        elif 'text' in request.data:
            text = request.data['text']
        else:
            return Response(
                {"error": "Please provide either a file or text"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not text or len(text.strip()) == 0:
            return Response(
                {"error": "No text content found. Please provide a valid resume file or text."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Parse the resume
        print("🤖 Initializing resume parser...")
        parser = get_resume_parser()
        parsed_data = parser.parse_text(text)
        print(f"✅ Parsed data keys: {list(parsed_data.keys())}")
        print(f"✅ Personal info: {parsed_data.get('personalInfo', {})}")
        print(f"✅ Work experience count: {len(parsed_data.get('workExperience', []))}")
        print(f"✅ Education count: {len(parsed_data.get('education', []))}")
        print(f"✅ Skills count: {len(parsed_data.get('skills', []))}")
        print(f"✅ Projects count: {len(parsed_data.get('projects', []))}")
        print(f"✅ Certificates count: {len(parsed_data.get('certificates', []))}")
        print(f"✅ Languages count: {len(parsed_data.get('languages', []))}")
        
        return Response(parsed_data, status=status.HTTP_200_OK)
        
    except ImportError as e:
        import traceback
        print(f"Import error: {e}")
        print(traceback.format_exc())
        return Response(
            {"error": "Resume parsing service is not available. Please ensure ML dependencies are installed."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )
    except Exception as e:
        import traceback
        print(f"Error parsing resume: {e}")
        print(traceback.format_exc())
        return Response(
            {"error": f"Failed to parse resume: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


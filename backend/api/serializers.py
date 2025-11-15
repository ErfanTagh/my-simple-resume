"""
Serializers for API data validation and transformation
"""
from rest_framework import serializers


class InterestSerializer(serializers.Serializer):
    interest = serializers.CharField(max_length=100, required=False, allow_blank=True)


class TechnologySerializer(serializers.Serializer):
    technology = serializers.CharField(max_length=100, required=False, allow_blank=True)


class CompetencySerializer(serializers.Serializer):
    competency = serializers.CharField(max_length=100, required=False, allow_blank=True)


class ResponsibilitySerializer(serializers.Serializer):
    responsibility = serializers.CharField(max_length=500, required=False, allow_blank=True)


class HighlightSerializer(serializers.Serializer):
    highlight = serializers.CharField(max_length=500, required=False, allow_blank=True)


class CourseSerializer(serializers.Serializer):
    course = serializers.CharField(max_length=200, required=False, allow_blank=True)


class PersonalInfoSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    professional_title = serializers.CharField(
        max_length=200, 
        required=False, 
        allow_blank=True
    )
    profile_image = serializers.CharField(
        required=False, 
        allow_blank=True
    )
    email = serializers.EmailField()
    phone = serializers.CharField(
        max_length=50, 
        required=False, 
        allow_blank=True
    )
    location = serializers.CharField(
        max_length=200, 
        required=False, 
        allow_blank=True
    )
    linkedin = serializers.URLField(required=False, allow_blank=True)
    github = serializers.URLField(required=False, allow_blank=True)
    website = serializers.URLField(required=False, allow_blank=True)
    summary = serializers.CharField(required=False, allow_blank=True)
    interests = InterestSerializer(many=True, required=False)


class WorkExperienceSerializer(serializers.Serializer):
    position = serializers.CharField(max_length=200, required=False, allow_blank=True)
    company = serializers.CharField(max_length=200, required=False, allow_blank=True)
    location = serializers.CharField(
        max_length=200, 
        required=False, 
        allow_blank=True
    )
    start_date = serializers.CharField(
        max_length=20, 
        required=False, 
        allow_blank=True
    )
    end_date = serializers.CharField(
        max_length=20, 
        required=False, 
        allow_blank=True
    )
    description = serializers.CharField(required=False, allow_blank=True)
    responsibilities = ResponsibilitySerializer(many=True, required=False)
    technologies = TechnologySerializer(many=True, required=False)
    competencies = CompetencySerializer(many=True, required=False)


class EducationSerializer(serializers.Serializer):
    degree = serializers.CharField(max_length=200, required=False, allow_blank=True)
    institution = serializers.CharField(max_length=200, required=False, allow_blank=True)
    location = serializers.CharField(
        max_length=200, 
        required=False, 
        allow_blank=True
    )
    start_date = serializers.CharField(
        max_length=20, 
        required=False, 
        allow_blank=True
    )
    end_date = serializers.CharField(
        max_length=20, 
        required=False, 
        allow_blank=True
    )
    field = serializers.CharField(
        max_length=200, 
        required=False, 
        allow_blank=True
    )
    key_courses = CourseSerializer(
        many=True, 
        required=False
    )


class ProjectSerializer(serializers.Serializer):
    name = serializers.CharField(
        max_length=200, 
        required=False, 
        allow_blank=True
    )
    description = serializers.CharField(required=False, allow_blank=True)
    highlights = HighlightSerializer(many=True, required=False)
    technologies = TechnologySerializer(many=True, required=False)
    start_date = serializers.CharField(
        max_length=20, 
        required=False, 
        allow_blank=True
    )
    end_date = serializers.CharField(
        max_length=20, 
        required=False, 
        allow_blank=True
    )
    link = serializers.URLField(required=False, allow_blank=True)


class CertificateSerializer(serializers.Serializer):
    name = serializers.CharField(
        max_length=200, 
        required=False, 
        allow_blank=True
    )
    organization = serializers.CharField(
        max_length=200, 
        required=False, 
        allow_blank=True
    )
    issue_date = serializers.CharField(
        max_length=20, 
        required=False, 
        allow_blank=True
    )
    expiration_date = serializers.CharField(
        max_length=20, 
        required=False, 
        allow_blank=True
    )
    credential_id = serializers.CharField(
        max_length=200, 
        required=False, 
        allow_blank=True
    )
    url = serializers.URLField(required=False, allow_blank=True)


class LanguageSerializer(serializers.Serializer):
    language = serializers.CharField(max_length=100, required=False, allow_blank=True)
    proficiency = serializers.CharField(max_length=50, required=False, allow_blank=True)


class SkillSerializer(serializers.Serializer):
    skill = serializers.CharField(max_length=100, required=False, allow_blank=True)


class ResumeSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True, source='_id')
    personal_info = PersonalInfoSerializer()
    work_experience = WorkExperienceSerializer(many=True, required=False)
    education = EducationSerializer(many=True, required=False)
    projects = ProjectSerializer(many=True, required=False)
    certificates = CertificateSerializer(many=True, required=False)
    languages = LanguageSerializer(many=True, required=False)
    skills = SkillSerializer(many=True, required=False)
    template = serializers.CharField(max_length=50, required=False, allow_blank=True)
    section_order = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False,
        allow_empty=True
    )
    # Quality scores
    completeness_score = serializers.FloatField(read_only=True, required=False)
    clarity_score = serializers.FloatField(read_only=True, required=False)
    formatting_score = serializers.FloatField(read_only=True, required=False)
    impact_score = serializers.FloatField(read_only=True, required=False)
    overall_score = serializers.FloatField(read_only=True, required=False)
    
    created_at = serializers.DateTimeField(read_only=True)
    updated_at = serializers.DateTimeField(read_only=True)


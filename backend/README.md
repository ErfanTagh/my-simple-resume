# Resume Backend API

Django REST API with MongoDB for managing CV/Resume data.

## Features

- **JWT Authentication** - Secure user authentication with access and refresh tokens
- **User Management** - Register, login, and manage user profiles
- **Protected Endpoints** - Users can only access their own resumes
- **RESTful API** - Full CRUD operations for CV/Resume data
- **MongoDB Integration** - NoSQL database with Djongo
- **CORS Enabled** - Frontend integration ready
- **Comprehensive Validation** - Data validation with Django REST Framework

## Tech Stack

- **Django 4.2.7** - Web framework
- **Django REST Framework** - REST API toolkit
- **Djongo** - MongoDB connector for Django
- **MongoDB** - NoSQL database

## Setup Instructions

### Prerequisites

- Python 3.8+
- MongoDB (running locally or remote)
- pip (Python package manager)

### Installation

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Create a virtual environment:**

   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**

   - On Linux/Mac:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

4. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

5. **Create .env file:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   MONGODB_NAME=resume_db
   MONGODB_HOST=localhost
   MONGODB_PORT=27017
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

6. **Run migrations:**

   ```bash
   python manage.py migrate
   ```

7. **Create superuser (optional, for admin panel):**

   ```bash
   python manage.py createsuperuser
   ```

8. **Run development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check

- **GET** `/api/health/` - Check if API is running

### Resumes

- **GET** `/api/resumes/` - List all resumes
- **POST** `/api/resumes/` - Create a new resume
- **GET** `/api/resumes/{id}/` - Get a specific resume
- **PUT** `/api/resumes/{id}/` - Update a resume
- **DELETE** `/api/resumes/{id}/` - Delete a resume

## Request/Response Format

### Register User (POST /api/auth/register/)

**Request:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Login (POST /api/auth/login/)

**Request:**

```json
{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  },
  "tokens": {
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Refresh Token (POST /api/auth/token/refresh/)

**Request:**

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response:**

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Logout (POST /api/auth/logout/)

**Request:**

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response:**

```json
{
  "message": "Logout successful"
}
```

### Create Resume (POST /api/resumes/)

**Note:** Requires authentication header with access token.

```json
{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "professionalTitle": "Software Engineer",
    "profileImage": "https://example.com/photo.jpg",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, USA",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "website": "https://johndoe.com",
    "summary": "Experienced software engineer...",
    "interests": [{ "interest": "Coding" }, { "interest": "Reading" }]
  },
  "workExperience": [
    {
      "position": "Senior Developer",
      "company": "Tech Corp",
      "location": "New York, USA",
      "startDate": "2020-01",
      "endDate": "Present",
      "description": "Led development team...",
      "technologies": [{ "technology": "React" }, { "technology": "Node.js" }],
      "competencies": [
        { "competency": "Leadership" },
        { "competency": "Problem Solving" }
      ]
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science",
      "institution": "University Name",
      "location": "Boston, USA",
      "startDate": "2016-09",
      "endDate": "2020-05",
      "field": "Computer Science",
      "keyCourses": [
        { "course": "Data Structures" },
        { "course": "Algorithms" }
      ]
    }
  ],
  "projects": [
    {
      "name": "E-commerce Platform",
      "description": "Built a full-stack e-commerce platform",
      "technologies": [{ "technology": "React" }, { "technology": "MongoDB" }],
      "startDate": "2021-01",
      "endDate": "2021-06",
      "link": "https://github.com/johndoe/project"
    }
  ],
  "certificates": [
    {
      "name": "AWS Certified Developer",
      "organization": "Amazon Web Services",
      "issueDate": "2022-03",
      "expirationDate": "2025-03",
      "credentialId": "ABC123",
      "url": "https://aws.amazon.com/verify/ABC123"
    }
  ],
  "languages": [
    {
      "language": "English",
      "proficiency": "Native"
    }
  ],
  "skills": [{ "skill": "JavaScript" }, { "skill": "Python" }]
}
```

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/` to manage resumes through a web interface.

## MongoDB Setup

Make sure MongoDB is running before starting the Django server:

```bash
# Start MongoDB (if installed locally)
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Authentication Flow

1. **Register**: User creates an account via `/api/auth/register/`
2. **Login**: User logs in via `/api/auth/login/` and receives access + refresh tokens
3. **Access Protected Resources**: Include access token in Authorization header for all protected endpoints
4. **Token Refresh**: When access token expires (1 hour), use refresh token at `/api/auth/token/refresh/` to get a new access token
5. **Logout**: Blacklist refresh token via `/api/auth/logout/`

### Token Lifetimes

- **Access Token**: 1 hour
- **Refresh Token**: 7 days

### Example Usage with curl

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"johndoe","password":"pass123"}'

# Create Resume (with authentication)
curl -X POST http://localhost:8000/api/resumes/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d @resume_data.json

# Get User's Resumes
curl -X GET http://localhost:8000/api/resumes/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Development

### Running Tests

```bash
python manage.py test
```

### Code Style

Follow PEP 8 guidelines for Python code.

## Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check `MONGODB_HOST` and `MONGODB_PORT` in `.env`
- Verify firewall settings allow connection to MongoDB

### CORS Issues

- Check `CORS_ALLOWED_ORIGINS` in `.env` includes your frontend URL
- Ensure `django-cors-headers` is properly installed

## License

This project is part of the Resume Application system.

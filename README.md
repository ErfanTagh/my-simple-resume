# 📄 Resume Builder App

A full-stack web application for creating beautiful, professional resumes with PDF export functionality.

## 🚀 Quick Start with Docker (Recommended)

### One Command to Start Everything

```bash
/home/erfan/resume-app/START_ALL_DOCKER.sh
```

This starts:

- ✅ MongoDB database
- ✅ Django REST API backend
- ✅ React frontend

Then open: **http://localhost:5173**

### Prerequisites

You only need Docker:

```bash
# Ubuntu/Debian
sudo apt install docker.io docker-compose-plugin

# Start Docker
sudo systemctl start docker
sudo usermod -aG docker $USER
# (logout and login again)
```

See [INSTALL_DOCKER.md](INSTALL_DOCKER.md) for detailed installation instructions.

## 🎯 Features

- ✨ **Multi-step Form** - Easy-to-use form for entering resume data
- 📝 **Comprehensive Sections** - Personal info, work experience, education, projects, certifications, skills, languages
- 👁️ **Live Preview** - View your resume in professional layout
- 📄 **PDF Export** - Print or download as PDF
- 🔒 **User Authentication** - JWT-based secure authentication
- 💾 **Save Multiple Resumes** - Create and manage multiple versions
- 🎨 **Beautiful Design** - Modern, professional resume template
- 📱 **Responsive** - Works on desktop, tablet, and mobile

## 📚 Tech Stack

### Frontend

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Hook Form + Zod validation
- React Router
- Axios

### Backend

- Django 4.2
- Django REST Framework
- JWT Authentication (simplejwt)
- MongoDB (via Djongo)
- CORS enabled

### Infrastructure

- Docker & Docker Compose
- MongoDB 6.0

## 🛠️ Setup Options

### Option 1: Docker (Easiest & Recommended) ⭐

**Start everything:**

```bash
/home/erfan/resume-app/START_ALL_DOCKER.sh
```

**Start backend only:**

```bash
/home/erfan/resume-app/START_DOCKER.sh
```

**Stop everything:**

```bash
cd /home/erfan/resume-app
docker compose down
```

### Option 2: Local Development

**Backend:**

```bash
cd /home/erfan/resume-app/backend
source venv/bin/activate
python manage.py runserver
```

**Frontend:**

```bash
cd /home/erfan/resume-app/frontend/skill-step-form
npm install
npm run dev
```

See [QUICK_START.md](QUICK_START.md) for detailed local setup instructions.

## 📖 Documentation

- **[DOCKER_GUIDE.md](DOCKER_GUIDE.md)** - Complete Docker documentation
- **[INSTALL_DOCKER.md](INSTALL_DOCKER.md)** - Docker installation guide
- **[QUICK_START.md](QUICK_START.md)** - Local development setup
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Full feature overview
- **[backend/README.md](backend/README.md)** - Backend API documentation
- **[backend/AUTHENTICATION.md](backend/AUTHENTICATION.md)** - Authentication guide
- **[frontend/skill-step-form/RESUME_VIEWER.md](frontend/skill-step-form/RESUME_VIEWER.md)** - Resume viewer docs

## 🎮 Usage

### 1. Start the Application

```bash
/home/erfan/resume-app/START_ALL_DOCKER.sh
```

Wait for:

```
✅ SUCCESS! All services are running!
📱 Frontend Application: http://localhost:5173
```

### 2. Create an Account

- Open http://localhost:5173
- Click "Sign Up"
- Enter your details
- Login

### 3. Create Your Resume

- Click "Create New Resume"
- Fill out the multi-step form:
  - **Personal Information** - Name, contact, professional title
  - **Work Experience** - Jobs, companies, responsibilities
  - **Education** - Degrees, institutions, courses
  - **Projects** - Personal/professional projects (optional)
  - **Certifications** - Certificates and credentials (optional)
  - **Languages** - Language proficiency
  - **Skills** - Technical and soft skills

### 4. View & Download

- After completing the form, you'll see your resume in professional layout
- Click "Print" or "Download PDF" to save it
- Your resume is automatically saved to your account

### 5. Manage Resumes

- Go to "My Resumes" to see all your saved resumes
- View, edit, or delete any resume
- Create multiple versions for different job applications

## 🌐 Endpoints

### Frontend

- **Application**: http://localhost:5173
- **Login/Signup**: http://localhost:5173/login

### Backend API

- **API Base**: http://localhost:8000
- **Health Check**: http://localhost:8000/api/health/
- **Admin Panel**: http://localhost:8000/admin/

### API Routes

- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/profile/` - Get user profile
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/resumes/` - List user's resumes
- `POST /api/resumes/` - Create new resume
- `GET /api/resumes/{id}/` - Get specific resume
- `PUT /api/resumes/{id}/` - Update resume
- `DELETE /api/resumes/{id}/` - Delete resume

## 🔧 Development

### View Logs

```bash
# All services
docker compose logs -f

# Backend only
docker compose logs -f backend

# Frontend only
docker compose logs -f frontend

# MongoDB only
docker compose logs -f mongodb
```

### Restart Services

```bash
docker compose restart

# Or restart specific service
docker compose restart backend
```

### Rebuild After Changes

```bash
docker compose down
docker compose build
docker compose up -d
```

### Access Container Shell

```bash
# Backend
docker exec -it resume_backend bash

# MongoDB
docker exec -it resume_mongodb mongosh
```

## 🎨 Resume Template

The resume viewer uses a professional template with:

- Two-column layout
- Modern typography (Inter font)
- Professional color scheme
- Icon integration (Font Awesome)
- Responsive design
- Print-optimized CSS

Customize the template by editing:

- `frontend/skill-step-form/public/resume-styles.css`

## 🔒 Security

- JWT token-based authentication
- HttpOnly cookies for refresh tokens
- CORS protection
- Password hashing with Django
- Protected API endpoints
- User-scoped data access

## 📦 Project Structure

```
resume-app/
├── backend/              # Django REST API
│   ├── api/             # API application
│   ├── config/          # Django settings
│   ├── Dockerfile       # Backend Docker config
│   └── docker-compose.yml
├── frontend/
│   └── skill-step-form/ # React application
│       ├── src/
│       │   ├── components/  # UI components
│       │   ├── pages/       # Page components
│       │   ├── contexts/    # React contexts
│       │   └── lib/         # API & utilities
│       └── public/
│           └── resume-styles.css  # Resume template CSS
├── docker-compose.yml   # Full stack Docker config
├── START_ALL_DOCKER.sh  # Start entire app
├── START_DOCKER.sh      # Start backend only
├── START_FRONTEND.sh    # Start frontend only
└── README.md            # This file
```

## 🐛 Troubleshooting

### Docker Compose Not Found

```bash
sudo apt install docker-compose-plugin
# or
sudo apt install docker-compose
```

### Port Already in Use

```bash
# Kill process on port 8000
sudo lsof -i :8000
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Cannot Connect to Docker

```bash
sudo systemctl start docker
sudo usermod -aG docker $USER
# logout and login
```

### Frontend Can't Connect to Backend

1. Check backend is running: http://localhost:8000/api/health/
2. Check CORS settings in backend
3. Restart both services

### MongoDB Connection Issues

```bash
# Check MongoDB container
docker ps | grep mongodb

# View MongoDB logs
docker compose logs mongodb

# Restart MongoDB
docker compose restart mongodb
```

## 🚢 Production Deployment

Before deploying:

1. Update environment variables in `docker-compose.yml`:

   - Set strong `SECRET_KEY`
   - Set `DEBUG=False`
   - Update `ALLOWED_HOSTS`
   - Update `CORS_ALLOWED_ORIGINS`

2. Use production database settings

3. Set up HTTPS/SSL

4. Use production WSGI server (gunicorn)

5. Set up proper logging

6. Configure backup strategy

## 📄 License

This project is for personal use.

## 🙏 Acknowledgments

- Built with Django REST Framework
- UI components from shadcn/ui
- Icons from Font Awesome
- Fonts from Google Fonts

## 📞 Support

For issues or questions, check the documentation files:

- [DOCKER_GUIDE.md](DOCKER_GUIDE.md)
- [QUICK_START.md](QUICK_START.md)
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)

---

Made with ❤️ using Django, React, and Docker

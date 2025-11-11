# Backend Quick Start Guide

## Prerequisites Check

Before starting, make sure you have:

- ✅ Python 3.8+ installed
- ✅ MongoDB running (locally or remotely)
- ✅ pip installed

## Step-by-Step Startup

### 1. Navigate to Backend Directory

```bash
cd /home/erfan/resume-app/backend
```

### 2. Create Virtual Environment (First Time Only)

```bash
python3 -m venv venv
```

### 3. Activate Virtual Environment

```bash
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### 4. Install Dependencies (First Time Only)

```bash
pip install -r requirements.txt
```

### 5. Create Environment File (First Time Only)

Create a `.env` file in the backend directory:

```bash
cat > .env << 'EOF'
SECRET_KEY=django-insecure-your-secret-key-change-this-in-production
DEBUG=True
MONGODB_NAME=resume_db
MONGODB_HOST=localhost
MONGODB_PORT=27017
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
EOF
```

Or manually create `.env` file with the content above.

### 6. Ensure MongoDB is Running

Check if MongoDB is running:

```bash
# Check MongoDB status
sudo systemctl status mongod
```

If not running, start it:

```bash
# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB to start on boot (optional)
sudo systemctl enable mongod
```

**Don't have MongoDB installed?** Install it:

```bash
# For Ubuntu/Debian
sudo apt update
sudo apt install -y mongodb

# Start the service
sudo systemctl start mongodb
```

Or use Docker:

```bash
cd /home/erfan/resume-app/backend
docker-compose up -d
```

### 7. Run Migrations (First Time Only)

```bash
python manage.py migrate
```

### 8. Create Superuser (Optional - for admin panel)

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 9. Start the Development Server

```bash
python manage.py runserver
```

You should see:

```
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

## Quick Commands Reference

### Daily Startup (After Initial Setup)

```bash
# 1. Navigate to backend
cd /home/erfan/resume-app/backend

# 2. Activate virtual environment
source venv/bin/activate

# 3. Start server
python manage.py runserver
```

### Stop the Server

Press `CTRL+C` in the terminal running the server.

### Deactivate Virtual Environment

```bash
deactivate
```

## Verify It's Working

### Test the API

Open a new terminal and run:

```bash
# Health check
curl http://localhost:8000/api/health/

# Should return: {"status": "healthy"}
```

Or open in your browser: http://localhost:8000/api/health/

### Test Admin Panel

Go to: http://localhost:8000/admin/
Login with the superuser credentials you created.

## Common Issues & Solutions

### Issue: `ModuleNotFoundError`

**Solution:** Make sure virtual environment is activated and dependencies are installed:

```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Issue: MongoDB Connection Error

**Solution:** Check if MongoDB is running:

```bash
sudo systemctl status mongod
# or
sudo systemctl status mongodb
```

Start MongoDB if it's not running:

```bash
sudo systemctl start mongod
```

### Issue: Port 8000 Already in Use

**Solution:** Kill the process using port 8000:

```bash
# Find the process
lsof -ti:8000

# Kill it
kill -9 $(lsof -ti:8000)
```

Or run on a different port:

```bash
python manage.py runserver 8001
```

### Issue: `SECRET_KEY` Error

**Solution:** Make sure `.env` file exists with SECRET_KEY defined:

```bash
cat .env | grep SECRET_KEY
```

## API Endpoints

Once running, your API will be available at:

- **Health Check:** http://localhost:8000/api/health/
- **Register:** http://localhost:8000/api/auth/register/
- **Login:** http://localhost:8000/api/auth/login/
- **Resumes:** http://localhost:8000/api/resumes/
- **Admin Panel:** http://localhost:8000/admin/

## Testing the Backend

### Register a User

```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpass123"
  }'
```

## Running with Frontend

### Terminal 1 - Backend

```bash
cd /home/erfan/resume-app/backend
source venv/bin/activate
python manage.py runserver
```

### Terminal 2 - Frontend

```bash
cd /home/erfan/resume-app/frontend/skill-step-form
npm run dev
```

Then open: http://localhost:5173

## Production Notes

Before deploying to production:

1. **Change SECRET_KEY** in `.env`
2. Set **DEBUG=False**
3. Update **ALLOWED_HOSTS** with your domain
4. Update **CORS_ALLOWED_ORIGINS** with your frontend URL
5. Use a production-grade database setup
6. Use environment variables for sensitive data
7. Set up proper logging
8. Use HTTPS

## Need Help?

- Check the full README: `/home/erfan/resume-app/backend/README.md`
- Check authentication guide: `/home/erfan/resume-app/backend/AUTHENTICATION.md`
- View Django logs in the terminal where the server is running
- Check MongoDB logs: `sudo journalctl -u mongod`

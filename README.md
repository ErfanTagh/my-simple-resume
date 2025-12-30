# Resume Builder

Build professional resumes with a clean multi-step form. Live at [123resume.de](https://123resume.de)

## Quick Start

Just run this:

```bash
./START_ALL_DOCKER.sh
```

Opens at http://localhost:5173

You'll need Docker installed first:

```bash
sudo apt install docker.io docker-compose-plugin
sudo systemctl start docker
sudo usermod -aG docker $USER
```

Then logout and back in.

## What's in it

- Multi-step form for resume building
- 4 templates: Modern, Classic, Minimal, Creative (each with its own font)
- Live preview as you type
- Quality scoring (checks completeness, clarity, formatting, impact)
- Add responsibilities and skills one line at a time
- Drag-and-drop to reorder sections
- Export to PDF
- User accounts with email verification
- Password reset via email
- Save multiple resume versions
- Works on mobile too

## Tech Stack

**Frontend:** React + TypeScript, Vite, Tailwind CSS, shadcn/ui, React Hook Form, Zod

**Backend:** Django REST Framework, JWT auth, MongoDB

**Deployment:** Docker Compose, Nginx, Let's Encrypt SSL, GitHub Actions for CI/CD

## Development

**With Docker:**

```bash
./START_ALL_DOCKER.sh    # Start everything
docker compose down       # Stop
```

**Without Docker:**

```bash
# Backend
cd backend
source venv/bin/activate
python manage.py runserver

# Frontend (separate terminal)
cd frontend/skill-step-form
npm install
npm run dev
```

## How to use it

1. Sign up and verify your email
2. Click "Create Resume"
3. Fill in the form (personal info, work experience, education, etc.)
4. Pick a template and customize section order if you want
5. See live preview on the right
6. Export to PDF when done
7. All your resumes are saved - edit or create new ones anytime

## API Endpoints

**Frontend:** http://localhost:5173

**Backend:** http://localhost:8000

Main routes:

- `POST /api/auth/register/` - Sign up
- `POST /api/auth/login/` - Login
- `GET /api/resumes/` - Get your resumes
- `POST /api/resumes/` - Create resume
- `PUT /api/resumes/{id}/` - Update resume
- `DELETE /api/resumes/{id}/` - Delete resume

## Useful Commands

```bash
# Logs
docker compose logs -f backend
docker compose logs -f frontend

# Restart
docker compose restart

# Rebuild after changes
docker compose down
docker compose build
docker compose up -d

# Access containers
docker exec -it resume_backend bash
docker exec -it resume_mongodb mongosh
```

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

## Common Issues

**Port already in use:**

```bash
sudo lsof -i :8000
kill -9 <PID>
```

**Docker not starting:**

```bash
sudo systemctl start docker
sudo usermod -aG docker $USER
# logout and back in
```

**Frontend can't reach backend:**

- Check backend is up: http://localhost:8000/api/health/
- Restart: `docker compose restart`

**MongoDB issues:**

```bash
docker compose logs mongodb
docker compose restart mongodb
```

## Email Configuration

The app supports two email backends:

### Option 1: SendGrid (Recommended for Production)

**Benefits:**

- ✅ Better deliverability (SPF/DKIM/DMARC handled automatically)
- ✅ Free tier: 100 emails/day forever
- ✅ No daily sending limits
- ✅ Built-in analytics and tracking
- ✅ Professional reputation management

**Setup Steps:**

1. **Create SendGrid Account:**

   - Go to [sendgrid.com](https://sendgrid.com) and sign up (free)
   - Verify your email address

2. **Create API Key:**

   - Go to Settings → API Keys
   - Click "Create API Key"
   - Name it (e.g., "123Resume Production")
   - Select "Full Access" or "Mail Send" permissions
   - Copy the API key (you'll only see it once!)

3. **Verify Sender Email:**

   - Go to Settings → Sender Authentication
   - Click "Verify a Single Sender"
   - Enter: `noreply@123resume.de` (or your preferred email)
   - Complete verification

4. **Add to `.env` file:**

   ```bash
   SENDGRID_API_KEY=SG.your_api_key_here
   DEFAULT_FROM_EMAIL=noreply@123resume.de
   ```

5. **Install dependencies:**
   ```bash
   docker compose exec backend pip install -r requirements.txt
   docker compose restart backend
   ```

That's it! The app will automatically use SendGrid when `SENDGRID_API_KEY` is set.

### Option 2: SMTP (Gmail, etc.) - Fallback

If `SENDGRID_API_KEY` is not set, the app falls back to SMTP:

```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password  # Use App Password, not regular password
DEFAULT_FROM_EMAIL=your-email@gmail.com
```

**Note:** Gmail has daily sending limits (500 emails/day) and may flag emails as spam. SendGrid is recommended for production.

## Deployment

Live site: [123resume.de](https://123resume.de)

Uses GitHub Actions - just push to main and it auto-deploys:

1. Pulls latest code
2. Rebuilds Docker containers (no cache)
3. Runs migrations
4. Copies frontend to Nginx
5. Reloads everything

Setup includes:

- HTTPS with Let's Encrypt
- Nginx reverse proxy
- MongoDB with auth
- Email verification
- Short cache times (5min for JS/CSS, none for HTML)

If deploying manually, set up `.env` with your secrets, run `./setup-ssl.sh` for SSL, then:

```bash
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate
```

---

Made with Django REST Framework, React, shadcn/ui

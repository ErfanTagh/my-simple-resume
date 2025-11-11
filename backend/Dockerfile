FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install packages with special handling for dependency conflicts
# Install pymongo and sqlparse first
RUN pip install --no-cache-dir pymongo==3.12.3 sqlparse==0.2.4

# Install djongo without dependencies (to avoid conflicts)
RUN pip install --no-cache-dir --no-deps djongo==1.3.6

# Install Django 3.2 LTS (compatible with sqlparse 0.2.4)
RUN pip install --no-cache-dir Django==3.2.23

# Install remaining packages
RUN pip install --no-cache-dir \
    djangorestframework==3.14.0 \
    djangorestframework-simplejwt==5.3.1 \
    django-cors-headers==4.3.1 \
    python-dotenv==1.0.0 \
    PyJWT==2.8.0

# Copy project files
COPY . .

# Create directory for SQLite (fallback database)
RUN mkdir -p /app/data

# Expose port
EXPOSE 8000

# Run migrations and start server
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]


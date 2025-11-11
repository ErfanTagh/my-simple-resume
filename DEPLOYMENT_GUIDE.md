# 🚀 Production Deployment Guide - Hetzner Server

Complete guide to deploy your Resume Builder app to production.

---

## Prerequisites

- ✅ Hetzner VPS (or any Linux server)
- ✅ Domain name purchased and DNS configured
- ✅ SSH access to server
- ✅ Docker & Docker Compose installed on server

---

## Step 1: Prepare Your Server (15 min)

### 1.1 Connect to Your Server

```bash
ssh root@your-server-ip
```

### 1.2 Update System

```bash
apt update && apt upgrade -y
```

### 1.3 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

### 1.4 Configure Firewall

```bash
# Allow SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
ufw status
```

---

## Step 2: Configure DNS (5 min)

Point your domain to your server:

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add these DNS records:

```
Type    Host    Value               TTL
A       @       your-server-ip      3600
A       www     your-server-ip      3600
```

3. Wait 5-15 minutes for DNS propagation
4. Verify: `ping yourdomain.com`

---

## Step 3: Upload Code to Server (10 min)

### Option A: Using Git (Recommended)

```bash
# On your server
cd /var/www
git clone https://github.com/yourusername/resume-app.git
cd resume-app
```

### Option B: Using SCP

```bash
# On your local machine
scp -r /home/erfan/resume-app root@your-server-ip:/var/www/
```

---

## Step 4: Configure Environment Variables (10 min)

### 4.1 Generate SECRET_KEY

```bash
python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

### 4.2 Generate MongoDB Password

```bash
openssl rand -base64 32
```

### 4.3 Create .env File

```bash
cd /var/www/resume-app
nano .env
```

Paste this content (replace with your values):

```env
# Django Settings
SECRET_KEY=<paste-generated-secret-key-here>
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
MONGODB_HOST=mongodb
MONGODB_PORT=27017
MONGODB_NAME=resume_db
MONGODB_USERNAME=resume_user
MONGODB_PASSWORD=<paste-generated-mongodb-password-here>

# CORS Settings
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Domain Configuration
DOMAIN=yourdomain.com
```

**Save:** Ctrl+X, Y, Enter

---

## Step 5: Prepare Nginx Config (5 min)

### 5.1 Replace ${DOMAIN} in Nginx Config

```bash
cd /var/www/resume-app
DOMAIN=yourdomain.com
sed -i "s/\${DOMAIN}/$DOMAIN/g" nginx/conf.d/app.conf
```

---

## Step 6: Deploy Application (10 min)

### 6.1 Make Scripts Executable

```bash
chmod +x deploy.sh setup-ssl.sh
```

### 6.2 Run Deployment

```bash
./deploy.sh
```

This will:

- Build Docker images
- Start all services (MongoDB, Django, React, Nginx)
- Run database migrations
- Collect static files

### 6.3 Check Status

```bash
docker compose -f docker-compose.prod.yml ps
```

You should see all services running!

---

## Step 7: Setup SSL Certificate (10 min)

### 7.1 Verify Domain is Accessible

```bash
curl http://yourdomain.com
```

If you see the app → good! If not, wait a few minutes for DNS.

### 7.2 Get SSL Certificate

```bash
./setup-ssl.sh
```

This will:

- Request certificate from Let's Encrypt
- Configure automatic renewal
- Enable HTTPS

---

## Step 8: Test Your Application ✅

1. **Open browser:** https://yourdomain.com
2. **Sign up** for an account
3. **Create a resume**
4. **Test all features**

---

## Useful Commands

### View Logs

```bash
# All logs
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f nginx
```

### Restart Services

```bash
# All services
docker compose -f docker-compose.prod.yml restart

# Specific service
docker compose -f docker-compose.prod.yml restart backend
```

### Stop Application

```bash
docker compose -f docker-compose.prod.yml down
```

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose -f docker-compose.prod.yml up --build -d
```

### Database Backup

```bash
# Backup
docker exec resume_mongodb mongodump --uri="mongodb://resume_user:your-password@localhost:27017/resume_db" --out=/backup/$(date +%Y%m%d)

# Restore
docker exec resume_mongodb mongorestore --uri="mongodb://resume_user:your-password@localhost:27017/resume_db" /backup/20241111
```

---

## Troubleshooting

### Issue: SSL Certificate Failed

**Solution:**

```bash
# Check if port 80 is accessible
curl http://yourdomain.com

# Check Nginx logs
docker compose -f docker-compose.prod.yml logs nginx

# Verify domain points to server
dig +short yourdomain.com
```

### Issue: 502 Bad Gateway

**Solution:**

```bash
# Check backend is running
docker compose -f docker-compose.prod.yml ps backend

# Check backend logs
docker compose -f docker-compose.prod.yml logs backend

# Restart backend
docker compose -f docker-compose.prod.yml restart backend
```

### Issue: Database Connection Error

**Solution:**

```bash
# Check MongoDB is running
docker compose -f docker-compose.prod.yml ps mongodb

# Check MongoDB logs
docker compose -f docker-compose.prod.yml logs mongodb

# Verify credentials in .env
cat .env
```

---

## Security Checklist ✅

- [x] Changed SECRET_KEY
- [x] Set DEBUG=False
- [x] MongoDB authentication enabled
- [x] Firewall configured
- [x] SSL/HTTPS enabled
- [x] CORS properly configured
- [ ] Regular backups scheduled (recommended)
- [ ] Monitoring setup (optional)

---

## Monitoring & Maintenance

### Setup Automatic Backups

```bash
# Create backup script
nano /root/backup-resume-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/resume-app"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker exec resume_mongodb mongodump \
  --uri="mongodb://resume_user:your-password@localhost:27017/resume_db" \
  --out=$BACKUP_DIR/$DATE

# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

```bash
chmod +x /root/backup-resume-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
```

Add line:

```
0 2 * * * /root/backup-resume-db.sh
```

---

## Cost Estimate

### Hetzner Server Options:

| Plan  | vCPU | RAM | Storage | Price/month |
| ----- | ---- | --- | ------- | ----------- |
| CX11  | 1    | 2GB | 20GB    | €4.15       |
| CPX11 | 2    | 2GB | 40GB    | €4.90       |
| CX21  | 2    | 4GB | 40GB    | €5.83       |

**Recommended:** CPX11 or CX21

**Additional Costs:**

- Domain: €10-15/year
- Total: ~€70-85/year

---

## Need Help?

Common issues and solutions are above. If you encounter problems:

1. Check logs: `docker compose -f docker-compose.prod.yml logs`
2. Verify .env file settings
3. Ensure DNS is properly configured
4. Check firewall rules

---

## Next Steps

Once deployed:

1. ✅ Test all functionality
2. ✅ Create your first resume
3. ✅ Share with friends!
4. Consider adding:
   - Email verification (using SendGrid/Mailgun)
   - Analytics (Google Analytics)
   - Monitoring (UptimeRobot)
   - CDN (Cloudflare)

---

**Congratulations! Your Resume Builder is now live! 🎉**

# Setting Up contact@123resume.de

There are several ways to set up receiving emails at `contact@123resume.de`. Here are the options from easiest to most complex:

## Option 1: Email Forwarding (Recommended - Easiest)

Forward emails from `contact@123resume.de` to your personal email address.

### If you use Cloudflare (Recommended):
1. Go to Cloudflare Dashboard → Email → Email Routing
2. Enable Email Routing for `123resume.de`
3. Add destination address: `your-personal-email@gmail.com`
4. Create routing rule:
   - **From**: `contact@123resume.de`
   - **To**: `your-personal-email@gmail.com`

Cloudflare will automatically set up the MX records for you.

### If you use another DNS provider:
1. Set up MX records in your DNS:
   ```
   Type: MX
   Name: @ (or 123resume.de)
   Priority: 10
   Value: mail.your-provider.com (check your provider's docs)
   ```
2. Configure email forwarding in your domain registrar or hosting provider
3. Forward `contact@123resume.de` → `your-personal-email@gmail.com`

**Advantages**: Free, automatic, no server setup needed
**Disadvantages**: You'll need to reply from your personal email (or configure reply-to)

---

## Option 2: Contact Form API (Recommended for Web Integration)

Create a contact form endpoint in your Django backend that sends you an email when someone submits the form. This is what's already shown on your website.

### Implementation:
See `backend/api/contact_views.py` (create this file if it doesn't exist)

**Advantages**: 
- Can collect structured data (name, subject, message)
- Can add spam protection (reCAPTCHA)
- No email server setup needed
- Works immediately

**Disadvantages**: Not a "real" email address for people to email directly

---

## Option 3: Professional Email Service (Zoho, Google Workspace, etc.)

### Google Workspace:
- Cost: ~€5/month per user
- Set up: Add `contact@123resume.de` as an alias or new user
- Includes: Professional email client, spam filtering, 30GB storage

### Zoho Mail (Free tier available):
- Free for up to 5 users (with domain branding)
- Cost: Free or €1-2/month per user
- Set up: Add custom domain, create `contact@123resume.de` mailbox

**Advantages**: Professional email, good spam filtering, mobile apps
**Disadvantages**: Monthly cost, more setup

---

## Option 4: Self-Hosted Mail Server (Postfix + Dovecot)

### Setup Postfix to receive emails:

1. **Install Postfix**:
```bash
sudo apt update
sudo apt install postfix mailutils
```

2. **Configure Postfix** (`/etc/postfix/main.cf`):
```
myhostname = mail.123resume.de
mydomain = 123resume.de
myorigin = $mydomain
mydestination = $myhostname, localhost.$mydomain, $mydomain, localhost
relayhost =
inet_interfaces = all
inet_protocols = ipv4
```

3. **Set up MX records**:
```
Type: MX
Name: @
Priority: 10
Value: mail.123resume.de (or your server's hostname)
```

4. **Configure virtual aliases** (forward to your email):
```
# /etc/postfix/virtual
contact@123resume.de    your-personal-email@gmail.com
```

5. **Install and configure Dovecot** (for IMAP/POP3 if you want to check emails on server):
```bash
sudo apt install dovecot-core dovecot-imapd
```

**Advantages**: Full control, free
**Disadvantages**: Complex setup, maintenance required, security concerns, deliverability issues

---

## Quick Setup: Contact Form API (Immediate Solution)

If you want to quickly enable the contact form that's already on your website:

1. Create a contact API endpoint in Django
2. Configure Django to send emails to your personal email when form is submitted
3. Add spam protection (reCAPTCHA)

This doesn't require any DNS changes and works immediately.

---

## Recommendation

**For immediate use**: Set up **Option 2 (Contact Form API)** - it's quick, works now, and doesn't require DNS changes.

**For long-term**: Use **Option 1 (Email Forwarding via Cloudflare)** if you use Cloudflare, or **Option 3 (Zoho Mail Free)** if you want a professional mailbox.

**Avoid**: Option 4 (self-hosted) unless you have experience with mail servers - it's complex and maintenance-heavy.

---

## Current Status

Your backend is already configured to **send** emails (via Gmail SMTP). You just need to set up **receiving** emails, which requires either:
- Email forwarding (MX records)
- A contact form endpoint (no MX records needed)
- A professional email service


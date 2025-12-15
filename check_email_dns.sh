#!/bin/bash
# Email DNS Configuration Checker
# Run this script to verify your email DNS records

DOMAIN="123resume.de"

echo "=========================================="
echo "Email DNS Configuration Checker"
echo "Domain: $DOMAIN"
echo "=========================================="
echo ""

echo "1. Checking SPF Record..."
SPF=$(dig +short $DOMAIN TXT | grep -i "spf")
if [ -z "$SPF" ]; then
    echo "   ❌ SPF record NOT FOUND"
else
    echo "   ✓ SPF found: $SPF"
    if echo "$SPF" | grep -q "~all"; then
        echo "   ⚠️  WARNING: Using ~all (soft fail). Should use -all (hard fail)"
    elif echo "$SPF" | grep -q "-all"; then
        echo "   ✓ Using -all (hard fail) - Good!"
    fi
fi
echo ""

echo "2. Checking DMARC Record..."
DMARC=$(dig +short _dmarc.$DOMAIN TXT)
if [ -z "$DMARC" ]; then
    echo "   ❌ DMARC record NOT FOUND"
else
    echo "   ✓ DMARC found: $DMARC"
    if echo "$DMARC" | grep -q "p=none"; then
        echo "   ⚠️  WARNING: Policy is 'none' (no enforcement). Should be 'quarantine' or 'reject'"
    elif echo "$DMARC" | grep -q "p=quarantine\|p=reject"; then
        echo "   ✓ Policy is set to enforce - Good!"
    fi
fi
echo ""

echo "3. Checking DKIM Record..."
DKIM=$(dig +short default._domainkey.$DOMAIN TXT)
if [ -z "$DKIM" ]; then
    echo "   ❌ DKIM record NOT FOUND - This is CRITICAL for deliverability!"
else
    echo "   ✓ DKIM found: ${DKIM:0:50}..."
fi
echo ""

echo "4. Checking MX Records..."
MX=$(dig +short $DOMAIN MX)
if [ -z "$MX" ]; then
    echo "   ⚠️  No MX records found (not required if only sending, not receiving)"
else
    echo "   ✓ MX records found:"
    echo "$MX" | while read line; do
        echo "     $line"
    done
fi
echo ""

echo "5. Checking A Record..."
A=$(dig +short $DOMAIN A)
if [ -z "$A" ]; then
    echo "   ❌ A record NOT FOUND"
else
    echo "   ✓ A record: $A"
fi
echo ""

echo "=========================================="
echo "Recommendations:"
echo "=========================================="
echo ""
echo "1. Add DKIM record (CRITICAL)"
echo "2. Update SPF to use -all instead of ~all"
echo "3. Update DMARC policy to 'quarantine' or 'reject'"
echo "4. Use a professional email service (SendGrid/Mailgun) for better deliverability"
echo ""
echo "Test your email configuration at:"
echo "- https://www.mail-tester.com/"
echo "- https://mxtoolbox.com/"
echo ""

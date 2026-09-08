import os
import smtplib
import logging
import json
import urllib.request
import urllib.error
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

def send_password_reset_email(email_to: str, reset_token: str) -> bool:
    """
    Send password reset email via Brevo.
    Attempts:
      1. Brevo HTTPS REST API (Port 443 - works on campus/restricted firewalls!)
      2. Brevo SMTP Port 465 (Direct SSL)
      3. Brevo SMTP Port 587 (TLS)
      4. Brevo SMTP Port 2525 (Alternative TLS)
      Fallback: Always prints reset link to console for dev testing.
    """
    # Force reload .env to ensure newly saved keys are active without needing manual server restart
    load_dotenv(override=True)
    
    api_key = os.getenv("SMTP_PASSWORD") or settings.SMTP_PASSWORD
    smtp_user = os.getenv("SMTP_USER") or settings.SMTP_USER
    sender_email = (
        os.getenv("EMAILS_FROM_EMAIL")
        or settings.EMAILS_FROM_EMAIL
        or smtp_user
    )
    if "@fintrack.local" in sender_email:
        sender_email = smtp_user

    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    
    # Always log to console for development convenience
    print("\n" + "=" * 70)
    print(" [FINTRACK DEV CONSOLE] PASSWORD RESET REQUESTED")
    print(f" Target User Email: {email_to}")
    print(f" Password Reset Link: {reset_link}")
    print("=" * 70 + "\n")

    if not smtp_user or not api_key:
        print("⚠️ Brevo credentials not provided. Logged reset link to console.")
        return True

    text_content = f"""
Hello,

You requested a password reset for your FinTrack account.
Click the link below to set a new password (valid for {settings.RESET_TOKEN_EXPIRE_MINUTES} minutes):

{reset_link}

If you did not request this, please ignore this email.
"""

    html_content = f"""
<!DOCTYPE html>
<html>
<head>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }}
    .card {{ max-width: 500px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e2e8f0; }}
    .btn {{ display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 20px 0; }}
    .footer {{ margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center; }}
  </style>
</head>
<body>
  <div class="card">
    <h2 style="color: #0f172a; margin-top: 0;">Password Reset Request</h2>
    <p style="color: #475569;">Hello,</p>
    <p style="color: #475569;">We received a request to reset your password for your <strong>{settings.PROJECT_NAME}</strong> account. Click the button below to choose a new password:</p>
    <div style="text-align: center;">
      <a href="{reset_link}" class="btn" style="color: #ffffff;">Reset Password</a>
    </div>
    <p style="color: #64748b; font-size: 13px;">This link will expire in {settings.RESET_TOKEN_EXPIRE_MINUTES} minutes.</p>
    <p style="color: #64748b; font-size: 13px;">If you did not make this request, you can safely ignore this email.</p>
    <div class="footer">
      &copy; {settings.PROJECT_NAME}. All rights reserved.
    </div>
  </div>
</body>
</html>
"""

    sent = False
    last_error = None

    # Strategy 1: Brevo HTTPS REST API (Port 443)
    # Bypasses all campus firewall port blocks!
    print(f"📡 Attempting delivery via Brevo HTTPS REST API (Sender: {sender_email})...")
    try:
        api_url = "https://api.brevo.com/v3/smtp/email"
        payload = {
            "sender": {"name": settings.EMAILS_FROM_NAME, "email": sender_email},
            "to": [{"email": email_to}],
            "subject": f"{settings.PROJECT_NAME} - Password Reset Request",
            "htmlContent": html_content,
            "textContent": text_content
        }
        req = urllib.request.Request(
            api_url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "accept": "application/json",
                "api-key": api_key,
                "content-type": "application/json"
            }
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            if resp.status in (200, 201):
                sent = True
                print(f"✅ [BREVO API SUCCESS] Password reset email successfully delivered to {email_to} via HTTPS API!\n")
                return True
    except urllib.error.HTTPError as http_err:
        err_body = http_err.read().decode("utf-8", errors="ignore")
        print(f"❌ [BREVO HTTP ERROR {http_err.code}]: {err_body}")
        last_error = f"HTTP {http_err.code}: {err_body}"
    except Exception as e:
        print(f"❌ [BREVO HTTP EXCEPTION]: {e}")
        last_error = e

    # Strategy 2: Direct SSL on Port 465
    if not sent:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"{settings.PROJECT_NAME} - Password Reset Request"
            msg["From"] = f"{settings.EMAILS_FROM_NAME} <{sender_email}>"
            msg["To"] = email_to
            msg.attach(MIMEText(text_content, "plain"))
            msg.attach(MIMEText(html_content, "html"))

            with smtplib.SMTP_SSL(settings.SMTP_HOST, 465, timeout=10) as server:
                server.login(smtp_user, api_key)
                server.sendmail(sender_email, email_to, msg.as_string())
            sent = True
            logger.info(f"Password reset email sent to {email_to} via Brevo SMTP (Port 465 SSL).")
        except Exception as e:
            last_error = e

    # Strategy 3: STARTTLS on Port 587 / 2525
    if not sent:
        for port in [587, 2525]:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = f"{settings.PROJECT_NAME} - Password Reset Request"
                msg["From"] = f"{settings.EMAILS_FROM_NAME} <{sender_email}>"
                msg["To"] = email_to
                msg.attach(MIMEText(text_content, "plain"))
                msg.attach(MIMEText(html_content, "html"))

                with smtplib.SMTP(settings.SMTP_HOST, port, timeout=10) as server:
                    server.starttls()
                    server.login(smtp_user, api_key)
                    server.sendmail(sender_email, email_to, msg.as_string())
                sent = True
                logger.info(f"Password reset email sent to {email_to} via Brevo SMTP (Port {port}).")
                break
            except Exception as e:
                last_error = e

    if sent:
        print(f"✅ [BREVO SMTP SUCCESS] Password reset email delivered to {email_to}!\n")
        return True
    else:
        print(f"\n❌ [BREVO FINAL STATUS]: Could not deliver via SMTP ({last_error}).")
        print(f"💡 The reset link above is active and can be used immediately!\n")
        return True

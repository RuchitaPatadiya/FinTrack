import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

def send_password_reset_email(email_to: str, reset_token: str) -> bool:
    """
    Send password reset email via Brevo SMTP.
    Falls back to printing the reset link to the console if SMTP is unconfigured or fails.
    """
    reset_link = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"
    
    # Always log to console for development convenience
    print("\n" + "=" * 70)
    print(" [FINTRACK DEV CONSOLE] PASSWORD RESET REQUESTED")
    print(f" Target User Email: {email_to}")
    print(f" Password Reset Link: {reset_link}")
    print("=" * 70 + "\n")

    # If SMTP credentials are not configured, dev console fallback is already logged
    if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
        logger.info("Brevo SMTP credentials not provided. Logged reset link to console.")
        return True

    # Prepare email message
    sender_email = (
        settings.EMAILS_FROM_EMAIL
        if settings.EMAILS_FROM_EMAIL and "@fintrack.local" not in settings.EMAILS_FROM_EMAIL
        else settings.SMTP_USER
    )
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"{settings.PROJECT_NAME} - Password Reset Request"
    msg["From"] = f"{settings.EMAILS_FROM_NAME} <{sender_email}>"
    msg["To"] = email_to

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

    part1 = MIMEText(text_content, "plain")
    part2 = MIMEText(html_content, "html")
    msg.attach(part1)
    msg.attach(part2)

    # Resilient delivery: Port 465 (SSL) -> Port 587 (TLS) -> Port 2525 (Alternative TLS)
    # Port 465 SSL bypasses Windows socket STARTTLS inspection/resets (WinError 10054)
    sent = False
    last_error = None

    # Strategy 1: Direct SSL on Port 465
    try:
        with smtplib.SMTP_SSL(settings.SMTP_HOST, 465, timeout=10) as server:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(sender_email, email_to, msg.as_string())
        sent = True
        logger.info(f"Password reset email sent to {email_to} via Brevo SMTP (Port 465 SSL).")
    except Exception as e:
        last_error = e

    # Strategy 2: STARTTLS on Port 587
    if not sent:
        try:
            with smtplib.SMTP(settings.SMTP_HOST, 587, timeout=10) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(sender_email, email_to, msg.as_string())
            sent = True
            logger.info(f"Password reset email sent to {email_to} via Brevo SMTP (Port 587).")
        except Exception as e:
            last_error = e

    # Strategy 3: Alternative STARTTLS on Port 2525
    if not sent:
        try:
            with smtplib.SMTP(settings.SMTP_HOST, 2525, timeout=10) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(sender_email, email_to, msg.as_string())
            sent = True
            logger.info(f"Password reset email sent to {email_to} via Brevo SMTP (Port 2525).")
        except Exception as e:
            last_error = e

    if sent:
        print(f"✅ [BREVO SMTP SUCCESS] Password reset email successfully delivered to {email_to}!\n")
        return True
    else:
        print(f"\n❌ [BREVO SMTP ERROR]: {last_error}\n")
        logger.error(f"Failed to send email via Brevo SMTP: {last_error}. Check server console for reset link.")
        return True

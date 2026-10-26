from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
import json
import urllib.request
try:
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests
    GOOGLE_AUTH_AVAILABLE = True
except ImportError:
    GOOGLE_AUTH_AVAILABLE = False

from backend.app.core.config import settings
from backend.app.core.database import get_db
from backend.app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_password_reset_token,
    verify_password_reset_token
)
from backend.app.core.email import send_password_reset_email
from backend.app.core.dependencies import get_current_user
from backend.app.accounts.models import User
from backend.app.accounts.schemas import (
    UserCreate,
    UserLogin,
    UserUpdate,
    ChangePasswordRequest,
    GoogleAuthRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserResponse,
    Token,
    MessageResponse
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account with email and password."""
    normalized_email = data.email.strip().lower()
    existing_user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    new_user = User(
        email=normalized_email,
        full_name=data.full_name.strip() if data.full_name else None,
        hashed_password=get_password_hash(data.password),
        auth_provider="local"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(data: UserLogin, db: Session = Depends(get_db)):
    """Authenticate email and password and return a JWT access token."""
    normalized_email = data.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
    
    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    access_token = create_access_token(subject=user.email)
    return Token(access_token=access_token, token_type="bearer")

@router.get("/config")
def get_auth_config():
    """Expose public auth configurations to frontend."""
    return {
        "google_client_id": settings.GOOGLE_CLIENT_ID or ""
    }

def _verify_google_id_token(credential: str, expected_client_id: str | None) -> dict:
    """Verify Google token via google-auth or Google's tokeninfo API."""
    if GOOGLE_AUTH_AVAILABLE:
        try:
            return id_token.verify_oauth2_token(credential, google_requests.Request(), expected_client_id)
        except Exception:
            pass

    # Universal fallback using Google's public tokeninfo endpoint
    url = f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}"
    req = urllib.request.Request(url, headers={"User-Agent": "FinTrack-App"})
    with urllib.request.urlopen(req, timeout=10) as response:
        token_data = json.loads(response.read().decode("utf-8"))
        if expected_client_id and token_data.get("aud") != expected_client_id:
            raise ValueError("Token audience does not match configured Google Client ID.")
        return token_data

@router.post("/google", response_model=Token)
def google_auth(data: GoogleAuthRequest, db: Session = Depends(get_db)):
    """Verify Google OAuth credential (ID token), create user if necessary, and return JWT."""
    try:
        client_id = settings.GOOGLE_CLIENT_ID if settings.GOOGLE_CLIENT_ID else None
        id_info = _verify_google_id_token(data.credential, client_id)
        
        email = id_info.get("email")
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google authentication failed: email not provided."
            )
        
        normalized_email = email.strip().lower()
        full_name = id_info.get("name")
        
        user = db.query(User).filter(User.email == normalized_email).first()
        if not user:
            # Create user automatically
            user = User(
                email=normalized_email,
                full_name=full_name,
                hashed_password=None,
                auth_provider="google"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        access_token = create_access_token(subject=user.email)
        return Token(access_token=access_token, token_type="bearer")

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid Google credential token: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Google authentication error: {str(e)}"
        )

@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Request a password reset link sent to the user's email."""
    normalized_email = data.email.strip().lower()
    user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
    
    # Generic message for security (prevents account enumeration)
    generic_success_msg = "If an account with that email exists, password reset instructions have been sent."

    if not user:
        all_emails = [u[0] for u in db.query(User.email).all()]
        print(f"\n⚠️ [FINTRACK DEV NOTICE] No account found in PostgreSQL for '{normalized_email}'.")
        print(f"👉 Currently registered emails in your DB: {all_emails}\n")
    else:
        reset_token = create_password_reset_token(email=user.email)
        send_password_reset_email(email_to=user.email, reset_token=reset_token)

    return MessageResponse(message=generic_success_msg)

@router.post("/reset-password", response_model=MessageResponse)
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset the user password using a valid reset token."""
    email = verify_password_reset_token(data.token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The password reset link is invalid or has expired."
        )

    user = db.query(User).filter(func.lower(User.email) == email.lower()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    user.hashed_password = get_password_hash(data.new_password)
    db.commit()

    return MessageResponse(message="Your password has been successfully reset. You can now log in.")

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Retrieve profile data for the authenticated user."""
    return current_user

@router.patch("/me", response_model=UserResponse)
def update_current_user_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update the authenticated user's profile (e.g. full name)."""
    if data.full_name is not None:
        current_user.full_name = data.full_name.strip()
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/change-password", response_model=MessageResponse)
def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change the authenticated user's password."""
    if not current_user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google accounts cannot change password here."
        )
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password."
        )
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return MessageResponse(message="Password changed successfully.")

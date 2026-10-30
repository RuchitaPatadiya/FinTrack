from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.config import settings
from backend.app.core.database import engine, Base

# Import models to ensure they are registered with SQLAlchemy Base metadata
import backend.app.accounts.models  # noqa: F401
import backend.app.transactions.models  # noqa: F401
import backend.app.goals.models  # noqa: F401
import backend.app.categories.models  # noqa: F401
import backend.app.budgets.models  # noqa: F401
import backend.app.subscriptions.models  # noqa: F401
import backend.app.notifications.models  # noqa: F401

from backend.app.accounts.routes import router as accounts_router
from backend.app.transactions.routes import router as transactions_router
from backend.app.goals.routes import router as goals_router
from backend.app.categories.routes import router as categories_router
from backend.app.budgets.routes import router as budgets_router
from backend.app.subscriptions.routes import router as subscriptions_router
from backend.app.notifications.routes import router as notifications_router

# Create tables in database (runs on startup/import)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs"
)

# Set up CORS middleware
if settings.cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include API routers
app.include_router(accounts_router, prefix=settings.API_V1_STR)
app.include_router(transactions_router, prefix=settings.API_V1_STR)
app.include_router(goals_router, prefix=settings.API_V1_STR)
app.include_router(categories_router, prefix=settings.API_V1_STR)
app.include_router(budgets_router, prefix=settings.API_V1_STR)
app.include_router(subscriptions_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router, prefix=settings.API_V1_STR)

@app.get("/")
def read_root():
    return {
        "status": "active",
        "message": f"Welcome to the {settings.PROJECT_NAME} API. Access documentation at /docs"
    }

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected"
    }

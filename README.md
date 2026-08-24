# FinTrack - Personal Financial Management Platform

FinTrack is a simple and clean personal finance dashboard built with **React (Vite + Tailwind)** on the frontend and **FastAPI (SQLAlchemy + PostgreSQL/SQLite)** on the backend.

## Getting Started

### Prerequisites
* Python 3.10+
* Node.js 18+
* PostgreSQL (Optional, defaults to SQLite for easy setup)

### Backend Setup

1. **Navigate to the root directory**:
   ```bash
   cd FinTrack
   ```

2. **Create and activate a virtual environment**:
   * Windows:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   * macOS/Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the backend**:
   ```bash
   python -m uvicorn backend.app.main:app --reload
   ```
   The backend will be running at `http://127.0.0.1:8000`. You can access the auto-generated Swagger API documentation at `http://127.0.0.1:8000/docs`.

---

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install node dependencies**:
   ```bash
   npm install
   ```

3. **Run the React development server**:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173`. Any API calls made to `/api` will be automatically proxied to the backend.

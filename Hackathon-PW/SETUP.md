# AlgoTix - Setup Instructions

## Quick Start

### 1. Backend Setup

```bash
cd backend
poetry install
poetry run python auth_api.py
```

Backend runs on `http://localhost:8000`

### 2. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## How It Works

1. **Login/Signup**: Go to `http://localhost:5173/login`
2. **Sign Up**: Create a new account (stored in backend memory)
3. **Sign In**: Login with your credentials
4. **Dashboard**: After login, you'll be redirected to `/dashboard`
5. **Protected Routes**: Dashboard requires authentication

## Features

✅ Real backend authentication (FastAPI)
✅ Token-based auth (stored in localStorage)
✅ Protected routes (redirects to login if not authenticated)
✅ Sign up and login forms
✅ Error handling
✅ Vite proxy configured (`/api` → `http://localhost:8000`)

## Testing

1. Start backend: `cd backend && poetry run python auth_api.py`
2. Start frontend: `cd frontend && npm run dev`
3. Visit `http://localhost:5173/login`
4. Sign up with any email/password (min 6 chars)
5. You'll be redirected to dashboard
6. Try accessing `/dashboard` directly - will redirect to login if not authenticated

## Notes

- Backend uses in-memory storage (resets on restart)
- Tokens are simple URL-safe strings (not JWT for simplicity)
- CORS is configured for localhost:5173

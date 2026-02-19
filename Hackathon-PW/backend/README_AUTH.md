# AlgoTix Authentication API

## Setup

1. Install dependencies:
```bash
cd backend
poetry install
```

2. Run the FastAPI server:
```bash
poetry run python auth_api.py
```

Or using uvicorn directly:
```bash
poetry run uvicorn auth_api:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /api/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "generated-token",
  "user": {
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### POST /api/signup
Create a new account.

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "token": "generated-token",
  "user": {
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### GET /api/verify?token=xxx
Verify a token.

## Notes

- Users are stored in-memory (will reset on server restart)
- Passwords are hashed using SHA256 (simple for demo)
- Tokens are generated using `secrets.token_urlsafe()`
- CORS is enabled for `http://localhost:5173` (Vite default)

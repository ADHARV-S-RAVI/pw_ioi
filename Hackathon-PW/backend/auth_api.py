from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.requests import Request
from pydantic import BaseModel, EmailStr, ValidationError
from typing import Optional
import secrets
from datetime import datetime, timedelta
import hashlib

app = FastAPI(title="AlgoTix Auth API")

# Exception handlers to ensure JSON responses
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation error", "errors": exc.errors()}
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "success": False}
    )

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory user storage (for hackathon demo)
users_db = {}

# Password hashing (simple for demo)
def hash_password(password: str) -> str:
    """Simple password hashing using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash"""
    return hash_password(plain_password) == hashed_password

def generate_token() -> str:
    """Generate a simple token (for demo, not production-ready)"""
    return secrets.token_urlsafe(32)

# Request/Response models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    success: bool
    token: str
    user: dict

class ErrorResponse(BaseModel):
    success: bool
    message: str

# Auth endpoints
@app.post("/api/login", response_model=AuthResponse)
async def login(credentials: LoginRequest):
    """Login endpoint"""
    try:
        email = credentials.email.lower()
        
        if email not in users_db:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        user = users_db[email]
        
        if not verify_password(credentials.password, user["password"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        token = generate_token()
        user["token"] = token
        user["last_login"] = datetime.now().isoformat()
        
        return {
            "success": True,
            "token": token,
            "user": {
                "email": user["email"],
                "name": user["name"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error: {str(e)}"
        )

@app.post("/api/signup", response_model=AuthResponse)
async def signup(user_data: SignupRequest):
    """Signup endpoint"""
    try:
        email = user_data.email.lower()
        
        if email in users_db:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists"
            )
        
        if len(user_data.password) < 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 6 characters"
            )
        
        hashed_password = hash_password(user_data.password)
        token = generate_token()
        
        users_db[email] = {
            "email": email,
            "name": user_data.name,
            "password": hashed_password,
            "token": token,
            "created_at": datetime.now().isoformat()
        }
        
        return {
            "success": True,
            "token": token,
            "user": {
                "email": email,
                "name": user_data.name
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Server error: {str(e)}"
        )

@app.get("/api/verify")
async def verify_token(token: str):
    """Verify token endpoint"""
    for email, user in users_db.items():
        if user.get("token") == token:
            return {
                "success": True,
                "user": {
                    "email": user["email"],
                    "name": user["name"]
                }
            }
    raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/")
async def root():
    """Health check"""
    return {"message": "AlgoTix Auth API is running", "users_count": len(users_db)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

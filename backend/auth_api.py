from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.requests import Request
from pydantic import BaseModel, EmailStr, ValidationError
from typing import Optional
import secrets
import os
from datetime import datetime, timedelta
import hashlib
from algosdk.v2client import algod
from dotenv import load_dotenv

load_dotenv()

ALGOD_SERVER = os.getenv("ALGOD_SERVER", "http://localhost")
ALGOD_PORT = os.getenv("ALGOD_PORT", "4001")
ALGOD_TOKEN = os.getenv("ALGOD_TOKEN", "a" * 64)
APP_ID = int(os.getenv("APP_ID", "0"))
ASSET_ID = int(os.getenv("ASSET_ID", "0"))

# Fix for Testnet nodes that don't use a separate port in the URL
if ALGOD_PORT and ALGOD_PORT.strip():
    algod_url = f"{ALGOD_SERVER}:{ALGOD_PORT}"
else:
    algod_url = ALGOD_SERVER

algod_client = algod.AlgodClient(ALGOD_TOKEN, algod_url)

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
    return {"message": "AlgoTix Auth API is running", "users_count": len(users_db)}


@app.get("/api/algo/status")
async def algo_status():
    try:
        node_status = algod_client.status()
        return {
            "connected": True,
            "last_round": node_status.get("last-round", 0),
            "app_id": APP_ID,
            "asset_id": ASSET_ID,
            "algod_version": node_status.get("last-version", "unknown"),
        }
    except Exception as e:
        return {"connected": False, "error": str(e)}


class DeployResponse(BaseModel):
    success: bool
    app_id: int
    asset_id: int
    deployer: str


@app.post("/api/algo/deploy", response_model=DeployResponse)
async def deploy_contract():
    global APP_ID, ASSET_ID, algod_client
    try:
        from contracts.scripts.deploy_full import deploy_full
        result = deploy_full()
        APP_ID = result["app_id"]
        ASSET_ID = result["asset_id"]
        return {
            "success": True,
            "app_id": result["app_id"],
            "asset_id": result["asset_id"],
            "deployer": result["deployer"],
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deploy failed: {str(e)}")


class CheckTicketRequest(BaseModel):
    address: str


@app.post("/api/algo/check-ticket")
async def check_ticket(req: CheckTicketRequest):
    try:
        if ASSET_ID == 0:
            raise HTTPException(status_code=400, detail="No ticket ASA deployed yet")
        account_info = algod_client.account_info(req.address)
        assets = account_info.get("assets", [])
        has_ticket = any(
            a["asset-id"] == ASSET_ID and a["amount"] > 0 for a in assets
        )
        return {
            "address": req.address,
            "has_ticket": has_ticket,
            "asset_id": ASSET_ID,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Check failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

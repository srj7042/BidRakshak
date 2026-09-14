from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import uuid4

from app.core.auth import create_access_token, get_current_user
from app.core.db import get_db

router = APIRouter(prefix="/auth", tags=["Authentication & Security"])

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    designation: str
    department: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_seconds: int = 86400
    user: dict

@router.post("/login", response_model=TokenResponse)
def login_officer(payload: LoginRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (payload.email,))
    r = cursor.fetchone()
    
    if not r:
        # Register user dynamically upon valid email login
        user_id = str(uuid4())
        now = datetime.now().isoformat()
        full_name = payload.email.split("@")[0].replace(".", " ").title()
        cursor.execute("""
        INSERT INTO users (id, email, full_name, designation, role, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, payload.email, full_name, "Nodal Officer", "PROCUREMENT_OFFICER", now))
        conn.commit()
        user = {
            "id": user_id,
            "email": payload.email,
            "full_name": full_name,
            "designation": "Nodal Officer",
            "department": "Government Department",
            "role": "PROCUREMENT_OFFICER",
            "organization": "Government of India",
            "nodal_code": "NIC-NODE-01"
        }
    else:
        user = {
            "id": r["id"],
            "email": r["email"],
            "full_name": r["full_name"],
            "designation": r["designation"] or "Nodal Officer",
            "department": "Government Department",
            "role": r["role"] or "PROCUREMENT_OFFICER",
            "organization": "Government of India",
            "nodal_code": "NIC-NODE-01"
        }
    conn.close()

    token = create_access_token(data={"sub": user["id"], "email": user["email"], "role": user["role"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in_seconds": 86400,
        "user": user
    }

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_officer(payload: RegisterRequest):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (payload.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Officer email already registered in database")
    
    user_id = str(uuid4())
    now = datetime.now().isoformat()
    
    cursor.execute("""
    INSERT INTO users (id, email, full_name, designation, role, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (user_id, payload.email, payload.full_name, payload.designation, "PROCUREMENT_OFFICER", now))
    
    conn.commit()
    conn.close()
    
    user = {
        "id": user_id,
        "email": payload.email,
        "full_name": payload.full_name,
        "designation": payload.designation,
        "department": payload.department,
        "role": "PROCUREMENT_OFFICER",
        "organization": "Government of India",
        "nodal_code": "NIC-NODE-NEW"
    }
    
    token = create_access_token(data={"sub": user["id"], "email": user["email"], "role": user["role"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me")
def get_authenticated_profile(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (current_user["email"],))
    r = cursor.fetchone()
    conn.close()
    
    if not r:
        return {
            "id": current_user["id"],
            "email": current_user["email"],
            "full_name": "Procurement Officer",
            "designation": "Nodal Officer",
            "department": "Government Department",
            "role": current_user["role"],
            "organization": "Government of India",
            "nodal_code": "NIC-NODE-01"
        }
        
    return {
        "id": r["id"],
        "email": r["email"],
        "full_name": r["full_name"],
        "designation": r["designation"] or "Nodal Officer",
        "department": "Government Department",
        "role": r["role"],
        "organization": "Government of India",
        "nodal_code": "NIC-NODE-01"
    }

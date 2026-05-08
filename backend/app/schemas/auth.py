"""
Schemas de Autenticación
"""
from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    """Request para login"""
    email: EmailStr = Field(..., description="Email del usuario")
    password: str = Field(..., min_length=8, description="Contraseña del usuario")


class UserLoginInfo(BaseModel):
    """Información del usuario para el login"""
    id: int
    email: str
    role: str
    name: str
    workCenter: str | None = None
    specialty: str | None = None


class LoginResponse(BaseModel):
    """Response de login exitoso"""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Tipo de token")
    user: UserLoginInfo = Field(..., description="Información del usuario")


class TokenPayload(BaseModel):
    """Payload del JWT token"""
    sub: int = Field(..., description="User ID")
    exp: int = Field(..., description="Expiration timestamp")
    iat: int = Field(..., description="Issued at timestamp")
    iss: str = Field(..., description="Issuer")
    aud: str = Field(..., description="Audience")

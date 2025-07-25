from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    
class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    balance: int 

    class Config:
        orm_mode = True

class DepositRequest(BaseModel):
    email: EmailStr
    amount: int

class TransferRequest(BaseModel):
    sender_email: EmailStr
    receiver_email: EmailStr
    amount: int
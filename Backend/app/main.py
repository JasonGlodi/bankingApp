from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import UserOut, TransferRequest, DepositRequest
from typing import List
from app import models, schemas, auth, utils
from app.database import engine, Base, get_db
from fastapi import Query

Base.metadata.create_all(bind=engine)
app = FastAPI()


@app.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        (models.User.username == user.username) | 
        (models.User.email == user.email)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = utils.hash_password(user.password)
    new_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    access_token = auth.create_access_token(data={"sub": new_user.username})
    return {"access_token": access_token, "token_type": "bearer"}

#get all users
@app.get("/users", response_model=List[UserOut])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users



@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()

    if not db_user or not utils.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = auth.create_access_token(data={"sub": db_user.username})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": db_user.username,
        "email": db_user.email
    }



@app.post("/deposit")
def deposit_funds(data: DepositRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Deposit amount must be positive")
    
    user.balance += data.amount
    db.commit()
    db.refresh(user)
    return {
        "status": "success",
        "message": f"{data.amount} deposited to {user.username}'s account",
        "balance": user.balance
    }


@app.post("/transfer")
def transfer_funds(data: TransferRequest, db: Session = Depends(get_db)):
    sender = db.query(models.User).filter(models.User.email == data.sender_email).first()
    receiver = db.query(models.User).filter(models.User.email == data.receiver_email).first()

    if not sender:
        raise HTTPException(status_code=404, detail="Sender not found")
    if not receiver:
        raise HTTPException(status_code=404, detail="Receiver not found")
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Transfer amount must be positive")
    if sender.balance < data.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    sender.balance -= data.amount
    receiver.balance += data.amount

    db.commit()
    db.refresh(sender)
    db.refresh(receiver)

    return {
        "status": "success",
        "message": f"{data.amount} transferred from {sender.username} to {receiver.username}",
        "sender_balance": sender.balance,
        "receiver_balance": receiver.balance
    }
    
@app.get("/balance")
def get_balance(email: str = Query(...), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "status": "success",
        "username": user.username,
        "email": user.email,
        "balance": user.balance
    }

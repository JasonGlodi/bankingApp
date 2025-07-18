# 💸 FastAPI Banking App

This is a simple FastAPI-based banking application that supports user registration, login, deposit, balance checking, and money transfers.

## 🚀 Features

- User Registration with initial balance of 0
- User Login (with JWT token response)
- Deposit money into your own account
- Transfer money to other users
- Get current account balance
- View all registered users

## 📦 Tech Stack

- Python
- FastAPI
- SQLAlchemy (with SQLite)
- Pydantic

---

## 🛠 Setup Instructions

1. **Clone the repo**

```bash
git clone https://github.com/JasonGlodi/bankingApp.git
cd banking-app
cd Backend
```

2. **Create and activate a virtual environment**

```bash
python -m venv env
source env/bin/activate  # On Windows use `env\Scripts\activate`
```

3. **Install dependencies**

```bash
pip install -r requirements.txt
```

4. **Run the server**

```bash
uvicorn main:app --reload
```

---

## 📬 API Endpoints

### 🔐 Register a New User

`POST /register`
**Body:**

```json
{
  "username": "jason",
  "email": "jason@example.com",
  "password": "secret"
}
```

---

### 🔐 Login User

`POST /login`
**Body:**

```json
{
  "email": "jason@example.com",
  "password": "secret"
}
```

---

### 💰 Deposit Funds

`POST /deposit`
**Body:**

```json
{
  "email": "jason@example.com",
  "amount": 1000
}
```

---

### 🔄 Transfer Funds

`POST /transfer`
**Body:**

```json
{
  "sender_email": "jason@example.com",
  "receiver_email": "alice@example.com",
  "amount": 500
}
```

---

### 📊 Get Balance

`GET /balance?email=jason@example.com`

---

### 👥 Get All Users

`GET /users`

---

## 📌 Notes

- Default balance is `0` upon registration.
- All amounts are integers (e.g., 1000 = 1,000 CFA).
- Email is used as a unique user identifier.

---

## 🔐 Authentication

Token is returned during login. Future improvements may include protecting routes using JWT tokens.

---

## 📄 License

MIT License – feel free to use and modify.

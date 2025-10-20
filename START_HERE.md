# 🚀 START HERE - Quick Setup

## 3 Simple Steps to Get Started

### ⚡ Step 1: Install Dependencies

Open **PowerShell** in this folder (`socket-tester`) and run:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
```

Or if using **CMD/Git Bash**:
```bash
npm install
```

---

### 🔧 Step 2: Start Backend Server

Go to your **techtrax-backend** folder and:

```bash
# 1. Install socket.io (if not already done)
npm install socket.io

# 2. Start the server
npm run dev
```

**Expected output:**
```
🎉 TechTrax Backend Server running on port 5000
🔌 Socket.IO initialized successfully
📡 WebSocket endpoint: ws://localhost:5000
```

---

### ✨ Step 3: Start This App

Back in **socket-tester** folder:

```bash
npm run dev
```

**App will open at:** http://localhost:3000

---

## 🔑 How to Login

### Quick Method: Use Token

1. **Get JWT Token:**
   - Method A: Login via Postman/Insomnia
     ```
     POST http://localhost:5000/api/auth/login
     Body: { "email": "doctor@techtrax.com", "password": "your-password" }
     ```
   - Copy the `token` from response

2. **In the app:**
   - Click "Use Token" tab
   - Paste token
   - Click "Connect"

### Alternative: Login with Credentials

1. Enter your email and password
2. Click "Login"

---

## 🎯 What to Test

Once logged in, test these modules:

### 🔔 Notifications
1. Click "Notifications" tab
2. Click "Subscribe to Topics"
3. Send notification from backend (check Instructions tab)
4. See it appear in real-time!

### 📋 Queue
1. Click "Queue" tab
2. Join queue "queue123"
3. Open another tab, join same queue
4. Test real-time position updates!

### 💬 Chat
1. Click "Chat" tab
2. Join chat "chat123"
3. Open another tab, join same chat
4. Send messages back and forth!

### 🎥 Consultation
1. Click "Consultation" tab
2. Join consultation "consult123"
3. Start/end (if you're a doctor)
4. See real-time events!

---

## 🆘 Having Issues?

### Backend Not Running?
```bash
cd ../techtrax-backend
npm run dev
```

### Can't Install Dependencies?
```powershell
# PowerShell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
```

### Authentication Failed?
- Get a fresh JWT token
- Make sure user exists
- Check user is active

### Can't Connect?
- Backend must be on http://localhost:5000
- Check `http://localhost:5000/health` returns JSON
- Make sure Socket.IO is installed in backend

---

## 📚 More Help

- **Full Guide:** `README.md`
- **Setup Details:** `SETUP_INSTRUCTIONS.md`
- **Backend Docs:** `../techtrax-backend/docs/SOCKET_IMPLEMENTATION.md`

---

## ✅ That's It!

You're ready to test all Socket.IO modules! 🎉

**Remember:**
1. Backend must be running
2. You need a valid JWT token
3. Open multiple tabs to test real-time features
4. Check browser console (F12) for logs

**Have Fun Testing! 🚀**


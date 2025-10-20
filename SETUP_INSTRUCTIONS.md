# 🚀 Setup Instructions

## Quick Setup (3 Steps)

### Step 1: Install Dependencies

Open **PowerShell** or **Command Prompt** in this folder:

```powershell
# If using PowerShell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
```

```bash
# If using CMD or Git Bash
npm install
```

### Step 2: Make Sure Backend is Running

In the **techtrax-backend** folder:

```bash
# Install socket.io if not already installed
npm install socket.io

# Start the backend server
npm run dev
```

You should see:
```
🎉 TechTrax Backend Server running on port 5000
🔌 Socket.IO initialized successfully
📡 WebSocket endpoint: ws://localhost:5000
```

### Step 3: Start This App

Back in this folder:

```bash
npm run dev
```

The app will open at: **http://localhost:3000**

---

## 🔑 How to Login

### Method 1: Use JWT Token (Recommended)

1. **Get a token** by calling the login API:
   - URL: `POST http://localhost:5000/api/auth/login`
   - Body: 
     ```json
     {
       "email": "doctor@techtrax.com",
       "password": "your-password"
     }
     ```
   - Copy the `token` from the response

2. **In the app:**
   - Click "Use Token" tab
   - Paste the token
   - Click "Connect with Token"

### Method 2: Login with Credentials

1. Click "Login with Credentials" tab
2. Enter email and password
3. Click "Login"

---

## 🧪 Testing Guide

### Test 1: Notifications

1. Click "🔔 Notifications" tab
2. Click "Subscribe to Topics"
3. In backend, run this code to send a notification:

```javascript
// In any controller
const { notifications, getSocketIO } = require('./socket/config')
const io = getSocketIO()

notifications.send(io, 'YOUR_USER_ID', {
  type: 'info',
  message: 'Hello from backend!'
})
```

4. See the notification appear in real-time!

### Test 2: Queue

1. Click "📋 Queue" tab
2. Enter queue ID: `queue123`
3. Click "Join Queue"
4. **Open another browser tab**, login, and join the same queue
5. In one tab, click "Call Next" (if you're a doctor)
6. See real-time updates in both tabs!

### Test 3: Chat

1. Click "💬 Chat" tab
2. Enter chat ID: `chat123`
3. Click "Join Chat"
4. **Open another browser tab**, login, and join the same chat
5. Send messages between tabs
6. See typing indicators when someone types!

### Test 4: Consultation

1. Click "🎥 Consultation" tab
2. Enter consultation ID: `consult123`
3. Click "Join Consultation"
4. If you're a doctor, click "Start Consultation"
5. **Open another browser tab** to see real-time updates

---

## 🔍 Troubleshooting

### Issue: "Cannot connect to server"

**Solution:**
1. Check backend is running: `http://localhost:5000`
2. Visit `http://localhost:5000/health` - should return JSON
3. Check no firewall blocking port 5000

### Issue: "Authentication failed"

**Solution:**
1. Get a fresh token (login again)
2. Make sure user exists in database
3. Check user account is active
4. Token should be JWT string (not "Bearer xyz")

### Issue: PowerShell execution policy error

**Solution:**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
```

### Issue: Port 3000 already in use

**Solution:**
Edit `vite.config.js` and change port:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,  // Change to any available port
  },
})
```

---

## 📊 What Each Tab Does

### 📖 Instructions
- Complete guide on how to use the app
- Testing tips
- Backend integration examples

### 🔔 Notifications
- Subscribe/unsubscribe to topics
- Receive real-time notifications
- Mark notifications as read
- See event logs

### 📋 Queue
- Join appointment queues
- See position updates
- Call next patient (doctors)
- Real-time queue status

### 💬 Chat
- Join chat rooms
- Send/receive messages
- Typing indicators
- Mark messages as read

### 🎥 Consultation
- Join video consultation rooms
- Start/end consultations (doctors)
- WebRTC signaling
- See participants

---

## 💡 Pro Tips

1. **Multi-Tab Testing:**
   - Open 2-3 browser tabs
   - Login with different users
   - Join same rooms
   - See real-time updates!

2. **Check Browser Console:**
   - Press F12 to open DevTools
   - Click "Console" tab
   - See detailed socket events

3. **Backend Integration:**
   - All helper functions are in `socket/config.js`
   - Import and use in controllers
   - Check `SOCKET_IMPLEMENTATION_SUMMARY.md` for examples

4. **Event Logging:**
   - Every panel has an event log
   - See all socket events in real-time
   - Debug issues easily

---

## ✅ Quick Test Checklist

Before you say "it works!", test these:

- [ ] Can login successfully
- [ ] Connection status shows "Connected"
- [ ] Notifications: Subscribe works
- [ ] Notifications: Receive notification from backend
- [ ] Queue: Join queue works
- [ ] Queue: See position updates
- [ ] Chat: Send message works
- [ ] Chat: Typing indicator shows
- [ ] Consultation: Join works
- [ ] Consultation: Start/end works (doctor)
- [ ] Multi-tab: Real-time updates work
- [ ] Event logs show all events

---

## 📁 Important Files

```
socket-tester/
├── README.md                    ← Full documentation
├── SETUP_INSTRUCTIONS.md        ← This file
├── package.json                 ← Dependencies
└── src/
    ├── App.jsx                  ← Main app
    ├── hooks/useSocket.js       ← Socket connection
    └── components/              ← All panels
```

---

## 🆘 Still Having Issues?

1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status":"success",...}`

2. **Check Socket.IO is installed:**
   ```bash
   cd ../techtrax-backend
   npm list socket.io
   ```
   Should show: `socket.io@4.x.x`

3. **Check logs:**
   - Backend: `../techtrax-backend/logs/app.log`
   - Frontend: Browser console (F12)

4. **Fresh start:**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

---

## 🎉 You're Ready!

Everything is set up. Now:

1. **Start backend:** `npm run dev` in techtrax-backend
2. **Start frontend:** `npm run dev` in this folder
3. **Login** at http://localhost:3000
4. **Test** all the modules
5. **Have fun!** 🚀

Need help? Check the README.md or backend documentation in `../techtrax-backend/docs/`


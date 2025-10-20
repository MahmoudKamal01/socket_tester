# 🔌 TechTrax Socket.IO Tester

A complete React + Vite application to test all Socket.IO modules for the TechTrax Healthcare platform.

## 📋 Prerequisites

Before you begin, make sure you have:

1. ✅ **Node.js** installed (v16 or higher)
2. ✅ **Backend server** running on `http://localhost:5000`
3. ✅ **Valid JWT token** or login credentials

## 🚀 Quick Start

### Step 1: Install Dependencies

Open PowerShell or Command Prompt in this directory and run:

```bash
npm install
```

If you get a PowerShell execution policy error, run:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
```

### Step 2: Start the Development Server

```bash
npm run dev
```

The app will open at: **http://localhost:3000**

### Step 3: Login

You have two options:

**Option A: Login with Credentials**
- Email: `doctor@techtrax.com` (or any valid user)
- Password: Your password
- Click "Login"

**Option B: Use JWT Token**
- Switch to "Use Token" tab
- Paste your JWT token
- Click "Connect with Token"

**To get a JWT token:**
1. Send POST request to `http://localhost:5000/api/auth/login`
2. Body: `{ "email": "doctor@techtrax.com", "password": "your-password" }`
3. Copy the token from response

## 📦 What's Included

### 4 Testing Modules

#### 1. 🔔 Notifications
- Subscribe/unsubscribe to topics
- Receive real-time notifications
- Mark notifications as read
- Test server-side notification broadcasting

#### 2. 📋 Queue Management ⭐ **FULLY FEATURED**
- 🏥 Doctor clock in/clock out
- 🆕 Create queue from scheduled appointments
- ✅ Patient check-in with auto-classification (on-time/late)
- 👑 Priority-based ordering (VIP → Emergency → Appointment → Walk-in → Late)
- 📞 Call, serve, and complete patients
- 📊 Real-time statistics dashboard
- 🔄 Live queue updates via Socket.IO
- 📋 Full event logging
- 🎨 Beautiful, responsive UI

**[📖 View Full Queue Management Guide](./QUEUE_MANAGEMENT_UI.md)**

#### 3. 💬 Chat
- Join chat rooms
- Send/receive messages in real-time
- Typing indicators
- Mark messages as read

#### 4. 🎥 Consultation
- Join video consultation rooms
- Start/end consultations (doctors)
- WebRTC signaling events
- See participants

## 🧪 How to Test

### Multi-User Testing

1. **Open Multiple Tabs:**
   - Open this app in 2-3 browser tabs
   - Login with different users (or same user)
   
2. **Test Notifications:**
   - In Tab 1: Subscribe to topics
   - In Tab 2: Send a notification from backend
   - See notification appear in Tab 1

3. **Test Queue:**
   - **NEW: Full Queue Management System** 🎉
   - Create queue from appointments
   - Doctor clocks in
   - Patients check in (auto-sorted by priority)
   - Call, serve, and complete patients
   - Real-time updates across all devices
   - **[See Full Guide](./QUEUE_MANAGEMENT_UI.md)**

4. **Test Chat:**
   - In Tab 1: Join chat with ID "chat123"
   - In Tab 2: Join same chat "chat123"
   - Send messages back and forth
   - See typing indicators

5. **Test Consultation:**
   - In Tab 1: Join consultation "consult123"
   - In Tab 2: Join same consultation
   - In Tab 1 (as doctor): Start consultation
   - See real-time updates in both tabs

### Backend Integration Testing

From your backend controller, you can trigger events:

```javascript
// notifications
const { notifications, getSocketIO } = require('./socket/config')
const io = getSocketIO()
notifications.send(io, userId, {
  type: 'info',
  message: 'Test notification!'
})

// Queue (comprehensive system)
const { queue } = require('./socket/config')

// Patient added to queue
queue.emit(io, 'queue:patientAdded', {
  queueId: '...',
  patientName: 'John Doe',
  position: 5
})

// Queue reordered automatically
queue.emit(io, 'queue:reordered', {
  queueId: '...',
  action: 'checkIn'
})

// Chat
const { chat } = require('./socket/config')
chat.sendMessage(io, 'chat123', {
  senderId: 'system',
  senderName: 'System',
  message: 'Welcome!'
})
```

## 🔍 Troubleshooting

### Connection Issues

**Problem:** Can't connect to server

**Solutions:**
1. Make sure backend is running: `npm run dev` in backend folder
2. Check server URL is correct: `http://localhost:5000`
3. Verify JWT token is valid (not expired)
4. Check browser console for errors (F12)

**Problem:** "Authentication failed"

**Solutions:**
1. Get a fresh JWT token by logging in
2. Make sure user exists in database
3. Verify user account is active
4. Check token format (should be JWT string, no "Bearer" prefix)

### Event Issues

**Problem:** Events not being received

**Solutions:**
1. Check if you're connected (green badge)
2. Verify you've joined the room/queue/chat
3. Ensure event names match exactly (case-sensitive)
4. Check browser console for errors

**Problem:** "Unauthorized" errors

**Solutions:**
1. Some events require specific roles (e.g., doctor)
2. Check you have correct permissions
3. Verify tenant access

## 📚 Project Structure

```
socket-tester/
├── src/
│   ├── components/
│   │   ├── Login.jsx              # Login/authentication
│   │   ├── Instructions.jsx       # Usage instructions
│   │   ├── NotificationsPanel.jsx # Notifications testing
│   │   ├── QueuePanel.jsx        # Queue testing
│   │   ├── ChatPanel.jsx         # Chat testing
│   │   └── ConsultationPanel.jsx # Consultation testing
│   ├── hooks/
│   │   └── useSocket.js          # Socket connection hook
│   ├── App.jsx                   # Main app component
│   ├── App.css                   # App styles
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── package.json
├── vite.config.js
└── README.md                     # This file
```

## 🎨 Features

### UI/UX
- ✅ Clean, modern interface
- ✅ Real-time connection status
- ✅ Event logging for debugging
- ✅ Color-coded log messages
- ✅ Responsive design
- ✅ Tab-based navigation
- ✅ Toast notifications

### Functionality
- ✅ JWT authentication
- ✅ Socket.IO connection management
- ✅ All 4 modules fully functional
- ✅ Real-time event handling
- ✅ Error handling & logging
- ✅ Multi-user support

## 🔐 Security Notes

1. **JWT Token:** Store securely, don't share
2. **Local Storage:** Token is saved in browser
3. **HTTPS:** Use HTTPS in production
4. **Token Expiry:** Token expires after configured time

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Environment Variables

Create `.env` file (optional):

```env
VITE_API_URL=http://localhost:5000
```

Then use in code:
```javascript
const SERVER_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
```

## 📖 Related Documentation

### Frontend
- **[Queue Management UI Guide](./QUEUE_MANAGEMENT_UI.md)** ⭐ Complete queue system guide

### Backend
- Socket Docs: `../techtrax-backend/docs/SOCKET_IMPLEMENTATION.md`
- Quick Reference: `../techtrax-backend/docs/SOCKET_QUICK_REFERENCE.md`
- Backend README: `../techtrax-backend/src/socket/README.md`
- **Queue System**: `../techtrax-backend/QUEUE_SYSTEM_DOCUMENTATION.md`
- **Queue Ordering**: `../techtrax-backend/QUEUE_ORDERING_SYSTEM.md`

## 🐛 Known Issues

1. **PowerShell Errors:** Use `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
2. **Port Conflicts:** Change port in `vite.config.js` if 3000 is in use
3. **CORS Errors:** Backend CORS is configured for `http://localhost:3000`

## 💡 Tips

1. **Keep Backend Running:** Always have backend server running
2. **Fresh Token:** Get new token if experiencing auth issues
3. **Browser Console:** Open DevTools (F12) for detailed logs
4. **Multiple Tabs:** Best way to test real-time features
5. **Different Users:** Login with different roles to test permissions

## 🎯 Testing Checklist

### Notifications
- [ ] Subscribe and receive
- [ ] Mark as read

### Queue Management ⭐
- [ ] Create queue from appointments
- [ ] Doctor clock in/out
- [ ] Patient check-in (on-time)
- [ ] Patient check-in (late - auto-detected)
- [ ] VIP/Emergency patient (auto-reorder)
- [ ] Call patient
- [ ] Serve patient
- [ ] Complete patient
- [ ] Real-time statistics
- [ ] Multi-device sync
- [ ] Event logging

### Chat
- [ ] Send messages
- [ ] Typing indicators
- [ ] Multiple users

### Consultation
- [ ] Join/leave
- [ ] Start/end (doctor)

### General
- [ ] Real-time updates work
- [ ] Multi-tab testing works

## 🚀 Next Steps

1. Test all modules thoroughly
2. Integrate with your actual backend workflows
3. Customize UI/styling as needed
4. Add more features (file upload, voice notes, etc.)
5. Deploy to production

## 📞 Support

If you encounter issues:

1. Check browser console (F12)
2. Check backend logs: `../techtrax-backend/logs/app.log`
3. Verify Socket.IO is installed in backend
4. Ensure all services are running

---

**Built with:**
- ⚡ Vite
- ⚛️ React
- 🔌 Socket.IO Client
- 💅 Custom CSS

**Happy Testing! 🎉**


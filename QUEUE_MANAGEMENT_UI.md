# 🏥 Queue Management UI - User Guide

## 🎯 Overview

A comprehensive **real-time queue management interface** for the TechTrax healthcare platform, featuring:

- ✅ Doctor clock in/clock out
- ✅ Queue creation from scheduled appointments
- ✅ Patient check-in with auto-classification (on-time/late)
- ✅ Real-time queue display with priority ordering
- ✅ Call, serve, and complete patients
- ✅ Live Socket.IO updates
- ✅ Queue statistics and analytics
- ✅ Event logging

---

## 🚀 Getting Started

### 1. Start the Backend

```bash
cd techtrax-backend
npm start
```

Backend should be running on `http://localhost:5000`

### 2. Start the Frontend

```bash
cd socket-tester
npm install
npm run dev
```

Frontend will open at `http://localhost:5173`

### 3. Login

Use your TechTrax credentials to login.

---

## 📋 How to Use

### Step 1: Queue Setup

1. Navigate to the **Queue** tab
2. Enter the required information:
   - **Tenant ID**: Your organization ID (e.g., `507f1f77bcf86cd799439011`)
   - **Doctor ID**: The doctor's user ID (e.g., `507f1f77bcf86cd799439012`)
   - **Date**: Select the queue date (defaults to today)

3. Choose one option:
   - **Load Queue**: If queue already exists
   - **Create from Appointments**: Pre-fill queue with scheduled appointments

---

### Step 2: Doctor Clock In

1. Once queue is loaded, click **🏥 Clock In**
2. Queue status changes from `pending` to `active`
3. Real-time event emitted to all connected clients
4. All waiting patients receive notification that doctor is available

---

### Step 3: Patient Check-In

#### Option A: Check In New Patient

1. Click **➕ Check In Patient** button
2. Enter Patient ID
3. Select patient type:
   - **Walk-in**: No appointment
   - **VIP**: Priority patient
   - **Emergency**: Highest priority
   - **Appointment**: Scheduled patient

4. Click **✅ Check In**

**What Happens:**
- System records check-in time
- If appointment exists, auto-determines if late (> 15 min)
- **Queue automatically reorders** based on priority
- Patient receives notification of their position
- Real-time update to all clients

---

#### Option B: Scheduled Patients Check In

Patients with pre-scheduled appointments will appear in the queue (not checked in).

When they arrive:
1. Click **Check In Patient**
2. Enter their Patient ID
3. System auto-detects:
   - ✅ On-time → Type: `appointment` (Priority 2)
   - ⏰ > 15 min late → Type: `late` (Priority 4)
4. Queue auto-reorders based on new priority

---

### Step 4: Call Patients

1. View **⏳ Waiting Queue** section
2. Click **📞 Call** on the first patient
3. Patient status: `waiting` → `called`
4. Patient receives urgent notification: "IT'S YOUR TURN!"
5. Patient has 10 minutes to respond (auto-unlock after)
6. Patient moves to **📞 Called** section

---

### Step 5: Serve Patient

1. When patient enters consultation room, click **👨‍⚕️ Serve**
2. Patient status: `called` → `serving`
3. Patient appears in **👨‍⚕️ Currently Serving** section
4. Lock removed (serving is permanent until done/cancelled)

---

### Step 6: Complete Consultation

1. After consultation, click **✅ Complete**
2. Patient status: `serving` → `done`
3. Patient removed from active queue
4. Stats update:
   - Completed patients count
   - Average wait time recalculated
5. Patient receives "Thank you" notification
6. Patient moves to **✅ Completed** section

---

### Step 7: Doctor Clock Out

1. At end of day, click **🏁 Clock Out**
2. Queue status changes to `closed`
3. Final statistics calculated:
   - Total patients seen
   - Completed vs. cancelled
   - Average wait time
4. Real-time summary emitted to all clients

---

## 🎨 UI Features

### Priority Display

Patients are displayed with priority emojis:

| Type | Emoji | Priority | Position |
|------|-------|----------|----------|
| **VIP** | 👑 | 1 | Top |
| **Emergency** | 🚨 | 1 | Top |
| **Appointment** | 📅 | 2 | Middle |
| **Walk-in** | 🚶 | 3 | Lower |
| **Late** | ⏰ | 4 | Bottom |

---

### Status Colors

Queue items are color-coded by status:

- **Waiting**: Blue border
- **Called**: Yellow background
- **Serving**: Purple gradient
- **Done**: Gray
- **Cancelled**: Red

---

### Real-Time Statistics

Live dashboard showing:

- **Total Patients**: All patients in queue
- **Waiting**: Currently waiting count
- **Completed**: Successfully finished
- **Avg Wait Time**: Average in minutes

---

## 🔌 Socket.IO Events

The UI automatically listens for these real-time events:

### Queue Events

```javascript
// Patient added to queue
'queue:patientAdded' → Updates queue display

// Queue auto-reordered (check-in, priority change)
'queue:reordered' → Refreshes queue order

// Manual reorder by receptionist
'queue:manualReorder' → Refreshes with audit info

// Patient called
'queue:patientCalled' → Moves patient to "Called" section

// Patient completed
'queue:patientDone' → Updates stats, removes from active

// Patient cancelled
'queue:patientCancelled' → Removes patient

// Auto-unlock expired locks
'queue:autoUnlocked' → Refreshes queue
```

### Doctor Events

```javascript
// Doctor clocked in
'doctor:clockIn' → Updates queue status, notifies patients

// Doctor clocked out
'doctor:clockOut' → Shows final stats, closes queue
```

### Personal Notifications

```javascript
// Your turn!
'notification:new' (type: 'your_turn') → Alert popup

// Checked in successfully
'notification:new' (type: 'queue_checked_in') → Position notification

// Position updated
'notification:new' (type: 'queue_position_update') → Position change
```

---

## 📊 Event Log

All socket events and API calls are logged in real-time:

- **Green**: Success events
- **Blue**: Info events
- **Orange**: Warning events
- **Red**: Error events

Useful for debugging and monitoring queue activity.

---

## 💡 Tips & Best Practices

### For Doctors

1. **Clock in** at start of day to activate queue
2. Call patients **one by one** from top of waiting list
3. Mark patients as **serving** when they enter room
4. **Complete** patients after consultation
5. **Clock out** at end of day for statistics

---

### For Receptionists

1. **Create queue from appointments** each morning
2. **Check in patients** as they arrive
3. System **auto-detects late arrivals** (> 15 min)
4. **VIP/Emergency** patients automatically jump to front
5. Monitor **real-time queue updates** across all devices

---

### For Patients

1. Arrive on time to avoid late classification
2. Check in with receptionist upon arrival
3. Watch for **"IT'S YOUR TURN!"** notification
4. Wait time displayed in real-time

---

## 🧪 Testing the System

### Test Scenario 1: Normal Flow

```
1. Create queue from appointments
   → Queue shows all scheduled patients (not checked in)

2. Doctor clocks in
   → Queue status: pending → active

3. Patient A checks in (on-time)
   → Auto-sorted, position #1

4. Walk-in checks in
   → Auto-sorted, position #2 (lower priority)

5. Call patient A
   → Patient A: waiting → called
   → Patient A gets urgent notification

6. Serve patient A
   → Patient A: called → serving

7. Complete patient A
   → Patient A: serving → done
   → Stats update
```

---

### Test Scenario 2: Late Arrival

```
1. Patient B has appointment at 10:00
2. Patient B checks in at 10:25 (25 min late)
   → System auto-detects late
   → Type: appointment → late
   → Priority: 2 → 4
   → Moved to end of queue
```

---

### Test Scenario 3: VIP Arrival

```
1. Queue: [Appt A, Appt B, Walk-in C]
2. VIP patient arrives
   → VIP checks in
   → All manual flags reset
   → Queue auto-reordered
   → New Queue: [VIP, Appt A, Appt B, Walk-in C]
```

---

### Test Scenario 4: Multi-Device Real-Time

```
1. Open UI in 2 browser tabs
2. Tab 1: Check in patient
   → Tab 2: Sees patient added instantly
3. Tab 1: Call patient
   → Tab 2: Sees patient called
4. Watch stats update in real-time
```

---

## 🎬 Demo Data

### Sample IDs for Testing

```javascript
// Tenant ID
"507f1f77bcf86cd799439011"

// Doctor IDs
"507f1f77bcf86cd799439012"
"507f1f77bcf86cd799439013"

// Patient IDs
"507f1f77bcf86cd799439014"
"507f1f77bcf86cd799439015"
"507f1f77bcf86cd799439016"
"507f1f77bcf86cd799439017"
"507f1f77bcf86cd799439018"
```

### Test Date

Use today's date or any date in format: `YYYY-MM-DD`

---

## 🔧 Customization

### Change API Endpoint

Edit `QueuePanel.jsx`:

```javascript
const API_BASE = 'http://localhost:5000/api'
// Change to your backend URL
```

### Change Refresh Interval

```javascript
// Stats refresh every 10 seconds
const interval = setInterval(fetchStats, 10000)
// Change 10000 to desired milliseconds
```

### Add Custom Patient Types

1. Update backend enum in `Queue.model.js`
2. Add to dropdown in `QueuePanel.jsx`
3. Add emoji in `getPriorityEmoji()` function
4. Add color in `getTypeColor()` function

---

## 🐛 Troubleshooting

### Queue Not Loading

✅ Check backend is running on port 5000
✅ Verify tenant ID and doctor ID are valid
✅ Check browser console for errors
✅ Ensure you're logged in with valid token

### Socket Events Not Working

✅ Check WebSocket connection (green badge)
✅ Verify backend Socket.IO is initialized
✅ Check firewall/network settings
✅ Look for errors in browser console

### Patient Not Auto-Reordering

✅ Ensure check-in endpoint is used (not add)
✅ Verify appointment time is set
✅ Check patient has checked in (checkInTime != null)
✅ Refresh queue manually

### Clock In/Out Not Working

✅ Verify queue exists and is loaded
✅ Check user has doctor role
✅ Ensure queue status allows action
✅ Check API response in network tab

---

## 📱 Mobile Support

The UI is responsive and works on:

- ✅ Desktop (1920x1080+)
- ✅ Laptop (1366x768+)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667+)

---

## 🎯 Next Steps

1. **Test the system** with sample data
2. **Open in multiple tabs** to see real-time updates
3. **Monitor event log** for debugging
4. **Try different patient types** (VIP, walk-in, late)
5. **Test full workflow** from clock-in to clock-out

---

## 🆘 Need Help?

Check these resources:

1. **Backend Docs**: `techtrax-backend/QUEUE_SYSTEM_DOCUMENTATION.md`
2. **API Reference**: `techtrax-backend/QUEUE_ORDERING_SYSTEM.md`
3. **Socket Events**: `techtrax-backend/SOCKET_CHEATSHEET.md`
4. **Examples**: `techtrax-backend/examples/queue-system-usage.js`

---

## ✨ Features Summary

✅ **Queue Creation** - From appointments or empty
✅ **Doctor Clock In/Out** - Track working hours
✅ **Patient Check-In** - Auto-classify on-time/late
✅ **Priority Ordering** - VIP → Appt → Walk-in → Late
✅ **Call System** - 10-minute auto-unlock
✅ **Serve & Complete** - Full patient lifecycle
✅ **Real-Time Updates** - Socket.IO live sync
✅ **Statistics** - Live analytics dashboard
✅ **Event Logging** - Full audit trail
✅ **Responsive Design** - Mobile-friendly

---

**Your queue management system is ready to use!** 🚀

Start the backend, login, and begin managing your queue!


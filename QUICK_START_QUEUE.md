# ⚡ Quick Start - Queue Management Testing

## 🚀 5-Minute Setup

### Step 1: Start Backend (1 min)

```bash
cd C:\Users\user\Desktop\techtrax-backend
npm start
```

Wait for: `✅ Server running on port 5000`

---

### Step 2: Start Frontend (30 sec)

```bash
cd C:\Users\user\Desktop\socket-tester
npm run dev
```

Opens at: `http://localhost:5173`

---

### Step 3: Login (30 sec)

1. Click **Use Token** tab
2. Paste your JWT token (or login with credentials)
3. Click **Connect with Token**

**Get JWT Token:**
```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@techtrax.com","password":"yourpassword"}'
```

---

### Step 4: Navigate to Queue Tab (10 sec)

Click **📋 Queue** tab

---

### Step 5: Test Queue System (3 min)

#### Quick Test with Sample Data

```
1. Enter these values:
   Tenant ID: 507f1f77bcf86cd799439011
   Doctor ID: 507f1f77bcf86cd799439012
   Date: [today's date - auto-filled]

2. Click "🆕 Create from Appointments"
   → Queue created with scheduled appointments

3. Click "🏥 Clock In"
   → Queue status: pending → active

4. Click "➕ Check In Patient"
   Patient ID: 507f1f77bcf86cd799439014
   Type: Walk-in
   → Patient added, queue auto-sorted

5. Click "📞 Call" on first patient
   → Patient status: waiting → called

6. Click "👨‍⚕️ Serve"
   → Patient status: called → serving

7. Click "✅ Complete"
   → Patient status: serving → done
   → Stats update

8. Click "🏁 Clock Out"
   → Queue closed, final stats shown
```

---

## 🎬 Full Demo Workflow

### Scenario: Busy Morning Clinic

```
SETUP:
- 3 scheduled appointments (09:00, 09:30, 10:00)
- Queue created from appointments
- Doctor clocks in at 08:55

TIMELINE:

09:00 - Patient A arrives ON TIME
  → Check in → Type: appointment (Priority 2)
  → Position: #1

09:05 - Call Patient A
  → Status: waiting → called
  → Patient A gets notification

09:07 - Patient A enters room
  → Click "Serve"
  → Status: called → serving

09:15 - WALK-IN arrives
  → Check in → Type: walkIn (Priority 3)
  → Position: #2 (behind appointments)

09:20 - Complete Patient A
  → Status: serving → done
  → Stats: 1 completed

09:25 - Call Patient B (09:30 appointment)
  → Early call, patient ready

09:30 - VIP PATIENT arrives
  → Check in → Type: VIP (Priority 1)
  → Queue AUTO-REORDERS
  → VIP jumps to #1
  → All other patients shift down

09:32 - Patient B enters, serve them
  → Complete after consultation

09:45 - Patient C arrives (10:00 appt, 15 min late)
  → System AUTO-DETECTS late arrival
  → Type: appointment → late (Priority 4)
  → Position: Last in queue

09:50 - Call VIP (highest priority)
  → VIP served first

... continue until all patients done ...

17:00 - Doctor clocks out
  → Final stats: 8 patients, 7 completed, 1 no-show
  → Average wait: 12 minutes
```

---

## 🧪 Multi-Device Testing

### Test Real-Time Sync

1. **Open 2 browser tabs side-by-side**

2. **Tab 1 (Doctor):**
   - Login as doctor
   - Load queue
   - Clock in

3. **Tab 2 (Receptionist):**
   - Login as receptionist
   - Load same queue (same tenant/doctor/date)
   - See queue already active

4. **Tab 2: Check in patient**
   - Add patient ID
   - Click check in
   - Watch Tab 1 update **instantly**

5. **Tab 1: Call patient**
   - Click "Call" button
   - Watch Tab 2 update **instantly**

6. **Both tabs:**
   - Stats update in real-time
   - Event log shows all actions
   - No refresh needed!

---

## 📊 Testing Different Patient Types

### Type 1: VIP (Priority 1)

```
Patient ID: 507f1f77bcf86cd799439014
Type: VIP
Expected: Jumps to front of queue
```

### Type 2: Emergency (Priority 1)

```
Patient ID: 507f1f77bcf86cd799439015
Type: Emergency
Expected: Jumps to front (same as VIP)
```

### Type 3: On-Time Appointment (Priority 2)

```
Patient ID: 507f1f77bcf86cd799439016
Type: Appointment
Appointment Time: 10:00
Check-in Time: 09:58
Expected: Classified as "appointment", normal priority
```

### Type 4: Walk-In (Priority 3)

```
Patient ID: 507f1f77bcf86cd799439017
Type: Walk-in
Expected: After appointments, before late patients
```

### Type 5: Late Appointment (Priority 4)

```
Patient ID: 507f1f77bcf86cd799439018
Type: Appointment (but late)
Appointment Time: 10:00
Check-in Time: 10:20 (20 min late)
Expected: Auto-classified as "late", lowest priority
```

---

## 🔍 What to Watch For

### Real-Time Events (Event Log)

✅ **Green** - Success events
- "Queue created"
- "Patient checked in"
- "Patient called"
- "Patient completed"
- "Doctor clocked in/out"

🔵 **Blue** - Info events
- "Queue reordered"
- "Position updated"
- "Status update"

🟠 **Orange** - Warning events
- "Manual reorder"
- "Auto-unlocked"

🔴 **Red** - Error events
- "Queue not found"
- "Patient not found"
- "Unauthorized"

---

### Priority-Based Reordering

Watch for automatic queue reordering when:

1. **VIP/Emergency checks in**
   - All patients shift down
   - Manual order flags reset
   - Event: "Queue reordered (checkIn)"

2. **Patient arrives late**
   - Auto-detected (> 15 min)
   - Type: appointment → late
   - Moves to end of queue

3. **On-time patient checks in**
   - Stays in appointment priority
   - Sorted by appointment time

---

## 🎯 Success Criteria

After testing, you should see:

✅ Queue created with appointments
✅ Doctor can clock in/out
✅ Patients check in successfully
✅ Queue auto-sorts by priority
✅ Late arrivals detected automatically
✅ VIP/Emergency override all manual ordering
✅ Real-time updates across all tabs
✅ Statistics update live
✅ Event log shows all actions
✅ Call → Serve → Complete flow works
✅ No page refresh needed

---

## 🆘 Troubleshooting

### "Queue not found"

**Fix:**
1. Verify tenant ID is valid ObjectId format
2. Check doctor ID exists in database
3. Use correct date format: YYYY-MM-DD
4. Try "Create from Appointments" first

---

### "Patient check-in failed"

**Fix:**
1. Ensure queue is **active** (doctor clocked in)
2. Verify patient ID is valid
3. Check patient exists in database
4. Ensure patient isn't already in queue

---

### "No real-time updates"

**Fix:**
1. Check connection badge is **green**
2. Verify Socket.IO is running on backend
3. Check browser console (F12) for errors
4. Try refreshing the page
5. Get a fresh JWT token

---

### "Stats not updating"

**Fix:**
1. Wait 10 seconds (auto-refresh interval)
2. Click "🔄 Refresh" button
3. Check queue stats endpoint is working
4. Verify backend cron jobs are running

---

## 💡 Pro Tips

1. **Keep Event Log Open**: Best way to debug issues
2. **Test Multi-Device**: Open 2+ tabs to see real-time magic
3. **Try Different Types**: VIP, emergency, late patients
4. **Watch Auto-Reorder**: Most impressive feature
5. **Clock Out**: Always clock out to see final stats

---

## 📱 Test on Mobile

1. Get your local IP: `ipconfig` → IPv4 Address
2. Update `QueuePanel.jsx`: Change `localhost` to your IP
3. Open on mobile: `http://192.168.x.x:5173`
4. Test real-time sync between desktop and mobile

---

## 🎉 You're Ready!

Follow the 5-minute setup above and start testing!

For full documentation, see: [QUEUE_MANAGEMENT_UI.md](./QUEUE_MANAGEMENT_UI.md)

**Happy Testing! 🚀**


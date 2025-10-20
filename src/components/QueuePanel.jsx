import { useState, useEffect } from 'react'
import { useSocket } from '../hooks/useSocket'
import { apiGet, apiPost } from '../utils/api'
import './QueuePanel.css'

const QueuePanel = ({ token }) => {
  const { socket, connected, user } = useSocket(token)
  
  // State
  const [queue, setQueue] = useState(null)
  const [queueItems, setQueueItems] = useState([])
  const [stats, setStats] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)
  
  // Helper function to safely get patient name
  const getPatientName = (item) => {
    // First try direct patientName field (stored in queue item)
    if (item.patientName) return item.patientName
    
    // Then try populated patientId with nested userId
    if (item.patientId?.userId) {
      const { firstName, lastName } = item.patientId.userId
      return `${firstName} ${lastName}`
    }
    
    // Fallback
    return 'Unknown Patient'
  }
  
  // Form states
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [doctorId, setDoctorId] = useState('')
  const [tenantId, setTenantId] = useState('')
  const [selectedPatient, setSelectedPatient] = useState('')
  const [checkInType, setCheckInType] = useState('walkIn')
  
  // UI states
  const [showCheckInForm, setShowCheckInForm] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const addLog = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString()
    setLogs((prev) => [{ time, message, type }, ...prev].slice(0, 50))
  }

  // Auto-fetch queue for logged-in doctor
  const fetchMyQueue = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const res = await apiGet('/queue/my-queue')
      const data = await res.json()
      
      if (data.status === 'success') {
        setQueue(data.data)
        setQueueItems(data.data.queueItems || [])
        addLog('✅ Queue loaded successfully', 'success')
      } else {
        // No queue found - user needs to clock in
        setQueue(null)
        setQueueItems([])
        addLog('ℹ️ No queue for today. Click "Clock In" to start.', 'info')
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error')
      setQueue(null)
      setQueueItems([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch queue data (legacy - for manual lookup)
  const fetchQueue = async () => {
    if (!tenantId || !doctorId || !date) return
    
    setLoading(true)
    try {
      const res = await apiGet(`/queue/${tenantId}/${doctorId}/${date}`)
      const data = await res.json()
      
      if (data.status === 'success') {
        setQueue(data.data)
        setQueueItems(data.data.queueItems || [])
        addLog('✅ Queue loaded successfully', 'success')
      } else {
        addLog('❌ Queue not found', 'error')
        setQueue(null)
        setQueueItems([])
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }
  
  // Auto-load queue when user logs in
  useEffect(() => {
    if (user && connected) {
      fetchMyQueue()
    }
  }, [user, connected])

  // Fetch queue stats
  const fetchStats = async () => {
    if (!queue?._id) return
    
    try {
      const res = await apiGet(`/queue/stats/${queue._id}`)
      const data = await res.json()
      
      if (data.status === 'success') {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Create queue from appointments
  const handleCreateFromAppointments = async () => {
    if (!tenantId || !doctorId || !date) {
      addLog('❌ Please fill tenant ID, doctor ID, and date', 'error')
      return
    }
    
    setLoading(true)
    try {
      const res = await apiPost('/queue/from-appointments', {
        tenantId,
        doctorId,
        date,
        workHours: { start: '09:00', end: '17:00' }
      })
      const data = await res.json()
      
      if (data.status === 'success') {
        setQueue(data.data)
        setQueueItems(data.data.queueItems || [])
        setShowCreateForm(false)
        addLog(`✅ Queue created with ${data.data.queueItems.length} appointments`, 'success')
      } else {
        addLog(`❌ ${data.message}`, 'error')
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Doctor clock in - auto creates queue with appointments
  const handleClockIn = async () => {
    setLoading(true)
    addLog('🏥 Clocking in and loading today\'s appointments...', 'info')
    
    try {
      // Clock in - backend will auto-create queue with appointments
      const res = await apiPost('/queue/clock-in', {})
      const data = await res.json()
      
      if (data.status === 'success') {
        setQueue(data.data)
        setQueueItems(data.data.queueItems || [])
        addLog(`✅ Clocked in! ${data.data.queueItems.length} appointments loaded`, 'success')
      } else {
        addLog(`❌ ${data.message}`, 'error')
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Doctor clock out
  const handleClockOut = async () => {
    if (!queue) return
    
    setLoading(true)
    try {
      const res = await apiPost('/queue/clock-out', {
        tenantId: queue.tenantId,
        doctorId: queue.doctorId,
        date: queue.date
      })
      const data = await res.json()
      
      if (data.status === 'success') {
        setQueue(data.data)
        addLog('🏁 Doctor clocked out successfully', 'success')
      } else {
        addLog(`❌ ${data.message}`, 'error')
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Patient check-in
  const handleCheckIn = async () => {
    if (!queue || !selectedPatient) return
    
    setLoading(true)
    try {
      const res = await apiPost('/queue/check-in', {
        tenantId: queue.tenantId,
        doctorId: queue.doctorId,
        date: queue.date,
        patientId: selectedPatient,
        type: checkInType
      })
      const data = await res.json()
      
      if (data.status === 'success') {
        setQueue(data.data)
        setQueueItems(data.data.queueItems || [])
        setShowCheckInForm(false)
        setSelectedPatient('')
        addLog('✅ Patient checked in successfully', 'success')
      } else {
        addLog(`❌ ${data.message}`, 'error')
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Call patient
  const handleCallPatient = async (queueItemId) => {
    if (!queue) return
    
    setLoading(true)
    try {
      const res = await apiPost('/queue/call', {
        tenantId: queue.tenantId,
        doctorId: queue.doctorId,
        date: queue.date,
        queueItemId
      })
      const data = await res.json()
      
      if (data.status === 'success') {
        setQueue(data.data)
        setQueueItems(data.data.queueItems || [])
        addLog('📞 Patient called successfully', 'success')
      } else {
        addLog(`❌ ${data.message}`, 'error')
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Serve patient
  const handleServePatient = async (queueItemId) => {
    if (!queue) return
    
    setLoading(true)
    try {
      const res = await apiPost('/queue/serve', {
        tenantId: queue.tenantId,
        doctorId: queue.doctorId,
        date: queue.date,
        queueItemId
      })
      const data = await res.json()
      
      if (data.status === 'success') {
        setQueue(data.data)
        setQueueItems(data.data.queueItems || [])
        addLog('👨‍⚕️ Now serving patient', 'success')
      } else {
        addLog(`❌ ${data.message}`, 'error')
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Finish patient
  const handleFinishPatient = async (queueItemId) => {
    if (!queue) return
    
    setLoading(true)
    try {
      const res = await apiPost('/queue/finish', {
        tenantId: queue.tenantId,
        doctorId: queue.doctorId,
        date: queue.date,
        queueItemId
      })
      const data = await res.json()
      
      if (data.status === 'success') {
        setQueue(data.data)
        setQueueItems(data.data.queueItems || [])
        addLog('✅ Patient completed', 'success')
      } else {
        addLog(`❌ ${data.message}`, 'error')
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Cancel patient
  const handleCancelPatient = async (queueItemId) => {
    if (!queue) return
    
    const reason = prompt('Cancel reason (optional):')
    
    setLoading(true)
    try {
      const res = await apiPost('/queue/cancel', {
        tenantId: queue.tenantId,
        doctorId: queue.doctorId,
        date: queue.date,
        queueItemId,
        reason
      })
      const data = await res.json()
      
      if (data.status === 'success') {
        setQueue(data.data)
        setQueueItems(data.data.queueItems || [])
        addLog('🚫 Patient cancelled', 'success')
      } else {
        addLog(`❌ ${data.message}`, 'error')
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error')
    } finally {
      setLoading(false)
    }
  }

  // Drag and Drop handlers
  const handleDragStart = (e, item, index) => {
    setDraggedItem({ item, index })
    e.dataTransfer.effectAllowed = 'move'
    e.currentTarget.classList.add('dragging')
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragEnter = (e) => {
    e.currentTarget.classList.add('drag-over')
  }

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over')
  }

  const handleDrop = async (e, targetItem, targetIndex) => {
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over')
    
    if (!draggedItem || draggedItem.index === targetIndex) {
      return
    }

    // Create new order
    const newWaitingItems = [...waitingItems]
    const [removed] = newWaitingItems.splice(draggedItem.index, 1)
    newWaitingItems.splice(targetIndex, 0, removed)

    // Update local state optimistically
    const newOrder = newWaitingItems.map((item, index) => ({
      id: item._id,
      order: index + 1
    }))

    setQueueItems(prev => {
      const updated = [...prev]
      newOrder.forEach(({ id, order }) => {
        const itemIndex = updated.findIndex(i => i._id === id)
        if (itemIndex !== -1) {
          updated[itemIndex] = { ...updated[itemIndex], position: order, order, manuallyOrdered: true }
        }
      })
      return updated
    })

    addLog(`↕️ Reordering queue manually...`, 'info')

    // Send to backend
    try {
      const res = await apiPost('/queue/reorder', {
        tenantId: queue.tenantId,
        doctorId: queue.doctorId,
        date: queue.date,
        newOrder
      })
      const data = await res.json()

      if (data.status === 'success') {
        setQueue(data.data)
        setQueueItems(data.data.queueItems || [])
        addLog('✅ Queue reordered successfully', 'success')
      } else {
        addLog(`❌ ${data.message}`, 'error')
        // Revert on error
        fetchQueue()
      }
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error')
      fetchQueue()
    }

    setDraggedItem(null)
  }

  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging')
    setDraggedItem(null)
  }

  // Socket.IO event listeners
  useEffect(() => {
    if (!socket) return

    // Queue events
    socket.on('queue:created', (data) => {
      addLog(`🎉 Queue created for ${data.doctorName}`, 'success')
      // Refresh if it's the logged-in doctor's queue
      if (user && data.doctorId === user.id) {
        fetchMyQueue()
      }
    })

    socket.on('queue:patientAdded', (data) => {
      addLog(`➕ ${data.patientName} added to queue (Pos: #${data.position})`, 'info')
      if (queue?._id === data.queueId) {
        fetchMyQueue()
      }
    })

    socket.on('queue:reordered', (data) => {
      addLog(`🔄 Queue reordered (${data.action})`, 'info')
      if (queue?._id === data.queueId) {
        fetchMyQueue()
      }
    })

    socket.on('queue:manualReorder', (data) => {
      addLog(`↕️ Manual reorder by ${data.reorderedByName}`, 'warning')
      if (queue?._id === data.queueId) {
        fetchMyQueue()
      }
    })

    socket.on('queue:patientCalled', (data) => {
      addLog(`📞 ${data.patientName} called`, 'success')
      if (queue?._id === data.queueId) {
        fetchMyQueue()
      }
    })

    socket.on('queue:patientDone', (data) => {
      addLog(`✅ Patient completed (${data.completedPatients} total)`, 'success')
      if (queue?._id === data.queueId) {
        fetchMyQueue()
        fetchStats()
      }
    })

    socket.on('queue:patientCancelled', (data) => {
      addLog(`🚫 Patient cancelled`, 'warning')
      if (queue?._id === data.queueId) {
        fetchMyQueue()
      }
    })

    socket.on('doctor:clockIn', (data) => {
      addLog(`🏥 ${data.doctorName} clocked in with ${data.appointmentCount} appointments`, 'success')
      // Refresh if it's the logged-in doctor
      if (user && data.doctorId === user.id) {
        fetchMyQueue()
      }
    })

    socket.on('doctor:clockOut', (data) => {
      addLog(`🏁 ${data.doctorName} clocked out (${data.completedPatients}/${data.totalPatients} patients)`, 'info')
      if (queue?._id === data.queueId) {
        fetchMyQueue()
      }
    })

    socket.on('queue:statusUpdate', (data) => {
      if (queue?._id === data.queueId) {
        fetchStats()
      }
    })

    socket.on('queue:autoUnlocked', (data) => {
      addLog(`🔓 Auto-unlocked ${data.unlockedCount} patient(s)`, 'warning')
      if (queue?._id === data.queueId) {
        fetchMyQueue()
      }
    })

    socket.on('analytics:update', (data) => {
      if (queue?._id === data.queueId) {
        fetchStats()
      }
    })

    // Personal notifications
    socket.on('notification:new', (notification) => {
      if (notification.type === 'your_turn') {
        addLog('🚨 IT\'S YOUR TURN!', 'success')
        alert('It\'s your turn! Please proceed to consultation room.')
      } else if (notification.type === 'queue_checked_in') {
        addLog(`✅ ${notification.message}`, 'success')
      } else if (notification.type === 'queue_position_update') {
        addLog(`📊 ${notification.message}`, 'info')
      }
    })

    return () => {
      socket.off('queue:created')
      socket.off('queue:patientAdded')
      socket.off('queue:reordered')
      socket.off('queue:manualReorder')
      socket.off('queue:patientCalled')
      socket.off('queue:patientDone')
      socket.off('queue:patientCancelled')
      socket.off('doctor:clockIn')
      socket.off('doctor:clockOut')
      socket.off('queue:statusUpdate')
      socket.off('queue:autoUnlocked')
      socket.off('analytics:update')
      socket.off('notification:new')
    }
  }, [socket, queue])

  // Auto-fetch stats periodically
  useEffect(() => {
    if (!queue) return
    
    fetchStats()
    const interval = setInterval(fetchStats, 10000) // Every 10 seconds
    
    return () => clearInterval(interval)
  }, [queue])

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      waiting: 'blue',
      called: 'orange',
      serving: 'green',
      done: 'gray',
      cancelled: 'red',
      noShow: 'darkgray'
    }
    return colors[status] || 'gray'
  }

  // Get type badge color
  const getTypeColor = (type) => {
    const colors = {
      vip: 'purple',
      emergency: 'red',
      appointment: 'blue',
      walkIn: 'green',
      late: 'orange'
    }
    return colors[type] || 'gray'
  }

  // Get priority emoji
  const getPriorityEmoji = (type) => {
    const emojis = {
      vip: '👑',
      emergency: '🚨',
      appointment: '📅',
      walkIn: '🚶',
      late: '⏰'
    }
    return emojis[type] || '📋'
  }

  // Waiting items sorted by position
  const waitingItems = queueItems.filter(i => i.status === 'waiting').sort((a, b) => a.position - b.position)
  const calledItems = queueItems.filter(i => i.status === 'called')
  const servingItems = queueItems.filter(i => i.status === 'serving')
  const completedItems = queueItems.filter(i => i.status === 'done')

  return (
    <div className="queue-panel">
      {/* Header */}
      <div className="card">
        <div className="flex-between mb-2">
          <h2>🏥 Queue Management System</h2>
          <div className={`status-badge ${connected ? 'connected' : 'disconnected'}`}>
            <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></span>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {user && (
          <p className="text-muted">
            Logged in as: <strong>{user.firstName} {user.lastName}</strong> ({user.role})
          </p>
        )}
      </div>

      {/* No Queue - Clock In */}
      {!queue && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>👋 Welcome, {user?.firstName}!</h2>
          <p className="text-muted mb-3">
            Ready to start your day? Click below to clock in and load today's appointments.
          </p>
          <button 
            onClick={handleClockIn} 
            disabled={!connected}
            className="success"
            style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
          >
            🏥 Clock In
          </button>
          {!connected && (
            <p className="text-muted mt-2" style={{ color: '#dc2626' }}>
              ⚠️ Not connected to server. Please wait...
            </p>
          )}
        </div>
      )}

      {!queue && loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>⏳ Loading...</h3>
          <p className="text-muted">Please wait while we set up your queue...</p>
        </div>
      )}

      {/* Queue Header */}
      {queue && (
        <>
          <div className="card queue-header">
            <div className="flex-between">
              <div>
                <h3>Queue: {queue.date}</h3>
                <p className="text-muted">
                  Status: <span className={`badge badge-${queue.status}`}>{queue.status}</span>
                  {queue.workHours && (
                    <span> • Hours: {queue.workHours.start} - {queue.workHours.end}</span>
                  )}
                </p>
              </div>
              <div className="flex gap-1">
                {queue.status === 'pending' && (
                  <button onClick={handleClockIn} disabled={loading} className="success">
                    🏥 Clock In
                  </button>
                )}
                {queue.status === 'active' && (
                  <button onClick={handleClockOut} disabled={loading} className="danger">
                    🏁 Clock Out
                  </button>
                )}
                <button onClick={fetchMyQueue} disabled={loading}>
                  🔄 Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Queue Statistics */}
          {stats && (
            <div className="card queue-stats">
              <h3>📊 Statistics</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-value">{stats.totalPatients}</div>
                  <div className="stat-label">Total Patients</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.waitingCount}</div>
                  <div className="stat-label">Waiting</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.completedPatients}</div>
                  <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{stats.averageWaitTime} min</div>
                  <div className="stat-label">Avg Wait Time</div>
                </div>
              </div>
            </div>
          )}

          {/* Check-in Button */}
          {queue.status === 'active' && (
            <div className="card">
              <button
                onClick={() => setShowCheckInForm(!showCheckInForm)}
                className="success full-width"
              >
                ➕ Check In Patient
              </button>

              {showCheckInForm && (
                <div className="check-in-form mt-2">
                  <div className="form-group">
                    <label>Patient ID</label>
                    <input
                      type="text"
                      value={selectedPatient}
                      onChange={(e) => setSelectedPatient(e.target.value)}
                      placeholder="507f1f77bcf86cd799439013"
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select value={checkInType} onChange={(e) => setCheckInType(e.target.value)}>
                      <option value="walkIn">Walk-in</option>
                      <option value="vip">VIP</option>
                      <option value="emergency">Emergency</option>
                      <option value="appointment">Appointment</option>
                    </select>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={handleCheckIn} disabled={loading || !selectedPatient} className="success">
                      ✅ Check In
                    </button>
                    <button onClick={() => setShowCheckInForm(false)} className="secondary">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Current Patient Serving */}
          {servingItems.length > 0 && (
            <div className="card current-patient">
              <h3>👨‍⚕️ Currently Serving</h3>
              {servingItems.map(item => (
                <div key={item._id} className="patient-card serving">
                  <div className="patient-info">
                    <h4>{getPriorityEmoji(item.type)} {item.patientName}</h4>
                    <div className="patient-meta">
                      <span className={`badge badge-${getTypeColor(item.type)}`}>{item.type}</span>
                      {item.checkInTime && (
                        <span className="text-muted">
                          Checked in: {new Date(item.checkInTime).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="patient-actions">
                    <button onClick={() => handleFinishPatient(item._id)} className="success small">
                      ✅ Complete
                    </button>
                    <button onClick={() => handleCancelPatient(item._id)} className="danger small">
                      🚫 Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Waiting Queue */}
          <div className="card">
            <div className="flex-between mb-2">
              <h3>⏳ Waiting Queue ({waitingItems.length})</h3>
              <span className="text-muted text-small">💡 Drag & drop to reorder</span>
            </div>
            {waitingItems.length === 0 ? (
              <div className="empty-state">No patients waiting</div>
            ) : (
              <div className="queue-list">
                {waitingItems.map((item, index) => (
                  <div
                    key={item._id}
                    className="patient-card draggable"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, index)}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, item, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="drag-handle">⋮⋮</div>
                    <div className="patient-position">#{item.position}</div>
                    <div className="patient-info">
                      <h4>{getPriorityEmoji(item.type)} {item.patientName}</h4>
                      <div className="patient-meta">
                        <span className={`badge badge-${getTypeColor(item.type)}`}>{item.type}</span>
                        {item.checkInTime ? (
                          <span className="text-muted">
                            ✓ Checked in: {new Date(item.checkInTime).toLocaleTimeString()}
                          </span>
                        ) : (
                          <span className="text-muted">❌ Not checked in</span>
                        )}
                        {item.manuallyOrdered && (
                          <span className="badge badge-purple">Manual</span>
                        )}
                      </div>
                    </div>
                    <div className="patient-actions">
                      {index === 0 && (
                        <button onClick={() => handleCallPatient(item._id)} className="primary small">
                          📞 Call
                        </button>
                      )}
                      {item.status === 'called' && (
                        <button onClick={() => handleServePatient(item._id)} className="success small">
                          👨‍⚕️ Serve
                        </button>
                      )}
                      <button onClick={() => handleCancelPatient(item._id)} className="danger small">
                        🚫 Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Called Patients */}
          {calledItems.length > 0 && (
            <div className="card">
              <h3>📞 Called ({calledItems.length})</h3>
              <div className="queue-list">
                {calledItems.map(item => (
                  <div key={item._id} className="patient-card called">
                    <div className="patient-info">
                      <h4>{getPriorityEmoji(item.type)} {item.patientName}</h4>
                      <div className="patient-meta">
                        <span className="text-muted">
                          Called: {new Date(item.calledTime).toLocaleTimeString()}
                        </span>
                        {item.lockedUntil && (
                          <span className="text-muted">
                            Locked until: {new Date(item.lockedUntil).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="patient-actions">
                      <button onClick={() => handleServePatient(item._id)} className="success small">
                        👨‍⚕️ Start Serving
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Patients */}
          {completedItems.length > 0 && (
            <div className="card">
              <h3>✅ Completed ({completedItems.length})</h3>
              <div className="completed-list">
                {completedItems.slice(0, 5).map(item => (
                  <div key={item._id} className="completed-item">
                    <span>{item.patientName}</span>
                    <span className="text-muted">
                      {new Date(item.doneTime).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Event Log */}
      <div className="card">
        <h3>📋 Event Log</h3>
        <div className="log-container">
          {logs.length === 0 ? (
            <div className="text-muted text-center">No events yet</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="log-entry">
                <span className="log-time">{log.time}</span>
                <span className={`log-message log-type-${log.type}`}>{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="card">
        <h3>💡 How to Use</h3>
        <ol className="instructions-list">
          <li>Enter tenant ID, doctor ID, and date</li>
          <li>Click "Load Queue" or "Create from Appointments"</li>
          <li>Doctor clicks "Clock In" to activate queue</li>
          <li>Check in patients using the "Check In Patient" button</li>
          <li>Call patients one by one using the "Call" button</li>
          <li>Mark patients as serving and complete them</li>
          <li>Watch real-time updates via Socket.IO</li>
          <li>Clock out at end of day</li>
        </ol>
      </div>
    </div>
  )
}

export default QueuePanel

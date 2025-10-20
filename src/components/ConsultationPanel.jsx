import { useState, useEffect } from 'react'
import { useSocket } from '../hooks/useSocket'

const ConsultationPanel = ({ token }) => {
  const { socket, connected, user } = useSocket(token)
  const [consultationId, setConsultationId] = useState('consult123')
  const [isInConsultation, setIsInConsultation] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [participants, setParticipants] = useState([])
  const [logs, setLogs] = useState([])

  const addLog = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, { time, message, type }])
  }

  useEffect(() => {
    if (!socket) return

    socket.on('consultation:started', (data) => {
      addLog(`▶️ Consultation started by ${data.doctorName}`, 'success')
      setIsActive(true)
    })

    socket.on('consultation:ended', (data) => {
      addLog(`⏹️ Consultation ended`, 'warning')
      setIsActive(false)
    })

    socket.on('consultation:userJoined', (data) => {
      addLog(`✅ ${data.userName} (${data.role}) joined`, 'success')
      setParticipants((prev) => [
        ...prev,
        { userId: data.userId, userName: data.userName, role: data.role },
      ])
    })

    socket.on('consultation:userLeft', (data) => {
      addLog(`❌ ${data.userName} left`, 'warning')
      setParticipants((prev) => prev.filter((p) => p.userId !== data.userId))
    })

    socket.on('consultation:signal', (data) => {
      addLog(`📡 WebRTC signal from ${data.fromUserName} (${data.type})`, 'info')
      // In a real app, you would handle WebRTC signaling here
    })

    return () => {
      socket.off('consultation:started')
      socket.off('consultation:ended')
      socket.off('consultation:userJoined')
      socket.off('consultation:userLeft')
      socket.off('consultation:signal')
    }
  }, [socket])

  const handleJoinConsultation = () => {
    if (!socket) return

    socket.emit(
      'consultation:join',
      { consultationId, tenantId: user?.tenantId },
      (response) => {
        if (response.success) {
          setIsInConsultation(true)
          addLog(`✅ Joined consultation: ${consultationId}`, 'success')
        } else {
          addLog(`❌ Error: ${response.error}`, 'error')
        }
      }
    )
  }

  const handleLeaveConsultation = () => {
    if (!socket) return

    socket.emit('consultation:leave', { consultationId }, (response) => {
      if (response.success) {
        setIsInConsultation(false)
        setIsActive(false)
        setParticipants([])
        addLog(`✅ Left consultation: ${consultationId}`, 'success')
      } else {
        addLog(`❌ Error: ${response.error}`, 'error')
      }
    })
  }

  const handleStartConsultation = () => {
    if (!socket) return

    socket.emit('consultation:start', { consultationId }, (response) => {
      if (response.success) {
        addLog(`✅ Consultation started`, 'success')
      } else {
        addLog(`❌ Error: ${response.error}`, 'error')
      }
    })
  }

  const handleEndConsultation = () => {
    if (!socket) return

    socket.emit(
      'consultation:end',
      { consultationId, summary: 'Consultation completed successfully' },
      (response) => {
        if (response.success) {
          addLog(`✅ Consultation ended`, 'success')
        } else {
          addLog(`❌ Error: ${response.error}`, 'error')
        }
      }
    )
  }

  const handleSendSignal = () => {
    if (!socket) return

    // Simulate WebRTC signaling
    socket.emit('consultation:signal', {
      consultationId,
      targetUserId: 'other-user-id',
      signal: { type: 'offer', sdp: 'mock-sdp-data' },
      type: 'offer',
    })
    addLog(`📡 Sent WebRTC signal (mock)`, 'info')
  }

  const isDoctorRole = user?.role === 'doctor'

  return (
    <div>
      <div className="card">
        <div className="flex-between mb-2">
          <h2>🎥 Consultation Module</h2>
          <div className={`status-badge ${connected ? 'connected' : 'disconnected'}`}>
            <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></span>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {user && (
          <p className="text-muted mb-2">
            Logged in as: <strong>{user.firstName} {user.lastName}</strong> ({user.role})
          </p>
        )}

        <div className="alert info">
          <strong>📝 Instructions:</strong>
          <ol>
            <li>Enter a consultation ID (or use the default "consult123")</li>
            <li>Click "Join Consultation"</li>
            <li>If you're a doctor, you can start/end the consultation</li>
            <li>Open this in another browser tab to see real-time updates</li>
            <li>WebRTC signaling events are logged (but not actually processed in this demo)</li>
          </ol>
        </div>
      </div>

      <div className="card">
        <div className="form-group">
          <label>Consultation ID</label>
          <input
            type="text"
            value={consultationId}
            onChange={(e) => setConsultationId(e.target.value)}
            placeholder="consult123"
            disabled={isInConsultation}
          />
        </div>

        <div className="flex gap-1">
          {!isInConsultation ? (
            <button onClick={handleJoinConsultation} disabled={!connected} className="success">
              🚪 Join Consultation
            </button>
          ) : (
            <button onClick={handleLeaveConsultation} disabled={!connected} className="danger">
              🚶 Leave Consultation
            </button>
          )}
        </div>
      </div>

      {isInConsultation && (
        <>
          <div className="video-placeholder">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎥</div>
            <h3>{isActive ? 'Consultation Active' : 'Waiting to Start'}</h3>
            <p>
              {isActive
                ? 'Video call is in progress'
                : isDoctorRole
                ? 'Start the consultation when ready'
                : 'Waiting for doctor to start'}
            </p>
          </div>

          {isDoctorRole && (
            <div className="card">
              <h3>Doctor Controls</h3>
              <div className="controls">
                {!isActive ? (
                  <button onClick={handleStartConsultation} disabled={!connected} className="success">
                    ▶️ Start Consultation
                  </button>
                ) : (
                  <button onClick={handleEndConsultation} disabled={!connected} className="danger">
                    ⏹️ End Consultation
                  </button>
                )}
                <button onClick={handleSendSignal} disabled={!connected}>
                  📡 Send WebRTC Signal (Mock)
                </button>
              </div>
            </div>
          )}

          {!isDoctorRole && (
            <div className="card">
              <p className="text-muted text-center">
                Note: Start/End controls are only available for doctors
              </p>
            </div>
          )}

          <div className="card">
            <h3>Participants ({participants.length + 1})</h3>
            <div className="message-list">
              <div className="message">
                <strong>{user?.firstName} {user?.lastName}</strong> ({user?.role}) - You
              </div>
              {participants.map((p, i) => (
                <div key={i} className="message">
                  <strong>{p.userName}</strong> ({p.role})
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="card">
        <h3>Event Log</h3>
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

      <div className="card">
        <h3>💡 About WebRTC</h3>
        <p>
          This demo shows Socket.IO event handling for consultations. In a real video call app:
        </p>
        <ul>
          <li>
            <code>consultation:signal</code> would exchange WebRTC SDP offers/answers
          </li>
          <li>ICE candidates would be shared for peer connection</li>
          <li>Video/audio streams would be displayed using WebRTC APIs</li>
          <li>You could use libraries like <code>simple-peer</code> or <code>PeerJS</code></li>
        </ul>
      </div>
    </div>
  )
}

export default ConsultationPanel


import { useState, useEffect } from 'react'
import { useSocket } from '../hooks/useSocket'

const NotificationsPanel = ({ token }) => {
  const { socket, connected, user } = useSocket(token)
  const [notifications, setNotifications] = useState([])
  const [subscribedTopics, setSubscribedTopics] = useState([])
  const [logs, setLogs] = useState([])

  const addLog = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, { time, message, type }])
  }

  useEffect(() => {
    if (!socket) return

    // Listen for new notifications
    socket.on('notification:new', (notification) => {
      addLog(`📬 Received: ${notification.message}`, 'success')
      setNotifications((prev) => [{
        ...notification,
        id: Date.now(),
        read: false,
      }, ...prev])
    })

    return () => {
      socket.off('notification:new')
    }
  }, [socket])

  const handleSubscribe = () => {
    if (!socket) return

    const topics = ['appointments', 'messages', 'alerts', 'system']
    
    socket.emit('notification:subscribe', { topics }, (response) => {
      if (response.success) {
        setSubscribedTopics(response.subscribedTopics)
        addLog(`✅ Subscribed to: ${response.subscribedTopics.join(', ')}`, 'success')
      } else {
        addLog(`❌ Error: ${response.error}`, 'error')
      }
    })
  }

  const handleUnsubscribe = () => {
    if (!socket) return

    socket.emit('notification:unsubscribe', { topics: subscribedTopics }, (response) => {
      if (response.success) {
        setSubscribedTopics([])
        addLog(`✅ Unsubscribed from all topics`, 'success')
      } else {
        addLog(`❌ Error: ${response.error}`, 'error')
      }
    })
  }

  const handleMarkAsRead = (notificationId) => {
    if (!socket) return

    socket.emit('notification:markAsRead', { notificationId }, (response) => {
      if (response.success) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        )
        addLog(`✅ Marked notification as read`, 'success')
      } else {
        addLog(`❌ Error: ${response.error}`, 'error')
      }
    })
  }

  return (
    <div>
      <div className="card">
        <div className="flex-between mb-2">
          <h2>🔔 Notifications Module</h2>
          <div className={`status-badge ${connected ? 'connected' : 'disconnected'}`}>
            <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></span>
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        {!connected && (
          <div className="alert danger">
            <strong>⚠️ Cannot connect to Socket.IO server</strong>
            <p>Make sure Socket.IO is installed in the backend:</p>
            <ol>
              <li>Open CMD (Command Prompt) - not PowerShell</li>
              <li>Run: <code>cd C:\Users\user\Desktop\techtrax-backend</code></li>
              <li>Run: <code>npm install socket.io</code></li>
              <li>Restart backend: <code>npm run dev</code></li>
            </ol>
          </div>
        )}

        {user && (
          <p className="text-muted mb-2">
            Logged in as: <strong>{user.firstName} {user.lastName}</strong> ({user.role})
          </p>
        )}

        <div className="alert info">
          <strong>📝 Instructions:</strong>
          <ol>
            <li>Click "Subscribe to Topics" to start receiving notifications</li>
            <li>Send a notification from the backend to see it appear here</li>
            <li>Click "Mark as Read" on any notification</li>
            <li>Check the event log below to see all socket events</li>
          </ol>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-1 mb-2">
          <button
            onClick={handleSubscribe}
            disabled={!connected || subscribedTopics.length > 0}
            className="success"
          >
            📡 Subscribe to Topics
          </button>
          <button
            onClick={handleUnsubscribe}
            disabled={!connected || subscribedTopics.length === 0}
            className="danger"
          >
            ❌ Unsubscribe
          </button>
        </div>

        {subscribedTopics.length > 0 && (
          <div className="mb-2">
            <strong>Subscribed to:</strong>{' '}
            {subscribedTopics.map((topic) => (
              <span key={topic} className="badge info">
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Notifications ({notifications.length})</h3>
        <div className="message-list">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <p>No notifications yet</p>
              <p className="text-small">
                Subscribe to topics and send a notification from the backend
              </p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`notification-item ${!notif.read ? 'unread' : ''}`}
              >
                <div className="notification-header">
                  <span className="notification-title">
                    {notif.type || 'Notification'}
                  </span>
                  <span className="text-small text-muted">
                    {new Date(notif.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="notification-body">{notif.message}</div>
                {!notif.read && (
                  <button
                    onClick={() => handleMarkAsRead(notif.id)}
                    className="small mt-1"
                  >
                    ✓ Mark as Read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <h3>Event Log</h3>
        <div className="log-container">
          {logs.length === 0 ? (
            <div className="text-muted text-center">No events yet</div>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="log-entry">
                <span className="log-time">{log.time}</span>
                <span className={`log-message log-type-${log.type}`}>
                  {log.message}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <h3>💡 Test from Backend</h3>
        <p>To send a notification from your backend controller:</p>
        <div className="code-block">
{`const { notifications, getSocketIO } = require('./socket/config')
const io = getSocketIO()

// Send to this user
notifications.send(io, '${user?.id || 'userId'}', {
  type: 'info',
  message: 'Test notification!',
  data: { /* any data */ }
})

// Or broadcast to tenant
notifications.broadcastToTenant(io, '${user?.tenantId || 'tenantId'}', {
  type: 'system',
  message: 'System announcement'
})`}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPanel


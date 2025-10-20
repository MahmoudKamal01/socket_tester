import { useState, useEffect, useRef } from 'react'
import { useSocket } from '../hooks/useSocket'

const ChatPanel = ({ token }) => {
  const { socket, connected, user } = useSocket(token)
  const [chatId, setChatId] = useState('chat123')
  const [isInChat, setIsInChat] = useState(false)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [typingUsers, setTypingUsers] = useState([])
  const [logs, setLogs] = useState([])
  const typingTimeoutRef = useRef(null)

  const addLog = (message, type = 'info') => {
    const time = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, { time, message, type }])
  }

  useEffect(() => {
    if (!socket) return

    socket.on('chat:message', (message) => {
      addLog(`💬 Message from ${message.senderName}`, 'info')
      setMessages((prev) => [...prev, message])
    })

    socket.on('chat:typing', (data) => {
      if (data.userId !== user?.id) {
        if (data.isTyping) {
          setTypingUsers((prev) => [...new Set([...prev, data.userName])])
        } else {
          setTypingUsers((prev) => prev.filter((name) => name !== data.userName))
        }
      }
    })

    socket.on('chat:messagesRead', (data) => {
      addLog(`✓✓ ${data.readBy} read messages`, 'success')
    })

    socket.on('chat:userJoined', (data) => {
      addLog(`✅ ${data.userName} joined the chat`, 'success')
    })

    socket.on('chat:userLeft', (data) => {
      addLog(`❌ ${data.userName} left the chat`, 'warning')
    })

    return () => {
      socket.off('chat:message')
      socket.off('chat:typing')
      socket.off('chat:messagesRead')
      socket.off('chat:userJoined')
      socket.off('chat:userLeft')
    }
  }, [socket, user])

  const handleJoinChat = () => {
    if (!socket) return

    socket.emit('chat:join', { chatId, tenantId: user?.tenantId }, (response) => {
      if (response.success) {
        setIsInChat(true)
        addLog(`✅ Joined chat: ${chatId}`, 'success')
      } else {
        addLog(`❌ Error: ${response.error}`, 'error')
      }
    })
  }

  const handleLeaveChat = () => {
    if (!socket) return

    socket.emit('chat:leave', { chatId }, (response) => {
      if (response.success) {
        setIsInChat(false)
        setMessages([])
        setTypingUsers([])
        addLog(`✅ Left chat: ${chatId}`, 'success')
      } else {
        addLog(`❌ Error: ${response.error}`, 'error')
      }
    })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!socket || !messageText.trim()) return

    socket.emit(
      'chat:sendMessage',
      {
        chatId,
        message: messageText,
        type: 'text',
      },
      (response) => {
        if (response.success) {
          setMessageText('')
          // Stop typing indicator
          socket.emit('chat:typing', { chatId, isTyping: false })
        } else {
          addLog(`❌ Error: ${response.error}`, 'error')
        }
      }
    )
  }

  const handleTyping = (e) => {
    setMessageText(e.target.value)

    if (!socket) return

    // Send typing indicator
    socket.emit('chat:typing', { chatId, isTyping: true })

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('chat:typing', { chatId, isTyping: false })
    }, 2000)
  }

  const handleMarkAsRead = () => {
    if (!socket || messages.length === 0) return

    const messageIds = messages.map((m) => m.id)

    socket.emit('chat:markAsRead', { chatId, messageIds }, (response) => {
      if (response.success) {
        addLog(`✅ Marked ${messageIds.length} messages as read`, 'success')
      } else {
        addLog(`❌ Error: ${response.error}`, 'error')
      }
    })
  }

  return (
    <div>
      <div className="card">
        <div className="flex-between mb-2">
          <h2>💬 Chat Module</h2>
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
            <li>Enter a chat ID (or use the default "chat123")</li>
            <li>Click "Join Chat"</li>
            <li>Open this in another browser tab with the same chat ID</li>
            <li>Send messages and see typing indicators in real-time</li>
          </ol>
        </div>
      </div>

      <div className="card">
        <div className="form-group">
          <label>Chat ID</label>
          <input
            type="text"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder="chat123"
            disabled={isInChat}
          />
        </div>

        <div className="flex gap-1">
          {!isInChat ? (
            <button onClick={handleJoinChat} disabled={!connected} className="success">
              🚪 Join Chat
            </button>
          ) : (
            <>
              <button onClick={handleLeaveChat} disabled={!connected} className="danger">
                🚶 Leave Chat
              </button>
              <button onClick={handleMarkAsRead} disabled={!connected || messages.length === 0}>
                ✓ Mark All as Read
              </button>
            </>
          )}
        </div>
      </div>

      {isInChat && (
        <div className="card">
          <h3>Messages</h3>
          <div className="message-list">
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>No messages yet</p>
                <p className="text-small">Start chatting!</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className="message">
                  <div className="message-header">
                    <span className="message-sender">
                      {msg.senderName} {msg.senderId === user?.id && '(You)'}
                    </span>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="message-body">{msg.message}</div>
                </div>
              ))
            )}
          </div>

          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}

          <form onSubmit={handleSendMessage}>
            <div className="form-inline">
              <div className="form-group" style={{ flex: 1 }}>
                <input
                  type="text"
                  value={messageText}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  disabled={!connected}
                />
              </div>
              <button type="submit" disabled={!connected || !messageText.trim()}>
                📤 Send
              </button>
            </div>
          </form>
        </div>
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
        <h3>💡 Test from Backend</h3>
        <p>To send a system message from your backend:</p>
        <div className="code-block">
{`const { chat, getSocketIO } = require('./socket/config')
const io = getSocketIO()

chat.sendMessage(io, '${chatId}', {
  senderId: 'system',
  senderName: 'System',
  message: 'Welcome to the chat!',
  type: 'system'
})`}
        </div>
      </div>
    </div>
  )
}

export default ChatPanel


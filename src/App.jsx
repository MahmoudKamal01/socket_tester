import { useState } from 'react'
import Login from './components/Login'
import NotificationsPanel from './components/NotificationsPanel'
import QueuePanel from './components/QueuePanel'
import ChatPanel from './components/ChatPanel'
import ConsultationPanel from './components/ConsultationPanel'
import Instructions from './components/Instructions'
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [activeTab, setActiveTab] = useState('instructions')

  const handleLogin = (newToken) => {
    setToken(newToken)
    localStorage.setItem('token', newToken)
    setActiveTab('notifications')
  }

  const handleLogout = () => {
    setToken('')
    localStorage.removeItem('token')
    setActiveTab('instructions')
  }

  if (!token) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>🔌 TechTrax Socket.IO Tester</h1>
          <button onClick={handleLogout} className="danger small">
            Logout
          </button>
        </div>
      </header>

      <div className="container">
        <div className="tabs">
          <button
            className={activeTab === 'instructions' ? 'active' : ''}
            onClick={() => setActiveTab('instructions')}
          >
            📖 Instructions
          </button>
          <button
            className={activeTab === 'notifications' ? 'active' : ''}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
          </button>
          <button
            className={activeTab === 'queue' ? 'active' : ''}
            onClick={() => setActiveTab('queue')}
          >
            📋 Queue
          </button>
          <button
            className={activeTab === 'chat' ? 'active' : ''}
            onClick={() => setActiveTab('chat')}
          >
            💬 Chat
          </button>
          <button
            className={activeTab === 'consultation' ? 'active' : ''}
            onClick={() => setActiveTab('consultation')}
          >
            🎥 Consultation
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'instructions' && <Instructions />}
          {activeTab === 'notifications' && <NotificationsPanel token={token} />}
          {activeTab === 'queue' && <QueuePanel token={token} />}
          {activeTab === 'chat' && <ChatPanel token={token} />}
          {activeTab === 'consultation' && <ConsultationPanel token={token} />}
        </div>
      </div>
    </div>
  )
}

export default App








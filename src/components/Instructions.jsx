import './Instructions.css'

const Instructions = () => {
  return (
    <div className="instructions">
      <div className="card">
        <h2>📖 Welcome to TechTrax Socket.IO Tester!</h2>
        <p>
          This application allows you to test all Socket.IO modules in real-time.
          You're now connected and ready to test the following modules:
        </p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>🔔 Notifications</h3>
          <p><strong>What you can do:</strong></p>
          <ul>
            <li>Subscribe to notification topics</li>
            <li>Receive real-time notifications</li>
            <li>Mark notifications as read</li>
          </ul>
          <p><strong>Try this:</strong></p>
          <ol>
            <li>Click "Subscribe to Topics" button</li>
            <li>Open browser console and send a notification from backend</li>
            <li>See notifications appear in real-time</li>
          </ol>
          <div className="code-block">
{`// From backend controller:
const { notifications, getSocketIO } = 
  require('./socket/config')
const io = getSocketIO()

notifications.send(io, userId, {
  type: 'info',
  message: 'Test notification!'
})`}
          </div>
        </div>

        <div className="card">
          <h3>📋 Queue Management</h3>
          <p><strong>What you can do:</strong></p>
          <ul>
            <li>Join appointment queues</li>
            <li>See position updates in real-time</li>
            <li>Call next patient (if you're a doctor)</li>
            <li>Get notified when it's your turn</li>
          </ul>
          <p><strong>Try this:</strong></p>
          <ol>
            <li>Enter a queue ID (e.g., "queue123")</li>
            <li>Click "Join Queue"</li>
            <li>Open in another browser/tab and join same queue</li>
            <li>Click "Call Next" to test notifications</li>
          </ol>
        </div>

        <div className="card">
          <h3>💬 Chat</h3>
          <p><strong>What you can do:</strong></p>
          <ul>
            <li>Join chat rooms</li>
            <li>Send and receive messages in real-time</li>
            <li>See typing indicators</li>
            <li>Mark messages as read</li>
          </ul>
          <p><strong>Try this:</strong></p>
          <ol>
            <li>Enter a chat ID (e.g., "chat123")</li>
            <li>Click "Join Chat"</li>
            <li>Open in another browser/tab with same chat ID</li>
            <li>Send messages back and forth</li>
            <li>See typing indicators when someone types</li>
          </ol>
        </div>

        <div className="card">
          <h3>🎥 Consultation</h3>
          <p><strong>What you can do:</strong></p>
          <ul>
            <li>Join video consultation rooms</li>
            <li>Start/end consultations (doctors only)</li>
            <li>WebRTC signaling support</li>
            <li>See participants join/leave</li>
          </ul>
          <p><strong>Try this:</strong></p>
          <ol>
            <li>Enter a consultation ID (e.g., "consult123")</li>
            <li>Click "Join Consultation"</li>
            <li>If you're a doctor, you can start/end the consultation</li>
            <li>See real-time events in the log</li>
          </ol>
        </div>
      </div>

      <div className="card">
        <h2>🚀 Testing Tips</h2>
        <div className="grid grid-2">
          <div>
            <h4>Multi-User Testing</h4>
            <ul>
              <li>Open this app in multiple browser tabs</li>
              <li>Login with different users in each tab</li>
              <li>Join the same rooms to see real-time updates</li>
              <li>Test notifications, queue updates, chat messages</li>
            </ul>
          </div>
          <div>
            <h4>Backend Integration</h4>
            <ul>
              <li>Make sure backend is running on <code>http://localhost:5000</code></li>
              <li>Use controllers to send server-side events</li>
              <li>Check browser console for detailed logs</li>
              <li>Monitor backend logs in <code>logs/app.log</code></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>🔍 Debugging</h2>
        <ul>
          <li><strong>Connection Issues:</strong> Check if backend is running and JWT token is valid</li>
          <li><strong>Events Not Received:</strong> Ensure event names match exactly (case-sensitive)</li>
          <li><strong>Authorization Errors:</strong> Some events require specific roles (e.g., doctor, admin)</li>
          <li><strong>Console Logs:</strong> Open browser DevTools (F12) to see detailed logs</li>
        </ul>
      </div>

      <div className="card">
        <h2>📚 Documentation</h2>
        <p>For more information, check:</p>
        <ul>
          <li><code>docs/SOCKET_IMPLEMENTATION.md</code> - Full documentation</li>
          <li><code>docs/SOCKET_QUICK_REFERENCE.md</code> - Quick reference guide</li>
          <li><code>SOCKET_IMPLEMENTATION_SUMMARY.md</code> - Implementation summary</li>
        </ul>
      </div>
    </div>
  )
}

export default Instructions








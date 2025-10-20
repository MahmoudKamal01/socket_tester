import { useState } from 'react'
import './Login.css'
import { tokenManager } from '../utils/tokenManager'

const Login = ({ onLogin }) => {
  const [serverUrl, setServerUrl] = useState('http://localhost:5000')
  const [email, setEmail] = useState('doctor@techtrax.com')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [useToken, setUseToken] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLoginWithCredentials = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${serverUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Handle different response structures
        const accessToken = data.data?.tokens?.accessToken || data.data?.token || data.token || data.data?.accessToken
        const refreshToken = data.data?.tokens?.refreshToken || data.data?.refreshToken
        
        if (accessToken) {
          console.log('Login successful, tokens received')
          
          // Store both tokens
          tokenManager.setTokens(accessToken, refreshToken || accessToken)
          
          onLogin(accessToken)
        } else {
          console.error('No token in response:', data)
          setError('Login successful but no token received. Check console for response details.')
        }
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Failed to connect to server. Make sure the backend is running on ' + serverUrl)
    } finally {
      setLoading(false)
    }
  }

  const handleLoginWithToken = (e) => {
    e.preventDefault()
    if (token.trim()) {
      onLogin(token.trim())
    } else {
      setError('Please enter a valid token')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box card">
        <h1>🔌 TechTrax Socket Tester</h1>
        <p className="text-muted mb-3">Test all Socket.IO modules in real-time</p>

        <div className="alert info mb-3">
          <strong>📝 Before you start:</strong>
          <ol>
            <li>Make sure the backend server is running on <code>http://localhost:5000</code></li>
            <li>You need a valid JWT token to connect</li>
            <li>You can either login with credentials or paste a token directly</li>
          </ol>
        </div>

        <div className="tabs-simple">
          <button
            className={!useToken ? 'active' : ''}
            onClick={() => setUseToken(false)}
          >
            Login with Credentials
          </button>
          <button
            className={useToken ? 'active' : ''}
            onClick={() => setUseToken(true)}
          >
            Use Token
          </button>
        </div>

        {error && (
          <div className="alert danger">
            {error}
          </div>
        )}

        {!useToken ? (
          <form onSubmit={handleLoginWithCredentials}>
            <div className="form-group">
              <label>Server URL</label>
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                placeholder="http://localhost:5000"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@techtrax.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-small text-muted mt-2">
              Don't have credentials? Switch to "Use Token" tab and paste your JWT token
            </p>
          </form>
        ) : (
          <form onSubmit={handleLoginWithToken}>
            <div className="form-group">
              <label>JWT Token</label>
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your JWT token here..."
                rows="4"
                required
              />
              <small className="text-muted">
                Get a token by logging in via the API or from Postman
              </small>
            </div>

            <button type="submit" style={{ width: '100%' }}>
              Connect with Token
            </button>

            <p className="text-small text-muted mt-2">
              To get a token:
              <br />
              1. POST to <code>http://localhost:5000/api/auth/login</code>
              <br />
              2. Copy the token from the response
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login


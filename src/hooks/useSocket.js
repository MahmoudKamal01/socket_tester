import { useEffect, useState, useRef } from 'react'
import io from 'socket.io-client'
import { tokenManager } from '../utils/tokenManager'

const SERVER_URL = 'http://localhost:5000'

export const useSocket = (token) => {
  const [connected, setConnected] = useState(false)
  const [user, setUser] = useState(null)
  const socketRef = useRef(null)
  const refreshIntervalRef = useRef(null)

  useEffect(() => {
    if (!token) return

    // Create socket connection with current access token
    const currentToken = tokenManager.getAccessToken() || token
    const socket = io(SERVER_URL, {
      auth: { token: currentToken },
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket

    // Connection events
    socket.on('connect', () => {
      setConnected(true)
      console.log('✅ Connected to server')
    })

    socket.on('connected', (data) => {
      setUser(data.user)
      console.log('👤 Authenticated as:', data.user.email)
    })

    socket.on('disconnect', () => {
      setConnected(false)
      console.log('❌ Disconnected from server')
    })

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error.message)
      console.error('Error details:', error)

      if (error.message.includes('websocket') || error.message.includes('404')) {
        console.error('⚠️ Socket.IO server not available!')
        console.error('💡 Make sure to run: npm install socket.io')
        console.error('💡 Then restart backend: npm run dev')
      }

      setConnected(false)
    })

    // Auto-refresh token every 10 minutes
    refreshIntervalRef.current = setInterval(async () => {
      try {
        console.log('🔄 Checking token expiry...')
        const newToken = await tokenManager.getValidAccessToken()

        // If token was refreshed, reconnect socket with new token
        if (newToken !== tokenManager.getAccessToken()) {
          console.log('🔑 Token refreshed, reconnecting socket...')
          socket.auth = { token: newToken }
          socket.disconnect()
          socket.connect()
        }
      } catch (error) {
        console.error('❌ Token refresh failed:', error)
        // If refresh fails, user will be logged out
        window.location.reload()
      }
    }, 10 * 60 * 1000) // Every 10 minutes

    // Cleanup on unmount
    return () => {
      socket.disconnect()
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current)
      }
    }
  }, [token])

  return {
    socket: socketRef.current,
    connected,
    user,
  }
}

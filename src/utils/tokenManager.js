const API_BASE = 'http://localhost:5000/api'

class TokenManager {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken') || ''
    this.refreshToken = localStorage.getItem('refreshToken') || ''
    this.refreshPromise = null
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  getAccessToken() {
    return this.accessToken
  }

  getRefreshToken() {
    return this.refreshToken
  }

  clearTokens() {
    this.accessToken = ''
    this.refreshToken = ''
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('token') // Legacy
  }

  async refreshAccessToken() {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.refreshToken}`,
          },
        })

        if (!response.ok) {
          throw new Error('Token refresh failed')
        }

        const data = await response.json()

        if (data.status === 'success' && data.data.tokens) {
          this.setTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken)
          return data.data.tokens.accessToken
        } else {
          throw new Error('Invalid refresh response')
        }
      } catch (error) {
        console.error('Token refresh error:', error)
        this.clearTokens()
        throw error
      } finally {
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  isTokenExpiringSoon(token) {
    if (!token) return true

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const exp = payload.exp * 1000 // Convert to milliseconds
      const now = Date.now()
      const timeUntilExpiry = exp - now

      // Refresh if less than 2 minutes remaining
      return timeUntilExpiry < 2 * 60 * 1000
    } catch (error) {
      console.error('Error parsing token:', error)
      return true
    }
  }

  async getValidAccessToken() {
    if (this.isTokenExpiringSoon(this.accessToken)) {
      console.log('Access token expiring soon, refreshing...')
      return await this.refreshAccessToken()
    }
    return this.accessToken
  }
}

export const tokenManager = new TokenManager()

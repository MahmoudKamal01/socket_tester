import { tokenManager } from './tokenManager'

const API_BASE = 'http://localhost:5000/api'

export const apiCall = async (endpoint, options = {}) => {
  try {
    // Get valid access token (will refresh if needed)
    const token = await tokenManager.getValidAccessToken()

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })

    // If 401 Unauthorized, try to refresh token once
    if (response.status === 401) {
      console.log('401 Unauthorized, attempting token refresh...')

      try {
        const newToken = await tokenManager.refreshAccessToken()
        headers['Authorization'] = `Bearer ${newToken}`

        // Retry the request with new token
        const retryResponse = await fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers,
        })

        return retryResponse
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // Clear tokens and reload to login page
        tokenManager.clearTokens()
        window.location.reload()
        throw refreshError
      }
    }

    return response
  } catch (error) {
    console.error('API call error:', error)
    throw error
  }
}

export const apiGet = (endpoint) => apiCall(endpoint, { method: 'GET' })

export const apiPost = (endpoint, data) =>
  apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const apiPut = (endpoint, data) =>
  apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

export const apiDelete = (endpoint) => apiCall(endpoint, { method: 'DELETE' })

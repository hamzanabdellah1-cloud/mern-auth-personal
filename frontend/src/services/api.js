const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'

async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = {
    Accept: 'application/json',
  }

  if (body) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()
  let data

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { message: text }
  }

  if (!response.ok) {
    const error = new Error(data?.message || `API error ${response.status}`)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export function loginUser(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export function getCurrentUser(token) {
  return apiRequest('/auth/me', {
    token,
  })
}

export function updateCurrentUser(token, payload) {
  return apiRequest('/auth/me', {
    method: 'PUT',
    body: payload,
    token,
  })
}

export function getApiHealth() {
  return apiRequest('/health')
}

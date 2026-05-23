import { useCallback, useEffect, useState } from 'react'
import {
  getCurrentUser,
  loginUser,
  registerUser,
  updateCurrentUser,
} from '../services/api'
import useLocalStorage from './useLocalStorage'

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'
const LEGACY_REGISTERED_USER_KEY = 'registered_user'

function useAuth() {
  const [token, setToken, clearToken] = useLocalStorage(AUTH_TOKEN_KEY)
  const [user, setUser, clearUser] = useLocalStorage(AUTH_USER_KEY)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isInitializing, setIsInitializing] = useState(Boolean(token && !user))

  useEffect(() => {
    localStorage.removeItem(LEGACY_REGISTERED_USER_KEY)
  }, [])

  const clearSession = useCallback(() => {
    clearToken()
    clearUser()
  }, [clearToken, clearUser])

  const saveSession = useCallback(
    ({ token: nextToken, user: nextUser }) => {
      setToken(nextToken)
      setUser(nextUser)
    },
    [setToken, setUser],
  )

  useEffect(() => {
    let isMounted = true

    if (!token) {
      return () => {
        isMounted = false
      }
    }

    if (user) {
      return () => {
        isMounted = false
      }
    }

    getCurrentUser(token)
      .then((data) => {
        if (isMounted) {
          setUser(data.user)
        }
      })
      .catch(() => {
        if (isMounted) {
          clearSession()
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsInitializing(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [clearSession, setUser, token, user])

  const register = useCallback(
    async (payload) => {
      setError('')
      setIsSubmitting(true)

      try {
        const data = await registerUser(payload)
        saveSession(data)
        return data.user
      } catch (requestError) {
        setError(requestError.message)
        throw requestError
      } finally {
        setIsSubmitting(false)
      }
    },
    [saveSession],
  )

  const login = useCallback(
    async (payload) => {
      setError('')
      setIsSubmitting(true)

      try {
        const data = await loginUser(payload)
        saveSession(data)
        return data.user
      } catch (requestError) {
        setError(requestError.message)
        throw requestError
      } finally {
        setIsSubmitting(false)
      }
    },
    [saveSession],
  )

  const logout = useCallback(() => {
    setError('')
    setIsInitializing(false)
    clearSession()
  }, [clearSession])

  const updateProfile = useCallback(
    async (payload) => {
      if (!token) {
        const requestError = new Error('Authentication token is missing.')
        setError(requestError.message)
        throw requestError
      }

      setError('')
      setIsSubmitting(true)

      try {
        const data = await updateCurrentUser(token, payload)
        setUser(data.user)
        return data.user
      } catch (requestError) {
        setError(requestError.message)
        throw requestError
      } finally {
        setIsSubmitting(false)
      }
    },
    [setUser, token],
  )

  return {
    user,
    token,
    error,
    isAuthenticated: Boolean(user && token),
    isInitializing,
    isSubmitting,
    register,
    login,
    logout,
    updateProfile,
  }
}

export default useAuth

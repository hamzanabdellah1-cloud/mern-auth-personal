import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import useAuth from './hooks/useAuth'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Register from './pages/Register'

function App() {
  const {
    user,
    register,
    login,
    logout,
    updateProfile,
    isInitializing,
    isSubmitting,
    error,
  } = useAuth()

  if (isInitializing) {
    return (
      <>
        <Navbar user={user} onLogout={logout} />
        <main className="page loading-page">
          <section className="loading-panel">
            <p className="eyebrow">Connexion API</p>
            <h1>Chargement...</h1>
            <p>Nous recuperons votre session depuis le backend.</p>
          </section>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar user={user} onLogout={logout} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register
                apiError={error}
                isSubmitting={isSubmitting}
                onRegister={register}
              />
            )
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login
                apiError={error}
                isSubmitting={isSubmitting}
                onLogin={login}
              />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <Profile
                user={user}
                isSubmitting={isSubmitting}
                onUpdateProfile={updateProfile}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App

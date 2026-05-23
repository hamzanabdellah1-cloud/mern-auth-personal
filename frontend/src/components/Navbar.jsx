import { NavLink, useNavigate } from 'react-router-dom'
import UserAvatar from './UserAvatar'

function Navbar({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <header className="site-navbar">
      <nav className="navbar-inner" aria-label="Navigation principale">
        <div className="navbar-links">
          <NavLink className="navbar-link" to="/">
            Accueil
          </NavLink>

          {user && (
            <NavLink className="navbar-link" to="/dashboard">
              Dashboard
            </NavLink>
          )}
        </div>

        <div className="navbar-actions">
          {user ? (
            <>
              <NavLink
                className="navbar-user"
                to="/profile"
                title="Modifier le profil"
              >
                <UserAvatar user={user} />
                <strong>{user.name || user.email}</strong>
              </NavLink>
              <button
                className="navbar-button navbar-button-danger"
                type="button"
                onClick={handleLogout}
              >
                Deconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink className="navbar-button navbar-button-ghost" to="/login">
                Connexion
              </NavLink>
              <NavLink
                className="navbar-button navbar-button-primary"
                to="/register"
              >
                Inscription
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar

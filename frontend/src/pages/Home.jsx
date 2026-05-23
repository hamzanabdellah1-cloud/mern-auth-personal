import { Link } from 'react-router-dom'
import AnimatedScene from '../components/AnimatedScene'

function Home() {
  return (
    <main className="home-page">
      <AnimatedScene className="home-scene" />

      <div className="home-layout">
        <section className="home-content">
          <p className="eyebrow">Application full-stack</p>
          <h1>AuthFlow</h1>
          <p className="home-description">
            Une interface moderne pour gérer l'inscription, la connexion et un
            dashboard protégé dans une application React.
          </p>

          <div className="action-row">
            <Link className="btn btn-primary" to="/login">
              Se connecter
            </Link>
            <Link className="btn btn-secondary" to="/register">
              Créer un compte
            </Link>
          </div>
        </section>

        <section className="app-preview" aria-label="Aperçu du dashboard">
          <div className="preview-topbar">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="preview-content">
            <div>
              <p className="preview-label">Session active</p>
              <strong>Bienvenue dans votre espace</strong>
            </div>
            <div className="preview-grid">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Home

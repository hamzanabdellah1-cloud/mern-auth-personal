import { Link } from 'react-router-dom'
import AnimatedScene from './AnimatedScene'

function AuthLayout({ badge, title, description, metrics, children }) {
  return (
    <main className="page auth-page">
      <section className="auth-visual" aria-label="Présentation AuthFlow">
        <AnimatedScene className="auth-scene" compact />

        <Link className="brand-link" to="/">
          AuthFlow
        </Link>

        <div className="auth-visual-content">
          <span className="security-badge">{badge}</span>
          <h2>{title}</h2>
          <p>{description}</p>

          <div className="auth-metrics">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <Link className="back-link" to="/">
          Accueil
        </Link>

        {children}
      </section>
    </main>
  )
}

export default AuthLayout

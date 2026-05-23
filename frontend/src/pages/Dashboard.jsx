import { Link } from 'react-router-dom'

function formatDate(date) {
  if (!date) {
    return 'Non disponible'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

function Dashboard({ user }) {
  return (
    <main className="page dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="eyebrow">Dashboard protege</p>
          <h1>Bonjour, {user.name}</h1>
          <p className="dashboard-subtitle">
            Ces informations viennent de la reponse securisee du backend.
          </p>
        </div>

        <div className="dashboard-actions">
          <Link className="btn btn-secondary" to="/profile">
            Modifier le profil
          </Link>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="info-panel">
          <div className="panel-title-row">
            <h2>Informations utilisateur</h2>
            <span className="source-pill">API</span>
          </div>

          <dl className="user-details">
            <div>
              <dt>Nom</dt>
              <dd>{user.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{user.role}</dd>
            </div>
            <div>
              <dt>Compte cree</dt>
              <dd>{formatDate(user.createdAt)}</dd>
            </div>
          </dl>
        </article>

        <article className="status-panel">
          <h2>Statut API</h2>
          <p>Session active</p>
          <span>
            Le profil est garde en cache local et synchronise quand vous
            modifiez vos informations.
          </span>
        </article>
      </section>
    </main>
  )
}

export default Dashboard

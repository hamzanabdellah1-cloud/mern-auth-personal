import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'

const metrics = [
  { value: 'API', label: 'Connexion backend' },
  { value: 'JWT', label: 'Session protegee' },
  { value: 'Live', label: 'Reponses affichees' },
]

function Login({ apiError, isSubmitting, onLogin }) {
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    const formData = new FormData(event.currentTarget)

    try {
      await onLogin({
        email: formData.get('email'),
        password: formData.get('password'),
      })

      navigate('/dashboard')
    } catch (error) {
      setFormError(error.message)
    }
  }

  return (
    <AuthLayout
      badge="Acces securise"
      title="Retrouvez votre espace en quelques secondes."
      description="Le formulaire envoie vos identifiants au backend et stocke le token JWT recu."
      metrics={metrics}
    >
      <p className="eyebrow">Connexion</p>
      <h1>Se connecter</h1>
      <p className="auth-intro">
        Accedez a votre espace personnel avec vos identifiants.
      </p>

      {(formError || apiError) && (
        <p className="form-alert" role="alert">
          {formError || apiError}
        </p>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          name="email"
          type="email"
          placeholder="vous@example.com"
          autoComplete="email"
          disabled={isSubmitting}
          required
        />

        <FormInput
          label="Mot de passe"
          name="password"
          type="password"
          placeholder="Votre mot de passe"
          autoComplete="current-password"
          disabled={isSubmitting}
          required
        />

        <button
          className="btn btn-primary btn-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <p className="auth-switch">
        Pas encore de compte ? <Link to="/register">Creer un compte</Link>
      </p>
    </AuthLayout>
  )
}

export default Login

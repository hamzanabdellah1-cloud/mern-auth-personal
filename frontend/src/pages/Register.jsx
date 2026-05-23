import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import FormInput from '../components/FormInput'

const metrics = [
  { value: 'POST', label: '/api/auth/register' },
  { value: 'JWT', label: 'Token recu' },
  { value: 'User', label: 'Profil affiche' },
]

function Register({ apiError, isSubmitting, onRegister }) {
  const navigate = useNavigate()
  const [formError, setFormError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    const formData = new FormData(event.currentTarget)

    try {
      await onRegister({
        name: formData.get('name'),
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
      badge="Nouveau depart"
      title="Creez un compte connecte a votre API."
      description="Le backend cree l'utilisateur, hash le mot de passe, renvoie un token JWT et le profil public."
      metrics={metrics}
    >
      <p className="eyebrow">Nouveau compte</p>
      <h1>Creer un compte</h1>
      <p className="auth-intro">
        Renseignez vos informations pour acceder au dashboard.
      </p>

      {(formError || apiError) && (
        <p className="form-alert" role="alert">
          {formError || apiError}
        </p>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <FormInput
          label="Nom"
          name="name"
          type="text"
          placeholder="Votre nom"
          autoComplete="name"
          disabled={isSubmitting}
          required
        />

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
          placeholder="Minimum 6 caracteres"
          autoComplete="new-password"
          disabled={isSubmitting}
          minLength="6"
          required
        />

        <button
          className="btn btn-primary btn-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creation...' : 'Creer un compte'}
        </button>
      </form>

      <p className="auth-switch">
        Deja inscrit ? <Link to="/login">Se connecter</Link>
      </p>
    </AuthLayout>
  )
}

export default Register

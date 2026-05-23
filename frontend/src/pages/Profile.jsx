import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import FormInput from '../components/FormInput'
import UserAvatar from '../components/UserAvatar'

const MAX_AVATAR_FILE_SIZE = 4 * 1024 * 1024
const AVATAR_SIZE = 320

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Impossible de lire cette image.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Image invalide.'))
    image.src = src
  })
}

async function fileToAvatarDataUrl(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error('Choisissez un fichier image.')
  }

  if (file.size > MAX_AVATAR_FILE_SIZE) {
    throw new Error('Image trop lourde. Maximum: 4 MB.')
  }

  const source = await readFileAsDataUrl(file)
  const image = await loadImage(source)
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Impossible de preparer cette image.')
  }

  const sourceSize = Math.min(image.naturalWidth, image.naturalHeight)
  const sourceX = (image.naturalWidth - sourceSize) / 2
  const sourceY = (image.naturalHeight - sourceSize) / 2

  canvas.width = AVATAR_SIZE
  canvas.height = AVATAR_SIZE
  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    AVATAR_SIZE,
    AVATAR_SIZE,
  )

  return canvas.toDataURL('image/jpeg', 0.86)
}

function Profile({ user, isSubmitting, onUpdateProfile }) {
  const [name, setName] = useState(user.name || '')
  const [email, setEmail] = useState(user.email || '')
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '')
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')
  const [isReadingImage, setIsReadingImage] = useState(false)
  const previewUser = useMemo(
    () => ({
      ...user,
      name,
      email,
      avatarUrl,
    }),
    [avatarUrl, email, name, user],
  )

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setFormError('')
    setSuccess('')
    setIsReadingImage(true)

    try {
      setAvatarUrl(await fileToAvatarDataUrl(file))
    } catch (error) {
      setFormError(error.message)
    } finally {
      setIsReadingImage(false)
      event.target.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setSuccess('')

    try {
      await onUpdateProfile({
        name,
        email,
        avatarUrl,
      })
      setSuccess('Profil mis a jour.')
    } catch (error) {
      setFormError(error.message)
    }
  }

  return (
    <main className="page profile-page">
      <section className="profile-header">
        <div>
          <p className="eyebrow">Profil</p>
          <h1>Modifier le profil</h1>
          <p className="dashboard-subtitle">
            Mettez a jour votre nom, votre email et votre image de profil.
          </p>
        </div>

        <Link className="btn btn-secondary" to="/dashboard">
          Retour dashboard
        </Link>
      </section>

      <section className="profile-panel">
        <div className="avatar-editor">
          <UserAvatar user={previewUser} size="lg" />

          <div className="avatar-controls">
            <input
              id="avatar-file"
              className="avatar-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleAvatarChange}
              disabled={isSubmitting || isReadingImage}
            />
            <label className="btn btn-secondary" htmlFor="avatar-file">
              {isReadingImage ? 'Chargement...' : 'Changer image'}
            </label>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => setAvatarUrl('')}
              disabled={isSubmitting || isReadingImage || !avatarUrl}
            >
              Supprimer
            </button>
          </div>
        </div>

        {(formError || success) && (
          <p
            className={formError ? 'form-alert' : 'form-success'}
            role={formError ? 'alert' : 'status'}
          >
            {formError || success}
          </p>
        )}

        <form className="auth-form profile-form" onSubmit={handleSubmit}>
          <FormInput
            label="Nom"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            disabled={isSubmitting}
            required
          />

          <FormInput
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            disabled={isSubmitting}
            required
          />

          <button
            className="btn btn-primary btn-full"
            type="submit"
            disabled={isSubmitting || isReadingImage}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default Profile

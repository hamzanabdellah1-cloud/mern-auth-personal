import { memo } from 'react'

function getInitial(user) {
  const source = user?.name || user?.email || 'U'
  return source.trim().charAt(0).toUpperCase() || 'U'
}

function UserAvatar({ user, size = 'sm', className = '' }) {
  const classes = [
    'user-avatar',
    `user-avatar-${size}`,
    user?.avatarUrl ? 'has-image' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (user?.avatarUrl) {
    return (
      <span className={classes} aria-hidden="true">
        <img src={user.avatarUrl} alt="" decoding="async" loading="eager" />
      </span>
    )
  }

  return (
    <span className={classes} aria-hidden="true">
      {getInitial(user)}
    </span>
  )
}

export default memo(UserAvatar)

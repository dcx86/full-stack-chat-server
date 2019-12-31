type User = {
  id: string
  username: string
}

const users: User[] = []

export const addUser = ({ id, username }: User) => {
  username = username.trim().toLowerCase()

  if (!username) return { error: 'A username is required!' }

  const existingUser = users.find(user => {
    return user.username === username
  })

  if (existingUser) return { error: 'Username is in use!' }

  const user = { id, username }
  users.push(user)

  return { user }
}

export const removeUser = (id: string) => {
  const index = users.findIndex(user => user.id === id)

  if (index !== -1) return users.splice(index, 1)[0]
}

export const getUser = (id: string) => {
  return users.find((user: User) => user.id == id)
}

export const getActiveUsers = () => {
  return users
}

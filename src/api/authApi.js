export async function loginUser(username, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })

  if (!response.ok) {
    throw new Error(
      response.status === 401
        ? 'Invalid username or password.'
        : `Login failed: ${response.status}`,
    )
  }

  return response.json()
}

export async function changeCredentials(
  token,
  currentPassword,
  newUsername,
  newPassword,
) {
  const response = await fetch('/api/auth/credentials', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword,
      newUsername,
      newPassword,
    }),
  })

  const responseText = await response.text()

  if (!response.ok) {
    throw new Error(
      responseText || `Credentials update failed: ${response.status}`,
    )
  }

  return responseText
}
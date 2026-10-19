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
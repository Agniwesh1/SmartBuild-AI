export async function fetchDashboard(token) {
  const response = await fetch('/api/dashboard', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Dashboard request failed: ${response.status}`)
  }

  return response.json()
}
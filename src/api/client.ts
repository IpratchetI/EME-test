export const API_BASE = import.meta.env.DEV
  ? '/api'
  : 'https://jsonplaceholder.typicode.com'

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 10000)

  try {
    return await fetch(`${API_BASE}${path}`, {
      ...init,
      signal: controller.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Превышено время ожидания ответа API')
    }
    throw new Error('Не удалось связаться с API (Failed to fetch)')
  } finally {
    window.clearTimeout(timeoutId)
  }
}

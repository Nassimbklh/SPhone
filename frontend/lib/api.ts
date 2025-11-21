/**
 * Configuration centralisée de l'API
 * SÉCURITÉ : Utilise les variables d'environnement pour éviter les URLs hardcodées
 */

// URL de base de l'API - récupérée depuis les variables d'environnement
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

// URL complète de l'API
export const API_BASE_URL = `${API_URL}/api`

/**
 * Fonction helper pour faire des requêtes API avec authentification
 * @param endpoint - Le endpoint de l'API (ex: '/products', '/orders/123')
 * @param options - Options fetch (method, body, headers, etc.)
 * @returns Promise<Response>
 */
export async function fetchAPI(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`

  // Récupérer le token d'authentification
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // Configuration par défaut
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  return fetch(url, config)
}

/**
 * Helper pour les requêtes GET
 */
export async function apiGet(endpoint: string): Promise<Response> {
  return fetchAPI(endpoint, {
    method: 'GET',
  })
}

/**
 * Helper pour les requêtes POST
 */
export async function apiPost(endpoint: string, body: any): Promise<Response> {
  return fetchAPI(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

/**
 * Helper pour les requêtes PUT
 */
export async function apiPut(endpoint: string, body: any): Promise<Response> {
  return fetchAPI(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

/**
 * Helper pour les requêtes DELETE
 */
export async function apiDelete(endpoint: string): Promise<Response> {
  return fetchAPI(endpoint, {
    method: 'DELETE',
  })
}

/**
 * Helper pour uploader des fichiers (multipart/form-data)
 */
export async function apiUpload(endpoint: string, formData: FormData): Promise<Response> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const url = `${API_BASE_URL}${endpoint}`

  return fetch(url, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      // Ne pas définir Content-Type pour multipart/form-data
      // Le navigateur le fait automatiquement avec le boundary correct
    },
    body: formData,
  })
}

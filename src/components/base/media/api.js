// API Configuration for Media Components
const API_BASE_URL = 'https://mediasapi.vstsolution.com'

// Media API Service
export const mediaApi = {
  // Base URL
  baseURL: API_BASE_URL,
  
  // Upload file to R2
  async uploadFile(idSaas, idUsuario, file) {
    const formData = new FormData()
    formData.append('id_saas', idSaas)
    formData.append('id_usuario', idUsuario)
    formData.append('file', file)
    
    const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
      method: 'POST',
      body: formData
    })
    
    return response.json()
  },
  
  // Get signed URL for viewing
  async getSignedUrl(key) {
    const response = await fetch(`${API_BASE_URL}/api/files/get-signed-url?key=${encodeURIComponent(key)}`)
    return response.json()
  },
  
  // Delete file from R2
  async deleteFile(key) {
    const response = await fetch(`${API_BASE_URL}/api/files/${encodeURIComponent(key)}`, {
      method: 'DELETE'
    })
    
    return response.json()
  }
}

// Export base URL for direct use if needed
export { API_BASE_URL }

// Default export
export default mediaApi

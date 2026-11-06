import axios from 'axios'

// Alamat default server backend Flask API (D:\Egg Sorting System\app_flask.py)
const DEFAULT_API_URL = 'http://127.0.0.1:8000'

export const eggApiClient = axios.create({
  baseURL: DEFAULT_API_URL,
  timeout: 15000,
})

export const eggApiService = {
  setBaseUrl(url) {
    eggApiClient.defaults.baseURL = url
  },

  getBaseUrl() {
    return eggApiClient.defaults.baseURL || DEFAULT_API_URL
  },

  // Health check endpoint
  async checkHealth() {
    try {
      const response = await eggApiClient.get('/api/v1/status')
      return {
        online: true,
        data: response.data,
      }
    } catch (error) {
      return {
        online: false,
        error: error.message || 'API Offline',
      }
    }
  },

  // Model Info endpoint
  async getModelInfo() {
    try {
      const response = await eggApiClient.get('/api/v1/model-info')
      return response.data
    } catch (error) {
      console.warn('[EggApi] Gagal mengambil model info:', error)
      return null
    }
  },

  // Prediksi citra telur (bisa 1 file atau multi-sudut 360 derajat)
  async predictEgg(files) {
    const formData = new FormData()

    if (Array.isArray(files)) {
      files.forEach((file) => {
        formData.append('files', file)
      })
    } else if (files) {
      formData.append('files', files)
      formData.append('file', files) // fallback untuk backward compatibility
    } else {
      throw new Error('Tidak ada file citra telur yang dikirim.')
    }

    const startTime = performance.now()
    const response = await eggApiClient.post('/api/v1/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    const latencyMs = Math.round(performance.now() - startTime)

    return {
      ...response.data,
      clientLatencyMs: latencyMs,
    }
  },

  // Chatbot interaktif dengan Google Gemini (SNI Auditor) via Flask API
  async chatWithLLM(message, history = [], inspectionContext = null, apiKey = null) {
    const payload = {
      message,
      history,
      inspection_context: inspectionContext,
    }
    if (apiKey) {
      payload.api_key = apiKey
    }

    const response = await eggApiClient.post('/api/v1/chat', payload)
    return response.data
  },
}


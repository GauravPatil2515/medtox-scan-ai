// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const ENV = process.env.REACT_APP_ENV || 'development';

export const config = {
  apiUrl: API_URL,
  environment: ENV,
  isProduction: ENV === 'production',
  isDevelopment: ENV === 'development',
  
  // API Endpoints
  endpoints: {
    health: `${API_URL}/api/health`,
    predict: `${API_URL}/api/predict`,
    predictBatch: `${API_URL}/api/predict/batch`,
    endpoints: `${API_URL}/api/endpoints`,
    analyzeImageVision: `${API_URL}/api/analyze-image-vision`,
    analyzeChemicalText: `${API_URL}/api/analyze-chemical-text`,
    chemicalNameToSmiles: `${API_URL}/api/chemical-name-to-smiles`,
    naturalLanguageToChemical: `${API_URL}/api/natural-language-to-chemical`,
    chatAsk: `${API_URL}/api/chat/ask`,
    aiAnalyze: `${API_URL}/api/ai/analyze`,
    aiExplain: (endpointId) => `${API_URL}/api/ai/explain/${endpointId}`,
    aiSuggestModifications: `${API_URL}/api/ai/suggest-modifications`,
    stats: `${API_URL}/api/stats`,
    predictions: `${API_URL}/api/predictions`,
    analytics: `${API_URL}/api/analytics`,
    downloadResults: `${API_URL}/api/download/results`,
    modelsStatus: `${API_URL}/api/models/status`,
    molecules: `${API_URL}/api/molecules`,
  },
  
  // Request configuration
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Helper function for API calls
export const apiCall = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export default config;

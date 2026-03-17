// Prediction service for fake news detection API

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Make authenticated API request
 */
const apiRequest = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);

    let data = {};
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        data = {};
      }
    }

    if (!response.ok) {
      let errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
      // Provide more helpful error message
      if (response.status === 500) {
        errorMessage = 'Server error. Please ensure: 1) MongoDB is running, 2) Flask ML backend is running on port 5000, 3) Backend is running on port 8000';
      }
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8000');
    }
    throw error;
  }
};

/**
 * Submit news text for fake news detection analysis
 * @param {string} text - The news article or statement to analyze
 * @returns {Promise<Object>} - Prediction result from ML backend
 */
export const analyzeNews = async (text) => {
  try {
    const response = await apiRequest('/predict', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });

    if (response.success && response.data) {
      return {
        prediction: response.data.finalLabel,
        confidence_percentage: response.data.confidencePercentage,
        confidence_level: response.data.confidenceLevel,
        key_influential_words: response.data.keyInfluentialWords,
        explanation_note: response.data.explanationNote,
        analysisId: response.data._id,
        timestamp: response.data.createdAt,
      };
    }

    throw new Error(response.message || 'Prediction failed');
  } catch (error) {
    console.error('Error analyzing news:', error);
    throw error;
  }
};

/**
 * Get prediction history for current user
 * @returns {Promise<Array>} - Array of past predictions
 */
export const getPredictionHistory = async () => {
  try {
    const response = await apiRequest('/history', {
      method: 'GET',
    });

    return response.success ? response.data : [];
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

/**
 * Delete a prediction from history
 * @param {string} id - The prediction ID to delete
 * @returns {Promise<Object>} - Deletion result
 */
export const deletePrediction = async (id) => {
  try {
    const response = await apiRequest(`/history/${id}`, {
      method: 'DELETE',
    });

    return response;
  } catch (error) {
    console.error('Error deleting prediction:', error);
    throw error;
  }
};

export default {
  analyzeNews,
  getPredictionHistory,
  deletePrediction,
};

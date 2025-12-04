// Use proxy in development (relative URL) or full URL from env
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set token in localStorage
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// Helper function to remove token from localStorage
const removeToken = () => {
  localStorage.removeItem('token');
};

// Helper function to make authenticated requests
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
    credentials: 'include', // Include cookies for cross-origin requests
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    // Try to parse JSON response
    let data = {};
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch (parseError) {
        // If JSON parsing fails, use empty object
        data = {};
      }
    }
    
    // Handle error responses
    if (!response.ok) {
      // Extract error message from response
      let errorMessage = data.message || data.error;
      
      // Provide more helpful error messages based on status code
      if (response.status === 500) {
        if (!errorMessage || errorMessage === 'Error in signup' || errorMessage === 'Error in login') {
          errorMessage = 'Server error occurred. Please check: 1) Database is connected, 2) Environment variables (JWT_SECRET, MONGODB_URL) are set, 3) Backend dependencies are installed. Check backend console for details.';
        } else {
          errorMessage = `Server error: ${errorMessage}`;
        }
      } else {
        errorMessage = errorMessage || `Request failed with status ${response.status}`;
      }
      
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    // Handle network errors (server not reachable, CORS issues, etc.)
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8000');
    }
    // Re-throw other errors with their messages (including backend error messages)
    throw error;
  }
};

// Signup function
export const signup = async (name, email, password) => {
  try {
    const response = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (response.success && response.token) {
      setToken(response.token);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// Login function
export const login = async (email, password) => {
  try {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.token) {
      setToken(response.token);
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    await apiRequest('/auth/logout', {
      method: 'POST',
    });
    removeToken();
    return { success: true };
  } catch (error) {
    // Even if the API call fails, remove token locally
    removeToken();
    throw error;
  }
};

// Get current user
export const getMe = async () => {
  try {
    const response = await apiRequest('/auth/me', {
      method: 'GET',
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Export token management functions
export { getToken, setToken, removeToken };


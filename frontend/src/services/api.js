import axios from 'axios'

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Simple cache for API responses
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add cache key for GET requests
    if (config.method === 'get') {
      config.cacheKey = `${config.baseURL}${config.url}`;
      
      // Check cache for GET requests
      const cached = apiCache.get(config.cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        // Return cached data
        config.useCached = true;
        config.cachedData = cached.data;
      }
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Handle cached responses
api.interceptors.response.use(
  (response) => {
    // Cache GET responses
    if (response.config.method === 'get' && response.config.cacheKey) {
      apiCache.set(response.config.cacheKey, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    return response;
  },
  (error) => {
    const originalRequest = error.config
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      localStorage.removeItem('token')
      window.location.href = '/login'
      return Promise.reject(error)
    }
    
    // Handle server errors
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data)
    }
    
    return Promise.reject(error)
  }
)

// Clear cache function for invalidating stale data
api.clearCache = (pattern = null) => {
  if (pattern) {
    // Clear specific cache entries matching pattern
    for (const key of apiCache.keys()) {
      if (key.includes(pattern)) {
        apiCache.delete(key);
      }
    }
  } else {
    // Clear all cache
    apiCache.clear();
  }
};

export default api
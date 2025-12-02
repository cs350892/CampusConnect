/**
 * Get the API base URL for backend requests
 * Automatically appends /api to production URL
 * @returns {string} Complete API base URL with /api suffix
 */
export const getApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  
  if (baseUrl) {
    // Production: append /api to base URL
    return `${baseUrl}/api`;
  }
  
  // Development: default localhost with /api
  return 'http://localhost:5000/api';
};

export default getApiUrl;

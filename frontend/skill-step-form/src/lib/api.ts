/**
 * API Service for Resume Backend
 * Handles all HTTP requests to the Django backend
 */

// Force the correct API base URL since env vars aren't working in Docker
const API_BASE_URL = 'http://localhost:8000/api';

// Log the API base URL for debugging
console.log('API Base URL:', API_BASE_URL);
console.log('Environment VITE_API_URL:', import.meta.env.VITE_API_URL);

// Helper function to convert camelCase to snake_case
const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

// Helper function to convert snake_case to camelCase
const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

// Helper function to convert object keys from camelCase to snake_case recursively
const camelToSnakeObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => camelToSnakeObject(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = camelToSnake(key);
      acc[snakeKey] = camelToSnakeObject(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

// Helper function to convert object keys from snake_case to camelCase recursively
const snakeToCamelObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => snakeToCamelObject(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = snakeToCamel(key);
      acc[camelKey] = snakeToCamelObject(obj[key]);
      return acc;
    }, {} as any);
  }
  return obj;
};

// Get tokens from localStorage
const getTokens = () => {
  const tokens = localStorage.getItem('tokens');
  return tokens ? JSON.parse(tokens) : null;
};

// Get access token
const getAccessToken = () => {
  const tokens = getTokens();
  return tokens?.access || null;
};

// Create headers with authentication
const createHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAccessToken();
    console.log('Access token:', token ? 'Token exists' : 'No token found');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Handle API errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    
    // Special handling for authentication errors
    if (response.status === 401) {
      throw new Error('You must be logged in to perform this action. Please log in and try again.');
    }
    
    throw new Error(error.error || error.detail || `HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  // Convert snake_case response to camelCase
  return snakeToCamelObject(data);
};

// ============================================
// Authentication APIs
// ============================================

export const authAPI = {
  /**
   * Register a new user
   */
  register: async (data: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Login user
   */
  login: async (data: { username: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Logout user
   */
  logout: async (refreshToken: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify({ refresh: refreshToken }),
    });
    return handleResponse(response);
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: createHeaders(false),
      body: JSON.stringify({ refresh: refreshToken }),
    });
    return handleResponse(response);
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },
};

// ============================================
// Resume APIs
// ============================================

export interface ResumeData {
  personalInfo: {
    firstName: string;
    lastName: string;
    professionalTitle?: string;
    profileImage?: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
    summary?: string;
    interests?: Array<{ interest: string }>;
  };
  workExperience?: Array<{
    position: string;
    company: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    technologies?: Array<{ technology: string }>;
    competencies?: Array<{ competency: string }>;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    field?: string;
    keyCourses?: Array<{ course: string }>;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: Array<{ technology: string }>;
    startDate?: string;
    endDate?: string;
    link?: string;
  }>;
  certificates?: Array<{
    name?: string;
    organization?: string;
    issueDate?: string;
    expirationDate?: string;
    credentialId?: string;
    url?: string;
  }>;
  languages?: Array<{
    language: string;
    proficiency: string;
  }>;
  skills?: Array<{
    skill: string;
  }>;
}

export interface Resume extends ResumeData {
  id: string;
  created_at: string;
  updated_at: string;
}

export const resumeAPI = {
  /**
   * Get all resumes for the authenticated user
   */
  getAll: async (): Promise<Resume[]> => {
    const response = await fetch(`${API_BASE_URL}/resumes/`, {
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  /**
   * Get a specific resume by ID
   */
  getById: async (id: string): Promise<Resume> => {
    const response = await fetch(`${API_BASE_URL}/resumes/${id}/`, {
      headers: createHeaders(true),
    });
    return handleResponse(response);
  },

  /**
   * Create a new resume
   */
  create: async (data: ResumeData): Promise<Resume> => {
    // Convert camelCase to snake_case for backend
    const snakeCaseData = camelToSnakeObject(data);
    
    const response = await fetch(`${API_BASE_URL}/resumes/`, {
      method: 'POST',
      headers: createHeaders(true),
      body: JSON.stringify(snakeCaseData),
    });
    return handleResponse(response);
  },

  /**
   * Update an existing resume
   */
  update: async (id: string, data: ResumeData): Promise<Resume> => {
    // Convert camelCase to snake_case for backend
    const snakeCaseData = camelToSnakeObject(data);
    
    const response = await fetch(`${API_BASE_URL}/resumes/${id}/`, {
      method: 'PUT',
      headers: createHeaders(true),
      body: JSON.stringify(snakeCaseData),
    });
    return handleResponse(response);
  },

  /**
   * Delete a resume
   */
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/resumes/${id}/`, {
      method: 'DELETE',
      headers: createHeaders(true),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Failed to delete resume');
    }
  },
};

// ============================================
// Health Check
// ============================================

export const healthAPI = {
  /**
   * Check if API is running
   */
  check: async () => {
    const response = await fetch(`${API_BASE_URL}/health/`, {
      headers: createHeaders(false),
    });
    return handleResponse(response);
  },
};

// Export everything as default for convenience
export default {
  auth: authAPI,
  resume: resumeAPI,
  health: healthAPI,
};


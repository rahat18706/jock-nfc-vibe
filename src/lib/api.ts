// API Client - Centralized API communication layer

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API Error class
export class ApiError extends Error {
  code: string;
  status: number;
  details?: any;

  constructor(message: string, code: string, status: number, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// Base fetch wrapper
async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    credentials: 'include', // Include cookies for authentication
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // Handle error responses
    if (!response.ok || data.success === false) {
      const errorMessage = data.error?.message || data.message || 'An error occurred';
      const errorCode = data.error?.code || 'UNKNOWN_ERROR';
      
      throw new ApiError(
        errorMessage,
        errorCode,
        response.status,
        data.error?.details
      );
    }

    return data;
  } catch (error) {
    // If it's already an ApiError, rethrow it
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Network error. Please check your connection.',
        'NETWORK_ERROR',
        0
      );
    }

    // Handle other errors
    throw new ApiError(
      'An unexpected error occurred',
      'UNKNOWN_ERROR',
      500
    );
  }
}

// ============================================
// AUTHENTICATION API
// ============================================

export const authApi = {
  // Login
  login: async (username: string, password: string) => {
    return fetchApi<{
      success: boolean;
      data: {
        user: {
          id: string;
          username: string;
          email: string;
          fullName: string;
          role: 'admin' | 'business';
          businessId?: string;
        };
        token: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  // Logout
  logout: async () => {
    return fetchApi<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    });
  },

  // Get current user
  getMe: async () => {
    return fetchApi<{
      success: boolean;
      data: {
        user: {
          id: string;
          username: string;
          email: string;
          fullName: string;
          role: 'admin' | 'business';
          businessId?: string;
        };
      };
    }>('/auth/me');
  },
};

// ============================================
// BUSINESS API
// ============================================

export const businessApi = {
  // Get my business
  getMyBusiness: async () => {
    return fetchApi<{
      success: boolean;
      data: {
        business: {
          _id: string;
          name: string;
          slug: string;
          category: string;
          description?: string;
          address?: {
            street?: string;
            city?: string;
            state?: string;
            zipCode?: string;
            country?: string;
          };
          phone?: string;
          website?: string;
          logo?: string;
          isActive: boolean;
          isSuspended: boolean;
          plan: string;
          createdAt: string;
          updatedAt: string;
        };
      };
    }>('/businesses/my');
  },

  // Update my business
  updateMyBusiness: async (data: {
    name?: string;
    description?: string;
    phone?: string;
    website?: string;
    address?: any;
  }) => {
    return fetchApi<{
      success: boolean;
      data: { business: any };
      message: string;
    }>('/businesses/my', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Get my cards
  getMyCards: async () => {
    return fetchApi<{
      success: boolean;
      data: {
        cards: Array<{
          _id: string;
          cardId: string;
          label: string;
          destinationUrl: string;
          isActive: boolean;
          stats?: {
            totalScans: number;
            todayScans: number;
            weekScans: number;
            monthScans: number;
          };
          createdAt: string;
          updatedAt: string;
        }>;
      };
    }>('/businesses/my/cards');
  },

  // Update card destination
  updateCardDestination: async (cardId: string, destinationUrl: string) => {
    return fetchApi<{
      success: boolean;
      data: {
        card: {
          _id: string;
          cardId: string;
          destinationUrl: string;
        };
        message: string;
      };
    }>(`/businesses/cards/${cardId}/destination`, {
      method: 'PUT',
      body: JSON.stringify({ destinationUrl }),
    });
  },
};

// ============================================
// ADMIN API
// ============================================

export const adminApi = {
  // Get platform stats
  getStats: async () => {
    return fetchApi<{
      success: boolean;
      data: {
        stats: {
          totalBusinesses: number;
          totalUsers: number;
          totalCards: number;
          totalOrders: number;
          totalScans: number;
          totalRevenue: number;
        };
        recentOrders: any[];
      };
    }>('/admin/stats');
  },

  // Get all businesses
  getBusinesses: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    
    return fetchApi<{
      success: boolean;
      data: {
        businesses: Array<{
          _id: string;
          name: string;
          slug: string;
          category: string;
          owner: {
            _id: string;
            username: string;
            email: string;
            fullName: string;
          };
          isActive: boolean;
          isSuspended: boolean;
          createdAt: string;
        }>;
        total: number;
        page: number;
        pages: number;
      };
    }>(`/admin/businesses${queryString ? `?${queryString}` : ''}`);
  },

  // Create business
  createBusiness: async (data: {
    username: string;
    password: string;
    email: string;
    fullName: string;
    businessName: string;
    category: string;
  }) => {
    return fetchApi<{
      success: boolean;
      data: {
        business: any;
        credentials: {
          username: string;
          password: string;
        };
      };
      message: string;
    }>('/admin/businesses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all cards
  getCards: async () => {
    return fetchApi<{
      success: boolean;
      data: {
        cards: Array<{
          _id: string;
          cardId: string;
          label: string;
          business: {
            _id: string;
            name: string;
          } | null;
          destinationUrl: string;
          isActive: boolean;
          stats?: {
            totalScans: number;
          };
          createdAt: string;
        }>;
      };
    }>('/admin/cards');
  },

  // Create card
  createCard: async (data: {
    cardId: string;
    businessId?: string;
    label?: string;
    destinationUrl?: string;
  }) => {
    return fetchApi<{
      success: boolean;
      data: { card: any };
      message: string;
    }>('/admin/cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Assign card to business
  assignCard: async (cardId: string, businessId: string) => {
    return fetchApi<{
      success: boolean;
      data: { card: any };
      message: string;
    }>(`/admin/cards/${cardId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ businessId }),
    });
  },
};

// ============================================
// ANALYTICS API
// ============================================

export const analyticsApi = {
  // Get overview stats
  getOverview: async () => {
    return fetchApi<{
      success: boolean;
      data: {
        totalScans: number;
        todayScans: number;
        weekScans: number;
        monthScans: number;
        uniqueVisitors: number;
        totalCards: number;
      };
    }>('/analytics/overview');
  },
};

// Export all APIs
export default {
  auth: authApi,
  business: businessApi,
  admin: adminApi,
  analytics: analyticsApi,
};

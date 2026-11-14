const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      let errorMsg = `Server error (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMsg = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
        }
      } catch (e) {
        // use default status error
      }
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      throw new Error('Unable to connect to TruthGuard AI backend. Check VITE_API_URL environment variable or ensure backend is running.');
    }
    throw err;
  }
}

export const api = {
  // Analyze text or headline
  analyzeNews: (text, inputType = 'auto') => {
    return request('/analyze', {
      method: 'POST',
      body: JSON.stringify({ text, input_type: inputType }),
    });
  },

  // Analyze news article URL
  analyzeUrl: (url) => {
    return request('/analyze-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  },

  // History operations
  getHistory: (skip = 0, limit = 50) => {
    return request(`/history?skip=${skip}&limit=${limit}`);
  },

  getHistoryById: (id) => {
    return request(`/history/${id}`);
  },

  deleteHistoryItem: (id) => {
    return request(`/history/${id}`, {
      method: 'DELETE',
    });
  },

  clearAllHistory: () => {
    return request('/history', {
      method: 'DELETE',
    });
  },

  // Analytics stats
  getDashboardStats: () => {
    return request('/dashboard/stats');
  },

  // Backend health & integration state
  getHealth: () => {
    return request('/health');
  },
};

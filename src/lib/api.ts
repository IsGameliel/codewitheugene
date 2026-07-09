const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    let response: Response;

    try {
      response = await fetch(url, config);
    } catch {
      throw new Error(`Cannot reach API at ${this.baseURL}. Make sure the backend server is running.`);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async register(email: string, password: string, fullName: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, fullName }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Blog methods
  async getBlogPosts(page = 1, limit = 10) {
    return this.request(`/blog?page=${page}&limit=${limit}`);
  }

  async getBlogPost(id: string) {
    return this.request(`/blog/${id}`);
  }

  async createBlogPost(post: {
    title: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    isPublished: boolean;
  }) {
    return this.request('/blog', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async updateBlogPost(id: string, post: {
    title: string;
    content: string;
    excerpt: string;
    coverImage?: string;
    isPublished: boolean;
  }) {
    return this.request(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  }

  // Admin blog methods
  async getAllBlogPosts() {
    return this.request('/blog/admin/all');
  }

  // Courses methods
  async getCourses() {
    return this.request('/courses');
  }

  async getCourse(id: string) {
    return this.request(`/courses/${id}`);
  }

  async createCourse(course: any) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(course),
    });
  }

  async updateCourse(id: string, course: any) {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(course),
    });
  }

  async deleteCourse(id: string) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Admin user methods
  async getAllUsers() {
    return this.request('/auth/admin/users');
  }

  async updateUserRole(id: string, role: string) {
    return this.request(`/auth/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/auth/admin/users/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

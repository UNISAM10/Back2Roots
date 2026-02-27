/**
 * API Configuration and Helper Functions
 */

const API_BASE_URL = 'http://localhost:5000/api';

class APIClient {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.token = localStorage.getItem('token');
    }

    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseURL}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (this.token) {
            options.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Request failed');
            }

            return result;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(email, password) {
        return this.request('/auth/login', 'POST', { email, password });
    }

    async register(userData) {
        return this.request('/auth/register', 'POST', userData);
    }

    async getProfile() {
        return this.request('/auth/profile', 'GET');
    }

    async updateProfile(profileData) {
        return this.request('/auth/profile', 'PUT', profileData);
    }

    async changePassword(oldPassword, newPassword) {
        return this.request('/auth/change-password', 'POST', {
            old_password: oldPassword,
            new_password: newPassword
        });
    }

    async verifyToken() {
        return this.request('/auth/verify-token', 'GET');
    }

    // Student endpoints
    async getStudentDashboard() {
        return this.request('/student/dashboard', 'GET');
    }

    async getStudentProfile() {
        return this.request('/student/profile'

/**
 * Authentication Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Check if user is already logged in
    if (apiClient.isAuthenticated()) {
        apiClient.verifyToken()
            .then(response => {
                // Redirect based on role
                const role = response.user.role;
                if (role === 'student') {
                    window.location.href = 'student.html';
                } else if (role === 'alumni') {
                    window.location.href = 'alumni.html';
                } else if (role === 'admin') {
                    window.location.href = 'admin.html';
                }
            })
            .catch(() => {
                apiClient.clearToken();
            });
    }
});

function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.classList.toggle('hidden');
    registerForm.classList.toggle('hidden');

    // Reset forms
    document.getElementById('loginFormElement').reset();
    document.getElementById('registerFormElement').reset();
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await apiClient.login(email, password);
        
        apiClient.setToken(response.token);
        showNotification('Login successful!', 'success');

        // Redirect based on role
        setTimeout(() => {
            const role = response.user.role;
            if (role === 'student') {

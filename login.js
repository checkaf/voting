document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Check credentials
        if (username === 'admin' && password === '321') {
            // Set login status
            sessionStorage.setItem('adminLoggedIn', 'true');
            // Redirect to admin page
            window.location.replace('admin.html');
        } else {
            // Show error message
            errorMessage.textContent = 'Invalid username or password';
            errorMessage.classList.remove('hidden');
        }
    });
}); 
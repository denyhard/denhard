// public/js/login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    isAuthenticatedUser();
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('jwt', data.token);
                    window.location.href = 'admin.html'; // Redirect ke user dashboard
                } else {
                    alert('Login failed!');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Login failed!');
            });
        });
    }
});

// public/js/register.js
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    isAuthenticatedUser();
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const institusi = document.getElementById('institusi').value;
            fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, institusi })
            })
            .then(response => response.json())
            .then(data => {
                alert('Registration successful!');
                window.location.href = 'login.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Registration failed!');
            });
        });
    }
});

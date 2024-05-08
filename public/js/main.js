// public/js/main.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    // Simpan token di localStorage dan redirect
                    localStorage.setItem('jwt', data.token);
                    window.location.href = '/user.html';
                } else {
                    alert('Login failed!');
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    // Anda bisa menambahkan lebih banyak fungsi untuk register, admin, dan user pages
});


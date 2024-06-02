// public/js/auth.js
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}


function isAuthenticated() {
    const token = localStorage.getItem('jwt');
    if (!token) {
        window.location.href = 'login.html'; // Redirect ke login jika tidak ada token
    } else {
        return true
    }
    
}

function isAuthenticatedUser() {
    const token = localStorage.getItem('jwt');
    console.log(token)
    if (token) {
        window.location.href = 'user.html'; // Redirect ke login jika tidak ada token
    }
}

function isAdmin() {
    const token = localStorage.getItem('jwt');
    if (token) {
        const payload = parseJwt(token);
        // console.log(payload)
        if (payload.admin) {
            return true;
        }
    }
    // window.location.href = 'login.html';  // Redirect to login if not admin
    return false;
}

function logout() {
    localStorage.removeItem('jwt');
    window.location.href = 'index.html';
}

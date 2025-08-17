// auth.js - Handles registration, login, and credential storage

// Register logic
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        if(name === '' || email === '' || password === '') {
            document.getElementById('registerMsg').textContent = 'Please fill in all fields.';
            return;
        }
        // Save credentials to localStorage
        localStorage.setItem('fh_user', JSON.stringify({ name, email, password }));
        document.getElementById('registerMsg').style.color = '#2d8a34';
        document.getElementById('registerMsg').textContent = 'Registration successful!';
        setTimeout(()=>window.location.href='login.html',1200);
    });
}

// Login logic
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const remember = document.getElementById('rememberMe') ? document.getElementById('rememberMe').checked : false;
        if(email === '' || password === '') {
            document.getElementById('loginMsg').textContent = 'Please fill in all fields.';
            return;
        }
        const user = JSON.parse(localStorage.getItem('fh_user'));
        if(user && user.email === email && user.password === password) {
            document.getElementById('loginMsg').style.color = '#2d8a34';
            document.getElementById('loginMsg').textContent = 'Login successful!';
            if(remember) {
                localStorage.setItem('fh_remember', email);
            } else {
                localStorage.removeItem('fh_remember');
            }
            setTimeout(()=>window.location.href='index.html',1200);
        } else {
            document.getElementById('loginMsg').style.color = '#e53935';
            document.getElementById('loginMsg').textContent = 'Invalid credentials.';
        }
    });
    // Autofill if remembered
    window.addEventListener('DOMContentLoaded', function() {
        const remembered = localStorage.getItem('fh_remember');
        if(remembered) {
            document.getElementById('loginEmail').value = remembered;
            document.getElementById('rememberMe').checked = true;
        }
    });
}

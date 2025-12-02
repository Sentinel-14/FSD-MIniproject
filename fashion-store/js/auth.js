// Fashion Store Authentication System
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('fashionStore_users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('fashionStore_currentUser')) || null;
        this.initializeEventListeners();
        this.createDemoUser();
    }

    initializeEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
            
            // Real-time password strength checker
            const passwordInput = document.getElementById('signupPassword');
            if (passwordInput) {
                passwordInput.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
            }

            // Real-time password confirmation
            const confirmPasswordInput = document.getElementById('confirmPassword');
            if (confirmPasswordInput) {
                confirmPasswordInput.addEventListener('input', () => this.checkPasswordMatch());
            }
        }
    }

    // Create demo user for testing
    createDemoUser() {
        if (this.users.length === 0) {
            const demoUser = {
                id: 1,
                fullName: 'Demo User',
                email: 'demo@fashionista.com',
                password: 'demo123',
                createdAt: new Date().toISOString()
            };
            this.users.push(demoUser);
            localStorage.setItem('fashionStore_users', JSON.stringify(this.users));
        }
    }

    // Validation functions
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validatePassword(password) {
        return password.length >= 6;
    }

    validateName(name) {
        return name.trim().length >= 2;
    }

    // Password strength checker
    checkPasswordStrength(password) {
        const strengthElement = document.getElementById('passwordStrength');
        const passwordInput = document.getElementById('signupPassword');
        
        if (!strengthElement || !password) {
            if (strengthElement) strengthElement.style.display = 'none';
            return;
        }

        strengthElement.style.display = 'block';
        
        let strength = 0;
        let message = '';
        
        if (password.length >= 6) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;

        if (strength < 3) {
            strengthElement.className = 'password-strength weak';
            message = 'Weak password - Try adding uppercase, numbers, or symbols';
            passwordInput.classList.remove('valid');
            passwordInput.classList.add('invalid');
        } else if (strength < 4) {
            strengthElement.className = 'password-strength medium';
            message = 'Medium strength - Good but could be stronger';
            passwordInput.classList.remove('invalid');
            passwordInput.classList.add('valid');
        } else {
            strengthElement.className = 'password-strength strong';
            message = 'Strong password - Excellent!';
            passwordInput.classList.remove('invalid');
            passwordInput.classList.add('valid');
        }

        strengthElement.textContent = message;
    }

    // Check password confirmation match
    checkPasswordMatch() {
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const confirmInput = document.getElementById('confirmPassword');
        const errorElement = document.getElementById('confirmError');

        if (confirmPassword && password !== confirmPassword) {
            confirmInput.classList.add('invalid');
            confirmInput.classList.remove('valid');
            errorElement.textContent = 'Passwords do not match';
        } else if (confirmPassword) {
            confirmInput.classList.remove('invalid');
            confirmInput.classList.add('valid');
            errorElement.textContent = '';
        }
    }

    // Show error message
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    // Clear all errors
    clearErrors() {
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => element.textContent = '');
        
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => input.classList.remove('invalid', 'valid'));
    }

    // Handle signup form submission
    handleSignup(e) {
        e.preventDefault();
        this.clearErrors();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('signupEmail').value.toLowerCase().trim();
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        let isValid = true;

        // Validate full name
        if (!this.validateName(fullName)) {
            this.showError('nameError', 'Please enter a valid name (at least 2 characters)');
            document.getElementById('fullName').classList.add('invalid');
            isValid = false;
        }

        // Validate email
        if (!this.validateEmail(email)) {
            this.showError('emailError', 'Please enter a valid email address');
            document.getElementById('signupEmail').classList.add('invalid');
            isValid = false;
        }

        // Check if email already exists
        if (this.users.find(user => user.email === email)) {
            this.showError('emailError', 'Email already registered. Please use a different email.');
            document.getElementById('signupEmail').classList.add('invalid');
            isValid = false;
        }

        // Validate password
        if (!this.validatePassword(password)) {
            this.showError('passwordError', 'Password must be at least 6 characters long');
            document.getElementById('signupPassword').classList.add('invalid');
            isValid = false;
        }

        // Check password confirmation
        if (password !== confirmPassword) {
            this.showError('confirmError', 'Passwords do not match');
            document.getElementById('confirmPassword').classList.add('invalid');
            isValid = false;
        }

        // Check terms agreement
        if (!agreeTerms) {
            alert('Please agree to the Terms & Conditions');
            isValid = false;
        }

        if (!isValid) return;

        // Create new user
        const newUser = {
            id: Date.now(),
            fullName: fullName,
            email: email,
            password: password, // In real app, this should be hashed
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('fashionStore_users', JSON.stringify(this.users));

        // Show success message
        const successElement = document.getElementById('signupSuccess');
        successElement.style.display = 'block';
        
        // Reset form
        e.target.reset();
        this.clearErrors();

        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    // Handle login form submission
    handleLogin(e) {
        e.preventDefault();
        this.clearErrors();

        const email = document.getElementById('loginEmail').value.toLowerCase().trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        let isValid = true;

        // Validate email
        if (!this.validateEmail(email)) {
            this.showError('emailError', 'Please enter a valid email address');
            document.getElementById('loginEmail').classList.add('invalid');
            isValid = false;
        }

        // Validate password
        if (!password) {
            this.showError('passwordError', 'Please enter your password');
            document.getElementById('loginPassword').classList.add('invalid');
            isValid = false;
        }

        if (!isValid) return;

        // Find user
        const user = this.users.find(u => u.email === email && u.password === password);

        if (!user) {
            this.showError('emailError', 'Invalid email or password');
            this.showError('passwordError', 'Please check your credentials');
            document.getElementById('loginEmail').classList.add('invalid');
            document.getElementById('loginPassword').classList.add('invalid');
            return;
        }

        // Login successful
        this.currentUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem('fashionStore_currentUser', JSON.stringify(this.currentUser));

        // Show success message
        const successElement = document.getElementById('loginSuccess');
        successElement.style.display = 'block';

        // Redirect to home page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Logout functionality
    logout() {
        this.currentUser = null;
        localStorage.removeItem('fashionStore_currentUser');
        window.location.href = 'index.html';
    }

    // Get current user info
    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize authentication system when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
    
    // Update homepage if user is logged in
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        updateHomepageForUser();
    }
});

// Update homepage for logged-in users
function updateHomepageForUser() {
    const currentUser = window.authSystem?.getCurrentUser();
    const loginBtn = document.querySelector('.login-btn');
    
    if (currentUser && loginBtn) {
        // Replace login button with user welcome message
        loginBtn.innerHTML = `👋 Hi, ${currentUser.fullName.split(' ')[0]}!`;
        loginBtn.href = '#';
        loginBtn.style.background = '#28a745';
        loginBtn.style.borderRadius = '20px';
        loginBtn.style.padding = '8px 20px';
        
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm(`Hello ${currentUser.fullName}! Do you want to logout?`)) {
                window.authSystem.logout();
            }
        });
    }
}

// Add smooth scrolling for better UX
if (typeof window !== 'undefined') {
    // Add smooth scrolling to CSS if not already added
    if (!document.querySelector('style[data-smooth-scroll]')) {
        const style = document.createElement('style');
        style.setAttribute('data-smooth-scroll', 'true');
        style.textContent = 'html { scroll-behavior: smooth; }';
        document.head.appendChild(style);
    }
}

console.log('🎉 Fashion Store Authentication System Loaded!');
console.log('📧 Demo Login: demo@fashionista.com');
console.log('🔑 Demo Password: demo123');
/* document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('loginForm');
            const togglePassword = document.getElementById('togglePassword');
            const passwordInput = document.getElementById('password');
            
            // Toggle password visibility
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.textContent = type === 'password' ? '👁️' : '🔒';
            });
            
            // Form validation
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                let isValid = true;
                
                // Validate username
                const username = document.getElementById('username');
                const usernameError = document.getElementById('usernameError');
                if (username.value.trim() === '') {
                    showError(username, usernameError, 'ব্যবহারকারীর নাম প্রয়োজন');
                    isValid = false;
                } else {
                    hideError(username, usernameError);
                }
                
                // Validate password
                const password = document.getElementById('password');
                const passwordError = document.getElementById('passwordError');
                if (password.value === '') {
                    showError(password, passwordError, 'পাসওয়ার্ড প্রয়োজন');
                    isValid = false;
                } else if (password.value.length < 6) {
                    showError(password, passwordError, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
                    isValid = false;
                } else {
                    hideError(password, passwordError);
                }
                
                // If form is valid, show success message
                if (isValid) {
                    // Show loading state
                    const btn = form.querySelector('.btn');
                    btn.textContent = 'লগইন হচ্ছে...';
                    btn.disabled = true;
                    
                    // Simulate API call
                    setTimeout(function() {
                        alert('লগইন সফল! AKN সিস্টেমে স্বাগতম।');
                        form.reset();
                        btn.textContent = 'লগইন করুন';
                        btn.disabled = false;
                    }, 1500);
                }
            });
            
            // Helper functions for error handling
            function showError(input, errorElement, message) {
                errorElement.textContent = message;
                errorElement.style.display = 'block';
                input.classList.add('invalid');
            }
            
            function hideError(input, errorElement) {
                errorElement.style.display = 'none';
                input.classList.remove('invalid');
            }
            
            // Real-time validation
            document.getElementById('username').addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    hideError(this, document.getElementById('usernameError'));
                }
            });
            
            document.getElementById('password').addEventListener('input', function() {
                if (this.value.length >= 6) {
                    hideError(this, document.getElementById('passwordError'));
                }
            });
        }); */
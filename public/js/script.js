document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const nav = document.getElementById('hamb');

  if (togglePassword && passwordInput) { // check existence
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.textContent = type === 'password' ? '👁️' : '🔒';
    });
  }
  
  if(!nav) return;
  
  nav.addEventListener('click', function() {
    
    console.log("nav")
    
  })
  
});



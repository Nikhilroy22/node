document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  

  if (togglePassword && passwordInput) { // check existence
    togglePassword.addEventListener('click', function() {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      this.textContent = type === 'password' ? '👁️' : '🔒';
    });
  }
  
 
  
});

// Network status
const statusEl = document.getElementById('statusnet');
window.addEventListener('online', () =>{ statusEl.textContent = 'Online ✅'
;
  console.log("net");
});

window.addEventListener('offline', () => statusEl.textContent = 'Offline ❌');
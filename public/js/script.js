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



async function frdata(){
  try{
  const res = await fetch("https://1xbet86.com/LiveFeed/Get1x2_VZip?count=50&lng=en_GB&gr=54&antisports=4&antisports=16&mode=4&country=19&getEmpty=true",  {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",     // বা অন্য header প্রয়োজনে
      "Accept": "application/json"
    }
  });
  const data = res.json();
  console.log(data);
  }catch(e){
  console.log(e);
    
    
  }
}
frdata();

const bb = document.body;
const sidenavmodal = document.getElementById("sidenav");
const showsidenavmodal = document.getElementById("hamb");
const closesidenav = document.getElementById("closenav");

showsidenavmodal.onclick = (e) => { 
 // console.log("show");
  if(e.target===showsidenavmodal){
  sidenavmodal.style.display = "block";
    
  }
  }

window.onclick = (e) => { 
  if(e.target===sidenavmodal){
  sidenavmodal.style.display = "none";}
  }
closesidenav.onclick = (e) => { 
  if(e.target===closesidenav){
  sidenavmodal.style.display = "none";}
  }

//console.log(sidenavmodal);



if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/js/worker.js')
      .then(reg => console.log('Service Worker registered:', reg))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

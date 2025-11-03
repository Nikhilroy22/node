
const bb = document.body;

async function ftt(){
  try{
const res = await fetch("/",{
    method: "GET",
    headers: {
      
      "Accept": "application/json"
    }
  })
const data = await res.json();
data.kalal = "janu";
console.log(data)
  if(data != null){
  alert(data.Amount);
}

}catch(err){
  
  console.log(err);
  
  
}
}
// ftt();

function greet(name) {
  if (typeof name !== "string") {
    throw new TypeError("argument 'name' must be a string");
  }
  console.log("Hello " + name);
}

//greet("Nikhil"); // ✅ ঠিক আছে
//greet(123);      // ❌ TypeError: argument 'name' must be a string

let i = 0;
i++

console.log(i)
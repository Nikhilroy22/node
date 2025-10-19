async function kalabd(){
  
  const url = "http://localhost:3000/res";

const fdata = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",     // বা অন্য header প্রয়োজনে
      "Accept": "application/json"
    }
  });
const jjj = await fdata.json();

setTimeout(kalabd, 2000)
console.log(jjj);
}
kalabd();
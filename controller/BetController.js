

//Bet Home Page

exports.bethome = (req, res) => {
  
  res.render('bet');
}


//Place Bet Post
exports.placeBet = (req, res) => {
  
  res.json('bet');
}


// Bet json API
exports.betapi = async(req, res) =>{
  const url = "https://1xbet86.com/LiveFeed/Get1x2_VZip?sports=16&count=50&lng=en&gr=54&antisports=4&mode=4&country=19&getEmpty=true";

const fdata = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",     // বা অন্য header প্রয়োজনে
      "Accept": "application/json"
    }
  });
const jjj = await fdata.json();
res.json(jjj);
  
}
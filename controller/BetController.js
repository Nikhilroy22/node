

// Place Bet (POST)
// controllers/betController.js


exports.placeBet = async (req, res) => {
  try {
    const { matchId, team, label, amount, odds } = req.body;

    if (!matchId) return res.status(400).json({ success: false, message: "❌ ম্যাচ আইডি দিতে হবে!" });
    if (!amount || isNaN(amount) || amount <= 0) return res.status(400).json({ success: false, message: "❌ সঠিক টাকার পরিমাণ দিন!" });

    const url = "https://22play8.com/LiveFeed/Get1x2_VZip?sports=4&count=50&lng=en_GB&gr=322&mode=4&country=19&partner=151&getEmpty=true";
    const resp = await fetch(url);
    const json = await resp.json();

    const match = json?.Value?.find(m => String(m.I) === String(matchId));
    if (!match) return res.status(404).json({ success: false, message: "ম্যাচ পাওয়া যায়নি!" });

    // 🔹 Main odds
    let serverOdds = team === "A" ? match.E?.[0]?.C : match.E?.[1]?.C;

    // 🔹 যদি extra option হয়, তখন AE → ME থেকে খুঁজে বের করো
    if (team === "X" && label) {
      match.AE?.forEach(ae => {
        ae.ME?.forEach(me => {
          if (me.N === label || me.C === Number(odds)) {
            serverOdds = me.C;
          }
        });
      });
    }

    if (!serverOdds)
      return res.status(400).json({ success: false, message: "❌ সার্ভার অডস পাওয়া যায়নি!" });

    // 🔹 Odds mismatch check
    if (Number(odds) !== Number(serverOdds)) {
      return res.status(409).json({
        success: false,
        message: `⚠️ অডস পরিবর্তন হয়েছে! নতুন অডস ${serverOdds}`,
        newOdds: serverOdds
      });
    }

    return res.json({
      success: true,
      message: "✅ বেট সফলভাবে প্লেস হয়েছে!",
      data: { matchId, team, label, amount, odds: serverOdds }
    });

  } catch (err) {
    console.error("Bet Error:", err.message);
    return res.status(500).json({ success: false, message: "⚠️ সার্ভার সমস্যা হয়েছে!" });
  }
};




//Bet Home Page

exports.bethome = (req, res) => {
  
  res.render('bet');
}



// Bet json API
exports.betapi = async(req, res) =>{
  try{
  const url = "https://22play8.com/LiveFeed/Get1x2_VZip?sports=4&count=50&lng=en_GB&gr=322&mode=4&country=19&partner=151&getEmpty=true";

const fdata = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",     // বা অন্য header প্রয়োজনে
      "Accept": "application/json"
    }
  });
const jjj = await fdata.json();
res.set("Content", "Nikhil"); // header set
res.json(jjj);
  }catch(err){
    //console.log("nao internet:" + err)
    chalk(err);
    res.end();
    
  }
}


// Place Bet (POST)
exports.placeBet = async (req, res) => {
  try {
    const { matchId, team, amount, odds } = req.body;

    // 🔹 Basic Validation
    if (!matchId || typeof matchId !== "string") {
      return res.status(400).json({ success: false, message: "ম্যাচ আইডি দিতে হবে!" });
    }
    if (!team || !["A", "B"].includes(team)) {
      return res.status(400).json({ success: false, message: "দল নির্বাচন সঠিক নয়!" });
    }
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "সঠিক টাকার পরিমাণ দিন!" });
    }
    if (!odds || isNaN(odds)) {
      return res.status(400).json({ success: false, message: "অডস দিতে হবে!" });
    }

    // 🔹 Live odds আনব
    const url = "https://1xbet86.com/LiveFeed/Get1x2_VZip?sports=16&count=50&lng=en&gr=54&antisports=4&mode=4&country=19&getEmpty=true";
    const fdata = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });
    const jjj = await fdata.json();
    const match = jjj?.Value?.find(m => m.I === parseInt(matchId));

    if (!match) {
      return res.status(404).json({ success: false, message: "ম্যাচ পাওয়া যায়নি!" });
    }

    const serverOdds = team === "A" ? match.E?.[0]?.C : match.E?.[1]?.C;

    // 🔹 Odds mismatch check
    if (Number(odds) !== Number(serverOdds)) {
      return res.status(400).json({
        success: false,
        message: `অডস পরিবর্তন হয়েছে! নতুন অডস ${serverOdds}`,
        newOdds: serverOdds
      });
    }

    // ✅ যদি odds ঠিক থাকে, বেট অনুমোদন করব
    const betData = {
      matchId,
      team,
      amount,
      odds,
      time: new Date().toLocaleString("bn-BD")
    };

    console.log("🧾 নতুন বেট:", betData);

    res.json({
      success: true,
      message: "✅ বেট সফলভাবে দেওয়া হয়েছে!",
      bet: betData
    });

  } catch (err) {
    console.error("❌ Bet error:", err);
    res.status(500).json({ success: false, message: "সার্ভারে সমস্যা হয়েছে!" });
  }
};




//Bet Home Page

exports.bethome = (req, res) => {
  
  res.render('bet');
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
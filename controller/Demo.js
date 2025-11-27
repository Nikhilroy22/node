const { db } = require('../helper/firebase'); // আগের ফাইল


exports.democ = async (req, res) => {
  
  try {
    await db.collection("users").doc("Nikhi9090").set({
      name: "Nikhil",
      email: "nikhil@example.com",
      balance: 1000,
      createdAt: Date.now()
    });

    console.log("User inserted successfully!");
  } catch (err) {
    console.error("Error inserting user:", err);
  }
  
  
  res.render('demo');
  
}
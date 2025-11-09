const { getUsers, updateAmount, getUserById } = require('../model/db');

const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const os = require('os');

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name in nets) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address; // যেমন 192.168.0.105
      }
    }
  }
  return '127.0.0.1';
}

  // যেমন: 'Windows_NT' বা 'Linux' বা 'Darwin'




exports.HomePage = 
  async (req, res) => {
    const users = await getUsers();
    
    
    const jjj = req.headers.accept;

 let data = null;
    
  if (req.session.user) {
    data = users.find(u => u.id === req.session.user.id);
  }
  
 /*   const user = await getUserById(req.session.user.id);
  
  const newtk = user.Amount + 500;
  
 await updateAmount(user.id, newtk);
 */
 
 
 

 
// console.log(tk);
  res.locals.kk = "TK";
  
  if(jjj === "application/json"){
  //const kkk = data : "";
  return res.json(data);
  }
  // exec কে await করে আউটপুট নিই
  try {
    const { stdout, stderr } = await execPromise("pwd");
    console.log("Output:", stdout);
const ip = getLocalIP();
    // render এ পাঠাই
    res.render("index", {
      title: "HOME PAGE",
      data,
      ip,
      nodeVersion: stdout.trim(),  // view এ ব্যবহার করবে
      showSplash: true
    });
  } catch (err) {
    console.error("Exec error:", err);
    res.render("index", {
      title: "HOME PAGE",
      data,
      nodeVersion: "Error",
      showSplash: true
    });
  }
}
  

const { getUsers, updateAmount, getUserById } = require('../model/db');


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
  //console.log(data)
  res.render('index', { title: 'HOME PAGE', data, showSplash: true});
}
  

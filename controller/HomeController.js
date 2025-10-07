const { getUsers, updateAmount, getUserById } = require('../db');


exports.HomePage = 
  async (req, res) => {
    const users = await getUsers();
    
  if (!req.session.user) {
    return res.redirect('/login');
  }
 /*   const user = await getUserById(req.session.user.id);
  
  const newtk = user.Amount + 500;
  
 await updateAmount(user.id, newtk);
 */
 
 const data = users.find(u => u.id === req.session.user.id);
 
// console.log(tk);
  
  
  res.render('index', { title: 'HOME PAGE',
  data});
}
  

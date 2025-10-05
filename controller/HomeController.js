const { getUsers, createUser } = require('../db');


exports.HomePage = 
  async (req, res) => {
    const users = await getUsers();
    
  if (!req.session.user) {
    return res.redirect('/login');
  }
 const data = users.find(u => u.id === req.session.user.id);
 console.log(data.id);
  
  
  res.render('index', { title: 'HOME PAGE',
  data});
}
  

exports.HomePage = 
  (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('index', { title: 'HOME PAGE',
  user: req.session.user});
}
  

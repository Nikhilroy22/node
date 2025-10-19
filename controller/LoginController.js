const { getUsers, createUser } = require('../model/db');

// Dummy user data
/*const users = [
  { user: 'admin', pass: '12345' },
  { user: 'alice', pass: 'alicepass' },
];
*/
// GET /login
exports.showLogin = (req, res) => {
  res.render('login');
};

// POST /login
exports.loginUser = async (req, res) => {
  const { user, pass } = req.body;
  const users = await getUsers();
  const errors = {};

  // ফাঁকা ইনপুট চেক
  if (!user || user.trim() === '') errors.user = 'নাম ফিল্ড খালি রাখা যাবে না';
  if (!pass || pass.trim() === '') errors.pass = 'পাসওয়ার্ড ফিল্ড খালি রাখা যাবে না';

  // ইউজার চেক
  let foundUser = null;
  if (Object.keys(errors).length === 0) {
    foundUser = users.find(u => u.username === user);

    if (!foundUser) {
      errors.user = 'এই নামে কোনো অ্যাকাউন্ট পাওয়া যায়নি';
    } else if (foundUser.password !== pass) {
      errors.pass = 'পাসওয়ার্ড সঠিক নয়';
    }
  }

  // যদি কোনো error থাকে
  if (Object.keys(errors).length > 0) {
    req.flash('errorss', errors);
    req.flash('oldInput', req.body);
    return res.redirect('/login');
  }

  // Session এ user সংরক্ষণ
  req.session.user = {
    id: foundUser.id,
    username: foundUser.username
  };

  res.redirect('/');
};
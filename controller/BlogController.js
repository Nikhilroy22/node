const jj = require('../db/nodesqlite');


exports.blogview = (req, res) =>{
  
  res.render("admin/AddPost");
}


exports.savepost = (req, res) =>{
  const { content } = req.body;
  res.json({ success: true, post: content });
  console.log(content)
  
}
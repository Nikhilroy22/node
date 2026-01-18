const jj = require('../db/nodesqlite');


exports.blogview = (req, res) =>{
  
  res.render("admin/AddPost");
}


exports.savepost = (req, res) =>{
  const { content } = req.body;
  
  /* Insert */
  const insert = jj.db.prepare(
    'INSERT INTO posts (content) VALUES (?)'
  );
  insert.run(content);
  
  res.json({ success: true, post: content });
  console.log(content)
  
}
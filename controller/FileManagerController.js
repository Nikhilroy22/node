const fs = require("fs");
const path = require("path");
const multer = require("multer");

const BASE_DIR = path.resolve("public/nj");

// Safe path function
function safePath(userPath = "") {
  const target = path.resolve(BASE_DIR, userPath);
  if (!target.startsWith(BASE_DIR)) {
    throw new Error("Access denied");
  }
  return target;
}


exports.fileview = (req, res) => {
  
  res.render("filemanager");
}

exports.filesapi = (req, res) => {
  
  try {
    const relPath = req.query.path || "";
    const dir = safePath(relPath);

    const files = fs.readdirSync(dir, { withFileTypes: true });

    res.json({
      path: relPath,
      items: files.map(f => ({
        name: f.name,
        type: f.isDirectory() ? "folder" : "file"
      }))
    });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
  
}

exports.filedelete = (req, res) => {
  
  try {
    const target = safePath(req.body.path);
    fs.rmSync(target, { recursive: true, force: true });
    res.json({ success: true });
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
}




// File upload API
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const upath = "Nikhil";
    
    console.log(req.body.file || "no")
  try {
    const folder = safePath(req.body.path || "");
    cb(null, folder);
  } catch (err) {
    cb(err);
    console.log(err);
  }
},
  filename(req, file, cb) {
    cb(null, file.originalname);
  }
});
exports.cupload = multer({ storage });



exports.fileupload = (req, res) => {
  
  res.json({ success: true  });
  
}
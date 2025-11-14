const http = require('http');

http.createServer((req, res) => {
  res.write('হ্যালো');
  // res.end() নাই!
}).listen(3000);
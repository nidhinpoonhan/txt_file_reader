const http = require('http');
var fs = require('fs');
var formidable = require('formidable');

const hostname = '127.0.0.1';
const port = 8000;

const server = http.createServer((req, res) => {
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    var input = fs.readFileSync(files.file.path, { encoding: 'utf8' }).split("\n");
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end(JSON.stringify(input));
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
const http = require('http');
const path = require('path');
const fs = require('fs');
const now = require('performance-now');

const PORT = 3002;

const server = http.createServer(function (req, res) {
  const start = now(); // start time marker
  fs.readFile(
    path.join(__dirname, 'data', 'big-file1.txt'),
    function (err, data) {
      if (err) {
        console.error(err.message);
        res.end('error');
      } else {
        let end = now(); // end marker
        console.log((end - start).toFixed(3));
        res.end(data);
      }
    }
  );
  console.log('will be processed before file');
});
server.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));

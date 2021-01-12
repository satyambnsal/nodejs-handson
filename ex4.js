const http = require('http');
const path = require('path');
const fs = require('fs');
const now = require('performance-now');

const PORT = 3003;

const server = http.createServer(function (req, res) {
  const start = now(); // start time marker

  const stream = fs.createReadStream(
    path.join(__dirname, 'data', 'big-file1.txt')
  );
  stream.on('data', () => {
    let end = now(); // end marker
    console.log((end - start).toFixed(3));
  });
  stream.pipe(res);
  console.log('will be processed before file');
});
server.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));

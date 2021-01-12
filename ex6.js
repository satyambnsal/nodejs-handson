const { Readable } = require('stream');

const rs = new Readable();

let c = 97;

rs._read = function () {
  if (c > 'z'.charCodeAt(0)) {
    rs.push(null);
  } else {
    rs.push(String.fromCharCode(c++));
  }
};

rs.pipe(process.stdout);

process.on('exit', () => {
  console.error(`\n _read was called ${c - 97} times`);
});

process.stdout.on('error', process.exit);

process.stdin.pipe(process.stdout);

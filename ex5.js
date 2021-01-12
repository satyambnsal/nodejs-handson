const { Readable } = require('stream');

const rs = new Readable();

rs.push('satyam');
rs.push('\n');
rs.push('bansal');
rs.push(null);

setTimeout(() => {
  rs.pipe(process.stdout);
}, 2000);

console.log('processed before setTimeout');

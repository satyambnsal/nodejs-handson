const fs = require('fs');
const path = require('path');

let stream1 = process.stdin; // ReadableStream
let stream2 = process.stdout; // Writable stream

const stream4 = fs.createWriteStream(
  path.resolve(__dirname, 'data', 'out.txt')
);

const stream3 = stream1.pipe(stream4);
// stream3.pipe(stream2);

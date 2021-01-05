#!/usr/bin/env node

// POSIX
// STDIN = 1, STDOUT = 2, STDERR = 3

'use strict';

const minimist = require('minimist');
const path = require('path');
const fs = require('fs');
const getStdIn = require('get-stdin');
const { Transform } = require('stream');

const args = minimist(process.argv.slice(2), {
  boolean: ['help', 'in'],
  string: ['file'],
});
console.log(args);
const BASE_PATH = path.resolve(process.env.BASE_PATH || __dirname);

if (args.help) {
  showHelp();
} else if (args.in) {
  getStdIn().then(processFile).catch(error);
} else if (args.file) {
  //TODO: process file
  // __dirname;
  const filepath = path.join(BASE_PATH, args.file);
  // const filepath1 = path.join(__dirname, 'data', 'cat.txt');
  // console.log(filepath);
  // console.log(filepath1);
  // fs.readFile(filepath, function onContent(err, content) {
  //   if (err) {
  //     error(err.toString(), true);
  //   } else {
  //     processFile(content);
  //   }
  // });
  const stream = fs.createReadStream(filepath);
  processFileStream(stream);
}

// process.stdout.write('Hello World');
// process.stderr.write('Oops got an error');
// process.stdin.read()

// STDOUT
// console.log('Hello World'); // I/O operation
// console.error('Ooops Got an error!');

function processFile(content) {
  // const content = fs.readFileSync(filepath);
  // Some independent operation
  // const upperCaseContent = content.toString().toUpperCase();
  // console.log(upperCaseContent);
  // process.stdout.write(upperCaseContent);
  const upperCaseContent = content.toString().toUpperCase();
  console.log(upperCaseContent);
}

function processFileStream(inStream) {
  let outputStream = inStream; // ReadableStream
  const transformStream = new Transform({
    transform(chunk, encoding, cb) {
      this.push(chunk.toString().toUpperCase());
      setTimeout(cb, 4000);
    },
  });

  outputStream = outputStream.pipe(transformStream);

  const targetStream = process.stdout; // Writable stream
  outputStream.pipe(targetStream);
}

function showHelp() {
  console.log('');
  console.log('ex1 usage');
  console.log('');
  console.log('--help                    show help');
}

function error(msg, includeHelp = false) {
  console.error(msg);
  if (includeHelp) {
    showHelp();
  }
}

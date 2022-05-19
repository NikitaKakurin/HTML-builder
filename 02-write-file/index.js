const fs = require('fs');
const path = require('path');
const {stdin, stdout} = process;
const pathToFile = path.join(__dirname, 'text.txt');

const writeStream = fs.createWriteStream(pathToFile);
stdout.write('---Please enter text---\n');
stdin.on('data', (data) => {
  const text = data.toString();
  if(text.slice(0,-2).trim()=='exit'){
    return process.exit();    
  }
  writeStream.write(text);
});
stdin.on('error', (error) => console.log('Error: ' + error.message));
process.on('exit', () => {
  stdout.write('---exit from process.---\n---Goodbye---');
});
process.on('SIGINT', () => { process.exit(); });


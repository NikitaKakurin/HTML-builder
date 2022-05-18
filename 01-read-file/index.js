const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'text.txt');
console.log(pathToFile);
const readStream = fs.createReadStream(pathToFile, 'utf-8');

let data = '';
readStream.on('data', (chunk) => data += chunk);
readStream.on('end', () => console.log(data));
readStream.on('error', (error) => console.log('Error:' + error.message));

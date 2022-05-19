const fs = require('fs');
const path = require('path');
const targetFilesPath = path.join(__dirname, 'files-copy');
const sourceFilesPath = path.join(__dirname, 'files');

fs.readdir(targetFilesPath, (err, files) => {
  if(err){
    makeFolder();
    fillCopyFolder();
    return;
  }
  cleanFolder(files);
  fillCopyFolder();
});

function cleanFolder(files){
  files.forEach((file)=>{
    fs.unlink(path.join(targetFilesPath, file), (err) => {
      if(err){
        console.log('CustomError: ' + err.message);
      }
    });
  });
}

function makeFolder(){
  fs.mkdir(targetFilesPath, (err) => {
    if(err){
      console.log('mkdir error: ' + err.message);
      return;
    }
  });
}

function fillCopyFolder(){
  fs.readdir(sourceFilesPath, (err, files) => {
    if(err){
      console.log('sourceError:'+ err.message);
      return;
    }
    files.forEach(file => {
      fs.copyFile(path.join(sourceFilesPath, file), path.join(targetFilesPath, file), (err) => {
        if(err){
          console.log('CustomError: ' + err.message);
        }
      });
    });
  });
}


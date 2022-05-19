const fs = require('fs');
const path = require('path');
const pathToFolder = path.join(__dirname, 'secret-folder');



function handleFolder(err, files){
  if(err){
    console.log(err);
    return;
  }
  
  files.forEach((file)=>{ 
    const pathToFile = path.join(pathToFolder, file);
    fs.stat(pathToFile,(err, stats)=>{
      if(err){
        console.log(err);
        return;
      }

      if(stats.isDirectory()) return;
      const parseFile = path.parse(pathToFile);
      console.log(`${parseFile.name} - ${parseFile.ext.slice(1)} - ${stats.size}b`);
    });
  });
}

fs.readdir(pathToFolder, handleFolder);

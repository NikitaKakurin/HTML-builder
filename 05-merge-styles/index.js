const fs = require('fs');
const path = require('path');
const targetFilesPath = path.join(__dirname, 'project-dist');
const sourceFilesPath = path.join(__dirname, 'styles');
(async() => {
  let filesTarget;
  try{
    filesTarget = await fs.promises.readdir(targetFilesPath);
    filesTarget.forEach((file)=>{
      if(file !== 'index.html'){
        fs.promises.unlink(path.join(targetFilesPath, file));
      }    
    });
  } catch(err){
    console.log('cleanTargetError ' + err.message);
  }


  let filesSource;
  try{
   
    let bundleText = '';
    filesSource = await fs.promises.readdir(sourceFilesPath);
    filesSource.forEach((file) => {
      const sourceFilePath = path.join(sourceFilesPath, file);
      if(path.parse(sourceFilePath).ext === '.css'){
        const readStream = fs.createReadStream(sourceFilePath, 'utf-8');
        readStream.on('data', (chunk) => {
          fs.promises.appendFile(path.join(targetFilesPath, 'bundle.css'), chunk);
        });
      }
    });
  } catch(err){
    console.log('readSourceError ' + err.message);
  }  

})();




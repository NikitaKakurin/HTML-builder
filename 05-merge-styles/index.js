const fs = require('fs');
const path = require('path');
const targetFilesPath = path.join(__dirname, 'project-dist');
const sourceFilesPath = path.join(__dirname, 'styles');
(async() => {
  let filesTarget;
  try{
    filesTarget = await fs.promises.readdir(targetFilesPath);
    filesTarget.forEach(async(file)=>{
      if(file !== 'index.html'){
        return await fs.promises.unlink(path.join(targetFilesPath, file));
      }    
    });
  } catch(err){
    console.log('cleanTargetError ' + err.message);
  }


  let filesSource;
  try{
    filesSource = await fs.promises.readdir(sourceFilesPath);
    filesSource.forEach(async (file) => {
      const sourceFilePath = path.join(sourceFilesPath, file);
      if(path.parse(sourceFilePath).ext === '.css'){
        const readStream = await fs.createReadStream(sourceFilePath, 'utf-8');
        readStream.on('data', async (chunk) => {
          return await fs.promises.appendFile(path.join(targetFilesPath, 'bundle.css'), chunk);
        });
      }
    });
  } catch(err){
    console.log('readSourceError ' + err.message);
  }  

})();




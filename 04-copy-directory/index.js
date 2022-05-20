const fs = require('fs');
const path = require('path');
const targetFilesPath = path.join(__dirname, 'files-copy');
const sourceFilesPath = path.join(__dirname, 'files');
(async() => {
  await fs.promises.mkdir(targetFilesPath,{recursive:true});

  const filesTarget = await fs.promises.readdir(targetFilesPath);
  filesTarget.forEach((file)=>{
    fs.promises.unlink(path.join(targetFilesPath, file));
  });

  let filesSource;
  try{
    filesSource = await fs.promises.readdir(sourceFilesPath);
  } catch(err){
    console.log('readdirError ' + err.message);
  }  
  filesSource.forEach((file) => {
    fs.promises.copyFile(path.join(sourceFilesPath, file), path.join(targetFilesPath, file));
  });
})();




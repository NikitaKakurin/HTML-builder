const fs = require('fs');
const path = require('path');
const targetFilesPath = path.join(__dirname, 'files-copy');
const sourceFilesPath = path.join(__dirname, 'files');
(async() => {
  async function clearFiles(folderPath) {
    return await fs.promises.rm(folderPath, { recursive: true, force: true });
  }
  await clearFiles(targetFilesPath);

  await fs.promises.mkdir(targetFilesPath,{recursive:true});

  async function copyFiles(addFolderPath) {
    let additionalPath = addFolderPath||'';
    let pathToFile = path.join(sourceFilesPath,addFolderPath);
    let filesSource;
    try{
      filesSource = await fs.promises.readdir(pathToFile);
      const prom = filesSource.reduce(async(acc, file) => {
        const promise = await acc;
        const stats = await fs.promises.stat(path.join(pathToFile, file));
        if(stats.isDirectory()){
          await fs.promises.mkdir(path.join(targetFilesPath, additionalPath, file),{recursive:true});
          return copyFiles(additionalPath + file);
        }
        // The promise is used to eliminate the error ESlint
        promise;
        return await fs.promises.copyFile(path.join(pathToFile, file), path.join(targetFilesPath, additionalPath, file));
      },'');
      return prom;
    } catch(err){
      console.log('copyError ' + err.message);
    }  
  }
  await copyFiles('');
})();




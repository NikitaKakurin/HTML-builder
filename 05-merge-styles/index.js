const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const sourceFilesPath = path.join(__dirname, 'styles');
(async() => {

  async function clearFolder(folder) {
    try{
      const filesTarget = await fs.promises.readdir(folder);
      const prom = filesTarget.reduce(async(acc,file)=>{
        const promise = await acc;
        const targetPath = path.join(folder, file);
        const stats = await fs.promises.stat(targetPath);
        if(stats.isDirectory()){
          return await fs.promises.rm(targetPath, { recursive: true, force: true });
        }
        if(file !== 'index.html'){
          return await fs.promises.unlink(targetPath);
        }
        return promise;
      });
      return prom;
    } catch(err){
      console.log('cleanTargetError ' + err.message);
    }
  }
  await clearFolder(projectDist);


  async function bundleCss(folder) {
  
    try{
      const readCss = async function () {
        const filesSource = await fs.promises.readdir(folder);
        let cssText = filesSource.reduce(async (text, file) => {
          const sourceFilePath = path.join(folder, file);
          const stats = await fs.promises.stat(sourceFilePath);
          const allCss = await text;
          if(stats.isDirectory()) return allCss;        
          if(path.parse(sourceFilePath).ext !== '.css')return allCss;

          const context = await fs.promises.readFile(sourceFilePath, 'utf-8');          
          if(context.includes('@font-face {')){
            return context  + '\n' + allCss ;
          }
          return allCss + context + '\n';
          
        },'');
        return cssText;
      };
      const styles = await readCss();
      return await fs.promises.writeFile(path.join(projectDist, 'bundle.css'), styles);
    } catch(err){
      console.log('readSourceError ' + err.message);
    }  
  }
  await bundleCss(sourceFilesPath);

})();




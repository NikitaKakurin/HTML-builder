const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const projectDistAssets = path.join(projectDist, 'assets');
const assets = path.join(__dirname, 'assets');
const sourceStyles = path.join(__dirname, 'styles');

(async() => {
  async function clearAssets(folderPath) {
    return await fs.promises.rm(folderPath, { recursive: true, force: true });
  }
  await clearAssets(projectDist);  
  
  async function copyAssets(addFolderPath) {
    let additionalPath = addFolderPath||'';
    let pathToFile = path.join(assets, addFolderPath);
    let filesSource;
    try{
      filesSource = await fs.promises.readdir(pathToFile);
      filesSource.forEach(async(file) => {
        const stats = await fs.promises.stat(path.join(pathToFile, file));
        if(stats.isDirectory()){
          await fs.promises.mkdir(path.join(projectDistAssets, additionalPath, file),{recursive:true});
          copyAssets(additionalPath + file);
          return;
        }
        return await fs.promises.copyFile(path.join(pathToFile, file), path.join(projectDistAssets, additionalPath, file));
      });
    } catch(err){
      console.log('copyError ' + err.message);
    }  
  }
  await copyAssets('');

  async function bundleCss(folder) {
    let filesSource;
    try{
      const readCss = async function () {
        filesSource = await fs.promises.readdir(folder);
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
      return await fs.promises.writeFile(path.join(projectDist, 'styles.css'), styles);
    } catch(err){
      console.log('readSourceError ' + err.message);
    }  
  }
  await bundleCss(sourceStyles);

  // async function createHTML(params) {
    
  // }
  
})();



// const readStream = await fs.createReadStream(sourceFilePath, 'utf-8');
// // readStream.on('data', async (chunk) => {
// //   return await fs.promises.appendFile(path.join(projectDist, 'style.css'), chunk);
// // });
// readStream.on('data', async (chunk) => {
//   css+=chunk;
//   console.log('css -- '+ css.length);
//   console.log('file -- '+sourceFilePath);
// });
// readStream.on('end', () => {
//   if(css.includes('@font-face {')){
//     allStyles = css + allStyles ;
//   } else{
//     allStyles += css;
//   }
//   console.log('allStyles -- '+ allStyles.length);
//   console.log('file -- '+sourceFilePath);
// });
const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist');
const projectDistAssets = path.join(projectDist, 'assets');
const assets = path.join(__dirname, 'assets');
const sourceStyles = path.join(__dirname, 'styles');
const template = path.join(__dirname, 'template.html');
const components = path.join(__dirname, 'components');

(async() => {
  async function clearAssets(folderPath) {
    return await fs.promises.rm(folderPath, { recursive: true, force: true });
  }
  await clearAssets(projectDist);  
  await fs.promises.mkdir((projectDistAssets),{recursive:true});

  async function copyAssets(addFolderPath) {
    try{      
      let additionalPath = addFolderPath||[''];
      let pathToFile = path.join(assets,...additionalPath);

      const filesSource = await fs.promises.readdir(pathToFile);
      const prom = filesSource.reduce(async(acc, file) => {
        const promise = await acc;
        const stats = await fs.promises.stat(path.join(pathToFile, file));
        if(stats.isDirectory()){
          await fs.promises.mkdir(path.join(projectDistAssets, ...additionalPath, file),{recursive:true});
          return copyAssets([...additionalPath, file]);
        }
        // The promise is used to eliminate the error ESlint
        promise;
        return await fs.promises.copyFile(path.join(pathToFile, file), path.join(projectDistAssets, ...additionalPath, file));
      },'');
      return prom;
    } catch(err){
      console.log('copyError ' + err.message);
    }  
  }
  
  await copyAssets();

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
      return await fs.promises.writeFile(path.join(projectDist, 'style.css'), styles);
    } catch(err){
      console.log('readSourceError ' + err.message);
    }  
  }
  await bundleCss(sourceStyles);

  async function createHTML(template) {
    try{
      const html = await fs.promises.readFile(template, 'utf-8');
      const regexp = new RegExp('{{\\w+}}','gm');
      const templatesArray = [...html.matchAll(regexp)];
    
      const setTemplate = templatesArray.reduce(async (htmlTemplate, htmlComponents) => {
        const template = await htmlTemplate;
        const componentsName = htmlComponents[0].slice(2,-2) + '.html';
        const componentsPath = path.join(components, componentsName);
        const stats = await fs.promises.stat(componentsPath);
        if(stats.isDirectory()) return template;
        const componentsContent = await fs.promises.readFile(componentsPath, 'utf-8');
        return template.replace(htmlComponents[0],componentsContent);
      },html);
      
      const textHTML = await setTemplate;
      return await fs.promises.writeFile(path.join(projectDist, 'index.html'), textHTML);
    } catch(err){
      console.log('createHTMLError: ' + err.message);
    }
  }
  await createHTML(template);
})();




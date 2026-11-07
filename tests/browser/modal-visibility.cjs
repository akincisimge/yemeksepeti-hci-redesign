const {chromium,webkit}=require('playwright');const {spawn}=require('node:child_process');const assert=require('node:assert/strict');const path=require('node:path');
const root=path.resolve(__dirname,'../..');
(async()=>{const server=spawn('node',['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5181','--strictPort'],{cwd:root});let browser;
try{
 await new Promise((resolve,reject)=>{server.stdout.on('data',data=>{if(String(data).includes('Local:'))resolve()});server.on('exit',()=>reject(Error('server exited')));setTimeout(()=>reject(Error('server timeout')),10000).unref()});
 const useWebkit=process.env.HCI_TEST_BROWSER==='webkit';
 browser=await (useWebkit?webkit:chromium).launch(useWebkit?{headless:true}:{executablePath:process.env.HCI_CHROMIUM_EXECUTABLE||undefined,headless:true,args:['--no-sandbox','--single-process','--no-zygote','--disable-gpu']});
 const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>localStorage.setItem('hci-delivery-location-v1','kotekli'));
 for(const width of [390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/','/market','/market/carrefour-1']){
   await page.goto('http://127.0.0.1:5181'+route);
   await page.getByRole('button',{name:'Konumu değiştir',exact:true}).click();
   const panel=page.getByRole('dialog',{name:'Teslimat adresin'});await panel.waitFor();
   const box=await panel.boundingBox();assert(box.height>=400,'dialog must not collapse to backdrop only');assert(box.y>=0&&box.y+box.height<=902,'dialog inside viewport');
   const content=await panel.locator('.app-dialog-content').boundingBox();assert(content.height>300,'scroll area must have real height');
   await panel.getByRole('heading',{name:'Nereye getirelim?',exact:true}).waitFor();
   await panel.getByRole('button',{name:'Başka bir adrese gönder',exact:true}).click();
   await panel.getByRole('combobox',{name:'İl',exact:true}).click();await page.keyboard.press('Escape');assert(await panel.isVisible(),'combobox Escape keeps modal open');
   await page.keyboard.press('Escape');await panel.waitFor({state:'detached'});
   await page.getByRole('button',{name:'Konumu değiştir',exact:true}).click();await panel.waitFor();await panel.getByRole('button',{name:'Teslimat adresin penceresini kapat'}).click();await panel.waitFor({state:'detached'});
  }
 }
 await page.goto('http://127.0.0.1:5181/');await page.getByRole('button',{name:'Profil ve hesap menüsünü aç'}).click();await page.getByRole('button',{name:/Kayıtlı adreslerim/}).click();await page.getByRole('dialog',{name:'Teslimat adresin'}).waitFor();
 assert.deepEqual(errors,[]);console.log(JSON.stringify({engine:useWebkit?'webkit':'chromium',passed:true,widths:[390,768,1440],entryPoints:['home','market','unavailable store','profile'],pageErrors:errors}));
}finally{await browser?.close();server.kill();}})().catch(error=>{console.error(error);process.exitCode=1});

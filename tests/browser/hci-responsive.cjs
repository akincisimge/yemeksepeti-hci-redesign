const {chromium}=require('playwright');
const {spawn}=require('node:child_process');const assert=require('node:assert/strict');const fs=require('node:fs');
const path=require('node:path');const os=require('node:os');
const root=path.resolve(__dirname,'../..');
const artifacts=fs.mkdtempSync(path.join(os.tmpdir(),'hci-browser-qa-'));
(async()=>{
const server=spawn('node',['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5175','--strictPort'],{cwd:root});let browser;
try{
await new Promise((res,rej)=>{server.stdout.on('data',d=>{if(String(d).includes('Local:'))res()});server.on('exit',()=>rej(Error('server exited')));setTimeout(()=>rej(Error('server timeout')),10000).unref()});
browser=await chromium.launch({executablePath:process.env.HCI_CHROMIUM_EXECUTABLE || undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--single-process','--no-zygote','--disable-gpu']});
const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{if(!localStorage.getItem('hci-delivery-location-v1'))localStorage.setItem('hci-delivery-location-v1','kotekli')});
await page.goto('http://127.0.0.1:5175/market/ymarket-1');await page.getByRole('heading',{name:'Yemeksepeti Market',exact:true}).waitFor();
const noOverflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
const screenshots=[];
for(const width of [390,768,1440]){
 await page.setViewportSize({width,height:900});await noOverflow();
 const bounds=await page.locator('article').evaluateAll(items=>items.slice(0,3).map(x=>({x:x.getBoundingClientRect().x,y:x.getBoundingClientRect().y})));
 assert(bounds[0].x!==bounds[1].x,`two columns at ${width}`);
 if(width===768||width===1440)assert.equal(Math.round(bounds[0].y),Math.round(bounds[2].y),`three columns at ${width}`);
 assert.equal(await page.getByRole('button',{name:/^Filtrele/}).isVisible(),width<1024);
 assert((await page.locator('main').boundingBox()).width<=1280);
 const file=path.join(artifacts,`market-${width}.png`);await page.screenshot({path:file,fullPage:false});screenshots.push(file);
}
await page.setViewportSize({width:390,height:844});
const filterButton=page.getByRole('button',{name:/^Filtrele/});await filterButton.click();
const filterDialog=page.getByRole('dialog',{name:'Filtreler',exact:true});await filterDialog.waitFor();
const filterClose=filterDialog.getByRole('button',{name:'Filtreler penceresini kapat'});
const apply=filterDialog.getByRole('button',{name:/ürünü göster/});await apply.focus();await page.keyboard.press('Tab');assert(await filterClose.evaluate(el=>el===document.activeElement));assert(await filterClose.evaluate(el=>getComputedStyle(el).boxShadow.includes('217')),'visible primary focus ring');await page.keyboard.press('Shift+Tab');assert(await apply.evaluate(el=>el===document.activeElement));
await page.keyboard.press('Escape');await filterDialog.waitFor({state:'detached'});assert(await filterButton.evaluate(el=>el===document.activeElement));
// Explicit fuzzy suggestion leaves the original query untouched until clicked.
const search=page.getByRole('searchbox',{name:'Ne arıyorsun?'});await search.fill('çklata');
const suggestion=page.getByRole('button',{name:'Bunu mu demek istediniz: Sütlü Çikolata?'});await suggestion.waitFor();assert.equal(await search.inputValue(),'çklata');await suggestion.click();await page.getByText('1 ürün bulundu',{exact:true}).waitFor();assert.equal(await search.inputValue(),'Sütlü Çikolata');await search.fill('');
// Long unbroken product names must not enlarge the grid.
await page.locator('article h3 a').first().evaluate(el=>el.textContent='ÇokUzunÜrünAdı'.repeat(40));await noOverflow();await page.reload();
await page.getByRole('button',{name:'Sütaş Süzme Peynir sepete ekle',exact:true}).click();await page.getByRole('button',{name:'Sütaş Süzme Peynir miktarını artır',exact:true}).click();
const basketButton=page.getByRole('button',{name:/^Sepetim ·/});await basketButton.click();
const basket=page.getByRole('dialog',{name:'Market sepetin',exact:true});await basket.waitFor();const bb=await basket.boundingBox();assert.equal(Math.round(bb.width),390);assert.equal(Math.round(bb.height),844);
await page.clock.install();
await basket.getByRole('button',{name:'Sütaş Süzme Peynir sepetten sil'}).click();
let toast=page.getByRole('alert');await toast.waitFor();assert(await toast.evaluate(el=>!!el.closest('dialog[open]')));
const toastClose=toast.getByRole('button',{name:'Geri alma bildirimini kapat'});await toastClose.focus();await page.keyboard.press('Tab');assert(await basket.getByRole('button',{name:'Market sepetin penceresini kapat'}).evaluate(el=>el===document.activeElement));
await page.keyboard.press('Shift+Tab');assert(await toastClose.evaluate(el=>el===document.activeElement));
await basket.getByRole('button',{name:'Market sepetin penceresini kapat'}).focus();
await page.clock.runFor(3500);await toast.hover();await page.clock.runFor(6000);assert(await toast.isVisible(),'hover pauses expiry');
await toast.getByRole('button',{name:'Geri Al',exact:true}).focus();await page.mouse.move(1,1);await page.clock.runFor(6000);assert(await toast.isVisible(),'focus pauses expiry');
await toast.getByRole('button',{name:'Geri Al',exact:true}).click();await toast.waitFor({state:'detached'});
assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-yemeksepeti-demo-carts-v1')).market[0].quantity),2);
// Repeated deletions after undo get a fresh timer; paused flags cannot leak.
await basket.getByRole('button',{name:'Sütaş Süzme Peynir sepetten sil'}).click();await page.getByRole('alert').waitFor();await page.mouse.move(1,1);await basket.getByRole('button',{name:'Market sepetin penceresini kapat'}).focus();
await page.clock.runFor(5100);await page.getByRole('alert').waitFor({state:'detached'});
await page.keyboard.press('Escape');await basket.waitFor({state:'detached'});assert(await basketButton.evaluate(el=>el===document.activeElement));
await page.clock.resume();
// Existing profile modal shares Escape and focus-return behavior.
const profile=page.getByRole('button',{name:'Profil ve hesap menüsünü aç'});await profile.click();await page.getByRole('dialog',{name:'Profil ve hesabım'}).waitFor();await page.keyboard.press('Escape');assert(await profile.evaluate(el=>el===document.activeElement));
const axeResults=[];
for(const width of [390,768,1440]){
 await page.setViewportSize({width,height:900});await page.goto('http://127.0.0.1:5175/market/ymarket-1');await page.getByRole('heading',{name:'Yemeksepeti Market',exact:true}).waitFor();
 await page.addScriptTag({content:fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8')});
 const result=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
 axeResults.push({width,violations:result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
}
await page.setViewportSize({width:390,height:844});
await page.goto('http://127.0.0.1:5175/market/ymarket-1');
await page.getByRole('button',{name:'Sütaş Süzme Peynir sepete ekle',exact:true}).click();
await page.getByRole('button',{name:/^Sepetim ·/}).click();
await page.getByRole('dialog',{name:'Market sepetin',exact:true}).waitFor();
await page.addScriptTag({content:fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8')});
let modalScan=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
axeResults.push({route:'mobile-basket',violations:modalScan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
await page.screenshot({path:path.join(artifacts,'mobile-basket.png')});
await page.keyboard.press('Escape');
await page.getByRole('button',{name:/^Filtrele/}).click();await page.screenshot({path:path.join(artifacts,'filters.png')});await page.keyboard.press('Escape');
for(const route of ['/','/market','/food','/market/product/m1','/cart/market','/checkout/market']){
 await page.goto('http://127.0.0.1:5175'+route);
 await page.addScriptTag({content:fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8')});
 const result=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));
 axeResults.push({route,violations:result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
}
console.log('AXE',JSON.stringify(axeResults));
assert(axeResults.every(r=>r.violations.length===0),'axe WCAG violations');
assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,widths:[390,768,1440],screenshots,checks:['overflow','grid columns','tablet filter visibility','max-width','filter focus wrap','Escape/focus return','explicit typo suggestion','long names','full-screen basket','toast inside modal','hover/focus timer pause','quantity restoration','5s dismissal','profile modal'],pageErrors:errors}));
}catch(e){console.error(e);process.exitCode=1}finally{await browser?.close();server.kill()}
})();

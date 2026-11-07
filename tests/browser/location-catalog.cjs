const {chromium}=require('playwright');
const {spawn}=require('node:child_process');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const os=require('node:os');
const root=path.resolve(__dirname,'../..');const artifacts=fs.mkdtempSync(path.join(os.tmpdir(),'hci-location-'));
const fixture={countryCode:'TR',principalSubdivision:'Muğla',city:'Menteşe',locality:'Kötekli',localityInfo:{administrative:[{name:'Muğla',adminLevel:4},{name:'Menteşe',adminLevel:6},{name:'Kötekli',adminLevel:8}]}};
(async()=>{
const server=spawn('node',['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5177','--strictPort'],{cwd:root});let browser;
try{
 await new Promise((res,rej)=>{server.stdout.on('data',d=>{if(String(d).includes('Local:'))res()});server.on('exit',()=>rej(Error('server exited')));setTimeout(()=>rej(Error('server timeout')),10000).unref()});
 browser=await chromium.launch({executablePath:process.env.HCI_CHROMIUM_EXECUTABLE||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--single-process','--no-zygote','--disable-gpu']});
 const context=await browser.newContext({viewport:{width:1440,height:1000},geolocation:{latitude:37.165,longitude:28.373},permissions:['geolocation']});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{window.geoCalls=0;const original=navigator.geolocation.getCurrentPosition.bind(navigator.geolocation);window.actualGeo=original;navigator.geolocation.getCurrentPosition=(...args)=>{window.geoCalls++;return original(...args);};});
 let calls=0;await page.route('https://api.bigdatacloud.net/**',async route=>{calls++;assert.equal(new URL(route.request().url()).searchParams.get('latitude'),'37.165');await route.fulfill({json:fixture});});
 await page.goto('http://127.0.0.1:5177/');await page.getByRole('heading',{name:'Nereye getirelim?',exact:true}).waitFor();assert.equal(await page.evaluate(()=>window.geoCalls),0);assert.equal(calls,0);
 await page.getByRole('button',{name:/Başka bir adrese gönder/}).click();
 const city=page.getByRole('combobox',{name:'İl',exact:true});const district=page.getByRole('combobox',{name:'İlçe',exact:true});
 await city.click();assert.equal(await page.getByRole('option').count(),81);
 await city.fill('istanbul');await page.getByRole('option',{name:'İstanbul',exact:true}).click();
 await district.fill('kadikoy');await page.getByRole('option',{name:'Kadıköy',exact:true}).click();await page.getByRole('textbox',{name:'Mahalle / semt',exact:true}).fill('Caferağa');
 await page.getByRole('button',{name:'Bu adrese getir →',exact:true}).click();await page.getByRole('heading',{name:'Bugün ne sipariş etmek istersin?'}).waitFor();
 assert.equal(calls,0);let stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-delivery-location-v2')));assert.equal(stored.city,'İstanbul');assert.equal(stored.district,'Kadıköy');assert(!('latitude'in stored));
 await page.reload();await page.getByRole('button',{name:/Teslimat konumu: Caferağa, Kadıköy, İstanbul/}).waitFor();
 await page.getByRole('button',{name:/Teslimat konumu:/}).click();const modal=page.getByRole('dialog',{name:'Teslimat adresin'});await modal.waitFor();
 // Real browser geolocation, intercepted reverse service: no personal coordinates leave the test.
 await modal.getByRole('button',{name:/Mevcut konumumu kullan/}).click();await modal.getByText('Konumun bulundu. Teslimat bölgeni kontrol edip onayla.').waitFor();
 assert.equal(await modal.getByRole('combobox',{name:'İl',exact:true}).inputValue(),'Muğla');assert.equal(await modal.getByRole('combobox',{name:'İlçe',exact:true}).inputValue(),'Menteşe');assert.equal(await modal.getByRole('textbox',{name:'Mahalle / semt'}).inputValue(),'Kötekli');assert.equal(calls,1);
 const scans=[];
 for(const width of [390,768,1440]){
  await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page overflow');const bounds=await modal.boundingBox();assert(bounds.x>=0&&bounds.x+bounds.width<=width,'modal overflow');
  await page.addScriptTag({content:fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8')});const result=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}));scans.push({width,violations:result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});
  await page.screenshot({path:path.join(artifacts,`location-${width}.png`)});
 }
 await modal.getByRole('button',{name:'Bu adrese getir →',exact:true}).click();await modal.waitFor({state:'detached'});
 stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-delivery-location-v2')));assert.equal(stored.neighborhood,'Kötekli');assert.equal(stored.source,'gps');assert(!('latitude'in stored)&&!('longitude'in stored));
 // GPS denial falls back to manual input with a useful persistent explanation.
 await page.evaluate(()=>{navigator.geolocation.getCurrentPosition=(_ok,error)=>error({code:1});});await page.getByRole('button',{name:/Teslimat konumu:/}).click();await modal.getByRole('button',{name:/Mevcut konumumu kullan/}).click();await modal.getByRole('alert').filter({hasText:'Konum izni verilmedi'}).waitFor();assert(await modal.getByRole('combobox',{name:'İl',exact:true}).isVisible());
 // A late GPS result must not overwrite a manually selected destination.
 await page.evaluate(()=>{navigator.geolocation.getCurrentPosition=success=>{window.pendingGps=success;};});
 await modal.getByRole('button',{name:'Mevcut konumumu kullan',exact:true}).click();await modal.getByRole('button',{name:'Başka bir adrese gönder',exact:true}).click();
 await page.evaluate(()=>window.pendingGps({coords:{latitude:37.165,longitude:28.373}}));assert.equal(calls,1);
 // The service can be unavailable: keep manual input usable without saving a wrong address.
 await page.evaluate(()=>{navigator.geolocation.getCurrentPosition=window.actualGeo;});await page.unroute('https://api.bigdatacloud.net/**');await page.route('https://api.bigdatacloud.net/**',async route=>{calls++;await route.fulfill({status:503,body:'Unavailable'});});
 await modal.getByRole('button',{name:'Mevcut konumumu kullan',exact:true}).click();await modal.getByRole('alert').filter({hasText:'adres bilgisi alınamadı'}).waitFor();
 const manualCity=modal.getByRole('combobox',{name:'İl',exact:true});await manualCity.fill('İzm');await page.keyboard.press('ArrowDown');await page.keyboard.press('Enter');assert.equal(await manualCity.inputValue(),'İzmir');
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('hci-delivery-location-v2')).city),'Muğla');
 // Escape dismisses the combobox before closing the address modal.
 await modal.getByRole('combobox',{name:'İl',exact:true}).click();await page.waitForFunction(()=>document.querySelector('dialog[open] input[role=combobox]')?.getAttribute('aria-expanded')==='true');await page.keyboard.press('Escape');assert(await modal.isVisible());await page.keyboard.press('Escape');await modal.waitFor({state:'detached'});
 await page.goto('http://127.0.0.1:5177/market/ymarket-1');await page.getByText('211 ürün bulundu',{exact:true}).waitFor();assert.equal(await page.locator('article').count(),24);
 await page.getByRole('button',{name:'Sonraki →',exact:true}).click();await page.getByText('Sayfa 2 / 9 · 211 ürün',{exact:true}).waitFor();assert.equal(await page.locator('article').count(),24);
 const search=page.getByRole('searchbox',{name:'Ne arıyorsun?'});await search.fill('laktozsuz');await page.getByText('2 ürün bulundu',{exact:true}).waitFor();assert.equal(await page.locator('article').count(),2);assert(!new URL(page.url()).searchParams.has('page'));
 await search.fill('çklata');await page.getByRole('button',{name:'Bunu mu demek istediniz: Sütlü Çikolata?'}).click();await page.getByText('1 ürün bulundu',{exact:true}).waitFor();
 await page.goto('http://127.0.0.1:5177/checkout/market');assert.equal(await page.getByRole('textbox',{name:'Demo teslimat adresi *'}).inputValue(),'Kötekli, Menteşe, Muğla');
 console.log(JSON.stringify({artifacts,scans,reverseRequests:calls,pageErrors:errors,passed:scans.every(s=>!s.violations.length)&&!errors.length}));assert(scans.every(s=>!s.violations.length),'accessibility violations');assert.deepEqual(errors,[]);
}finally{await browser?.close();server.kill();}
})().catch(error=>{console.error(error);process.exitCode=1});

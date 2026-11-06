import { chromium } from 'playwright-core';
import { mkdirSync, writeFileSync } from 'node:fs';

const base = 'http://127.0.0.1:8765/';
const widths = [320, 375, 390, 768, 1280];
const routes = ['index.html','menus.html','specials.html','reservations.html','catering.html','events.html','vip.html','contact.html'];
const failures = [];
const results = [];
const assert = (ok, where, problem) => { if (!ok) failures.push({where, problem}); };
mkdirSync('audit', { recursive: true });

const possible = ['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'];
let browser;
for (const executablePath of possible) {
 try { browser = await chromium.launch({ executablePath, headless:true, args:['--no-sandbox','--disable-dev-shm-usage'] }); console.log('Chrome: '+executablePath); break; }
 catch (e) { console.log('Chrome unavailable at '+executablePath); }
}
if (!browser) throw new Error('No Chromium/Chrome executable available on the CI runner.');
for (const width of widths) {
 const context = await browser.newContext({viewport:{width,height:860},reducedMotion:'reduce',isMobile:width<=390,hasTouch:width<=390,deviceScaleFactor:1});
 const page = await context.newPage();
 const jsErrors = [];
 page.on('pageerror', e => jsErrors.push(String(e)));
 for (const route of routes) {
  const where = width+'px / '+route;
  const response = await page.goto(base+route, {waitUntil:'domcontentloaded',timeout:30000});
  assert(response?.status()===200, where, 'HTTP status '+response?.status());
  await page.waitForTimeout(80);
  const summary = await page.evaluate(() => ({
   viewport:innerWidth,
   scrollWidth:document.documentElement.scrollWidth,
   h1:document.querySelectorAll('h1').length,
   main:!!document.querySelector('main'),
   noindex:!!document.querySelector('meta[name="robots"][content*="noindex"]'),
   title:document.title,
   buttons:[...document.querySelectorAll('button')].length
  }));
  results.push({width,route,...summary});
  assert(summary.scrollWidth<=summary.viewport+2,where,'Horizontal overflow: '+summary.scrollWidth+' > '+summary.viewport);
  assert(summary.h1===1,where,'Expected 1 h1, saw '+summary.h1);
  assert(summary.main,where,'Missing main landmark');
  assert(summary.noindex,where,'Staging page missing noindex');
  if(width<=768){
    await page.locator('.nav-toggle').click();
    assert(await page.locator('.nav').isVisible(),where,'Mobile nav did not open');
    await page.locator('.nav-toggle').click();
    assert(!await page.locator('.nav').isVisible(),where,'Mobile nav did not close');
  }
  if(route==='menus.html'){
   await page.locator('#tab-menu-1').click();
   assert(await page.locator('#menu-1').isVisible(),where,'Menu tab did not switch');
   await page.locator('#tab-menu-1').press('ArrowRight');
   assert(await page.locator('#menu-2').isVisible(),where,'Keyboard tab ArrowRight did not switch');
  }
  if(route==='reservations.html'||route==='catering.html'||route==='events.html'){
   assert(await page.locator('form').count()===0,where,'Placeholder form is still present');
   assert(await page.locator('a.btn.btn-dark').count()===1,where,'Missing primary inquiry/booking CTA');
  }
  if(route==='menus.html'){
   assert(await page.locator('.menu-panel').count()===5,where,'Missing one or more menu categories');
   assert((await page.locator('.menu-item').count())>100,where,'Menu item coverage insufficient');
   assert(!(await page.locator('main').innerText()).toLowerCase().includes('gluten'),where,'Forbidden dietary labels');
   assert((await page.locator('main').textContent()).includes('MKT'),where,'Market pricing missing');
  }
  if(route==='index.html'){
   await page.locator('[data-slide-next]').click();
   await page.waitForFunction(() => document.querySelector('[data-slide-to="1"]')?.getAttribute('aria-pressed')==='true',null,{timeout:8000}).catch(()=>{});
   assert(await page.locator('[data-slide-to="1"]').getAttribute('aria-pressed')==='true',where,'Carousel next did not advance');
   await page.locator('[data-gallery="0"]').click();
   assert(await page.locator('#cbGalleryDialog').evaluate(el=>el.open),where,'Gallery modal did not open');
   await page.locator('[data-close-gallery]').click();
   assert(!(await page.locator('#cbGalleryDialog').evaluate(el=>el.open)),where,'Gallery modal did not close');
   await page.locator('[data-promo="wine"]').click();
   assert(await page.locator('#cbPromoDialog').evaluate(el=>el.open),where,'Wine Night modal did not open');
   await page.locator('[data-close-promo]').click();
   assert(!(await page.locator('#cbPromoDialog').evaluate(el=>el.open)),where,'Wine Night modal did not close');
   // Original Holiday Parties popup: separate forced preview, real artwork, verified CTA and close.
   await page.goto(base+'index.html?holiday-preview=1',{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.querySelector('#cbHolidayDialog')?.open===true,null,{timeout:10000});
   assert(await page.locator('#cbHolidayDialog').evaluate(el=>el.open),where,'Holiday Parties popup did not open');
   assert(await page.locator('#cbHolidayTitle').innerText()==='HOLIDAY PARTIES',where,'Holiday Parties title incorrect');
   assert(await page.locator('#cbHolidayCopy').innerText()==='The perfect venue for your Holiday Party! Book your party today!',where,'Holiday copy incorrect');
   const holidayImgOK=await page.locator('.cb-holiday-art').evaluate(img=>img.complete&&img.naturalWidth>0);
   assert(holidayImgOK,where,'Original Holiday Parties art missing');
   const holidayLink=await page.locator('.cb-holiday-book').getAttribute('href');
   assert(holidayLink==='https://tmt.spotapps.co/private-parties?spot_id=344525',where,'Holiday Parties booking link incorrect');
   const holidaySize=await page.locator('#cbHolidayDialog').boundingBox();
   assert(holidaySize&&holidaySize.x>=0&&holidaySize.x+holidaySize.width<=width+2,where,'Holiday popup exceeds viewport');
   if(width===375||width===1280)await page.screenshot({path:'audit/holiday-'+width+'.png',animations:'disabled'});
   await page.locator('[data-close-holiday]').click();
   assert(!(await page.locator('#cbHolidayDialog').evaluate(el=>el.open)),where,'Holiday Parties popup did not close');
   if(width===375||width===1280){
     await page.evaluate(()=>{document.querySelectorAll('img[loading="lazy"]').forEach(img=>img.setAttribute('loading','eager'));});
     await page.waitForTimeout(500);
     const broken=await page.locator('img').evaluateAll(items=>items.filter(img=>Boolean(img.getAttribute('src')?.trim())&&img.complete&&img.naturalWidth===0).map(img=>img.getAttribute('src')));
     assert(broken.length===0,where,'Broken images: '+broken.join(', '));
     await page.screenshot({path:'audit/home-'+width+'.png',fullPage:true,animations:'disabled'});
   }
  }
  assert(jsErrors.length===0,where,'JS exceptions: '+jsErrors.join(' | '));
  jsErrors.length=0;
 }
 await context.close();
}
await browser.close();
writeFileSync('audit/responsive-results.json',JSON.stringify({date:new Date().toISOString(),routes,widths,results,failures},null,2));
console.log('Checked '+results.length+' viewport/page combinations across '+widths.join(', ')+'px');
if(failures.length) { for(const f of failures) console.error('FAIL '+f.where+': '+f.problem); process.exitCode=1; } 
else console.log('PASS: all automated browser assertions passed.');

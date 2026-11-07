(function () {
'use strict';
const toggle=document.querySelector('.nav-toggle');
const nav=document.getElementById('site-navigation');
if(toggle&&nav){
  toggle.addEventListener('click',function(){
    const open=nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded',String(open));
    toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  });
  nav.addEventListener('click',function(e){if(e.target.closest('a')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}});
}
const tabs=[...document.querySelectorAll('[data-tab]')];
function chooseTab(tab,focus){
 if(!tab)return;
 tabs.forEach(t=>{const active=t===tab;t.classList.toggle('selected',active);t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
 document.querySelectorAll('.menu-panel').forEach(panel=>{const active=panel.id===tab.dataset.tab;panel.classList.toggle('is-active',active);panel.hidden=!active;});
 if(focus)tab.focus();
}
tabs.forEach(function(tab){
 tab.addEventListener('click',()=>chooseTab(tab,false));
 tab.addEventListener('keydown',function(e){
  if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
  e.preventDefault();
  const i=tabs.indexOf(tab);
  const next=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  chooseTab(tabs[next],true);
 });
});

// External service switchboard. It only rewrites explicitly tagged CTAs from an
// independently reviewed static config; current URLs remain the HTML fallback.
async function loadServiceLinks(){
 try{
  const response=await fetch('services.json',{cache:'no-store'});
  if(!response.ok)return;
  const settings=await response.json();
  if(settings.version!==1||settings.staging_only!==true)return;
  for(const link of document.querySelectorAll('a[data-service]')){
   const key=link.getAttribute('data-service');
   const configured=settings.services?.[key];
   if(configured?.verified_destination!==true)continue;
   const uri=new URL(configured.url);
   if(uri.protocol!=='https:')continue;
   link.href=uri.href;
   link.rel='noopener noreferrer';
  }
 }catch(e){console.warn('Using existing service links; no replacement link loaded.');}
}
loadServiceLinks();

})();
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
 document.querySelectorAll('.menu-panel').forEach(panel=>{panel.classList.toggle('is-active',panel.id===tab.dataset.tab);});
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
})();
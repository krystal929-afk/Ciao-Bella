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
tabs.forEach(function(tab){
 tab.addEventListener('click',function(){
  tabs.forEach(function(t){const active=t===tab;t.classList.toggle('selected',active);t.setAttribute('aria-selected',String(active));});
  document.querySelectorAll('.menu-panel').forEach(function(panel){panel.classList.toggle('is-active',panel.id===tab.dataset.tab);});
 });
});
})();
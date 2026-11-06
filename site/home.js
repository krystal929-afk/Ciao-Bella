(()=>{'use strict';
if(!document.body.classList.contains('home-upgrade'))return;
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
const slides=[...document.querySelectorAll('[data-hero-slide]')];
const dots=[...document.querySelectorAll('[data-slide-to]')];
let slide=0; let timer=null;let paused=reduce.matches;const interval=6500;
let imageChangeToken=0;
function prepareSlide(index){
 const slideNode=slides[index];const image=slideNode?.querySelector('img[data-src]');
 if(!image)return Promise.resolve();
 image.src=image.dataset.src;
 image.removeAttribute('data-src');
 return typeof image.decode==='function'?image.decode().catch(()=>{}):Promise.resolve();
}
function showSlide(index){
 if(!slides.length)return;
 const target=(index+slides.length)%slides.length;
 const token=++imageChangeToken;
 prepareSlide(target).then(()=>{
  if(token!==imageChangeToken)return;
  slide=target;
  slides.forEach((node,i)=>{let active=i===slide;node.classList.toggle('is-active',active);node.setAttribute('aria-hidden',String(!active));});
  dots.forEach((dot,i)=>{let active=i===slide;dot.classList.toggle('active',active);dot.setAttribute('aria-pressed',String(active));});
  const num=document.getElementById('cbSlideNumber');if(num)num.textContent=String(slide+1).padStart(2,'0');
 });
}
function stop(){if(timer){clearInterval(timer);timer=null;}}
function start(){stop();if(paused||reduce.matches||document.hidden||slides.length<2)return;timer=window.setInterval(()=>showSlide(slide+1),interval);}
const hero=document.querySelector('.cb-hero');let hovering=false;let focused=false;
function refresh(){if(hovering||focused)stop();else start();}
hero?.addEventListener('mouseenter',()=>{hovering=true;refresh();});
hero?.addEventListener('mouseleave',()=>{hovering=false;refresh();});
hero?.addEventListener('focusin',()=>{focused=true;refresh();});
hero?.addEventListener('focusout',()=>{setTimeout(()=>{focused=hero.contains(document.activeElement);refresh();},0);});
document.querySelector('[data-slide-prev]')?.addEventListener('click',()=>showSlide(slide-1));
document.querySelector('[data-slide-next]')?.addEventListener('click',()=>showSlide(slide+1));
dots.forEach(d=>d.addEventListener('click',()=>showSlide(Number(d.dataset.slideTo))));
const pause=document.querySelector('[data-slide-pause]');
function syncPause(){if(!pause)return;pause.textContent=paused?'Play':'Pause';pause.setAttribute('aria-label',paused?'Play photo carousel':'Pause photo carousel');}
pause?.addEventListener('click',()=>{paused=!paused;syncPause();refresh();});
reduce.addEventListener?.('change',e=>{if(e.matches){paused=true;syncPause();stop();}else refresh();});
document.addEventListener('visibilitychange',refresh);
showSlide(0);syncPause();refresh();
window.addEventListener('load',()=>window.setTimeout(()=>{if(!document.hidden)prepareSlide((slide+1)%slides.length);},2500),{once:true});
const headerLogo=document.querySelector('.cb-header-logo');const showTextLogo=()=>document.querySelector('.cb-header-brand')?.classList.add('image-missing');headerLogo?.addEventListener('error',showTextLogo);if(headerLogo?.complete&&headerLogo.naturalWidth===0)showTextLogo();
if(!reduce.matches&&'IntersectionObserver' in window){document.body.classList.add('cb-motion-ready');const reveal=new IntersectionObserver((entries,observer)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-in-view');observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px 30px 0px'});document.querySelectorAll('.cb-reveal').forEach(el=>reveal.observe(el));}
document.querySelectorAll('img').forEach(img=>{const fail=()=>{img.classList.add('is-photo-missing');img.closest('.cb-gallery-card,.cb-slide')?.classList.add('is-photo-missing');};img.addEventListener('error',fail);if(img.complete&&img.naturalWidth===0&&img.getAttribute('src'))fail();});
const gallery=[{src:"assets/3635.webp",alt:"Seafood on a wooden serving board"},{src:"assets/3636.webp",alt:"Close-up of a freshly baked pizza"},{src:"assets/3637.webp",alt:"Breaded Italian entrée served with pasta"},{src:"assets/3639.webp",alt:"Pizza on a white plate"},{src:"assets/3647.webp",alt:"Salmon, tomatoes, and mozzarella on a plate"},{src:"assets/3650.webp",alt:"Calamari platter with lemon and sauce"},{src:"assets/3653.webp",alt:"Tiramisu on a white plate"},{src:"assets/3656.webp",alt:"Shrimp pasta served in a bowl"}];
const galleryDialog=document.getElementById('cbGalleryDialog');const galleryImg=document.getElementById('cbGalleryLarge');const galleryCaption=document.getElementById('cbGalleryCaption');let galleryIdx=0;
function showGallery(index){if(!galleryImg||!galleryDialog)return;galleryIdx=(index+gallery.length)%gallery.length;galleryImg.src=gallery[galleryIdx].src;galleryImg.alt=gallery[galleryIdx].alt;galleryCaption.textContent=(galleryIdx+1)+' / '+gallery.length+' · '+gallery[galleryIdx].alt;if(!galleryDialog.open)galleryDialog.showModal();}
document.querySelectorAll('[data-gallery]').forEach(el=>el.addEventListener('click',()=>showGallery(Number(el.dataset.gallery))));
document.querySelector('[data-gallery-prev]')?.addEventListener('click',()=>showGallery(galleryIdx-1));
document.querySelector('[data-gallery-next]')?.addEventListener('click',()=>showGallery(galleryIdx+1));
document.querySelector('[data-close-gallery]')?.addEventListener('click',()=>galleryDialog?.close());
galleryDialog?.addEventListener('click',e=>{if(e.target===galleryDialog)galleryDialog.close();});
document.addEventListener('keydown',e=>{if(!galleryDialog?.open)return;if(e.key==='ArrowLeft')showGallery(galleryIdx-1);if(e.key==='ArrowRight')showGallery(galleryIdx+1);});
const promos={
wine:{label:'Tuesday–Friday · 5 PM–10 PM',title:'Wine Night',text:['Glass $7 · Glass with a dish or board $5','Bottle $19 · Bottle with charcuterie board $44'],image:'assets/3638.webp',alt:'Ciao Bella wine display',href:'specials.html#wine-night',action:'View Wine Night'},
catering:{label:'Catering',title:'Ciao Bella Catering',text:['Catering and private-event information.'],image:'assets/3656.webp',alt:'Ciao Bella shrimp pasta',href:'catering.html',action:'Explore catering'},
vip:{label:'Membership',title:'VIP Club',text:['$79 per year','A free bottle of Impero wine when you join','A $5 Impero glass any night','A free dessert every month with a dinner entrée','First seats at Mama’s Sunday Supper'],image:'assets/3640.png',alt:'Ciao Bella original logo',href:'vip.html',action:'View VIP Club'}
};
const promoDialog=document.getElementById('cbPromoDialog'),promoImg=document.getElementById('cbPromoImage'),promoWrap=document.getElementById('cbPromoImageWrap'),promoBody=document.getElementById('cbPromoDescription'),promoLink=document.getElementById('cbPromoLink');
function openPromo(key){const p=promos[key];if(!promoDialog||!p||galleryDialog?.open)return;if(promoImg){promoImg.src=p.image;promoImg.alt=p.alt;}if(promoWrap)promoWrap.hidden=false;document.getElementById('cbPromoLabel').textContent=p.label;document.getElementById('cbPromoTitle').textContent=p.title;promoBody.replaceChildren();if(key==='vip'){const list=document.createElement('ul');p.text.forEach(t=>{const li=document.createElement('li');li.textContent=t;list.appendChild(li);});promoBody.appendChild(list);}else{p.text.forEach(t=>{const paragraph=document.createElement('p');paragraph.textContent=t;promoBody.appendChild(paragraph);});}promoLink.href=p.href;promoLink.firstChild.textContent=p.action+' ';if(!promoDialog.open)promoDialog.showModal();}
document.querySelectorAll('[data-promo]').forEach(b=>b.addEventListener('click',()=>openPromo(b.dataset.promo)));
document.querySelector('[data-close-promo]')?.addEventListener('click',()=>promoDialog?.close());
promoDialog?.addEventListener('click',e=>{if(e.target===promoDialog)promoDialog.close();});
let last=0;try{last=Number(localStorage.getItem('cb_promo_auto_last')||'0');}catch(e){}
if(Date.now()-last>7*24*60*60*1000){setTimeout(()=>{if(document.hidden||galleryDialog?.open||promoDialog?.open)return;openPromo('wine');try{localStorage.setItem('cb_promo_auto_last',String(Date.now()));}catch(e){}},12000);}
})();
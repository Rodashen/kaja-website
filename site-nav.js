(()=>{
 const dropdown=document.querySelector('.about-dropdown');if(!dropdown)return;
 const summary=dropdown.querySelector('summary');summary.setAttribute('aria-expanded',String(dropdown.open));dropdown.addEventListener('toggle',()=>summary.setAttribute('aria-expanded',String(dropdown.open)));
 document.addEventListener('click',event=>{if(!dropdown.contains(event.target))dropdown.open=false});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&dropdown.open){dropdown.open=false;summary.focus()}});
 if(document.body.classList.contains('kaja-subpage')){const button=document.querySelector('.menu'),nav=document.querySelector('#nav');button.onclick=()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)};document.addEventListener('keydown',event=>{if(event.key==='Escape'){nav.classList.remove('open');button.setAttribute('aria-expanded','false')}});}
 const path=location.pathname.split('/').pop();dropdown.querySelectorAll('a').forEach(link=>{if(link.getAttribute('href')===path)link.setAttribute('aria-current','page')});
})();

const config=window.KAJA_SITE;
document.querySelectorAll("[data-social]").forEach(link=>{link.href=link.dataset.social==='facebook'?config.facebookUrl:config.tiktokUrl;});
document.querySelectorAll('[data-registration]').forEach(link=>{
 if(config.registrationUrl&&/^https:\/\/(docs\.google\.com\/forms\/|forms\.gle\/)/.test(config.registrationUrl)){
  link.href=config.registrationUrl;link.target='_blank';link.rel='noopener';
 }else link.addEventListener('click',event=>{event.preventDefault();document.querySelector('#registration-status').hidden=false;document.querySelector('#registration-status').scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});});
});

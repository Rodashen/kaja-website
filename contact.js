const config=window.KAJA_SITE;
document.querySelectorAll("[data-social]").forEach(link=>{link.href=link.dataset.social==='facebook'?config.facebookUrl:config.tiktokUrl;});
document.querySelectorAll('[data-registration]').forEach(link=>{
 if(config.registrationUrl&&/^https:\/\/(docs\.google\.com\/forms\/|forms\.gle\/)/.test(config.registrationUrl)){
  link.href=config.registrationUrl;link.target='_blank';link.rel='noopener';
 }else link.addEventListener('click',event=>{event.preventDefault();document.querySelector('#registration-status').hidden=false;document.querySelector('#registration-status').scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});});
});
const form=document.querySelector('#contact-form'),status=document.querySelector('#contact-status'),button=form.querySelector('button[type=submit]');
let ready=false,csrf='';
async function prepareContact(){
 try{const response=await fetch('contact.php',{credentials:'same-origin',cache:'no-store'});if(!response.headers.get('content-type')?.includes('application/json'))throw Error();const data=await response.json();ready=response.ok&&data.ready;csrf=data.csrf||'';if(!ready)throw Error();status.textContent='Your message will go to '+config.contactEmail+'.';button.disabled=false;}
 catch{ready=false;button.disabled=true;status.textContent='Online messaging is not available yet. Please use the email link below to contact Kaja.';}
}
form.addEventListener('submit',async event=>{
 event.preventDefault();if(!ready||!form.reportValidity())return;
 button.disabled=true;button.textContent='Sending…';status.textContent='Sending your message…';
 try{const payload=Object.fromEntries(new FormData(form));payload.csrf=csrf;const response=await fetch('contact.php',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!response.headers.get('content-type')?.includes('application/json'))throw Error('Your message could not be sent. Please use the email link below.');const data=await response.json();if(!response.ok||!data.ok)throw Error(data.error||'Your message could not be sent. Please try again.');form.reset();status.textContent='Your message has been sent to Kaja. Thank you!';}
 catch(error){status.textContent=error.message;}
 finally{button.disabled=false;button.textContent='Send message';}
});
document.querySelector('#gmail-compose').addEventListener('click',event=>{const fields=new FormData(form);const subject='Kaja inquiry: '+(fields.get('subject')||'General inquiry');const body=(fields.get('message')||'')+'\n\nName: '+(fields.get('name')||'')+'\nEmail: '+(fields.get('email')||'');event.currentTarget.href='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(config.contactEmail)+'&su='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);});
prepareContact();

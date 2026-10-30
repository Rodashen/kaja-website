(()=>{
 const dialog=document.createElement('dialog');dialog.className='gallery-dialog';dialog.setAttribute('aria-label','Kaja photo viewer');
 const close=document.createElement('button');close.type='button';close.className='gallery-close';close.textContent='Close ×';
 const image=document.createElement('img'),caption=document.createElement('p');dialog.append(close,image,caption);document.body.append(dialog);let opener;
 document.addEventListener('click',event=>{const link=event.target.closest('a.gallery-open');if(!link)return;event.preventDefault();opener=link;const original=link.querySelector('img');image.src=link.href;image.alt=original.alt;caption.textContent=original.alt;dialog.showModal();document.body.classList.add('gallery-active');close.focus();});
 close.onclick=()=>dialog.close();dialog.addEventListener('close',()=>{document.body.classList.remove('gallery-active');opener?.focus()});dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close()});
 document.querySelectorAll('.school-video-grid video').forEach(video=>video.addEventListener('play',()=>document.querySelectorAll('.school-video-grid video').forEach(other=>{if(other!==video)other.pause()})));
})();

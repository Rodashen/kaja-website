// Temporary browser-only gate. This is not server-side authentication.
(()=>{const key='kaja-temporary-access-v1';if(sessionStorage.getItem(key)==='accepted')return;const next=location.pathname.split('/').pop()||'index.html';location.replace('exam-entry.html?next='+encodeURIComponent(next));})();

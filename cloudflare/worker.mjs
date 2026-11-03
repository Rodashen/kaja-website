const DAY=86400000;
const html=(body,status=200,headers={})=>new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KAJA Exam Access</title><style>body{font:16px system-ui;background:#eef3f9;color:#0b2e60;margin:0;padding:30px}main{max-width:480px;margin:8vh auto;background:white;padding:32px;border-radius:18px}input,select,button{box-sizing:border-box;font:inherit;width:100%;padding:14px;margin:10px 0;border-radius:8px;border:1px solid #a4b7cd}button{background:#0b2e60;color:white;cursor:pointer}label{display:block}a{color:#0b2e60}p{line-height:1.6}</style><main>${body}</main></html>`,{status,headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','Content-Security-Policy':"default-src 'self'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'",...headers}});
const hash=async x=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(x)))).map(n=>n.toString(16).padStart(2,'0')).join('');
const token=()=>crypto.randomUUID()+crypto.randomUUID();
function cookie(req,name){return req.headers.get('Cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(name+'='))?.slice(name.length+1)||'';}
const setCookie=(name,value,seconds)=>`${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${seconds}`;
const redirect=(url,cookies)=>new Response(null,{status:303,headers:{Location:url,'Cache-Control':'no-store',...(cookies?{'Set-Cookie':cookies}:{})}});
const login=(admin=false,error='')=>html(`<h1>${admin?'Teacher admin':'KAJA exam access'}</h1><p>${error|| (admin?'Sign in to manage the exam access code.':'Ask your teacher for the current access code.')}</p><form method="post" action="${admin?'/admin/login':'/login'}"><label>${admin?'Admin password':'Access code'}<input type="password" name="code" required maxlength="128" autocomplete="${admin?'current-password':'off'}"></label><button>Continue</button></form><a href="https://kajalanguagecenter.com/">Back to KAJA</a>`);
async function session(req,env,kind){const value=cookie(req,kind==='admin'?'kaja_admin':'kaja_exam');if(!value)return null;return env.DB.prepare('SELECT * FROM sessions WHERE token=? AND kind=? AND expires>?').bind(await hash(value),kind,Date.now()).first();}
async function limited(env,key){const now=Date.now(),row=await env.DB.prepare('SELECT count, until FROM attempts WHERE key=?').bind(key).first();if(row&&row.until>now&&row.count>=10)return true;await env.DB.prepare('INSERT INTO attempts(key,count,until) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN until<? THEN 1 ELSE count+1 END, until=CASE WHEN until<? THEN ? ELSE until END').bind(key,now+900000,now,now,now+900000).run();return false;}
export default {async fetch(req,env){
const url=new URL(req.url),p=url.pathname;
if(!env.DB||!env.ADMIN_PASSWORD_HASH)return html('<h1>KAJA exam access</h1><p>The teacher’s access service is being configured. Please try again later.</p>',503);
if(req.method==='POST'){
if(req.headers.get('Origin')!==url.origin)return html('<h1>Request rejected</h1>',403);
if(Number(req.headers.get('content-length')||0)>4096)return new Response('Too large',{status:413});
const data=await req.formData(),code=String(data.get('code')||'');if(code.length>128)return html('<p>Code too long.</p>',400);
if(p==='/login'||p==='/admin/login'){
const admin=p.startsWith('/admin');if(await limited(env,(req.headers.get('CF-Connecting-IP')||'unknown')+p))return html('<p>Too many attempts. Try again in 15 minutes.</p>',429);
const current=await env.DB.prepare('SELECT * FROM access_code WHERE id=1').first();
const valid=admin?await hash(code)===env.ADMIN_PASSWORD_HASH:current&&current.expires>Date.now()&&await hash(code)===current.hash;
if(!valid)return login(admin,admin?'Incorrect admin password.':'The code is incorrect or expired. Ask your teacher for a current code.');
await env.DB.prepare('DELETE FROM attempts WHERE key=?').bind((req.headers.get('CF-Connecting-IP')||'unknown')+p).run();
const value=token(),expires=admin?Date.now()+3600000:current.expires;
await env.DB.prepare('INSERT INTO sessions(token,kind,expires) VALUES(?,?,?)').bind(await hash(value),admin?'admin':'student',expires).run();
return redirect(admin?'/admin':'/practice/',setCookie(admin?'kaja_admin':'kaja_exam',value,Math.floor((expires-Date.now())/1000)));
}
if(p==='/admin/code'){
if(!await session(req,env,'admin'))return redirect('/admin');if(code.length<6)return html('<p>Use at least six characters.</p><a href="/admin">Back</a>',400);
const days=Number(data.get('days'));if(!Number.isInteger(days)||days<1||days>7)return html('<p>Choose a duration from 1 to 7 days.</p><a href="/admin">Back</a>',400);
await env.DB.prepare('INSERT INTO access_code(id,hash,expires) VALUES(1,?,?) ON CONFLICT(id) DO UPDATE SET hash=excluded.hash, expires=excluded.expires').bind(await hash(code),Date.now()+days*DAY).run();return redirect('/admin?saved=1');
}return new Response('Not found',{status:404});
}
if(p==='/admin'){
if(!await session(req,env,'admin'))return login(true);
const current=await env.DB.prepare('SELECT expires FROM access_code WHERE id=1').first();
return html(`<h1>Exam access code</h1><p>${url.searchParams.has('saved')?'New code saved. Share it with your students. ':''}${current&&current.expires>Date.now()?'Current code expires: '+new Date(current.expires).toLocaleString('en-PH',{timeZone:'Asia/Manila'})+' (Philippine time).':'No active code. Students cannot sign in.'}</p><form method="post" action="/admin/code"><label>New access code<input name="code" required minlength="6" maxlength="128" autocomplete="off"></label><label>Code valid for<select name="days" required>${Array.from({length:7},(_,i)=>`<option value="${i+1}">${i+1} ${i===0?'day':'days'}</option>`).join('')}</select></label><p>The duration starts when you save. One day means 24 hours.</p><button>Save access code</button></form><p>Saving a new code replaces the previous sign-in code. Existing students retain access until their original expiry.</p>`);
}
if(p==='/'||p==='/login')return login();
if(!await session(req,env,'student'))return redirect('/');
if(!env.ASSETS)return html('<p>Exam files are being uploaded. Please check back soon.</p>',503);
const result=await env.ASSETS.fetch(req);const response=new Response(result.body,result);response.headers.set('Cache-Control','private, no-store');return response;
}};

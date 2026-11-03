import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './worker.mjs';

function environment() {
  const writes=[];
  return {writes,ADMIN_PASSWORD_HASH:'configured',DB:{prepare(sql){return {bind(...args){this.args=args;return this;},async first(){
    if(sql.includes('FROM sessions')) return {kind:'admin',expires:Date.now()+60000};
    return null;
  },async run(){writes.push({sql,args:this.args});return {};}};}}};
}
function request(days,authenticated=true) {
  return new Request('https://exam.example/admin/code',{method:'POST',headers:{Origin:'https://exam.example',...(authenticated?{Cookie:'kaja_admin=test'}:{})},body:new URLSearchParams({code:'example-code',...(days===undefined?{}:{days:String(days)})})});
}
test('each allowed duration stores the chosen expiry',async()=>{
  for(let days=1;days<=7;days++) {
    const env=environment(),before=Date.now();
    const response=await worker.fetch(request(days),env);
    assert.equal(response.status,303);
    const write=env.writes.find(x=>x.sql.includes('INSERT INTO access_code'));
    assert.ok(write);
    assert.ok(write.args[1]>=before+days*86400000);
    assert.ok(write.args[1]<=Date.now()+days*86400000);
  }
});
test('invalid or missing duration never writes a code',async()=>{
  for(const days of [undefined,0,8,1.5,'invalid']) {
    const env=environment();
    assert.equal((await worker.fetch(request(days),env)).status,400);
    assert.equal(env.writes.length,0);
  }
});
test('unauthenticated code changes are rejected',async()=>{
  const env=environment();
  assert.equal((await worker.fetch(request(7,false),env)).status,303);
  assert.equal(env.writes.length,0);
});
test('admin offers all seven durations',async()=>{
  const response=await worker.fetch(new Request('https://exam.example/admin',{headers:{Cookie:'kaja_admin=test'}}),environment());
  const body=await response.text();
  assert.equal((body.match(/<option value=/g)||[]).length,7);
  assert.ok(body.includes('Save access code'));
});

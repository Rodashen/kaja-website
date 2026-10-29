import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {plates,compareAnswers,createAttempt} from '../practice/js/ishihara.mjs';

test('random practice uses 12 distinct numbers and avoids the previous attempt',()=>{
 let previous=[];for(let i=0;i<100;i++){const attempt=createAttempt(previous);assert.equal(attempt.length,12);assert.equal(new Set(attempt.map(p=>p.answer)).size,12);assert.ok(attempt.every(p=>Number(p.answer)>=1&&Number(p.answer)<=99&&!previous.some(old=>old.answer===p.answer)));assert.ok(compareAnswers(attempt.map(p=>p.answer),attempt).every(r=>r.matched));previous=attempt;}
});
test('each attempt uses six color combinations without adjacent repeats, including retries',()=>{
 let previous=[];for(let i=0;i<100;i++){const attempt=createAttempt(previous);assert.equal(new Set(attempt.map(p=>p.palette)).size,6);assert.notEqual(attempt[0].palette,previous.at(-1)?.palette);for(let j=1;j<attempt.length;j++)assert.notEqual(attempt[j].palette,attempt[j-1].palette);previous=attempt;}
});

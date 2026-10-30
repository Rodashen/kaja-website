import {createUbtPlayback, ubtPlayCount} from './practice/js/ubt-playback.mjs';

const state = {ubtPlayback:{}};
const controls = [...document.querySelectorAll('[data-ubt-audio]')];
const status = document.querySelector('#voice-status');
const player = createUbtPlayback({state, save:()=>{}, onChange:({busy,message})=>{
  if(message) status.textContent=message;
  controls.forEach(button=>{button.disabled=busy || ubtPlayCount(state,button.dataset.ubtAudio)>=2;});
}, onActive:()=>{}});
controls.forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.ubtAudio;
  player.play(key, 'assets/pop-listening/'+key+'.mp3');
}));
window.addEventListener('pagehide',()=>player.stop());

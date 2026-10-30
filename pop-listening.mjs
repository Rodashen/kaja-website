const controls = [...document.querySelectorAll('[data-ubt-audio]')];
const status = document.querySelector('#voice-status');
let currentAudio = null;
controls.forEach(button => button.addEventListener('click', async () => {
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
  const audio = new Audio('assets/pop-listening/' + button.dataset.ubtAudio + '.mp3?v=quiet-20261031');
  audio.volume = 0.65;
  currentAudio = audio;
  controls.forEach(control => control.classList.toggle('playing', control === button));
  status.textContent = 'Playing once. Press play again to listen again.';
  const finish = () => {
    if (currentAudio !== audio) return;
    currentAudio = null;
    controls.forEach(control => control.classList.remove('playing'));
    status.textContent = 'Press play to listen again.';
  };
  audio.addEventListener('ended', finish, {once: true});
  audio.addEventListener('error', () => { finish(); status.textContent = 'Audio could not play. Please try again.'; }, {once: true});
  try { await audio.play(); } catch { finish(); status.textContent = 'Audio could not play. Please try again.'; }
}));
window.addEventListener('pagehide', () => currentAudio?.pause());

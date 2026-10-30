(() => {
  const carousel = document.querySelector('.pop-cards');
  const cards = [...carousel.querySelectorAll('.pop-card')];
  const indicators = [...document.querySelectorAll('[data-card]')];
  function show(index) {
    cards[index].scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'nearest', inline:'start'});
    indicators.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  }
  indicators.forEach((button, index) => button.addEventListener('click', () => show(index)));
  carousel.addEventListener('scroll', () => {
    const index = Math.round(carousel.scrollLeft / (carousel.clientWidth || 1));
    indicators.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  }, {passive:true});
  document.querySelectorAll('.pop-card').forEach(card => {
    card.querySelectorAll('[data-correct]').forEach(button => button.addEventListener('click', () => {
      card.querySelectorAll('[data-correct]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      card.querySelector('.quiz-feedback').textContent = button.dataset.correct === 'yes' ? card.dataset.success : 'Not quite — give it another try.';
    }));
  });
  document.querySelectorAll('[data-speak]').forEach(button => button.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) { document.querySelector('#voice-status').textContent = 'Voice playback is not available in this browser.'; return; }
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(button.dataset.speak); utterance.lang = 'ko-KR';
    const voice = speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('ko'));
    if (voice) utterance.voice = voice;
    else { document.querySelector('#voice-status').textContent = 'A Korean voice may need to be installed on your device.'; }
    speechSynthesis.speak(utterance);
  }));
})();

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
})();

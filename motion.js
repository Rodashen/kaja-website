(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const animations = new Set();
  function animate(element, frames, options = {}) {
    if (preference.matches) return;
    const animation = element.animate(frames, {duration: 260, easing: 'cubic-bezier(.2,.7,.2,1)', ...options});
    animations.add(animation);
    animation.finished.catch(() => {}).finally(() => animations.delete(animation));
    return animation;
  }
  document.querySelectorAll('details').forEach(details => {
    const summary = details.querySelector(':scope > summary');
    if (!summary) return;
    if (details.classList.contains('about-dropdown')) {
      details.addEventListener('toggle', () => {
        const submenu = details.querySelector('.about-submenu');
        if (details.open && submenu) animate(submenu, [{opacity: 0, transform: 'translateY(-8px)'}, {opacity: 1, transform: 'none'}]);
      });
      return;
    }
    let running;
    let targetOpen = details.open;
    summary.addEventListener('click', event => {
      if (preference.matches) return;
      event.preventDefault();
      const start = details.getBoundingClientRect().height;
      running?.cancel();
      targetOpen = !targetOpen;
      details.open = true;
      details.style.overflow = 'hidden';
      const end = targetOpen ? details.scrollHeight : summary.getBoundingClientRect().height;
      running = animate(details, [{height: `${start}px`}, {height: `${end}px`}], {duration: 320});
      const current = running;
      current.finished.then(() => {
        if (running !== current) return;
        details.open = targetOpen;
        details.style.overflow = '';
        running = null;
      }).catch(() => {});
    });
  });
  const nav = document.querySelector('#nav');
  if (nav) new MutationObserver(() => {
    if (nav.classList.contains('open')) animate(nav, [{opacity: 0, transform: 'translateY(-10px)'}, {opacity: 1, transform: 'none'}]);
  }).observe(nav, {attributes: true, attributeFilter: ['class']});
  document.querySelectorAll('[data-course]').forEach(button => button.addEventListener('click', () => {
    const panel = document.querySelector('#course-panel');
    if (panel) animate(panel, [{opacity: .25, transform: 'translateY(8px)'}, {opacity: 1, transform: 'none'}]);
  }));
  document.querySelectorAll('dialog').forEach(dialog => new MutationObserver(() => {
    if (dialog.open) animate(dialog, [{opacity: 0, transform: 'scale(.97)'}, {opacity: 1, transform: 'scale(1)'}]);
  }).observe(dialog, {attributes: true, attributeFilter: ['open']}));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -24px 0px'});
  document.querySelectorAll('.section-intro, .course-photo, .course-content, .offering-grid article, .eps-notice, .eps-process-heading, .eps-steps li, .eps-reality, .outline-body, .feature-list, .pop-quiz, .school-photo-grid > a, .school-video-grid figure, .community-grid > *, .questions > *, .enroll > *, .message-intro, .contact-actions-panel, .visit > *, .partnerships li, .award-grid figure, .testimonial-grid figure, footer > *, .about-values article, .about-courses > *, .hall-section > *').forEach((element, index) => {
    element.classList.add('scroll-reveal');
    element.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
    observer.observe(element);
  });
  preference.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      animations.forEach(animation => animation.finish());
      document.querySelectorAll('.scroll-reveal').forEach(element => element.classList.add('is-revealed'));
    }
  });
})();

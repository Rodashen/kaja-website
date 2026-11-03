(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    });
  }, {threshold: 0.08, rootMargin: '0px 0px -24px 0px'});
  document.querySelectorAll('.section-intro, .course-photo, .course-content, .offering-grid article, .eps-notice, .eps-process-heading, .eps-steps li, .eps-reality, .outline-body, .feature-list, .pop-quiz, .school-photo-grid > a, .school-video-grid figure, .community-grid > *, .questions > *, .enroll > *, .message-intro, #contact-form, .visit > *, .partnerships li, .award-grid figure, .testimonial-grid figure').forEach((element, index) => {
    element.classList.add('scroll-reveal');
    element.style.setProperty('--reveal-delay', `${(index % 3) * 65}ms`);
    observer.observe(element);
  });
  preference.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      document.querySelectorAll('.scroll-reveal').forEach(element => element.classList.add('is-revealed'));
    }
  });
})();

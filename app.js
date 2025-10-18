const navToggleButton = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('#site-nav');
if (navToggleButton && siteNav) {
  navToggleButton.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggleButton.setAttribute('aria-expanded', String(isOpen));
  });
}
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
// Smooth scroll for internal links
 document.addEventListener('click', (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;
  const link = target.closest('a[href^="#"]');
  if (link) {
    const id = link.getAttribute('href');
    const el = id ? document.querySelector(id) : null;
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      siteNav?.classList.remove('open');
      navToggleButton?.setAttribute('aria-expanded', 'false');
    }
  }
});

// Assign reveal class to common content blocks
(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selectors = [
    '.cards .card',
    '.steps li',
    '.quotes .quote',
    '.section h2',
    '.section .section__lede'
  ];
  const targets = document.querySelectorAll(selectors.join(','));
  targets.forEach((el) => {
    el.classList.add('reveal');
  });

  // Reveal on scroll for elements with .reveal
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.15 });
    revealEls.forEach((el) => observer.observe(el));
  }

  // Gentle parallax on hero background
  const hero = document.querySelector('.hero');
  if (hero && !prefersReduced) {
    const baseX = 50;
    const baseY = 50;
    const maxShift = 4; // in percent
    const onScroll = () => {
      const rect = hero.getBoundingClientRect();
      const viewportH = window.innerHeight || document.documentElement.clientHeight;
      const centerOffset = (rect.top + rect.height / 2) - viewportH / 2; // px from center
      const norm = Math.max(-1, Math.min(1, centerOffset / (viewportH / 2))); // -1..1
      const yShift = baseY + norm * maxShift;
      hero.style.backgroundPosition = `${baseX}% ${yShift}%`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();

// AJAX submit for Web3Forms
(function(){
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = form.querySelector('.form__status');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (status) { status.textContent = 'Envoi…'; status.classList.remove('success','error'); }
    try {
      const formData = new FormData(form);
      const resp = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      const result = await resp.json();
      if (resp.ok && result.success) {
        if (status) { status.textContent = 'Merci ! Votre demande a été envoyée.'; status.classList.add('success'); }
        form.reset();
        window.location.hash = '#thank-you';
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      if (status) { status.textContent = "Désolé, l'envoi a échoué. Veuillez réessayer."; status.classList.add('error'); }
      // Fallback to native submit (will use redirect)
      form.submit();
    }
  });
})();

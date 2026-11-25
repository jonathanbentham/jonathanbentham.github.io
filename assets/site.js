// Mobile nav toggle
document.querySelectorAll('.nav-toggle').forEach((btn) => {
  const nav = document.getElementById(btn.getAttribute('aria-controls'));
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  // Close the menu after tapping a link (e.g. "Work" anchor)
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }));
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Looping clips on project pages: only play while on screen
const clipObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    const fig = target.closest('figure');
    const inActiveSlide = !fig || fig.classList.contains('active');
    if (isIntersecting && inActiveSlide) target.play().catch(() => {});
    else target.pause();
  });
}, { threshold: 0.25 });
document.querySelectorAll('video.clip').forEach((v) => clipObserver.observe(v));

// Hero showreel: pause when scrolled away or if the user prefers less motion
const reel = document.querySelector('.reel-bg');
if (reel) {
  if (reduceMotion) { reel.removeAttribute('autoplay'); reel.pause(); }
  else {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) reel.play().catch(() => {}); else reel.pause();
    }).observe(reel);
  }
}

// Card hover previews: play on hover (desktop) or when mostly on screen (touch)
const startPreview = (media) => {
  const v = media.querySelector('video');
  if (!v) return;
  v.play().then(() => media.classList.add('previewing')).catch(() => {});
};
const stopPreview = (media) => {
  const v = media.querySelector('video');
  if (!v) return;
  v.pause();
  media.classList.remove('previewing');
};
const previews = document.querySelectorAll('.hover-preview');
if (!reduceMotion) {
  if (canHover) {
    previews.forEach((media) => {
      const card = media.closest('.card') || media;
      card.addEventListener('mouseenter', () => startPreview(media));
      card.addEventListener('mouseleave', () => stopPreview(media));
    });
  } else {
    const touchObserver = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => (isIntersecting ? startPreview(target) : stopPreview(target)));
    }, { threshold: 0.7 });
    previews.forEach((media) => touchObserver.observe(media));
  }
}

// Video lightbox (YouTube trailers and local videos)
const lightbox = document.getElementById('lightbox');
if (lightbox && typeof lightbox.showModal === 'function') {
  const frame = lightbox.querySelector('.lightbox-frame');
  const open = (el) => {
    const yt = el.dataset.youtube;
    const vid = el.dataset.video;
    if (yt) {
      frame.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(yt)}?autoplay=1&rel=0" title="Trailer" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
    } else if (vid) {
      frame.innerHTML = `<video controls autoplay playsinline src="${vid}"></video>`;
    } else return;
    lightbox.showModal();
  };
  const close = () => { lightbox.close(); };
  lightbox.addEventListener('close', () => { frame.innerHTML = ''; });
  lightbox.querySelector('.lightbox-close').addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.querySelectorAll('[data-youtube], [data-video]').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); open(el); });
  });
} else {
  // Very old browsers: fall back to opening the video directly
  document.querySelectorAll('[data-youtube], [data-video]').forEach((el) => {
    el.addEventListener('click', () => {
      const url = el.dataset.youtube ? `https://www.youtube.com/watch?v=${el.dataset.youtube}` : el.dataset.video;
      window.open(url, '_blank', 'noopener');
    });
  });
}

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) { target.classList.add('in'); revealObserver.unobserve(target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Slideshows (kept for project pages)
document.querySelectorAll('.slideshow').forEach((show) => {
  const slides = [...show.querySelectorAll('figure')];
  if (slides.length < 2) {
    slides[0]?.classList.add('active');
    show.querySelector('.controls')?.remove();
    return;
  }
  const dots = show.querySelector('.dots');
  slides.forEach(() => dots.appendChild(document.createElement('span')));
  let i = 0;
  const go = (n) => {
    slides[i].classList.remove('active');
    slides[i].querySelector('video')?.pause();
    dots.children[i].classList.remove('on');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('active');
    slides[i].querySelector('video')?.play().catch(() => {});
    dots.children[i].classList.add('on');
  };
  slides[0].classList.add('active');
  dots.children[0].classList.add('on');
  show.querySelector('.prev').addEventListener('click', () => go(i - 1));
  show.querySelector('.next').addEventListener('click', () => go(i + 1));
});

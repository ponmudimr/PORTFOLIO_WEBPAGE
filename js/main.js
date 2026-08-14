// ── DATA & UI ENGINE ─────────────────────────────────────────────────────────
(function () {
  'use strict';

  const DATA = window.PORTFOLIO_DATA || {};
  let lastActiveTrigger = null;

  // ── ACCESSIBILITY: FOCUS TRAP & RESTORE HELPERS ────────────────────────────────
  function getFocusableElements(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.hasAttribute('disabled') && el.offsetWidth > 0 && el.offsetHeight > 0);
  }

  function handleFocusTrap(e, container) {
    if (e.key !== 'Tab') return;
    const focusables = getFocusableElements(container);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // ── TYPING ANIMATION ───────────────────────────────────────────────────────────
  const typedEl = document.getElementById('typed');
  const lines = DATA.typingTitles || ['ECE Student', 'Embedded Systems Developer', 'Defense Tech Innovator', 'RF & SDR Engineer', 'Team 404 Lead'];
  let lineIdx = 0, charIdx = 0, deleting = false;

  function type() {
    if (!typedEl) return;
    const line = lines[lineIdx];
    typedEl.textContent = deleting ? line.substring(0, charIdx - 1) : line.substring(0, charIdx + 1);
    deleting ? charIdx-- : charIdx++;
    if (!deleting && charIdx === line.length) {
      setTimeout(() => { deleting = true; setTimeout(type, 80); }, 1800);
      return;
    }
    if (deleting && charIdx === 0) {
      deleting = false;
      lineIdx = (lineIdx + 1) % lines.length;
    }
    setTimeout(type, deleting ? 50 : 80);
  }
  setTimeout(type, 600);

  // ── THEME TOGGLE ───────────────────────────────────────────────────────────────
  const themeBtn = document.getElementById('theme-btn');
  const themeCallbacks = [];

  function applyTheme(isDark, save = true) {
    document.body.classList.toggle('dark-mode', isDark);
    if (themeBtn) {
      themeBtn.textContent = isDark ? '☀' : '🌙';
      themeBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }
    if (save) localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeCallbacks.forEach(fn => fn(isDark));
  }

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme ? savedTheme === 'dark' : prefersDark, false);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      applyTheme(!document.body.classList.contains('dark-mode'));
    });
  }

  window.PortfolioTheme = {
    isDark: () => document.body.classList.contains('dark-mode'),
    onChange: (fn) => { if (typeof fn === 'function') themeCallbacks.push(fn); }
  };

  // ── HAMBURGER & NAV ────────────────────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }));
  }

  // ── SKILLS ─────────────────────────────────────────────────────────────────────
  const skillsGrid = document.getElementById('skills-grid');
  if (skillsGrid && DATA.skills) {
    skillsGrid.innerHTML = DATA.skills.map(s => `
      <div class="skill-card" tabindex="0" role="group" aria-label="${s.name} skill level ${Math.round(s.level * 100)}%">
        <span class="skill-icon">${s.icon}</span>
        <div class="skill-name">${s.name}</div>
        <div class="skill-level" title="${Math.round(s.level * 100)}%"><div class="skill-fill" style="transform:scaleX(${s.level})"></div></div>
      </div>`).join('');
  }

  // ── PROJECTS ──────────────────────────────────────────────────────────────────
  const projGrid = document.getElementById('projects-grid');
  if (projGrid && DATA.projects) {
    projGrid.innerHTML = DATA.projects.map(p => `
      <div class="project-card" data-id="${p.id}" tabindex="0" role="button" aria-label="Explore ${p.title}">
        <div class="project-num">${p.num}</div>
        <div class="project-title">${p.title}</div>
        <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="project-arrow">Explore <span>→</span></div>
      </div>`).join('');

    projGrid.addEventListener('click', e => {
      const card = e.target.closest('.project-card');
      if (card) {
        lastActiveTrigger = card;
        openProject(card.dataset.id);
      }
    });

    projGrid.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.project-card');
        if (card) {
          e.preventDefault();
          lastActiveTrigger = card;
          openProject(card.dataset.id);
        }
      }
    });
  }

  // ── PROJECT MODAL ──────────────────────────────────────────────────────────────
  const overlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (overlay) {
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    overlay.addEventListener('keydown', e => handleFocusTrap(e, overlay));
  }

  function openProject(id) {
    if (!DATA.projects || !modalContent || !overlay) return;
    const p = DATA.projects.find(x => x.id === id);
    if (!p) return;
    modalContent.innerHTML = `
      <div class="modal-num">${p.num}</div>
      <h2 class="modal-title" id="modal-title-heading">${p.title}</h2>
      ${p.img ? `<img src="${p.img}" alt="${p.title}" class="modal-project-img" loading="lazy">` : ''}
      <div class="modal-section">
        <h4>Description</h4>
        <p>${p.desc}</p>
      </div>
      <div class="modal-section">
        <h4>Technologies</h4>
        <div class="modal-tags">${p.tech.map(t => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
      <div class="modal-section">
        <h4>Key Features</h4>
        <ul>${p.features.map(f => `<li>${f}</li>`).join('')}</ul>
      </div>
      <div class="modal-section">
        <h4>Challenges</h4>
        <p>${p.challenges}</p>
      </div>
      <div class="modal-section">
        <h4>Future Improvements</h4>
        <p>${p.future}</p>
      </div>
      <div class="modal-btn-row">
        <a href="https://github.com/ponmudimr" target="_blank" rel="noopener noreferrer" class="btn-primary">GitHub</a>
      </div>
    `;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    if (overlay && overlay.classList.contains('open')) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      if (lastActiveTrigger) lastActiveTrigger.focus();
    }
    if (certModal && certModal.classList.contains('open')) {
      certModal.classList.remove('open');
      document.body.style.overflow = '';
      if (lastActiveTrigger) lastActiveTrigger.focus();
    }
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // ── CERTIFICATES ───────────────────────────────────────────────────────────────
  const filtersEl = document.getElementById('certs-filters');
  const certsGridEl = document.getElementById('certs-grid');
  let activeFilter = 'All';

  if (filtersEl && certsGridEl && DATA.certs) {
    const cats = ['All', ...new Set(DATA.certs.map(c => c.cat))];
    filtersEl.innerHTML = cats.map(cat => `<button class="filter-btn${cat === 'All' ? ' active' : ''}" data-cat="${cat}" role="tab" aria-selected="${cat === 'All'}">${cat}</button>`).join('');

    filtersEl.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      activeFilter = btn.dataset.cat;
      filtersEl.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      renderCerts();
    });

    function renderCerts() {
      const filtered = activeFilter === 'All' ? DATA.certs : DATA.certs.filter(c => c.cat === activeFilter);
      certsGridEl.innerHTML = filtered.map((c) => `
        <div class="cert-card" data-idx="${DATA.certs.indexOf(c)}" tabindex="0" role="button" aria-label="View credential ${c.title}">
          <div class="cert-badge">${c.cat}</div>
          <div class="cert-title">${c.title}</div>
          <div class="cert-by">${c.by}</div>
          <div style="margin-top:.5rem;font-size:.78rem;color:var(--accent)">${c.id}</div>
          <div class="cert-year">${c.year}</div>
        </div>
      `).join('');
    }
    renderCerts();

    certsGridEl.addEventListener('click', e => {
      const card = e.target.closest('.cert-card');
      if (card) {
        lastActiveTrigger = card;
        openCert(Number(card.dataset.idx));
      }
    });

    certsGridEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.cert-card');
        if (card) {
          e.preventDefault();
          lastActiveTrigger = card;
          openCert(Number(card.dataset.idx));
        }
      }
    });
  }

  const certModal = document.getElementById('cert-modal');
  const certClose = document.getElementById('cert-close');

  if (certClose) certClose.addEventListener('click', closeModal);
  if (certModal) {
    certModal.addEventListener('click', e => { if (e.target === certModal) closeModal(); });
    certModal.addEventListener('keydown', e => handleFocusTrap(e, certModal));
  }

  function openCert(idx) {
    if (!DATA.certs || !DATA.certs[idx] || !certModal) return;
    const c = DATA.certs[idx];
    const certLarge = document.getElementById('cert-large-content');
    const certText = document.getElementById('cert-modal-text');

    if (certLarge) {
      certLarge.innerHTML = c.img ?
        `<img src="${c.img}" alt="${c.title}" style="max-width:100%;max-height:100%;border-radius:12px;object-fit:contain" loading="lazy">` :
        `<div style="text-align:center">
          <div style="font-size:2.5rem;margin-bottom:1rem">🏆</div>
          <div style="font-size:.85rem;color:var(--accent);margin-bottom:.5rem;font-weight:600">${c.cat}</div>
          <div style="font-size:1.1rem;font-weight:600;color:var(--text)" id="cert-modal-title-heading">${c.title}</div>
        </div>`;
    }

    if (certText) {
      let extraPdf = c.pdf ? `<div style="margin-top:.75rem"><a href="${c.pdf}" download target="_blank" rel="noopener noreferrer" class="btn-primary" style="font-size:.8rem;padding:.4rem 1rem">Download PDF Certificate</a></div>` : '';
      certText.innerHTML = `
        <h3 style="font-size:1rem;font-weight:700;margin-bottom:.4rem">${c.title}</h3>
        <p style="font-size:.9rem;color:var(--text2);margin-bottom:.5rem">${c.by}</p>
        <p style="font-size:.8rem;color:var(--accent)">${c.id}</p>
        <p style="font-size:.75rem;color:var(--text3);margin-top:.25rem">${c.year}</p>
        ${extraPdf}`;
    }
    certModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (certClose) certClose.focus();
  }

  // ── SCROLL REVEALS & OBSERVERS ─────────────────────────────────────────────────
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => fadeObs.observe(el));

  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-card').forEach(el => skillObs.observe(el));

  // ── JOURNEY RAIL ───────────────────────────────────────────────────────────────
  const railLinks = [...document.querySelectorAll('#journey-rail a')];
  const railMap = new Map(railLinks.map(a => [a.getAttribute('href').slice(1), a]));
  const railObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        railLinks.forEach(a => a.classList.remove('active'));
        const link = railMap.get(e.target.id);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  ['hero', 'about', 'skills', 'projects', 'certs', 'resume', 'contact']
    .forEach(id => { const el = document.getElementById(id); if (el) railObs.observe(el); });

  // ── SCROLL PROGRESS → CSS var ──────────────────────────────────────────────────
  let _ticking = false;
  addEventListener('scroll', () => {
    if (_ticking) return; _ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      document.documentElement.style.setProperty('--scroll-progress', p);
      _ticking = false;
    });
  }, { passive: true });

  // ── LOADER WATCHDOG ────────────────────────────────────────────────────────────
  // Safety timeout: If 3D engine fails to initialize or network drops Three.js CDN,
  // force dismiss loader after 2.5s so user can view portfolio immediately.
  setTimeout(() => {
    const loader = document.getElementById('world-loader');
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
      document.body.classList.add('immersive', 'immersive-fallback');
      const rail = document.getElementById('journey-rail');
      if (rail) rail.style.display = 'flex';
    }
  }, 2500);

})();

/* ============================================
   メディアとサービス — main.js
   ============================================ */

// ==============================
// 1. スクロール時ヘッダー変化 ＋ トップに戻るボタン
// ==============================
(function initHeader() {
  const header = document.getElementById('header');
  const btn    = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 50);
    if (btn) btn.classList.toggle('show', y > 300);
  });

  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();


// ==============================
// 2. Intersection Observer — スクロールフェードイン
// ==============================
(function initReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();


// ==============================
// 3. 数値カウンターアニメーション
// ==============================
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start    = performance.now();

    const update = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target).toLocaleString('ja-JP');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


// ==============================
// 4. スムーススクロール（ナビ）
// ==============================
(function initSmoothNav() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ==============================
// 5. 記事カード Ripple エフェクト
// ==============================
(function initRipple() {
  // ripple用スタイルを注入
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { width: 280px; height: 280px; opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.article-card').forEach(card => {
    card.style.position = 'relative';
    card.style.overflow = 'hidden';

    card.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position: absolute;
        left: ${e.clientX - rect.left}px;
        top: ${e.clientY - rect.top}px;
        width: 0; height: 0;
        background: rgba(26,86,219,0.1);
        border-radius: 50%;
        transform: translate(-50%,-50%);
        animation: rippleAnim 0.55s ease-out forwards;
        pointer-events: none;
        z-index: 5;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
})();

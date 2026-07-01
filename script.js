
function __lf(s,w,h){var a=['img/g1.jpg','img/g2.jpg','img/g3.jpg','img/g4.jpg','img/g5.jpg','img/g6.jpg'];var n=0,x=String(s);for(var i=0;i<x.length;i++){n=(n*31+x.charCodeAt(i))>>>0;}return a[n%a.length];}
function __av(s){return 'https://i.pravatar.cc/200?u=brushstroke'+encodeURIComponent(String(s));}
/* ============================================================
   Brushstroke Decorators — demo interactions (vanilla JS)
============================================================ */
(function () {
  'use strict';
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---- Year ---- */
  var yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ============================================================
     1. Mobile hamburger
  ============================================================ */
  var burger = $('#hamburger');
  var nav = $('#main-nav');
  if (burger && nav) {
    var toggleNav = function (open) {
      var isOpen = open != null ? open : !nav.classList.contains('open');
      nav.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    };
    burger.addEventListener('click', function () { toggleNav(); });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) toggleNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { toggleNav(false); burger.focus(); }
    });
  }

  /* ============================================================
     Smooth scroll (accounts for sticky header) — progressive
     enhancement; native CSS smooth-scroll already works.
  ============================================================ */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var top = target.getBoundingClientRect().top + window.pageYOffset - 64;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ============================================================
     2. Scroll reveal
  ============================================================ */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ============================================================
     3. Before / After comparison slider (drag + keyboard)
  ============================================================ */
  (function () {
    var slider = $('#baSlider');
    if (!slider) return;
    var beforeWrap = $('#baBeforeWrap');
    var beforeImg = $('.ba-before', slider);
    var handle = $('#baHandle');
    var pos = 50; // percent

    function sizeBefore() {
      // keep the before image the full slider width so it doesn't squash
      beforeImg.style.width = slider.clientWidth + 'px';
    }
    function setPos(p) {
      pos = Math.max(0, Math.min(100, p));
      beforeWrap.style.width = pos + '%';
      handle.style.left = pos + '%';
      slider.setAttribute('aria-valuenow', Math.round(pos));
    }
    function fromClientX(clientX) {
      var r = slider.getBoundingClientRect();
      setPos(((clientX - r.left) / r.width) * 100);
    }

    var dragging = false;
    function start(e) { dragging = true; move(e); }
    function move(e) {
      if (!dragging) return;
      var x = e.touches ? e.touches[0].clientX : e.clientX;
      fromClientX(x);
      if (e.cancelable) e.preventDefault();
    }
    function end() { dragging = false; }

    slider.addEventListener('mousedown', start);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    slider.addEventListener('touchstart', start, { passive: true });
    slider.addEventListener('touchmove', move, { passive: false });
    slider.addEventListener('touchend', end);

    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { setPos(pos - 4); e.preventDefault(); }
      else if (e.key === 'ArrowRight') { setPos(pos + 4); e.preventDefault(); }
      else if (e.key === 'Home') { setPos(0); e.preventDefault(); }
      else if (e.key === 'End') { setPos(100); e.preventDefault(); }
    });

    window.addEventListener('resize', sizeBefore);
    // size once images are ready
    if (beforeImg.complete) sizeBefore(); else beforeImg.addEventListener('load', sizeBefore);
    sizeBefore();
    setPos(50);
  })();

  /* ============================================================
     4. Portfolio gallery + filter + lightbox
  ============================================================ */
  var projects = [
    { cat: 'interior', title: 'Clifton townhouse hallway', seed: 'proj-int-1' },
    { cat: 'exterior', title: 'Bishopston Victorian render', seed: 'proj-ext-1' },
    { cat: 'commercial', title: 'Stokes Croft café fit-out', seed: 'proj-com-1' },
    { cat: 'interior', title: 'Redland nursery feature wall', seed: 'proj-int-2' },
    { cat: 'exterior', title: 'Southville sash windows', seed: 'proj-ext-2' },
    { cat: 'interior', title: 'Cotham kitchen respray', seed: 'proj-int-3' },
    { cat: 'commercial', title: 'Harbourside office repaint', seed: 'proj-com-2' },
    { cat: 'exterior', title: 'Bedminster masonry coat', seed: 'proj-ext-3' },
    { cat: 'commercial', title: 'Gloucester Rd salon', seed: 'proj-com-3' }
  ];
  var catLabel = { interior: 'Interior', exterior: 'Exterior', commercial: 'Commercial' };
  var grid = $('#portfolioGrid');
  if (grid) {
    grid.innerHTML = projects.map(function (p, i) {
      return '<button class="portfolio-item" data-cat="' + p.cat + '" data-index="' + i + '" ' +
        'aria-label="View project: ' + p.title + '">' +
        '<img src="' + __lf(p.seed, 640, 480) + '" alt="' + p.title + '" loading="lazy" width="640" height="480">' +
        '<span class="pi-overlay"><span class="pi-cat">' + catLabel[p.cat] + '</span>' +
        '<span class="pi-title">' + p.title + '</span></span></button>';
    }).join('');

    /* filter */
    $$('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('.filter-btn').forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var f = btn.getAttribute('data-filter');
        $$('.portfolio-item', grid).forEach(function (item) {
          var show = f === 'all' || item.getAttribute('data-cat') === f;
          item.classList.toggle('hide', !show);
        });
      });
    });

    /* lightbox */
    var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
    var lbPrev = $('#lbPrev'), lbNext = $('#lbNext'), lbClose = $('#lbClose');
    var current = 0, lastFocused = null;

    function visibleItems() {
      return $$('.portfolio-item', grid).filter(function (it) { return !it.classList.contains('hide'); });
    }
    function openLB(index) {
      current = index;
      var p = projects[index];
      lbImg.src = '' + __lf(p.seed, 1200, 900) + '';
      lbImg.alt = p.title;
      lbCap.textContent = catLabel[p.cat] + ' · ' + p.title;
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      lbClose.focus();
    }
    function closeLB() {
      lb.hidden = true;
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }
    function step(dir) {
      var vis = visibleItems();
      var idxs = vis.map(function (it) { return +it.getAttribute('data-index'); });
      var at = idxs.indexOf(current);
      var next = (at + dir + idxs.length) % idxs.length;
      openLB(idxs[next]);
    }

    grid.addEventListener('click', function (e) {
      var item = e.target.closest('.portfolio-item');
      if (!item) return;
      lastFocused = item;
      openLB(+item.getAttribute('data-index'));
    });
    lbClose.addEventListener('click', closeLB);
    lbPrev.addEventListener('click', function () { step(-1); });
    lbNext.addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLB(); });
    document.addEventListener('keydown', function (e) {
      if (lb.hidden) return;
      if (e.key === 'Escape') closeLB();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
    });
  }

  /* ============================================================
     5. Quote calculator
  ============================================================ */
  (function () {
    var form = $('#calcForm');
    if (!form) return;
    var rooms = $('#calcRooms'), roomsOut = $('#roomsOut'), size = $('#calcSize');
    var ceil = $('#calcCeil'), wood = $('#calcWood'), out = $('#calcOut');

    function fmt(n) { return '£' + Math.round(n / 10) * 10; }
    function recalc() {
      var n = +rooms.value;
      var sz = +size.value;
      var typeEl = form.querySelector('input[name="calcType"]:checked');
      var type = typeEl ? typeEl.value : 'interior';
      var typeRate = { interior: 260, exterior: 340, commercial: 300 }[type];
      var callout = { interior: 180, exterior: 260, commercial: 240 }[type];

      var base = callout + n * sz * typeRate;
      if (ceil.checked) base += n * 45;
      if (wood.checked) base += n * 70;

      var low = base * 0.9;
      var high = base * 1.15;
      out.textContent = fmt(low) + ' – ' + fmt(high);
      roomsOut.textContent = n;
    }
    [rooms, size, ceil, wood].forEach(function (el) {
      el.addEventListener('input', recalc);
      el.addEventListener('change', recalc);
    });
    $$('input[name="calcType"]', form).forEach(function (r) { r.addEventListener('change', recalc); });
    recalc();
  })();

  /* ============================================================
     6. Reviews wall with star ratings
  ============================================================ */
  function starsSVG(rating) {
    var html = '';
    for (var i = 1; i <= 5; i++) {
      var fill = i <= rating ? '#ffc83d' : '#e6dfd3';
      html += '<span class="star"><svg viewBox="0 0 24 24" width="18" height="18">' +
        '<path d="M12 2l3 6 6 .9-4.5 4.3 1 6.1L12 17l-5.5 2.3 1-6.1L3 8.9 9 8z" fill="' + fill + '"/>' +
        '</svg></span>';
    }
    return html;
  }
  // hydrate any [data-rating] summary stars
  $$('.stars[data-rating]').forEach(function (el) {
    el.innerHTML = starsSVG(+el.getAttribute('data-rating'));
  });

  var reviews = [
    { name: 'Hannah W.', area: 'Clifton', rating: 5, c: '#f24e1e', text: 'Immaculate work and not a speck of mess left behind. Our hallway and stairwell look brand new. Genuinely the tidiest tradespeople we have had in the house.' },
    { name: 'Marcus T.', area: 'Bishopston', rating: 5, c: '#3e6df2', text: 'Repainted the front of our Victorian terrace. Prepped properly, sorted a bit of cracked render and the finish is spot on. Fair quote, no surprises.' },
    { name: 'Priya S.', area: 'Redland', rating: 5, c: '#00a884', text: 'Hung a tricky patterned wallpaper in the nursery and you cannot see a single seam. Friendly, punctual and great with our questions about colours.' },
    { name: 'The Bear & Bean', area: 'Stokes Croft', rating: 5, c: '#9b5de5', text: 'Did our café out of hours so we never lost a day of trading. Professional from quote to clean-up. We will be using them for the next unit too.' },
    { name: 'David R.', area: 'Southville', rating: 4, c: '#f15bb5', text: 'Lovely job on the sash windows and woodwork. Took a touch longer than planned due to the weather but kept us posted throughout. Happy customer.' },
    { name: 'Ellie M.', area: 'Cotham', rating: 5, c: '#ffc83d', text: 'The kitchen respray is unbelievable, looks like a brand new kitchen for a fraction of replacing it. Dust control was excellent. Cannot recommend enough.' }
  ];
  var rg = $('#reviewsGrid');
  if (rg) {
    rg.innerHTML = reviews.map(function (r) {
      return '<article class="review-card reveal">' +
        '<div class="review-stars" aria-label="' + r.rating + ' out of 5 stars">' +
        '<span class="stars" aria-hidden="true">' + starsSVG(r.rating) + '</span></div>' +
        '<p class="review-text">' + r.text + '</p>' +
        '<div class="review-author">' +
        '<span class="review-avatar" aria-hidden="true" style="background:' + r.c + '">' + r.name.charAt(0) + '</span>' +
        '<span><span class="review-name">' + r.name + '</span>' +
        '<span class="review-meta">' + r.area + ', Bristol · Verified</span></span></div>' +
        '</article>';
    }).join('');
    // re-observe new reveal elements
    if ('IntersectionObserver' in window) {
      var io2 = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io2.unobserve(en.target); } });
      }, { threshold: 0.12 });
      $$('.review-card.reveal', rg).forEach(function (el) { io2.observe(el); });
    } else {
      $$('.review-card.reveal', rg).forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ============================================================
     7. Quote / booking form validation + success
  ============================================================ */
  (function () {
    var form = $('#quoteForm');
    if (!form) return;
    var success = $('#formSuccess');

    function showError(field, msg) {
      var wrap = field.closest('.field');
      wrap.classList.add('invalid');
      var err = wrap.querySelector('.error');
      if (err) err.textContent = msg;
      field.setAttribute('aria-invalid', 'true');
    }
    function clearError(field) {
      var wrap = field.closest('.field');
      wrap.classList.remove('invalid');
      var err = wrap.querySelector('.error');
      if (err) err.textContent = '';
      field.removeAttribute('aria-invalid');
    }

    var name = $('#name'), email = $('#email'), phone = $('#phone'), message = $('#message');

    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
    function validPhone(v) { return v === '' || /^[\d\s()+\-]{7,}$/.test(v); }

    [name, email, phone, message].forEach(function (f) {
      f.addEventListener('input', function () { clearError(f); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      if (!name.value.trim()) { showError(name, 'Please tell us your name.'); ok = false; }
      if (!email.value.trim()) { showError(email, 'We need an email to reply.'); ok = false; }
      else if (!validEmail(email.value.trim())) { showError(email, 'That email doesn’t look right.'); ok = false; }
      if (!validPhone(phone.value.trim())) { showError(phone, 'Please enter a valid phone number.'); ok = false; }
      if (!message.value.trim()) { showError(message, 'A quick description helps us quote.'); ok = false; }

      if (!ok) {
        var firstBad = form.querySelector('.invalid input, .invalid textarea');
        if (firstBad) firstBad.focus();
        return;
      }
      form.querySelectorAll('input, textarea, select, button').forEach(function (el) { el.disabled = true; });
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  })();

})();

// Natra site script: page position, FAQ accordions, hero examples, store links, "Copy email".
// No cookies, no tracking, no third parties.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  /* ---------- Every page opens at the top ---------- */
  // Do not restore the previous scroll position (reload, back/forward, preview frames).
  // A link with #anchor (e.g. /support#delete-account) still goes to its anchor.
  try {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  } catch (e) {}

  function hasTarget() {
    return location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  }
  function toTop() {
    if (hasTarget()) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }
  toTop();
  window.addEventListener('load', function () {
    toTop();
    setTimeout(toTop, 120);
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) toTop();
  });

  /* ---------- FAQ accordions: smooth, one item open at a time ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DURATION = 320;
  var EASING = 'cubic-bezier(0.22, 0.61, 0.36, 1)';

  function panelOf(item) {
    return item.querySelector('.acc__panel');
  }
  function stop(item) {
    if (item._anim) {
      item._anim.cancel();
      item._anim = null;
    }
  }
  function openItem(item, animate) {
    var panel = panelOf(item);
    var from = item.open ? panel.getBoundingClientRect().height : 0;
    stop(item);
    item.open = true;
    item.classList.add('is-open');
    if (!animate || reduceMotion || !panel.animate) return;
    var to = panel.scrollHeight;
    item._anim = panel.animate(
      [
        { height: from + 'px', opacity: from ? 1 : 0 },
        { height: to + 'px', opacity: 1 },
      ],
      { duration: DURATION, easing: EASING }
    );
    item._anim.onfinish = function () {
      item._anim = null;
    };
  }
  function closeItem(item, animate) {
    var panel = panelOf(item);
    item.classList.remove('is-open');
    if (!item.open) return;
    if (!animate || reduceMotion || !panel.animate) {
      stop(item);
      item.open = false;
      return;
    }
    var from = panel.getBoundingClientRect().height;
    stop(item);
    var anim = panel.animate(
      [
        { height: from + 'px', opacity: 1 },
        { height: '0px', opacity: 0 },
      ],
      { duration: DURATION, easing: EASING }
    );
    item._anim = anim;
    anim.onfinish = function () {
      if (item._anim === anim) {
        item._anim = null;
        item.open = false;
      }
    };
  }

  var groups = Array.prototype.slice.call(document.querySelectorAll('[data-accordion]'));
  groups.forEach(function (group) {
    var items = Array.prototype.slice.call(group.querySelectorAll('.acc__item'));
    items.forEach(function (item) {
      if (item.open) item.classList.add('is-open');
      item.querySelector('summary').addEventListener('click', function (e) {
        e.preventDefault();
        if (item.classList.contains('is-open')) {
          closeItem(item, true);
        } else {
          items.forEach(function (other) {
            if (other !== item && other.classList.contains('is-open')) closeItem(other, true);
          });
          openItem(item, true);
        }
      });
    });
  });

  // Deep links: /support#delete-account opens that question.
  function openFromHash(scroll) {
    var target = hasTarget();
    if (!target || !target.classList.contains('acc__item')) return;
    var group = target.closest('[data-accordion]');
    Array.prototype.forEach.call(group.querySelectorAll('.acc__item'), function (other) {
      if (other !== target) closeItem(other, false);
    });
    openItem(target, false);
    if (scroll) target.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  openFromHash(false);
  window.addEventListener('hashchange', function () {
    openFromHash(true);
  });

  /* ---------- Header section links: mark the section on screen ---------- */
  var anchors = document.querySelectorAll('.site-nav__anchor[href^="#"]');
  if (anchors.length && 'IntersectionObserver' in window) {
    var byId = {};
    Array.prototype.forEach.call(anchors, function (a) {
      var sec = document.getElementById(a.getAttribute('href').slice(1));
      if (sec) byId[sec.id] = a;
    });
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var a = byId[e.target.id];
          if (a) a.classList.toggle('is-current', e.isIntersecting);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    Object.keys(byId).forEach(function (id) {
      spy.observe(document.getElementById(id));
    });
  }

  /* ---------- Platform: phones see only their own store once the app is live ---------- */
  var ua = navigator.userAgent || '';
  var isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/.test(ua);
  if (isIOS) root.classList.add('is-ios');
  if (isAndroid) root.classList.add('is-android');
  Array.prototype.forEach.call(document.querySelectorAll('[data-store-link]'), function (a) {
    var href = (isAndroid && a.getAttribute('data-android')) || (isIOS && a.getAttribute('data-ios'));
    if (href) a.setAttribute('href', href);
  });

  /* ---------- Hero: question chips switch the example answer ---------- */
  var tries = document.querySelector('[data-tries]');
  var answer = document.querySelector('[data-answer]');
  if (tries && answer) {
    tries.hidden = false;
    var frame = answer.closest('.answer');
    var buttons = Array.prototype.slice.call(tries.querySelectorAll('.try'));
    var q = answer.querySelector('[data-answer-q]');
    var verdict = answer.querySelector('[data-answer-verdict]');
    var bar = answer.querySelector('[data-answer-bar]');
    var pct = answer.querySelector('[data-answer-pct]');
    var reading = answer.querySelector('[data-answer-reading]');
    var swapTimer;
    function show(btn) {
      var c = btn.getAttribute('data-confidence');
      answer.className = answer.className.replace(/\btone-\S+/, 'tone-' + btn.getAttribute('data-tone'));
      q.textContent = '\u201c' + btn.textContent + '\u201d';
      verdict.textContent = btn.getAttribute('data-verdict');
      bar.className = 'w-' + c;
      pct.textContent = c + '%';
      reading.textContent = btn.getAttribute('data-reading');
    }
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (btn.getAttribute('aria-pressed') === 'true') return;
        buttons.forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
        clearTimeout(swapTimer);
        if (reduceMotion) return show(btn);
        frame.classList.add('is-changing');
        swapTimer = setTimeout(function () {
          show(btn);
          frame.classList.remove('is-changing');
        }, 200);
      });
    });
  }

  /* ---------- Sticky "Get the app" bar: after the hero, hidden near the final buttons ---------- */
  var getbar = document.querySelector('[data-getbar]');
  var hero = document.querySelector('[data-hero]');
  if (getbar && hero && 'IntersectionObserver' in window) {
    var closing = document.querySelector('[data-closing]');
    var heroVisible = true;
    var closingVisible = false;
    getbar.hidden = false;
    document.body.classList.add('has-getbar');
    function update() {
      getbar.classList.toggle('is-away', heroVisible || closingVisible);
    }
    update();
    new IntersectionObserver(function (e) {
      heroVisible = e[0].isIntersecting;
      update();
    }).observe(hero);
    if (closing) {
      new IntersectionObserver(function (e) {
        closingVisible = e[0].isIntersecting;
        update();
      }).observe(closing);
    }
  }

  /* ---------- Support: "Copy email" ---------- */
  var copyRoot = document.querySelector('[data-copy-root]');
  if (!copyRoot) return;
  var button = copyRoot.querySelector('[data-copy-button]');
  var source = copyRoot.querySelector('[data-copy-source]');
  var status = copyRoot.querySelector('[data-copy-status]');
  var timer;

  function selectText() {
    var range = document.createRange();
    range.selectNodeContents(source);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  function say(text) {
    status.textContent = text;
    clearTimeout(timer);
    timer = setTimeout(function () {
      status.textContent = '';
    }, 4000);
  }
  button.addEventListener('click', function () {
    var text = source.textContent.trim();
    var done = function () {
      say(button.getAttribute('data-copied'));
    };
    var fail = function () {
      selectText();
      var ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (e) {}
      say(button.getAttribute(ok ? 'data-copied' : 'data-failed'));
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fail);
    } else {
      fail();
    }
  });
})();

// Natra site script: page position, FAQ accordions, "Copy email".
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

  /* ---------- Mobile menu ---------- */
  var menu = document.querySelector('[data-menu]');
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) menu.open = false;
    });
    document.addEventListener('click', function (e) {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.open) {
        menu.open = false;
        menu.querySelector('summary').focus();
      }
    });
  }

  /* ---------- Carousels (phones): swipe cards with dots ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-carousel]'), function (track) {
    var items = Array.prototype.slice.call(track.children);
    if (items.length < 2 || !('IntersectionObserver' in window)) return;
    var dots = document.createElement('div');
    dots.className = 'dots';
    dots.setAttribute('aria-hidden', 'true');
    items.forEach(function (item, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.tabIndex = -1;
      dot.className = 'dots__dot' + (i === 0 ? ' is-active' : '');
      dot.addEventListener('click', function () {
        track.scrollTo({ left: item.offsetLeft - track.offsetLeft - parseFloat(getComputedStyle(track).paddingLeft || 0), behavior: reduceMotion ? 'auto' : 'smooth' });
      });
      dots.appendChild(dot);
    });
    track.parentNode.insertBefore(dots, track.nextSibling);
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var i = items.indexOf(entry.target);
            Array.prototype.forEach.call(dots.children, function (d, k) {
              d.classList.toggle('is-active', k === i);
            });
          }
        });
      },
      { root: track, threshold: 0.6 }
    );
    items.forEach(function (item) {
      io.observe(item);
    });
  });

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

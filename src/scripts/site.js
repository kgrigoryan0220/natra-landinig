// Support page: "Copy email" button. No cookies, no tracking, no third parties.
(function () {
  var root = document.querySelector('[data-copy-root]');
  if (!root) return;
  var button = root.querySelector('[data-copy-button]');
  var source = root.querySelector('[data-copy-source]');
  var status = root.querySelector('[data-copy-status]');
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
    timer = setTimeout(function () { status.textContent = ''; }, 4000);
  }

  button.addEventListener('click', function () {
    var text = source.textContent.trim();
    var done = function () { say(button.getAttribute('data-copied')); };
    var fail = function () {
      selectText();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) {}
      say(button.getAttribute(ok ? 'data-copied' : 'data-failed'));
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fail);
    } else {
      fail();
    }
  });
})();

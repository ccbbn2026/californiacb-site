const button = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');
button.addEventListener('click', () => {
  const open = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  button.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
}));

if (location.search.indexOf('form=error') !== -1) { var fe = document.querySelector('.form-error'); if (fe) fe.hidden = false; }

// Contact form: submit in place so nothing the visitor typed is lost on an error.
(function () {
  var form = document.querySelector('form[action="/contact.php"]');
  if (!form || !window.fetch) return;
  var note = form.querySelector('.form-error');
  var btn = form.querySelector('button[type="submit"]');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending...';
    if (note) note.hidden = true;
    function fail(msg) {
      btn.disabled = false; btn.textContent = label;
      if (note) { note.textContent = msg; note.hidden = false; note.scrollIntoView({ block: 'center' }); }
    }
    fetch('/contact.php', { method: 'POST', body: new FormData(form), headers: { 'X-Requested-With': 'fetch' } })
      .then(function (r) { return r.json(); })
      .then(function (d) { if (d.ok) { window.location.href = d.redirect; } else { fail(d.message); } })
      .catch(function () { fail('Sorry, that did not go through. Please try again or call (805) 667-7102.'); });
  });
})();

// Google Ads tag (AW-18208357318), loaded on every page from this file.
(function () {
  if (window.gtag || document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=AW-18208357318';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', 'AW-18208357318');
})();

// Reviews: shorten long reviews to a few lines with a "Read more" toggle.
(function () {
  document.querySelectorAll('.review-text').forEach(function (q) {
    if (q.textContent.length < 420) return;
    q.classList.add('clamped');
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'review-more'; b.textContent = 'Read more';
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () {
      var open = q.classList.toggle('clamped') === false;
      b.textContent = open ? 'Show less' : 'Read more';
      b.setAttribute('aria-expanded', String(open));
    });
    q.insertAdjacentElement('afterend', b);
  });
})();

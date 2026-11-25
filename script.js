(function () {
  'use strict';
  var P = window.PORTFOLIO || {};
  var PDFJS_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';

  /* ---------- helpers ---------- */
  function h(tag, props) {
    var e = document.createElement(tag);
    if (props) Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (v == null || v === false) return;
      if (k === 'class') e.className = v;
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) {
      [].concat(arguments[i]).forEach(function (c) {
        if (c == null || c === false) return;
        e.append(c.nodeType ? c : document.createTextNode(String(c)));
      });
    }
    return e;
  }
  function safe(u) { u = String(u || '').trim(); return /^(javascript|data):/i.test(u) ? '' : u; }
  function isPdf(f) { return /\.pdf(\?|#|$)/i.test(f || ''); }
  function isImage(f) { return /\.(png|jpe?g|webp|gif|svg|avif)(\?|#|$)/i.test(f || ''); }
  function list(a) { return Array.isArray(a) ? a : []; }
  function byId(id) { return document.getElementById(id); }

  /* ---------- PDF first page as a picture (pdf.js) ---------- */
  var pdfReady = null;
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = function () { rej(new Error('script')); };
      document.head.append(s);
    });
  }
  function loadPdfJs() {
    if (!pdfReady) pdfReady = loadScript(PDFJS_BASE + 'pdf.min.js')
      .then(function () {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_BASE + 'pdf.worker.min.js';
        return window.pdfjsLib;
      });
    return pdfReady;
  }
  function renderPdf(url) {
    return loadPdfJs().then(function (lib) {
      return lib.getDocument({ url: url, isEvalSupported: false, disableFontFace: true }).promise;
    }).then(function (doc) { return doc.getPage(1); }).then(function (page) {
      var v0 = page.getViewport({ scale: 1 });
      var vp = page.getViewport({ scale: Math.min(2, 900 / v0.width) });
      var c = document.createElement('canvas');
      c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
      var ctx = c.getContext('2d');
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
      return page.render({ canvasContext: ctx, viewport: vp }).promise.then(function () { return c; });
    });
  }

  /* Short text for the fallback tile: the issuer (ISRO, DUCAT) or the first letters of the title. */
  function monogram(item) {
    var name = (item.issuer && !/^certificate$/i.test(item.issuer)) ? item.issuer : (item.title || item.text || '');
    var t = String(name).split(/[^A-Za-z0-9+]+/).filter(Boolean);
    if (!t.length) return '?';
    if (t[0].length <= 6 && t[0] === t[0].toUpperCase()) return t[0];
    return t.slice(0, 3).map(function (w) { return w[0]; }).join('').toUpperCase();
  }

  /* A preview box. Order of choice:
       1. preview: "logo"   -> the company logo
       2. preview: "x.png"  -> that picture
       3. file is an image  -> the image itself
       4. file is a PDF     -> its first page, drawn in the browser
       5. nothing worked    -> the company logo (logo: "assets/logos/x.png"), else the issuer's initials  */
  function previewBox(item) {
    var f = safe(item.file), box = h('div', { class: 'pv' });
    function badge() { if (isPdf(f)) box.append(h('em', { class: 'badge' }, 'PDF')); }
    function fallback() {
      box.replaceChildren();
      function initials() { box.replaceChildren(h('span', { class: 'mono' }, monogram(item))); badge(); }
      if (safe(item.logo)) {
        var lg = h('img', { class: 'logo', src: safe(item.logo), alt: (item.issuer || '') + ' logo' });
        lg.onload = function () { badge(); };
        lg.onerror = initials;
        box.append(lg);
      } else initials();
    }
    function viaPdf() {
      if (!isPdf(f)) return fallback();
      renderPdf(f).then(function (c) { box.replaceChildren(c); badge(); }, fallback);
    }
    var pv = safe(item.preview);
    if (pv === 'logo') { fallback(); return box; }
    var src = pv || (isImage(f) ? f : '');
    if (src) {
      var im = h('img', { src: src, alt: '', loading: 'lazy' });
      im.onload = badge;
      im.onerror = viaPdf;
      box.append(im);
    } else viaPdf();
    return box;
  }

  function copy(text, btn) {
    var reset = function (t) { btn.textContent = t; setTimeout(function () { btn.textContent = 'copy'; }, 1600); };
    try {
      navigator.clipboard.writeText(text).then(function () { reset('copied'); }, function () { reset('select it'); });
    } catch (e) { reset('select it'); }
  }
  function section(id, name, body) {
    return h('section', { class: 'sec', id: id, 'aria-labelledby': id + '-h' },
      h('h2', { class: 'fname', id: id + '-h' }, h('span', null, '// '), name),
      h('div', { class: 'body' }, body));
  }
  function when(t) { return h('div', { class: 'when' }, t || ''); }
  function jump(id) { return function (e) { e.preventDefault(); var t = byId(id); if (t) t.scrollIntoView(); }; }

  /* ---------- page ---------- */
  function render() {
    var app = byId('app'), wrap = h('div', { class: 'wrap' });
    app.append(wrap);
    document.title = (P.name || 'Portfolio') + ' | Portfolio';

    var total = +P.totalSem || 8, sem = Math.max(1, Math.min(total, +P.semester || 1));
    var yr = ['1st', '2nd', '3rd', '4th', '5th'][Math.min(4, Math.ceil(sem / 2) - 1)];
    var links = list(P.links).filter(function (l) { return safe(l.url); });

    var btns = [];
    if (P.resume) btns.push(h('a', { class: 'btn primary', href: safe(P.resume), target: '_blank', rel: 'noopener' }, './resume.pdf'));
    links.forEach(function (l) { btns.push(h('a', { class: 'btn', href: safe(l.url), target: '_blank', rel: 'noopener' }, l.label || 'link')); });
    btns.push(h('a', { class: 'btn', href: '#contact', onclick: jump('contact') }, './contact'));

    var ini = String(P.name || '?').trim().split(/\s+/).slice(0, 2).map(function (w) { return w[0] || ''; }).join('').toUpperCase();
    var avatarIn = h('div', { class: 'avatar-in' }, h('span', null, ini));
    if (P.photo) {
      var photo = h('img', { src: safe(P.photo), alt: 'Portrait of ' + (P.name || 'the student') });
      photo.onload = function () { avatarIn.replaceChildren(photo); };
    }

    var rows = [['university', P.university], ['degree', P.degree], ['batch', P.batch], ['cgpa', P.cgpa],
      ['focus', P.focus], ['location', P.location], ['email', P.email]].filter(function (r) { return r[1]; });
    var strip = h('div', { class: 'sem', role: 'img', 'aria-label': 'Semester ' + sem + ' of ' + total });
    for (var i = 1; i <= total; i++) strip.append(h('span', { class: i < sem ? 'done' : (i === sem ? 'now' : '') }, String(i)));

    wrap.append(h('header', { class: 'hero', id: 'home' },
      h('div', { class: 'term' },
        h('h1', null, P.name || 'Your name'),
        P.roles ? h('p', { class: 'roles' }, P.roles) : null,
        P.headline ? h('p', { class: 'lede' }, P.headline) : null,
        h('div', { class: 'cta' }, btns)),
      h('aside', { class: 'panel', 'aria-label': 'Profile summary' },
        h('div', { class: 'panel-t' }, 'profile.json'),
        h('div', { class: 'panel-b' },
          h('div', { class: 'avatar' }, avatarIn),
          rows.length ? h('dl', { class: 'kv' }, rows.map(function (r) {
            return h('div', null, h('dt', null, r[0]),
              h('dd', null, r[0] === 'email' ? h('a', { href: 'mailto:' + r[1] }, r[1]) : r[1]));
          })) : null,
          h('div', null, strip, h('p', { class: 'sem-cap' }, yr + ' year / semester ' + sem + ' of ' + total))))));

    var secs = [];

    if (list(P.about).length) secs.push(['about', 'about.md', list(P.about).map(function (t, i) {
      return h('div', { class: 'ln' }, h('i', null, String(i + 1)), h('p', null, t));
    })]);

    secs.push(['education', 'education.txt', [
      h('article', { class: 'entry' }, when(P.batch), h('div', { class: 'eb' },
        h('h3', null, P.degree || 'Degree'),
        P.university ? h('p', { class: 'sub' }, P.university) : null,
        P.cgpa ? h('p', null, 'CGPA ' + P.cgpa) : null,
        P.focus ? h('p', null, 'Focus: ' + P.focus) : null))
    ].concat(list(P.education).map(function (e) {
      return h('article', { class: 'entry' }, when(e.period), h('div', { class: 'eb' },
        h('h3', null, e.title || ''), e.place ? h('p', { class: 'sub' }, e.place) : null, e.score ? h('p', null, e.score) : null));
    }))]);

    if (list(P.skills).length) secs.push(['skills', 'skills.js', h('pre', { class: 'code' },
      h('div', null, h('span', { class: 'k' }, 'const '), h('span', { class: 'f' }, 'skills'), ' = {'),
      list(P.skills).map(function (g) {
        var key = String(g.group || 'group').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'group';
        var items = list(g.items);
        return h('div', { class: 'row' }, h('span', { class: 'f' }, key + ':'), h('span', { class: 'dim' }, '['),
          items.map(function (t, i) {
            return h('span', null, h('span', { class: 's' }, '"' + t + '"'), i < items.length - 1 ? h('span', { class: 'dim' }, ',') : null);
          }), h('span', { class: 'dim' }, '],'));
      }),
      h('div', null, '};'))]);

    if (list(P.projects).length) {
      var pj = list(P.projects).map(function (pr) {
        var ls = list(pr.links).filter(function (l) { return safe(l.url); }).map(function (l) {
          return h('a', { class: 'btn', href: safe(l.url), target: '_blank', rel: 'noopener' }, l.label || 'link');
        });
        var slug = String(pr.title || 'project').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'project';
        return h('article', { class: 'proj' },
          h('div', { class: 'proj-t' }, h('span', null, slug + '/'),
            list(pr.tech).length ? h('ul', { class: 'chips' }, list(pr.tech).map(function (t) { return h('li', { class: 'chip' }, t); })) : null),
          h('div', { class: 'proj-b' }, h('h3', null, pr.title || ''),
            pr.desc ? h('p', null, pr.desc) : null, ls.length ? h('div', { class: 'links' }, ls) : null));
      });
      if (P.wip) pj.push(h('p', { class: 'note' }, '// ' + P.wip));
      secs.push(['projects', 'projects/', pj]);
    }

    if (list(P.experience).length) secs.push(['experience', 'experience.log', list(P.experience).map(function (x) {
      return h('article', { class: 'entry' }, when(x.period), h('div', { class: 'eb' },
        h('h3', null, x.role || ''), x.org ? h('p', { class: 'sub' }, x.org) : null, x.desc ? h('p', null, x.desc) : null));
    })]);

    if (list(P.certificates).length) secs.push(['certificates', 'certificates/', h('div', { class: 'certs' }, list(P.certificates).map(function (c) {
      var meta = [c.issuer, c.date].filter(Boolean).join(' / ');
      var kids = [previewBox(c), h('div', { class: 'cert-b' }, h('b', null, c.title || 'Certificate'), meta ? h('small', null, meta) : null)];
      return c.file ? h('a', { class: 'cert', href: safe(c.file), target: '_blank', rel: 'noopener' }, kids) : h('div', { class: 'cert' }, kids);
    }))]);

    if (list(P.achievements).length) secs.push(['achievements', 'achievements.txt', h('div', { class: 'wins' }, list(P.achievements).map(function (a) {
      var kids = [a.file ? previewBox(a) : null, h('span', { class: 'win-t' }, a.text || ''),
        a.file ? h('span', { class: 'win-go' }, isPdf(a.file) ? 'open pdf' : 'open') : null];
      return a.file ? h('a', { class: 'win', href: safe(a.file), target: '_blank', rel: 'noopener' }, kids) : h('div', { class: 'win' }, kids);
    }))]);

    var crow = [];
    function row(label, node) { crow.push(h('div', null, h('dt', null, label), h('dd', null, node))); }
    if (P.email) row('email', [h('a', { href: 'mailto:' + P.email }, P.email),
      h('button', { class: 'copy', type: 'button', onclick: function (e) { copy(P.email, e.currentTarget); } }, 'copy')]);
    if (P.phone) row('phone', [h('span', null, P.phone),
      h('button', { class: 'copy', type: 'button', onclick: function (e) { copy(P.phone, e.currentTarget); } }, 'copy')]);
    links.forEach(function (l) {
      row(String(l.label || 'link').toLowerCase(), h('a', { href: safe(l.url), target: '_blank', rel: 'noopener' }, l.url.replace(/^https?:\/\//i, '')));
    });
    if (crow.length) secs.push(['contact', 'contact.sh', h('dl', { class: 'contact' }, crow)]);

    wrap.append(h('nav', { class: 'tabs', 'aria-label': 'Sections' }, secs.map(function (x) {
      return h('a', { href: '#' + x[0], onclick: jump(x[0]) }, x[1]);
    })));
    secs.forEach(function (x) { wrap.append(section(x[0], x[1], x[2])); });

    app.append(h('footer', { class: 'status' },
      h('span', null, 'sem ' + sem + '/' + total),
      P.degree ? h('span', null, P.degree) : null,
      P.university ? h('span', null, P.university) : null));
  }

  render();
})();
